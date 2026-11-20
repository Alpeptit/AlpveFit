"""Ekip imzası için hareketli AlpveFit GIF'i üretir (site/assets/brand/imza.gif).
Koyu zemin, logo + yazı; logonun ve yazının üzerinden geçen yumuşak ışık süzmesi ve hafif nefes alan parıltı.
Çalıştır: python3 tools/brand/signature_gif.py"""
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

W, H, S = 720, 220, 4              # çıktı boyutu (2x) ve iç çizim ölçeği (kenar yumuşatma için)
OUT = Path(__file__).resolve().parents[2] / "site/assets/brand/imza.gif"
FD = "/usr/share/fonts/opentype/inter/"
BG = (17, 17, 19)

def font(name, px): return ImageFont.truetype(FD + name, px * S)

def base_layers():
    w, h = W * S, H * S
    bg = Image.new("RGB", (w, h), BG)
    # hafif ışık havuzu (sol üst) ve ince çerçeve çizgisi
    glow = Image.new("L", (w, h), 0); g = ImageDraw.Draw(glow)
    g.ellipse((-w * 0.15, -h * 1.1, w * 0.55, h * 1.3), fill=46)
    glow = glow.filter(ImageFilter.GaussianBlur(60 * S))
    bg = Image.composite(Image.new("RGB", (w, h), (44, 44, 50)), bg, glow)
    # içerik maskesi: logo karesi (beyaz) + "A" (koyu) + yazılar
    ink = Image.new("L", (w, h), 0); d = ImageDraw.Draw(ink)
    m, y0, sz = 36 * S, (H * S - 148 * S) // 2, 148 * S
    d.rounded_rectangle((m, y0, m + sz, y0 + sz), radius=42 * S, fill=255)
    a = Image.new("L", (w, h), 0); da = ImageDraw.Draw(a)
    k = sz / 64
    def P(x, y): return (m + x * k, y0 + y * k)
    # favicon.svg ile aynı biçim: M19.5 46.5 L30 20.5 q2-4.5 4 0 l10.5 26 (yuvarlak uç ve birleşim)
    pts = [P(19.5, 46.5), P(30, 20.5)]
    for i in range(1, 12):
        u = i / 12; x = (1 - u) ** 2 * 30 + 2 * (1 - u) * u * 32 + u * u * 34; y = (1 - u) ** 2 * 20.5 + 2 * (1 - u) * u * 16 + u * u * 20.5; pts.append(P(x, y))
    pts += [P(34, 20.5), P(44.5, 46.5)]
    da.line(pts, fill=255, width=int(6 * k), joint="curve")
    for x, y in [(19.5, 46.5), (44.5, 46.5)]: cx, cy = P(x, y); r = 3 * k; da.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    da.line([P(24.5, 37.5), P(39.5, 37.5)], fill=255, width=int(5.5 * k))
    for x in (24.5, 39.5): cx, cy = P(x, 37.5); r = 2.75 * k; da.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    tx = m + sz + 34 * S
    d.text((tx, y0 + 6 * S), "AlpveFit", font=font("InterDisplay-Bold.otf", 84), fill=255)
    sub = Image.new("L", (w, h), 0); ds = ImageDraw.Draw(sub)
    ds.text((tx + 3 * S, y0 + 112 * S), "Uzaktan eğitim  ·  Birebir koçluk", font=font("Inter-Medium.otf", 26), fill=255)
    return bg, ink, a, sub, (m, y0, sz)

def frame(bg, ink, a, sub, box, t):
    w, h = bg.size
    # ışık süzmesi: soldan sağa çapraz bant (t: 0..1 arası geçer, kalan süre bekler)
    sweep = Image.new("L", (w, h), 0); sd = ImageDraw.Draw(sweep)
    if t < 1:
        cx = -0.25 * w + t * 1.5 * w; bw = 90 * S
        sd.polygon([(cx - bw, h), (cx, h), (cx + 0.35 * h + bw * 0.2, 0), (cx + 0.35 * h - bw, 0)], fill=255)
        sweep = sweep.filter(ImageFilter.GaussianBlur(26 * S))
    # nefes alan parıltı (logonun etrafı)
    breathe = 0.5 + 0.5 * math.sin(2 * math.pi * t * 0.8)
    halo = Image.new("L", (w, h), 0); hd = ImageDraw.Draw(halo)
    m, y0, sz = box; pad = 16 * S
    hd.rounded_rectangle((m - pad, y0 - pad, m + sz + pad, y0 + sz + pad), radius=56 * S, fill=int(60 + 50 * breathe))
    halo = halo.filter(ImageFilter.GaussianBlur(16 * S))
    img = Image.composite(Image.new("RGB", (w, h), (78, 78, 88)), bg, halo)
    white = (244, 244, 246)
    img = Image.composite(Image.new("RGB", (w, h), white), img, ink)
    img = Image.composite(Image.new("RGB", (w, h), BG), img, a)
    img = Image.composite(Image.new("RGB", (w, h), (150, 150, 160)), img, sub)
    # süzme yalnız içerik üzerinde parlar; zeminde çok hafif
    on = ImageChops.multiply(sweep, ImageChops.lighter(ink, sub))
    img = Image.composite(Image.new("RGB", (w, h), (255, 255, 255)), img, on.point(lambda v: int(v * 0.85)))
    a_on = ImageChops.multiply(sweep, a)
    img = Image.composite(Image.new("RGB", (w, h), (70, 70, 78)), img, a_on.point(lambda v: int(v * 0.9)))
    img = Image.composite(Image.new("RGB", (w, h), (60, 60, 68)), img, sweep.point(lambda v: int(v * 0.18)))
    return img.resize((W, H), Image.LANCZOS)

def main():
    layers = base_layers()
    n_move, n_hold = 26, 22
    frames = [frame(*layers, i / n_move) for i in range(n_move)] + [frame(*layers, 1 + i / n_hold) for i in range(n_hold)]
    strip = Image.new("RGB", (W, H * 4)); [strip.paste(frames[i], (0, H * j)) for j, i in enumerate((0, n_move // 3, n_move // 2, n_move - 4))]
    pal = strip.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
    out = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out[0].save(OUT, save_all=True, append_images=out[1:], duration=[45] * n_move + [90] * n_hold, loop=0, optimize=True, disposal=1)
    print(OUT, OUT.stat().st_size, "bayt", len(out), "kare")

if __name__ == "__main__": main()
