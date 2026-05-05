#!/bin/sh
set -eu

TARGET_DB="${POSTGRES_USER}"

if [ -z "${TARGET_DB}" ]; then
  echo "POSTGRES_USER is empty, skipping user database creation."
  exit 0
fi

DB_EXISTS="$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${TARGET_DB}'")"

if [ "$DB_EXISTS" = "1" ]; then
  echo "Database '${TARGET_DB}' already exists, skipping."
else
  echo "Creating database '${TARGET_DB}' owned by '${POSTGRES_USER}'..."
  createdb --username "$POSTGRES_USER" --owner "$POSTGRES_USER" "$TARGET_DB"
fi
