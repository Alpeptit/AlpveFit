// Anlık olaylar (Server-Sent Events): üyenin açık sekmelerine yeni mesaj, okundu ve "yazıyor" bilgisi anında iletilir.
// Bellek içi yayın: tek sunucu süreci için. Bağlantı koparsa istemci kendiliğinden yeniden bağlanır; ayrıca seyrek yoklama
// yedek olarak çalışır (olay kaçsa da veri sunucudan yeniden okunur). Olaylar yalnız kimlik ve zaman taşır; mesaj metni gönderilmez.
const subs = new Map();          // userId → Set<res>
const MAX_PER_USER = 6;          // kullanıcı başına en çok açık bağlantı (en eskisi kapatılır)
const PING_MS = 20000;

export function liveCount() { let n = 0; for (const s of subs.values()) n += s.size; return n; }

/** SSE bağlantısını açar ve kaydeder; istemci kapanınca kaydı siler. */
export function openStream(req, res, userId) {
  res.status(200);
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");   // no-transform: sıkıştırma ara katmanı akışı tamponlamaz
  res.setHeader("X-Accel-Buffering", "no");
  res.setHeader("Connection", "keep-alive");
  if (res.flushHeaders) res.flushHeaders();
  let set = subs.get(userId);
  if (!set) { set = new Set(); subs.set(userId, set); }
  if (set.size >= MAX_PER_USER) { const old = set.values().next().value; set.delete(old); try { old.end(); } catch { /* yok say */ } }
  set.add(res);
  write(res, "hello", { t: Date.now() }, "retry: 4000\n");
  const ping = setInterval(() => { try { res.write(": ping\n\n"); if (res.flush) res.flush(); } catch { /* yok say */ } }, PING_MS);
  const done = () => { clearInterval(ping); const s = subs.get(userId); if (s) { s.delete(res); if (!s.size) subs.delete(userId); } };
  req.on("close", done);
  res.on && res.on("close", done);
}

function write(res, event, data, prefix = "") {
  try { res.write(`${prefix}event: ${event}\ndata: ${JSON.stringify(data)}\n\n`); if (res.flush) res.flush(); } catch { /* bağlantı kapanmış */ }
}

/** Kullanıcının tüm açık sekmelerine olay gönderir. */
export function emit(userId, event, data) {
  const set = subs.get(String(userId)); if (!set) return 0;
  for (const res of set) write(res, event, data);
  return set.size;
}
