# Avant Aqua Production Runbook

## 1) Service topology

- `nginx` serves the public domain and routes:
  - `location /` -> Next.js app (`127.0.0.1:3000`)
  - WordPress/API paths (`/wp-json`, `/wp-admin`, `/graphql`, `/wp-content`) -> Apache (`127.0.0.1:8080`)
- `pm2` runs `avant-next` from `/var/www/avant-storefront`
- WordPress is hosted at `/var/www/www-root/data/www/avant-aqua.ru`

## 2) Deploy

1. Sync source to server (`scripts/deploy-rsync.sh`).
2. Build and restart:
   - `cd /var/www/avant-storefront`
   - `npm ci`
   - `npm run build`
   - `pm2 restart avant-next --update-env`
3. Validate edge routing:
   - `curl -I http://<domain>/`
   - `curl -I http://<domain>/wp-json/`
   - `curl -I http://<domain>/graphql`

## 3) Rollback

1. Restore previous release directory (or git checkout on server).
2. Rebuild previous commit: `npm run build`.
3. Restart app: `pm2 restart avant-next --update-env`.
4. Reload nginx if config was changed: `nginx -t && systemctl reload nginx`.

## 4) Revalidate / cache refresh

- Protected endpoint: `POST /api/revalidate`
- Header: `x-revalidate-token: <REVALIDATE_TOKEN>`
- Body example:
  - `{"path":"/catalog","tags":["products","categories"]}`
- Use this after catalog imports or bulk product updates.

## 5) Health checks

- Storefront: `GET /` -> `200`
- Catalog page: `GET /catalog` -> `200`
- Catalog API source: `GET /wp-json/wc/store/v1/products?per_page=10`
- Checkout readiness: `GET /api/checkout/health`
- Marketing webhook readiness: `GET /api/marketing/abandoned-cart/health`

## 6) Incident triage

- `pm2 list`
- `pm2 logs avant-next --lines 200 --nostream`
- `systemctl status nginx apache2 pm2-root --no-pager`
- `tail -n 200 /var/log/nginx/error.log`
- `tail -n 200 /var/log/apache2/error.log`

## 7) Backups

- DB backup before mass import:
  - `mysqldump -u<user> -p <db> > backup.sql`
- Files backup:
  - WordPress uploads + plugins
  - storefront `.env.production`
