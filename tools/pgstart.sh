#!/bin/bash
# Yerel doğrulama için PostgreSQL 16 (yalnız geliştirme; üretimde Railway Postgres kullanılır)
B=/usr/lib/postgresql/16/bin; D=/home/alpeptit/.pgtest
if [ ! -d $D/data ]; then mkdir -p $D; chown postgres $D; su postgres -s /bin/bash -c "$B/initdb -D $D/data -U postgres -A trust >/dev/null"; fi
su postgres -s /bin/bash -c "$B/pg_ctl -D $D/data -o '-p 55432 -k $D' -l $D/log start >/dev/null" 2>/dev/null; sleep 1.5
