# Traefik Infra Stack

Traefik läuft in der Produktionsumgebung als eigenes Verzeichnis neben dem App-Repository auf Hetzner Cloud (Debian 13).

Beispiel Server-Layout:

```text
/srv/
	traefik/
	next_js_prisma_postgres_monorepo/
```

## 1) BasicAuth für Dashboard generieren

Das Traefik-Dashboard braucht einen htpasswd-Hash (bcrypt). Generiere ihn so:

```bash
# Linux/Mac
sudo apt install apache2-utils
echo $(htpasswd -nbB admin 'yourMegaSecurePassword')

# Oder mit Docker (überall):
docker run --rm httpd:2.4-alpine htpasswd -nbB admin 'under_any_circumstances_change_this_password'
```

Output sieht so aus: `admin:$2y$10$...`. 

**WICHTIG für .env:** Alle `$`-Zeichen im Hash müssen mit `$$` escapt werden:
- `$2y$10$abc...` wird zu `$$2y$$10$$abc...`

Setze den gesamten escapten String (inklusive Username) in `.env` als `TRAEFIK_DASHBOARD_PASSWORD_HASH`.

## 2) Werte in `.env` prüfen und ggf. anpassen

- `TRAEFIK_CERT_EMAIL` - deine E-Mail für Let's Encrypt
- `TRAEFIK_DASHBOARD_HOST` - Domain des Traefik-Dashboards (z. B. `traefik.qiz.at`)
- `TRAEFIK_DASHBOARD_PASSWORD_HASH` - htpasswd-String (siehe oben)
- `APP_HOST` - Domain der Next.js-App (z. B. `app.qiz.at`)
- `PGADMIN_HOST` - Domain fuer pgAdmin (z. B. `pgadmin.qiz.at`)

DNS für beide Hosts muss auf die Server-IP zeigen.



## 4) Traefik-Stack starten

Zuerst sicherstellen, dass der ACME-Storage richtige Permissions hat:

```bash
cd /srv/traefik
touch letsencrypt/acme.json
chmod 600 letsencrypt/acme.json
docker compose up -d
```

## 5) App-Stack anbinden

Das App-Repository (`docker-compose.yml`) ist bereits mit Traefik-Labels konfiguriert:
- Service `web` hat `networks: [web]`
- Labels definieren Router, TLS-Resolver, Load-Balancer-Port

Start des App-Stacks:

```bash
cd /srv/next_js_prisma_postgres_monorepo
cp .env.prod .env
docker compose up -d
```

## Verifikation

- Dashboard: `https://traefik.qiz.at` (mit BasicAuth-Credentials)
- App: `https://app.qiz.at`
- pgAdmin: `https://pgadmin.qiz.at`
- Logs Traefik: `docker logs traefik`
- Logs App: `docker logs web`





## optional - nicht weitermachen

## 3) Netzwerk vorbereiten

**Wichtig:** Das `web`-Netzwerk muss vor dem Start von Traefik existieren.

```bash
docker network create web
```

Wenn das Netzwerk bereits existiert, kannst du diesen Schritt überspringen.
