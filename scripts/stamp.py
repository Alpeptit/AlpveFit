#!/usr/bin/env python3
"""site/index.html (ve site-uzman/index.html) içindeki ?v=... değerlerini dosya içeriğinin özetiyle günceller.
/assets/* uzun süre önbelleğe alındığı için içerik değişince adres de değişmelidir. Kullanım: python3 scripts/stamp.py"""
import hashlib, re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
def stamp(page, assets_dir, prefix):
    p = root / page
    if not p.exists(): return
    s = p.read_text(encoding="utf-8")
    def rep(m):
        f = root / assets_dir / m.group(1)
        v = hashlib.sha256(f.read_bytes()).hexdigest()[:10] if f.exists() else "missing"
        return f'{prefix}{m.group(1)}?v={v}"'
    s2 = re.sub(re.escape(prefix) + r'([a-z0-9-]+\.(?:js|css))\?v=[A-Za-z0-9]+"', rep, s)
    if s2 != s: p.write_text(s2, encoding="utf-8")
stamp("site/index.html", "site/assets", "/assets/")
stamp("site/404.html", "site/assets", "/assets/")              # 404 de aynı uygulamayı yükler (marka ve maskotlu sayfa)
stamp("site-uzman/index.html", "site/assets", "/assets/")          # ortak çekirdek (herkese açık)
stamp("site-uzman/index.html", "site-uzman/assets", "/assets/uzman/")
