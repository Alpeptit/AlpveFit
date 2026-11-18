// GIPHY entegrasyonu (imza GIF'i). Anahtar yalnız sunucuda: GIPHY_API_KEY (Railway değişkeni). İçerik derecesi "pg" ile sınırlıdır.
import axios from "axios";

const API = "https://api.giphy.com/v1/gifs";
export const giphyEnabled = () => !!process.env.GIPHY_API_KEY;
const isGiphyMedia = (u) => { try { const x = new URL(u); return x.protocol === "https:" && /(^|\.)giphy\.com$/.test(x.hostname); } catch { return false; } };

function pick(g) {
  const im = (g && g.images) || {};
  const r = im.fixed_height_small || im.fixed_height_downsampled || im.downsized;
  const pv = im.fixed_height_small_still || im.preview_gif || r;
  if (!r || !isGiphyMedia(r.url)) return null;
  return { id: g.id, title: String(g.title || "").slice(0, 80), preview: isGiphyMedia(pv && pv.url) ? pv.url : r.url, anim: r.url, w: Number(r.width) || 0, h: Number(r.height) || 0 };
}
export async function giphySearch(q, offset, lang) {
  const term = q.trim().slice(0, 50);
  const { data } = await axios.get(term ? `${API}/search` : `${API}/trending`, {
    params: { api_key: process.env.GIPHY_API_KEY, q: term || undefined, limit: 24, offset: Math.max(0, Math.min(offset, 4000)), rating: "pg", lang },
    timeout: 6000,
  });
  return { items: (data && data.data || []).map(pick).filter(Boolean), next: (data && data.pagination && data.pagination.offset + data.pagination.count) || 0 };
}
/** Seçilen GIF'in küçük boyutlu (≈100 px yükseklik) sürümünü indirir. */
export async function giphyDownload(id, maxBytes) {
  const { data } = await axios.get(`${API}/${encodeURIComponent(id)}`, { params: { api_key: process.env.GIPHY_API_KEY }, timeout: 6000 });
  const g = pick(data && data.data);
  if (!g) { const e = new Error("bulunamadı"); e.userMessage = "GIF bulunamadı."; throw e; }
  const r = await axios.get(g.anim, { responseType: "arraybuffer", timeout: 10000, maxContentLength: maxBytes, maxRedirects: 2,
    validateStatus: (s) => s === 200, beforeRedirect: (o) => { if (!/(^|\.)giphy\.com$/.test(o.hostname)) throw new Error("yönlendirme"); } });
  const buf = Buffer.from(r.data);
  if (buf.length > maxBytes) { const e = new Error("büyük"); e.userMessage = "Bu GIF çok büyük (en fazla 1 MB). Lütfen başka bir GIF seçin."; throw e; }
  return buf;
}
