-- Anonymous preview endpoint needs a small, bounded abuse guard.
-- Store only a keyed fingerprint; never store raw client IP addresses or uploaded files.

create table if not exists public.preflight_rate_limits (
  fingerprint text primary key check (fingerprint ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  bytes_in_window bigint not null default 0 check (bytes_in_window >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists preflight_rate_limits_updated_at_idx
  on public.preflight_rate_limits (updated_at);

alter table public.preflight_rate_limits enable row level security;

revoke all on table public.preflight_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on table public.preflight_rate_limits to service_role;

create or replace function public.consume_preflight_rate_limit(
  p_fingerprint text,
  p_bytes bigint
)
returns table (
  allowed boolean,
  retry_after_seconds integer,
  requests_in_window integer,
  bytes_in_window bigint
)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_started timestamptz;
  v_requests integer;
  v_bytes bigint;
begin
  if p_fingerprint is null or p_fingerprint !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid preflight fingerprint';
  end if;

  if p_bytes is null or p_bytes < 1 or p_bytes > 31457280 then
    raise exception 'invalid preflight byte reservation';
  end if;

  -- Expire old anonymous fingerprints opportunistically; no raw IP is retained.
  delete from public.preflight_rate_limits
  where updated_at < v_now - interval '24 hours';

  insert into public.preflight_rate_limits (
    fingerprint, window_started_at, request_count, bytes_in_window, updated_at
  ) values (
    p_fingerprint, v_now, 0, 0, v_now
  )
  on conflict (fingerprint) do nothing;

  select t.window_started_at, t.request_count, t.bytes_in_window
    into v_started, v_requests, v_bytes
  from public.preflight_rate_limits as t
  where t.fingerprint = p_fingerprint
  for update;

  if v_started <= v_now - interval '15 minutes' then
    update public.preflight_rate_limits as t
      set window_started_at = v_now,
          request_count = 1,
          bytes_in_window = p_bytes,
          updated_at = v_now
    where t.fingerprint = p_fingerprint;

    return query select true, 0, 1, p_bytes;
    return;
  end if;

  if v_requests >= 10 or v_bytes + p_bytes > 125829120 then
    update public.preflight_rate_limits as t
      set updated_at = v_now
    where t.fingerprint = p_fingerprint;

    return query select
      false,
      greatest(1, ceil(extract(epoch from (v_started + interval '15 minutes' - v_now)))::integer),
      v_requests,
      v_bytes;
    return;
  end if;

  update public.preflight_rate_limits as t
    set request_count = v_requests + 1,
        bytes_in_window = v_bytes + p_bytes,
        updated_at = v_now
  where t.fingerprint = p_fingerprint;

  return query select true, 0, v_requests + 1, v_bytes + p_bytes;
end;
$$;

revoke all on function public.consume_preflight_rate_limit(text, bigint) from public, anon, authenticated;
grant execute on function public.consume_preflight_rate_limit(text, bigint) to service_role;
