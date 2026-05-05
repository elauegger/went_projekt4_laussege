# Hetzner Docker Compose Stacks (Traefik, Registry, PostgreSQL 18, Next.js App)


## To Do

- https://www.authelia.com/ vor traefik
- hetzner firewall oder/und ufw



## Tech Stack

- **Traefik v3.6.10** (Let's Encrypt, HTTP-01) `≥ **3.6.10**`
- Docker Version (für BuildKit und neuere Features) (`≥ 29`)
- **postgres:<latest-stable-major>-alpine.** (`postgres:<latest-stable-major>-alpine.`) Momentan (`postgres:18-alpine`)
- **Node.js v24** (`node:24-alpine`) `≥ **24.14.0**`
- **Next.js 16** mit **App Router** (`≥ 16.1.6`)
- **React mindestens 19.2** (`≥ 19.2`)
- **Prisma ORM v7** (JavaScript Client) (`≥ 7.4.2`) provider = "prisma-client-js"
- **better-auth** (JavaScript Client, mindestens v1.5) `≥ 1.5.4`
- **Passwort-Hashing:** `argon2id`
- `docker-compose.yml` ist der Standard-Stack für PROD
- `.env.prod` für prod
- `.env.dev` für dev
- `cp .env.prod .env` in der Produktionsumgebung
- `cp .env.dev .env` in der Entwicklungsumgebung
- 2 Docker-Compose-Dateien: nur `docker-compose.dev.yml` (vollständiger, eigenständiger Dev-Stack) für Dev und `docker-compose.yml` (vollständiger, eigenständiger Prod-Stack) für Prod. Keine weiteren Docker-Compose-Dateien.

Alle Compose-Dateien sind **ohne `version:`** (Compose v2+). Konfiguration über `.env`-Dateien.

**Linting & Formatting:** `biome` (global)

## Schnellstart

### Development (lokal)

```bash
# Dependencies installieren
pnpm install

# DEV-Config aktivieren
cp .env.dev .env

# Compose für Dev starten (mit Volumes für Hot-Reload)
docker compose up -d

# Logs ansehen
docker compose logs -f web
```

Das App entwickelt sich auf `http://localhost:3000`.

Der lokale DEV-Stack nutzt dabei nur `COMPOSE_FILE=docker-compose.dev.yml` aus `.env`.

Der PROD-Stack nutzt nur `COMPOSE_FILE=docker-compose.yml` aus `.env`.

### Production (Hetzner mit Traefik)

In der Produktionsumgebung liegt der Traefik-Stack nicht unter `infra/traefik`, sondern als eigenes Verzeichnis auf derselben Ebene wie das App-Repository.

#### 1. Traefik Infrastruktur starten

```bash
cd /pfad/neben-dem-app-repo/traefik

# .env prüfen und anpassen
# - TRAEFIK_CERT_EMAIL
# - TRAEFIK_DASHBOARD_HOST
# - TRAEFIK_DASHBOARD_PASSWORD_HASH (htpasswd-String)
# - APP_HOST (Domain der App)

# Traefik starten
docker compose --env-file .env up -d
```

#### 2. App starten

Vorher `pnpm install` lokal ausführen, damit `package.json` und `pnpm-lock.yaml` aktuell sind. `node_modules` muss nicht auf den Server kopiert werden, der Ordner wird dort im Container erzeugt.

Nach Änderungen an Abhängigkeiten immer `package.json` und `pnpm-lock.yaml` mit auf den Server übernehmen.

```bash
# Aus Projekt-Root
# PROD-Config aktivieren
cp .env.prod .env

# Stack starten
docker compose up -d --build --force-recreate

# !!! start prod - nur erstes mal !!! erzeugt migration und gibt sie in die db
docker compose exec web npx prisma migrate dev --name init

# Logs
docker compose logs -f web
```

Die App läuft jetzt unter `https://APP_HOST` mit automatischem Let's Encrypt-Zertifikat.





### Update über GitLab

Wenn das Repository bereits auf dem Server geklont ist, reicht für ein normales Update dieser Ablauf:

```bash
cd /pfad/zum/repo

git pull

cp .env.prod .env

docker compose up -d --build
```

Das bewirkt:

- `git pull` holt den aktuellen Stand aus GitLab.
- `cp .env.prod .env` aktiviert die Produktionskonfiguration.
- `docker compose up -d --build` baut das App-Image neu und startet geänderte Container neu.

Wenn zusätzlich Prisma-Migrationen im Update enthalten sind:

```bash
docker compose exec web npx prisma migrate deploy
```

Empfohlene Reihenfolge für Deployments:

1. Änderungen lokal entwickeln und nach GitLab pushen.
2. Auf dem Server `git pull` ausführen.
3. Produktions-Env mit `cp .env.prod .env` aktivieren.
4. Stack mit `docker compose up -d --build` aktualisieren.
5. Bei DB-Änderungen `docker compose exec web npx prisma migrate deploy` ausführen.

---

## Entwickle & Wartet

### DB-Migrations

```bash
# Lokales Dev
docker compose exec web npx prisma migrate dev --name <migration-name>

# Production (mit Backup)
docker compose exec web npx prisma migrate deploy

# start prod - erstes mal

```

### Logs & Debugging

```bash
# Dev - alle Services live
docker compose logs -f

# Dev - nur App live
docker compose logs -f web

# Prod - nur App live
docker compose logs -f web

# Prod - nur DB live
docker compose logs -f db

# Prod - nur pgAdmin live
docker compose logs -f pgadmin

# Prod - letzte 300 Zeilen App
docker compose logs --tail=300 web

# Prod - Logs mit Timestamps
docker compose logs -t web

# Prod - Logs seit 10 Minuten
docker compose logs --since=10m web

# Nach Next.js Error-Digest suchen
docker compose logs web | grep <DIGEST>

# Logs vom zuletzt beendeten Web-Container
docker compose logs web --tail=200

# Traefik Logs (separater Stack neben dem App-Repo)
cd /pfad/neben-dem-app-repo/traefik && docker compose logs -f traefik
```

### Datenbankfehler / Prisma-Regeneration

```bash
# Prisma Client regenerieren (bei Schema-Änderungen)
docker compose exec web npx prisma generate

# DB-Schema mit lokalen Migration resetten (nur DEV!)
docker compose exec db psql -U postgres -d mydb -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker compose exec web npx prisma migrate deploy
```

### Build-Images aktualisieren

```bash
# Dev Image (tag: latest-dev)
docker build -t nextjs:latest-dev -f docker/Dockerfile.dev .

# Prod Image (tag: latest-prod)
docker build -t nextjs:latest-prod -f docker/Dockerfile .

# Compose forcieren, neue Images zu nutzen
docker compose --env-file .env up -d --force-recreate
```

### Linting & Formatting

```bash
# Lint prüfen (alle Dateien)
biome lint

# Auto-Fix + Format
biome check --apply

# Nur Format prüfen
biome format

# Nur formatieren (schreiben)
biome format --write
```

### Postgres Dump / Restore

```bash
# Dump erstellen
docker compose exec db pg_dump -U postgres mydb > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore aus Dump
docker compose exec -T db psql -U postgres mydb < backup.sql
```

### Secrets & Environment

```bash
# Dev - .env.dev pflegen und bei Bedarf nach .env kopieren
# Prod - .env.prod pflegen und auf dem Zielsystem nach .env kopieren (NICHT in Git!)

# Aktuelle Env im Container prüfen
docker compose exec web printenv | grep BETTER_AUTH
```

### Service neu starten

```bash
# Dev
docker compose restart web
docker compose restart db

# Prod
docker compose restart web
docker compose restart db
```

### Alles aufräumen

```bash
# Dev - alle Services stoppen & Volumes löschen
docker compose down -v

# Prod
docker compose down

# Traefik + Zertifikate
cd /pfad/neben-dem-app-repo/traefik && docker compose --env-file .env down
```

---

## Automatische Linting-Integration (pre-commit)

Husky ist konfiguriert. Schreibe `biome check --apply` in `.husky/pre-commit`, um vor jedem Commit automatisch zu formatieren.



```
Einmalig initiale Migration erzeugen und anwenden:
docker compose exec web npx prisma migrate dev --name init
Danach die erzeugten Dateien unter prisma/migrations ins Repo committen.
Ab dann auf neuen Umgebungen nur noch anwenden:
docker compose exec web npx prisma migrate deploy
```



## Autoren

- gam
- Teile von schweigea und fanicm

