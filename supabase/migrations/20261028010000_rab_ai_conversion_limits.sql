-- Bound the cost of anonymous AI-powered document conversion.
-- Only an HMAC fingerprint is stored; never persist raw client IP addresses or PDF bytes.

create table if not exists public.rab_ai_conversion_limits (
  fingerprint text primary key check (fingerprint ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  conversions_in_window integer not null default 0 check (conversions_in_window >= 0),
  pages_in_window integer not null default 0 check (pages_in_window >= 0),
  day_started_at timestamptz not null,
  conversions_today integer not null default 0 check (conversions_today >= 0),
  pages_today integer not null default 0 check (pages_today >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists rab_ai_conversion_limits_updated_at_idx
  on public.rab_ai_conversion_limits (updated_at);

alter table public.rab_ai_conversion_limits enable row level security;
revoke all on table public.rab_ai_conversion_limits from public, anon, authenticated;
grant select, insert, update, delete on public.rab_ai_conversion_limits to service_role;

create or replace function public.consume_rab_ai_conversion(
  p_fingerprint text,
  p_pages integer
)
returns table (
  allowed boolean,
  retry_after_seconds integer,
  conversions_in_window integer,
  pages_in_window integer,
  conversions_today integer,
  pages_today integer
)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_day_start timestamptz := date_trunc('day', clock_timestamp() at time zone 'UTC') at time zone 'UTC';
  v_window_started timestamptz;
  v_day_started timestamptz;
  v_requests_window integer;
  v_pages_window integer;
  v_requests_today integer;
  v_pages_today integer;
  v_retry integer;
begin
  if p_fingerprint is null or p_fingerprint !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid RabConverter AI fingerprint';
  end if;
  if p_pages is null or p_pages < 1 or p_pages > 50 then
    raise exception 'invalid RabConverter AI page reservation';
  end if;

  delete from public.rab_ai_conversion_limits
  where updated_at < v_now - interval '48 hours';

  insert into public.rab_ai_conversion_limits (
    fingerprint, window_started_at, conversions_in_window, pages_in_window,
    day_started_at, conversions_today, pages_today, updated_at
  ) values (
    p_fingerprint, v_now, 0, 0, v_day_start, 0, 0, v_now
  )
  on conflict (fingerprint) do nothing;

  select t.window_started_at, t.conversions_in_window, t.pages_in_window,
         t.day_started_at, t.conversions_today, t.pages_today
    into v_window_started, v_requests_window, v_pages_window,
         v_day_started, v_requests_today, v_pages_today
  from public.rab_ai_conversion_limits as t
  where t.fingerprint = p_fingerprint
  for update;

  if v_day_started < v_day_start then
    v_day_started := v_day_start;
    v_requests_today := 0;
    v_pages_today := 0;
  end if;

  if v_window_started <= v_now - interval '15 minutes' then
    v_window_started := v_now;
    v_requests_window := 0;
    v_pages_window := 0;
  end if;

  if v_requests_window >= 2
     or v_pages_window + p_pages > 100
     or v_requests_today >= 4
     or v_pages_today + p_pages > 200 then
    if v_requests_today >= 4 or v_pages_today + p_pages > 200 then
      v_retry := greatest(1, ceil(extract(epoch from (v_day_start + interval '1 day' - v_now)))::integer);
    else
      v_retry := greatest(1, ceil(extract(epoch from (v_window_started + interval '15 minutes' - v_now)))::integer);
    end if;

    update public.rab_ai_conversion_limits as t
      set window_started_at = v_window_started,
          conversions_in_window = v_requests_window,
          pages_in_window = v_pages_window,
          day_started_at = v_day_started,
          conversions_today = v_requests_today,
          pages_today = v_pages_today,
          updated_at = v_now
    where t.fingerprint = p_fingerprint;

    return query select false, v_retry, v_requests_window, v_pages_window, v_requests_today, v_pages_today;
    return;
  end if;

  v_requests_window := v_requests_window + 1;
  v_pages_window := v_pages_window + p_pages;
  v_requests_today := v_requests_today + 1;
  v_pages_today := v_pages_today + p_pages;

  update public.rab_ai_conversion_limits as t
    set window_started_at = v_window_started,
        conversions_in_window = v_requests_window,
        pages_in_window = v_pages_window,
        day_started_at = v_day_started,
        conversions_today = v_requests_today,
        pages_today = v_pages_today,
        updated_at = v_now
  where t.fingerprint = p_fingerprint;

  return query select true, 0, v_requests_window, v_pages_window, v_requests_today, v_pages_today;
end;
$$;

revoke all on function public.consume_rab_ai_conversion(text, integer) from public, anon, authenticated;
grant execute on function public.consume_rab_ai_conversion(text, integer) to service_role;
