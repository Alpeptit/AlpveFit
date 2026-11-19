#!/usr/bin/env bash
# OWASP ZAP güvenlik taraması — YALNIZ GitHub Actions içinde çalışır (.github/workflows/security-scan.yml).
#   1) Geçici, TLS'li bir PostgreSQL ve üretim kipinde (NODE_ENV=production) uygulama ayağa kaldırılır. Tüm anahtarlar her
#      çalıştırmada rastgele üretilir; hiçbir gerçek sır, canlı veritabanı veya müşteri verisi kullanılmaz.
#   2) Yerel kopyaya: pasif tarama (site + ajax örümceği), etkin (saldırı) tarama, API'nin tamamına kimliksiz / üye / yönetici
#      olarak etkin tarama (API tanımı tools/security/openapi.mjs ile rotalardan üretilir).
#   3) Canlı siteye (LIVE_URL): YALNIZ pasif tarama (saldırı isteği gönderilmez; kısa örümcek, düşük trafik).
# Raporlar zap-out/ klasörüne yazılır; özet: zap-out/OZET.md
set -u
ROOT="$PWD"; OUT="$ROOT/zap-out"; mkdir -p "$OUT"; chmod 777 "$OUT"
ZAP_IMG="ghcr.io/zaproxy/zaproxy:stable"
PORT=3000; BASE="http://localhost:$PORT"
log() { echo "[$(date -u +%H:%M:%S)] $*" | tee -a "$OUT/calisma.log"; }
[ -n "${GITHUB_ACTIONS:-}" ] || { echo "Yalnız CI içinde çalışır."; exit 2; }

log "ZAP imajı indiriliyor"; docker pull -q "$ZAP_IMG" >/dev/null

# ---------- 1) geçici TLS'li PostgreSQL ----------
TLS="$RUNNER_TEMP/pgtls"; mkdir -p "$TLS"
openssl req -new -x509 -days 2 -nodes -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" \
  -keyout "$TLS/server.key" -out "$TLS/server.crt" 2>/dev/null
sudo chown 999:999 "$TLS/server.key" "$TLS/server.crt"; sudo chmod 600 "$TLS/server.key"; sudo chmod 644 "$TLS/server.crt"
PGPASS=$(openssl rand -hex 16)
docker run -d --name pg -p 127.0.0.1:5432:5432 -e POSTGRES_PASSWORD="$PGPASS" -e POSTGRES_DB=app -v "$TLS":/tls:ro postgres:16 \
  -c ssl=on -c ssl_cert_file=/tls/server.crt -c ssl_key_file=/tls/server.key >/dev/null
for i in $(seq 1 60); do docker exec pg psql -U postgres -d app -h 127.0.0.1 -c "select 1" >/dev/null 2>&1 && break; sleep 1; done
sleep 2; log "PostgreSQL hazır (TLS açık)"

# ---------- 2) uygulama (üretim kipi) ----------
export NODE_ENV=production PORT FRONTEND_URL="$BASE" RUN_BACKGROUND_JOBS=false
export DATABASE_URL="postgres://postgres:$PGPASS@127.0.0.1:5432/app"
export DB_CA_CERT="$(sudo cat "$TLS/server.crt")"
export JWT_SECRET="$(openssl rand -hex 32)" ENCRYPTION_KEY="$(openssl rand -hex 32)"
node src/server.js > "$OUT/sunucu.log" 2>&1 &
SRV=$!
for i in $(seq 1 90); do curl -fsS "$BASE/api/health" >/dev/null 2>&1 && break; sleep 1; done
curl -sS "$BASE/api/health" > "$OUT/saglik.json" 2>&1; log "sağlık: $(cat "$OUT/saglik.json")"
curl -sSI "$BASE/" > "$OUT/basliklar-ana-sayfa.txt" 2>&1
curl -sSI "$BASE/api/health" > "$OUT/basliklar-api.txt" 2>&1
kill -0 $SRV 2>/dev/null || { log "SUNUCU AÇILMADI — sunucu.log'a bakın"; exit 1; }

