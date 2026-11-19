#!/usr/bin/env bash
# ZAP raporlarını depodaki ayrı "security-reports" dalına yazar (yalnız son çalıştırma tutulur; ana dal etkilenmez).
set -u
[ -d zap-out ] || { echo "rapor yok"; exit 0; }
TMP=$(mktemp -d); cp -r zap-out/. "$TMP/"; cd "$TMP"
git init -q && git checkout -q -b security-reports
git add -A
git -c user.name="security-scan" -c user.email="security-scan@users.noreply.github.com" -c commit.gpgsign=false \
  commit -qm "ZAP raporu $(date -u '+%Y-%m-%d %H:%M') (${GITHUB_SHA:0:7})"
git push -qf "https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" security-reports
