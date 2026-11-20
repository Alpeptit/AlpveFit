/* AlpveFit — uygulama (PWA) hizmet çalışanı.
   Güvenlik ilkesi: KİŞİSEL VERİ ÖNBELLEĞE ALINMAZ. Yalnız (1) çevrimdışı sayfası ve uygulama simgeleri, (2) adresinde sürüm
   özeti (?v=…) bulunan herkese açık /assets dosyaları saklanır. Sayfalar her zaman ağdan gelir (bağlantı yoksa çevrimdışı sayfası);
   /api, yönetim alanı ve "private / no-store" yanıtlar hiçbir koşulda saklanmaz. Başka sitelere giden isteklere dokunulmaz. */
"use strict";
var CACHE = "avf-v2";   // v2: telefona bildirim (push)
var OFFLINE = "/offline.html";
var PRECACHE = [OFFLINE, "/assets/icons/icon-192.png", "/assets/icons/icon-512.png"];
var SKIP = /^\/(api|uzman|admin)(\/|$)|^\/assets\/uzman\//;
var MAX_ITEMS = 160;

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(PRECACHE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
function storable(res) {
  if (!res || !res.ok || res.type !== "basic") return false;
  var cc = (res.headers.get("Cache-Control") || "").toLowerCase();
  return cc.indexOf("no-store") < 0 && cc.indexOf("private") < 0;
}
function trim(c) {
  return c.keys().then(function (keys) { if (keys.length > MAX_ITEMS) return Promise.all(keys.slice(0, keys.length - MAX_ITEMS).map(function (k) { return c.delete(k); })); });
}
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin || SKIP.test(url.pathname)) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(function () { return caches.match(OFFLINE); }));
    return;
  }
  if (url.pathname.indexOf("/assets/") === 0 && /[?&]v=[A-Za-z0-9]+/.test(url.search)) {
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) { if (storable(res)) { c.put(req, res.clone()).then(function () { return trim(c); }); } return res; });
      });
    }));
  }
});

// ---- telefona / masaüstüne bildirim (Web Push) ----
// İtme içerik taşımaz; kısa metin oturumla sunucudan çekilir. Oturum kapalıysa ya da bağlantı yoksa genel bir bildirim gösterilir.
self.addEventListener("push", function (e) {
  e.waitUntil(fetch("/api/push/latest", { credentials: "include", cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (d) {
      d = d || { title: "AlpveFit", body: "Yeni bir bildirimin var.", url: "/panel/bildirimler", tag: "n" };
      return self.registration.showNotification(d.title || "AlpveFit", { body: d.body || "", tag: d.tag || "n", renotify: true,
        icon: "/assets/icons/icon-192.png", badge: "/assets/icons/icon-192.png", data: { url: typeof d.url === "string" && d.url.charAt(0) === "/" ? d.url : "/panel/bildirimler" } });
    }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { var c = list[i]; if (new URL(c.url).origin === self.location.origin && "focus" in c) { c.focus(); if ("navigate" in c) return c.navigate(url); return; } }
    return self.clients.openWindow(url);
  }));
});