node tools/security/openapi.mjs "$BASE" > "$OUT/openapi.json" 2>> "$OUT/calisma.log"
U=$(TEST_DB_ONLY=1 node tools/security/session.mjs user zapuye 2>> "$OUT/calisma.log")
A=$(TEST_DB_ONLY=1 node tools/security/session.mjs admin zapyonetici 2>> "$OUT/calisma.log")
jget() { node -e 'const o=JSON.parse(process.argv[1]||"{}");process.stdout.write(o[process.argv[2]]||"")' "$1" "$2"; }
# doğrulama: oturumlar gerçekten geçerli mi (tarama kimliksiz kalmasın)
log "üye oturumu: $(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: $(jget "$U" cookie)" "$BASE/api/auth/me") · yönetici: $(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: $(jget "$A" cookie)" "$BASE/api/auth/me")"

LIMITS="-config scanner.maxScanDurationInMins=25 -config scanner.maxRuleDurationInMins=4 -config scanner.threadPerHost=4"
zap() { docker run --rm --network host -v "$OUT":/zap/wrk:rw "$@" >> "$OUT/calisma.log" 2>&1; log "  bitti (çıkış kodu $?)"; }
hdrs() {   # $1 = csrf → X-CSRF-Token ve Origin başlıkları her isteğe eklenir (çerez ZAP_AUTH_HEADER ile)
  echo "-config replacer.full_list(0).description=csrf -config replacer.full_list(0).enabled=true -config replacer.full_list(0).matchtype=REQ_HEADER -config replacer.full_list(0).matchstr=X-CSRF-Token -config replacer.full_list(0).regex=false -config replacer.full_list(0).replacement=$1 -config replacer.full_list(1).description=origin -config replacer.full_list(1).enabled=true -config replacer.full_list(1).matchtype=REQ_HEADER -config replacer.full_list(1).matchstr=Origin -config replacer.full_list(1).regex=false -config replacer.full_list(1).replacement=$BASE"
}

log "1/6 yerel site — pasif tarama (örümcek + ajax örümceği)"
zap -t "$ZAP_IMG" zap-baseline.py -t "$BASE" -m 3 -j -I -r yerel-pasif.html -J yerel-pasif.json -w yerel-pasif.md
log "2/6 yerel site — etkin (saldırı) taraması"
zap -t "$ZAP_IMG" zap-full-scan.py -t "$BASE" -m 2 -I -r yerel-etkin.html -J yerel-etkin.json -w yerel-etkin.md -z "$LIMITS"
log "3/6 API — kimliksiz etkin tarama"
zap -t "$ZAP_IMG" zap-api-scan.py -t /zap/wrk/openapi.json -f openapi -I -r api-kimliksiz.html -J api-kimliksiz.json -w api-kimliksiz.md -z "$LIMITS"
log "4/6 API — üye oturumuyla etkin tarama"
zap -e ZAP_AUTH_HEADER=Cookie -e ZAP_AUTH_HEADER_VALUE="$(jget "$U" cookie)" -e ZAP_AUTH_HEADER_SITE=localhost -t "$ZAP_IMG" \
  zap-api-scan.py -t /zap/wrk/openapi.json -f openapi -I -r api-uye.html -J api-uye.json -w api-uye.md -z "$LIMITS $(hdrs "$(jget "$U" csrf)")"
log "5/6 API — yönetici oturumuyla etkin tarama"
zap -e ZAP_AUTH_HEADER=Cookie -e ZAP_AUTH_HEADER_VALUE="$(jget "$A" cookie)" -e ZAP_AUTH_HEADER_SITE=localhost -t "$ZAP_IMG" \
  zap-api-scan.py -t /zap/wrk/openapi.json -f openapi -I -r api-yonetici.html -J api-yonetici.json -w api-yonetici.md -z "$LIMITS $(hdrs "$(jget "$A" csrf)")"
log "oturumlar tarama sonunda: üye $(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: $(jget "$U" cookie)" "$BASE/api/auth/me") · yönetici $(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: $(jget "$A" cookie)" "$BASE/api/auth/me")"
if [ -n "${LIVE_URL:-}" ]; then
  log "6/6 canlı site — YALNIZ pasif tarama: $LIVE_URL"
  zap -t "$ZAP_IMG" zap-baseline.py -t "$LIVE_URL" -m 1 -I -r canli-pasif.html -J canli-pasif.json -w canli-pasif.md
fi

# sunucu tarafında yakalanmamış hata / 5xx izi
grep -E "Error|TypeError|ReferenceError|UnhandledPromise| 500 " "$OUT/sunucu.log" | sort | uniq -c | sort -rn | head -60 > "$OUT/sunucu-hatalari.txt" || true
npm audit --omit=dev --json > "$OUT/npm-audit.json" 2>/dev/null || true
kill $SRV 2>/dev/null; docker rm -f pg >/dev/null 2>&1

# ---------- özet ----------
python3 - "$OUT" <<'PY'
import json, os, sys, glob
out = sys.argv[1]; lines = ["# OWASP ZAP özeti", ""]
names = {"0": "Bilgi", "1": "Düşük", "2": "Orta", "3": "Yüksek"}
for f in sorted(glob.glob(os.path.join(out, "*.json"))):
    if os.path.basename(f) in ("openapi.json", "npm-audit.json", "saglik.json"): continue
    try: d = json.load(open(f))
    except Exception as e: lines.append(f"## {os.path.basename(f)}\n(okunamadı: {e})\n"); continue
    al = [a for s in d.get("site", []) for a in s.get("alerts", [])]
    cnt = {}
    for a in al: cnt[a["riskcode"]] = cnt.get(a["riskcode"], 0) + 1
    lines.append(f"## {os.path.basename(f)[:-5]} — " + ", ".join(f"{names[k]}: {cnt.get(k, 0)}" for k in ("3", "2", "1", "0")))
    for a in sorted(al, key=lambda a: -int(a["riskcode"])):
        urls = [i.get("uri", "") for i in a.get("instances", [])][:4]
        lines.append(f"- [{names[a['riskcode']]}] {a['alert']} (pluginId {a.get('pluginid')}, {a.get('count', len(a.get('instances', [])))} örnek) — " + " · ".join(urls))
    lines.append("")
try:
    au = json.load(open(os.path.join(out, "npm-audit.json"))).get("metadata", {}).get("vulnerabilities", {})
    lines.append("## npm audit (üretim bağımlılıkları) — " + ", ".join(f"{k}: {v}" for k, v in au.items()))
except Exception: pass
open(os.path.join(out, "OZET.md"), "w").write("\n".join(lines) + "\n")
PY
log "tamamlandı"
