#!/bin/bash
# Test veritabanını sıfırlar ve tüm migration'ları uygular (yerel PG: tools/pgstart.sh).
PG=/usr/lib/postgresql/16/bin; A="-h ${PGSOCK:-/home/alpeptit/.pgtest} -p 55432 -U postgres"
$PG/psql $A -q -c "DROP DATABASE IF EXISTS ${SIM_DB:-avfsim}" -c "CREATE DATABASE ${SIM_DB:-avfsim}" || exit 1
for f in $(ls "$(dirname "$0")/../src/db"/migrate-v*.sql | sort -V); do $PG/psql $A -q -1 -v ON_ERROR_STOP=1 -d ${SIM_DB:-avfsim} -f "$f" >/dev/null || { echo "HATA: $f"; exit 1; }; done
echo "veritabanı hazır"
