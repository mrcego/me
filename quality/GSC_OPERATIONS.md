# Google Search Console operations

## Property

- Preferred: `sc-domain:cesargomez.dev` (DNS verification via `scripts/namecheap-dns.mjs gsc-verify` if needed)

## After each production deploy

1. Confirm `/sitemap_index.xml` returns 200 and lists new routes.
2. Submit/resubmit sitemap in GSC.
3. URL Inspection for home + changed landings/case studies; request indexing when needed.
4. Watch Coverage for redirect errors (trailing slash) and soft 404s.

## Weekly

```bash
# If google-search-console-pp-cli is installed:
google-search-console-pp-cli sync sc-domain:cesargomez.dev
google-search-console-pp-cli quick-wins sc-domain:cesargomez.dev --position 8-20 --min-imps 50 --json
google-search-console-pp-cli cannibalization sc-domain:cesargomez.dev --min-imps 30 --top 25 --json
google-search-console-pp-cli sitemap-watch sc-domain:cesargomez.dev --since 7d --json
```

## KPIs

- Impressions/clicks: desarrollador Vue, Vue developer Colombia, páginas web Cartagena, vibe coding, Nuxt developer
- Landing vs home share for Vue hire queries
- Contact + CV conversions by landing
- AI referral accuracy (not labeled AI Engineer)
