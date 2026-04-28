# Avant Aqua Release Checklist

## A. Critical safety

- [ ] `AUTH_SECRET`, `NEXTAUTH_URL`, `REVALIDATE_TOKEN`, Woo API keys configured on server
- [ ] `nginx -t` passes
- [ ] `pm2 list` shows `avant-next` as `online`
- [ ] `/api/revalidate` protected (401 without token)
- [ ] Woo webhook secret set (`WC_WEBHOOK_SECRET`)

## B. Sales flow

- [ ] `/catalog` shows products and categories
- [ ] Product page opens for at least one real SKU
- [ ] `/api/products/search?q=<known SKU>` returns items
- [ ] `/api/checkout/health` is `configured: true`
- [ ] Checkout order creation tested end-to-end
- [ ] Lead form returns success and reaches integration endpoint

## C. Content/SEO

- [ ] `robots.txt` references sitemap
- [ ] `sitemap.xml` returns product/category/news URLs
- [ ] No `/dev/*` pages indexed
- [ ] OG/Twitter metadata present on home and catalog pages

## D. Performance/quality

- [ ] CI green: lint + typecheck + test + build
- [ ] No critical console/server errors in logs during smoke test
- [ ] Core pages load without layout shifts and with expected fonts/images

## E. Final acceptance

- [ ] Smoke test matrix passed on desktop + mobile
- [ ] Rollback path validated
- [ ] Backup snapshot created before go-live
