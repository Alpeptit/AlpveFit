// Alpvefit sitesi (ön yüz) aynı alan adından sunulur: https://www.alpvefit.com/ → sayfalar, /api → API.
// Aynı köken: httpOnly oturum çerezi ve CSRF çerezi aynı alan adında olur; CORS ve üçüncü taraf çerez sorunu yoktur.
// Güvenlik:
//  - HTML sıkı bir CSP ile gönderilir: yalnız kendi betiklerimiz + reCAPTCHA; satır içi betik YOK.
//  - Uzman/yönetici arayüzü herkese açık site klasöründe DEĞİL: site-uzman/ ayrı klasörde durur ve yalnız panel rolündeki
//    oturuma sunulur; diğer herkese bilinmeyen bir adresle AYNI 404 döner.
import express from "express";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { panelUser } from "./utils/panelSession.js";

const here = dirname(fileURLToPath(import.meta.url));
export const SITE_DIR = process.env.SITE_DIR || join(here, "..", "site");
export const EXPERT_DIR = process.env.EXPERT_DIR || join(here, "..", "site-uzman");
export const EXPERT_ASSET_PREFIX = "/assets/uzman/";
const PRIVATE_ASSET = /^[a-z0-9-]+\.(js|css|html)$/;

export const SITE_CSP = [
  "default-src 'self'",
  "script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://www.gstatic.com",
  "connect-src 'self' https://www.google.com/recaptcha/",
  "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

function htmlHeaders(res) {
  res.setHeader("Content-Security-Policy", SITE_CSP);
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
}

/** Siteyi bağlar. Hız sınırlarından ÖNCE çağrılmalı (sayfa varlıkları kullanıcının API kotasını tüketmesin). */
export function mountSite(app) {
  if (!existsSync(join(SITE_DIR, "index.html"))) {
    console.warn(`[site] ${SITE_DIR} içinde site bulunamadı — yalnız API sunuluyor.`);
    return false;
  }
  const indexFile = join(SITE_DIR, "index.html");
  const notFound = readFileSync(join(SITE_DIR, "404.html"));
  const sendNotFound = (res) => { htmlHeaders(res); res.status(404).type("html").send(notFound); };
  const assetNotFound = (res) => { res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Content-Type-Options", "nosniff"); res.status(404).type("text/plain").send("Not found"); };

  // Uzman/yönetici varlıkları: yalnız panel rolü; CDN/ara katman saklamaz. Yetkisize ve bulunmayana aynı düz 404.
  app.get(EXPERT_ASSET_PREFIX + ":file", async (req, res) => {
    const file = basename(String(req.params.file || ""));
    const full = join(EXPERT_DIR, "assets", file);
    if (!PRIVATE_ASSET.test(file) || !existsSync(full) || !(await panelUser(req))) return assetNotFound(res);
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.sendFile(full);
  });

  app.use("/assets", express.static(join(SITE_DIR, "assets"), {
    index: false, dotfiles: "ignore", fallthrough: true,
    setHeaders(res) { res.setHeader("Cache-Control", "public, max-age=31536000, immutable"); res.setHeader("X-Content-Type-Options", "nosniff"); },
  }));
  app.use("/assets", (req, res) => assetNotFound(res));

  // Uzman/yönetici sayfası: oturum sunucuda doğrulanır; panel rolü yoksa bilinmeyen adresle birebir aynı 404.
  const expertPage = join(EXPERT_DIR, "index.html");
  app.get(["/uzman", "/uzman/*"], async (req, res) => {
    if (!existsSync(expertPage) || !(await panelUser(req))) return sendNotFound(res);
    htmlHeaders(res);
    res.setHeader("Cache-Control", "private, no-store");
    res.sendFile(expertPage);
  });

  // Tek sayfa uygulama: /panel, /panel/*, /giris vb. istemci tarafı yönlendirilir.
  const SPA = ["/", "/giris", "/kayit", "/sifremi-unuttum", "/paketler", "/sss", "/hakkimizda", "/blog", "/blog/*", "/araclar", "/araclar/*", "/forum", "/yasal/*", "/panel", "/panel/*"];
  app.get(SPA, (req, res) => { htmlHeaders(res); res.sendFile(indexFile); });

  app.use(express.static(SITE_DIR, {
    index: false, dotfiles: "ignore", redirect: true, extensions: false,
    setHeaders(res, path) {
      if (path.endsWith(".html")) htmlHeaders(res);
      else res.setHeader("Cache-Control", "public, max-age=3600");
    },
  }));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api/") || req.path === "/api") return next();
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    sendNotFound(res);
  });
  return true;
}
