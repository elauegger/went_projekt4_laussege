# AGENTS.md

## Zweck

Diese Datei definiert, wie KI-/Automations-Agenten in diesem Repository arbeiten sollen, damit Änderungen an Docker-Stacks, Versionen und Dokumentation konsistent, schnell und nachvollziehbar sind.

## Geltungsbereich

Gilt für das gesamte Repository, insbesondere:

## Grundprinzipien

- Minimal-invasive Änderungen: nur das ändern, was angefragt ist.
- Source of Truth für Versionen sind die jeweiligen `*.env`-Dateien.
- Keine stillen Annahmen: bei Unklarheit kurz explizit machen.
- Erst prüfen, dann dokumentieren, dann (optional) anpassen.
- Keine Dateien ändern, wenn explizit "nur prüfen" angefragt wurde.
- Ziel bei Images: möglichst auf dem **letzten stabilen Stand** bleiben, **wenn** dies mit dem restlichen Stack kompatibel ist.
- Bevorzugt **leichtgewichtige Images** einsetzen (vorzugsweise **Alpine**), sofern kompatibel und vom Upstream stabil unterstützt.

## Source of Truth (Versionen)

Bei Versionsaussagen immer zuerst hier lesen:

- Dockerversion: ^29.2 (also keine version in docker-compose.yml)
- Traefik: `traefik/.env` (`TRAEFIK_IMAGE`)
- Postgres: `postgres/.env` (`POSTGRES_IMAGE`) und pgadmin
- source: nextjsprisma
- runtime container: nextjs

## Ziel deployment

 Hauptziel
 :hetzner cloud server debian 13 unter docker mit traefik laufen bzw. lokal ohne traefik.

## Technologiestack (Zielbild)

Agenten sollen diesen Stack als Referenz für Entscheidungen, Kompatibilitätschecks und Doku verwenden:

- **Traefik v3.6.9** (Let's Encrypt, HTTP-01) `≥ **3.6.10**`
- Docker Version (für BuildKit und neuere Features) (`≥ 29`)
- **postgres:<latest-stable-major>-alpine.** (`postgres:<latest-stable-major>-alpine.`) Momentan: (`postgres:18-alpine`)
- PGADMIN latest
- **Node.js v24** (`node:24-alpine`) `≥ **24.14.0**`
- **Next.js 16** mit **App Router** (`≥ 16.1.6`)
- **React mindestens 19.2** (`≥ 19.2`)
- **Prisma ORM v7** (JavaScript Client) (`≥ 7.4.2`) provider = "prisma-client-js"
- **better-auth** (JavaScript Client, mindestens v1.5) `≥ 1.5.4`
- **Passwort-Hashing:** `argon2id`
- `.env.prod` für prod
- `.env.dev` für dev
- `cp .env.prod .env` in der Produktionsumgebung
- `cp .env.dev .env` in der Entwicklungsumgebung
- 2 Docker-Compose-Dateien: nur `docker-compose.dev.yml` (vollständiger, eigenständiger Dev-Stack) für Dev und `docker-compose.yml` (vollständiger, eigenständiger Prod-Stack) für Prod. Keine weiteren Docker-Compose-Dateien.
- **Linting & Formatting:** `biome` (global)

Alle Compose-Dateien sind **ohne `version:`** (Compose v2+). Konfiguration über `.env`-Dateien.

Wenn konkrete Versionen im Projekt davon abweichen, gilt:

- `.env`/Compose sind operative Wahrheit für den aktuellen Betrieb.
- Der Technologiestack in dieser Datei ist Ziel-/Leitbild und bei Änderungen an README/CI zu berücksichtigen.

## Kompatibilitätsregel bei Updates

- Bei Versionsvorschlägen immer Stack-Kombination prüfen (Next.js ↔ React ↔ Node ↔ Prisma ↔ Postgres).
- Bei Major-Sprüngen kurz Risiken nennen (Breaking Changes, Migrationsbedarf, Client-Regeneration).
- Bei Prisma-/DB-Änderungen auf Schema-Migration und Backup-Hinweis achten.
- Update-Priorität: zuerst Patch/Minor auf latest stable innerhalb der Linie, dann erst Major prüfen.
- Variant-Priorität: wenn verfügbar und kompatibel, Alpine-Variante vor nicht-Alpine bevorzugen.

### Ausnahmen zur Alpine-Präferenz

Nicht-Alpine ist zulässig, wenn mindestens einer dieser Punkte zutrifft:

- Upstream bietet keine stabile Alpine-Variante für die benötigte Version.
- Alpine verursacht nachweisbare Kompatibilitätsprobleme (z. B. native Module, libc-Abhängigkeiten, Healthchecks).
- Sicherheits- oder Stabilitätslage ist bei der nicht-Alpine-Variante nachweisbar besser.

In solchen Fällen kurz dokumentieren:

- Grund der Ausnahme
- betroffene Images/Tags
- geplanter Zeitpunkt zur erneuten Alpine-Prüfung

## Standard-Workflow bei "Versionen prüfen"

1. Alle Image-Referenzen aus `docker-compose.yml` und `Dockerfile` erfassen.
2. Effektive Werte über passende `.env`-Dateien auflösen.
3. Wenn möglich Registry/Upstream-Tags prüfen (z. B. Docker Hub API).
4. Ergebnis trennen in:
   - Ist-Stand (aktuell gesetzt)
   - Update möglich (ja/nein)
   - Risiko/Kompatibilität (z. B. Major-Version, floating tags)
5. Nichts ändern, falls User nur Prüfung wollte.

## Sicherheits- und Stabilitätshinweise

- Bevorzuge stable versionen bzw. latest minor und sonst gepinnte Tags statt `latest` für reproduzierbare Deployments außer bei pgadmin.
- Bei Postgres keine Major-Sprünge ohne Migrations-/Backup-Hinweis empfehlen.
- Keine Secrets in README oder Commits eintragen.

## Kommunikationsstil für Agenten

- Kurz, konkret, auf Deutsch (wenn User Deutsch schreibt).
- Bei größeren Änderungen: kurz sagen, was geprüft wurde und was als Nächstes kommt.
- Bei Abschluss: nur relevante Datei(en), Kernänderung, optional nächster sinnvoller Schritt.

## Definition of Done

Aufgabe ist fertig, wenn:

- angefragte Prüfung/Änderung vollständig erledigt ist,
- README-Inhalte zu aktuellen `.env`-Werten passen,
- keine unaufgeforderten Zusatzänderungen erfolgt sind.
