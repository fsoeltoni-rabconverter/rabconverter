# RabConverter SEO implementation notes

## Current canonical origin

The current public preview origin is `https://rabconverter-preview.rabconverter-id.workers.dev`. The canonical URL, sitemap URL, robots.txt Sitemap directive, and JSON-LD URLs are intentionally consistent with this origin for the current preview.

**Before production launch:** choose the final custom domain and update all references together in `index.html`, `public/robots.txt`, `public/sitemap.xml`, and the inline HTML served by the Cloudflare `rabconverter-preview` Worker if that Worker remains the preview target. Submit only the production sitemap in Google Search Console.

## Implemented SEO basics

- Indonesian document language and descriptive, unique title and meta description.
- Canonical URL and explicit index/follow directive for the current public preview.
- Open Graph / Twitter summary metadata (no unverified or misleading product claims).
- Minimal `WebSite` and `WebPage` JSON-LD; no fake reviews, ratings, or unsupported `SoftwareApplication` rich-result data.
- Crawlable `robots.txt` and XML sitemap with absolute canonical URLs.
- Descriptive semantic landing-page content, clear H1/H2 hierarchy, section anchors, checklist, and FAQs.
- Honest product-status disclosure. The current preview only selects a PDF in the browser; it does not upload or convert files.

## Before indexing the production site

1. Replace the preview host with the production domain in all canonical, sitemap, robots, Open Graph and JSON-LD URLs.
2. Verify the production domain property in Google Search Console.
3. Test `/robots.txt` as plain text and `/sitemap.xml` as valid XML with HTTP 200; both must enumerate only canonical URLs intended for indexing.
4. Use Search Console URL Inspection to check the live rendered HTML, canonical choice, crawlability and indexing.
5. Test title/description, schema validity, internal links and mobile behavior on the live host.
6. Measure PageSpeed / Core Web Vitals. Targets at the 75th percentile: LCP <= 2.5 s, INP <= 200 ms and CLS <= 0.1.
7. Enable conversion functionality and validate real output before promoting the service as an active PDF-to-Excel converter.
8. Add supporting guide URLs to the sitemap only when each page is published, crawlable, useful, unique and returns HTTP 200.

## Keyword focus

Primary: RAB PDF ke Excel, convert RAB ke Excel, BoQ PDF to Excel.
Secondary: ubah tabel PDF ke Excel, cara mengubah RAB PDF ke Excel, cara copy tabel PDF ke Excel.

These are intent-based priorities, not verified monthly search-volume estimates. Validate demand and actual query performance using a keyword data source and Google Search Console. Do not create near-duplicate keyword doorway pages or promise that any configuration guarantees position #1.
