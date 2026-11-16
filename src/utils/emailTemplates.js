// Alpvefit e-posta şablonları (Alpvefit şablon yapısından türetildi; marka, renk ve içerik Alpvefit'e ait) (tek merkez).
// • Koyu antrasit üst bant + lime ◆ ALPVEFIT, beyaz kart, lime vurgu, ortalanmış kod kutusu.
// • E-posta istemcisi uyumluluğu: tablo düzeni, satır içi stil, harici yazı tipi/görsel/izleme pikseli YOK
//   (görseller kapalıyken de eksiksiz görünür; alıcı hakkında hiçbir veri dışarı sızmaz).
// • Her ileti TR/EN; dil isteği yapan tarayıcının dilinden (X-Alp-Lang) veya üyenin kayıtlı dilinden gelir.
// • Her şablon { subject, html, text } döner — düz metin sürümü spam filtrelerinde ve metin tabanlı istemcilerde okunur.
// • Şablona giren TÜM değişken değerler HTML'e kaçışlanarak yazılır (ad, e-posta, plan türü, hazırlayan adı…).

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const L = (lang) => (lang === "en" ? "en" : "tr");

export function mailLang(req) {
  const h = String((req && req.headers && req.headers["x-avf-lang"]) || "").toLowerCase();
  return h === "en" ? "en" : "tr";
}

// v51: e-posta alt bilgisindeki marka bağlantısı her zaman ana alan adı (api. alt alanı değil). İşlem bağlantıları (panel,
// ödeme sayfası vb.) siteBase() ile FRONTEND_URL'den gelir; alan adı taşındığında yalnız ortam değişkeni güncellenir.
export const BRAND_URL = "https://www.alpvefit.com";

export function siteBase() {
  const raw = process.env.FRONTEND_URL || process.env.PUBLIC_API_URL || "";
  try { const u = new URL(raw); return u.protocol === "https:" || process.env.NODE_ENV !== "production" ? u.origin : ""; } catch { return ""; }
}

const C = {
  ink: "#0f172a", body: "#334155", muted: "#64748b", line: "#e7e2dc", page: "#F5F7F2", dark: "#17201D",
  orange: "#B8E84B", orangeSoft: "#F0F8DA", orangeLine: "#B8E84B", orangeText: "#1F6B5B",
};
const FONT = "'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace";

// ---------- yapı taşları (her biri { html, text }) ----------
const p = (s) => ({ html: `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${C.body}">${s}</p>`, text: strip(s) });
const codeBox = (code, note) => ({
  html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:22px auto 8px"><tr>
<td align="center" style="background:${C.orangeSoft};border:1px dashed ${C.orangeLine};border-radius:14px;padding:18px 30px">
<div style="font-family:${MONO};font-size:34px;line-height:1.1;font-weight:800;letter-spacing:10px;color:${C.ink};padding-left:10px">${esc(code)}</div>
</td></tr></table>
<p style="margin:0 0 20px;text-align:center;font-size:12.5px;line-height:1.5;color:${C.orangeText};font-weight:600">${esc(note)}</p>`,
  text: `\n    ${code}\n    (${note})\n`,
});
const rows = (list) => {
  const r = list.filter((x) => x && x[1] !== undefined && x[1] !== null && x[1] !== "");
  return {
    html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 18px;border:1px solid ${C.line};border-radius:12px;border-collapse:separate">${
      r.map(([k, v], i) => `<tr><td style="padding:11px 14px;font-size:13px;color:${C.muted};${i ? `border-top:1px solid ${C.line};` : ""}width:42%">${esc(k)}</td><td style="padding:11px 14px;font-size:14px;color:${C.ink};font-weight:700;${i ? `border-top:1px solid ${C.line};` : ""}word-break:break-word">${esc(v)}</td></tr>`).join("")
    }</table>`,
    text: r.map(([k, v]) => `${k}: ${v}`).join("\n"),
  };
};
const items = (list, lang) => {
  const r = (list || []).slice(0, 30);
  if (!r.length) return { html: "", text: "" };
  return {
    html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px">${
      r.map((x) => `<tr><td style="padding:6px 0;font-size:14px;color:${C.body}">${esc(x.name)}${x.batch ? ` <span style="color:${C.muted};font-size:12px">· ${esc(lang === "en" ? "Batch" : "Parti")} ${esc(x.batch)}</span>` : ""}</td><td align="right" style="padding:6px 0;font-size:14px;color:${C.ink};font-weight:700;white-space:nowrap">× ${esc(x.qty)}</td></tr>`).join("")
    }</table>`,
    text: r.map((x) => `- ${x.name} × ${x.qty}`).join("\n"),
  };
};
const callout = (s, tone) => {
  const t = tone === "danger" ? ["#fef2f2", "#ef4444", "#7f1d1d"] : tone === "ok" ? ["#f0fdf4", "#22c55e", "#14532d"] : ["#f8fafc", "#94a3b8", C.body];
  return { html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 18px"><tr><td style="background:${t[0]};border-left:3px solid ${t[1]};border-radius:8px;padding:12px 14px;font-size:13.5px;line-height:1.6;color:${t[2]}">${s}</td></tr></table>`, text: strip(s) };
};
const button = (label, href) => {
  if (!href) return { html: "", text: "" };
  return {
    html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 22px"><tr><td align="center" bgcolor="${C.orange}" style="border-radius:12px">
<a href="${esc(href)}" style="display:inline-block;padding:13px 24px;font-family:${FONT};font-size:14.5px;font-weight:800;color:#17201D;text-decoration:none;border-radius:12px">${esc(label)}</a></td></tr></table>`,
    text: `${label}: ${href}`,
  };
};
function strip(s) { return String(s).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"); }

const FOOT = {
  tr: { auto: "Bu e-posta Alpvefit hesabınızla ilgili bir işlem nedeniyle otomatik olarak gönderildi; lütfen yanıtlamayın. Yardım için sitemizdeki canlı desteği kullanabilirsiniz.",
        never: "Alpvefit ekibi sizden hiçbir zaman şifrenizi, doğrulama kodunuzu veya kurtarma kodlarınızı istemez." },
  en: { auto: "This email was sent automatically because of an action on your Alpvefit account; please do not reply. For help, use live support on our website.",
        never: "The Alpvefit team will never ask you for your password, verification code or recovery codes." },
};

/** Ortak çerçeve: üst bant, kart, alt bilgi. blocks = [{html,text}] */
function layout(lang, { preheader, eyebrow, title, blocks, footer }) {
  const lg = L(lang), f = FOOT[lg], year = new Date().getUTCFullYear();
  const foot = footer || f.auto;
  const html = `<!doctype html>
<html lang="${lg}" xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"><title>${esc(title)}</title>
<style>@media only screen and (max-width:480px){.ap-out{padding:16px 8px!important}.ap-px{padding-left:20px!important;padding-right:20px!important}.ap-h1{font-size:20px!important}}</style></head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader || title)}&#8203;&#8199;&#8203;&#8199;&#8203;&#8199;&#8203;&#8199;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page}"><tr><td align="center" class="ap-out" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;font-family:${FONT}">
<tr><td class="ap-px" style="background:${C.dark};border-radius:16px 16px 0 0;padding:20px 28px">
<span style="color:#B8E84B;font-size:16px;line-height:1">&#9670;</span>&nbsp;<span style="color:#F5F7F2;font-size:15px;font-weight:800;letter-spacing:.16em">ALPVEFIT</span></td></tr>
<tr><td style="height:3px;line-height:3px;font-size:0;background:${C.orange}">&nbsp;</td></tr>
<tr><td class="ap-px" style="background:#ffffff;padding:30px 28px 14px">
${eyebrow ? `<div style="font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${C.orangeText};margin:0 0 10px">${esc(eyebrow)}</div>` : ""}
<h1 class="ap-h1" style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${C.ink};font-weight:800">${esc(title)}</h1>
${blocks.map((b) => b.html).join("\n")}
</td></tr>
<tr><td class="ap-px" style="background:#ffffff;border-radius:0 0 16px 16px;padding:0 28px 26px">
<div style="border-top:1px solid ${C.line};padding-top:16px;font-size:12px;line-height:1.6;color:${C.muted}">${foot}<br><span style="color:#94a3b8">${esc(f.never)}</span></div></td></tr>
<tr><td align="center" style="padding:16px 8px 0;font-size:11.5px;color:#94a3b8">&copy; ${year} Alpvefit · <a href="${BRAND_URL}" style="color:#94a3b8;text-decoration:underline">alpvefit.com</a></td></tr>
</table></td></tr></table></body></html>`;
  const text = [`ALPVEFIT`, ``, title, ``, ...blocks.map((b) => b.text).filter(Boolean), ``, `—`, strip(foot), f.never, `\n${BRAND_URL}`].join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  return { html, text };
}

const subj = (s) => `Alpvefit — ${s}`;
const VALID = { tr: (m) => `${m} dakika geçerlidir · kimseyle paylaşmayın`, en: (m) => `Valid for ${m} minutes · do not share it with anyone` };
const NOT_YOU = {
  tr: "Bu işlemi siz başlatmadıysanız bu e-postayı dikkate almayın ve kodu kimseyle paylaşmayın; şifrenizi değiştirmenizi öneririz.",
  en: "If you did not start this, ignore this email and do not share the code; we recommend changing your password.",
};
const NOT_YOU_DONE = {
  tr: "Bu işlemi siz yapmadıysanız hemen şifrenizi değiştirin ve sitemizdeki canlı destek üzerinden bizimle iletişime geçin.",
  en: "If this wasn't you, change your password immediately and contact us via live support on our website.",
};

// ---------- KODLU İLETİLER ----------
// purpose → metin. Tümü aynı düzende: başlık, açıklama, kod kutusu, "siz değilseniz" uyarısı.
const CODE_TEXT = {
  register: {
    tr: { s: "E-posta Doğrulama", e: "Hoş geldiniz", t: "E-posta adresinizi doğrulayın", d: "Alpvefit hesabınızı oluşturmak için aşağıdaki doğrulama kodunu kayıt ekranına girin." },
    en: { s: "Email Verification", e: "Welcome", t: "Verify your email address", d: "Enter the verification code below on the sign-up screen to create your Alpvefit account." },
  },
  password_change: {
    tr: { s: "Şifre Değişikliği Onayı", e: "Hesap güvenliği", t: "Şifre değişikliğini onaylayın", d: "Hesap şifrenizi değiştirme talebinizi onaylamak için aşağıdaki kodu girin. Onaydan sonra tüm cihazlardaki oturumlar kapanır." },
    en: { s: "Confirm Password Change", e: "Account security", t: "Confirm your password change", d: "Enter the code below to confirm your password change. All sessions on every device will be signed out afterwards." },
  },
  name_change: {
    tr: { s: "İsim Değişikliği Onayı", e: "Hesap bilgileri", t: "İsim değişikliğini onaylayın", d: "Hesabınızdaki adı aşağıdaki şekilde değiştirme talebinizi onaylamak için kodu girin." },
    en: { s: "Confirm Name Change", e: "Account details", t: "Confirm your name change", d: "Enter the code to confirm changing the name on your account as shown below." },
  },
  email_change_old: {
    tr: { s: "E-posta Değişikliği Onayı", e: "Hesap güvenliği", t: "E-posta değişikliği talebi", d: "Hesabınızın e-posta adresini aşağıdaki adresle değiştirme talebi alındı. Devam etmek için kodu girin." },
    en: { s: "Confirm Email Change", e: "Account security", t: "Email change request", d: "We received a request to change your account email to the address below. Enter the code to continue." },
  },
  email_change: {
    tr: { s: "Yeni E-posta Adresini Doğrulayın", e: "Hesap bilgileri", t: "Yeni e-posta adresinizi doğrulayın", d: "Bu adresi Alpvefit hesabınızın yeni e-posta adresi olarak onaylamak için aşağıdaki kodu girin." },
    en: { s: "Verify Your New Email", e: "Account details", t: "Verify your new email address", d: "Enter the code below to confirm this address as the new email for your Alpvefit account." },
  },
  delete_account: {
    tr: { s: "Hesap Silme Onayı", e: "Kalıcı işlem", t: "Hesap silme onayı", d: "Hesabınızı ve kişisel verilerinizi kalıcı olarak silmek için aşağıdaki kodu girin." },
    en: { s: "Confirm Account Deletion", e: "Permanent action", t: "Confirm account deletion", d: "Enter the code below to permanently delete your account and personal data." },
  },
  "2fa_enable": {
    tr: { s: "Google Authenticator Etkinleştirme Onayı", e: "Hesap güvenliği", t: "Google Authenticator'ı etkinleştirin", d: "Google Authenticator ile iki adımlı giriş doğrulamasını etkinleştirme işlemini onaylamak için aşağıdaki kodu girin." },
    en: { s: "Confirm Google Authenticator Setup", e: "Account security", t: "Turn on Google Authenticator", d: "Enter the code below to confirm turning on two-step sign-in verification with Google Authenticator." },
  },
  totp_renew: {
    tr: { s: "Google Authenticator Yenileme Onayı", e: "Hesap güvenliği", t: "Google Authenticator'ı yenileyin", d: "Hesabınızdaki Google Authenticator kurulumunu yeni bir telefona / uygulamaya taşımak için aşağıdaki kodu girin. Yeni kurulum doğrulanana kadar mevcut kurulumunuz geçerli kalır; doğrulandığında eski kurulum ve eski kurtarma kodları geçersiz olur." },
    en: { s: "Confirm Google Authenticator Renewal", e: "Account security", t: "Renew Google Authenticator", d: "Enter the code below to move the Google Authenticator setup on your account to a new phone / app. Your current setup keeps working until the new one is verified; after that, the old setup and old recovery codes stop working." },
  },
  recovery_regen: {
    tr: { s: "Kurtarma Kodu Yenileme Onayı", e: "Hesap güvenliği", t: "Kurtarma kodlarını yenileme", d: "Kurtarma kodlarınızı yenilemek için aşağıdaki kodu girin. Yenilendiğinde eski kodların tamamı geçersiz olur." },
    en: { s: "Confirm Recovery Code Renewal", e: "Account security", t: "Renew recovery codes", d: "Enter the code below to renew your recovery codes. All old codes will stop working." },
  },
};

/**
 * Kodlu ileti. purpose: CODE_TEXT anahtarı. extra: { newName, newEmail, minutes }.
 */
export function codeMail(purpose, code, lang, extra = {}) {
  const lg = L(lang), mins = extra.minutes || 5;
  const T = CODE_TEXT[purpose] && CODE_TEXT[purpose][lg];
  if (!T) throw new Error("unknown code mail: " + purpose);   // v67: bilinmeyen amaç sessizce başka bir metne düşmez
  const blocks = [p(esc(T.d))];
  if (purpose === "name_change" && extra.newName) blocks.push(rows([[lg === "en" ? "New name" : "Yeni ad", extra.newName]]));
  if (purpose === "email_change_old" && extra.newEmail) blocks.push(rows([[lg === "en" ? "New email" : "Yeni e-posta", extra.newEmail]]));
  blocks.push(codeBox(code, VALID[lg](mins)));
  if (purpose === "delete_account") blocks.push(callout(esc(lg === "en" ? "This cannot be undone." : "Bu işlem geri alınamaz."), "danger"));
  blocks.push(callout(esc(NOT_YOU[lg])));
  const { html, text } = layout(lg, { preheader: `${T.t} — ${code}`, eyebrow: T.e, title: T.t, blocks });
  return { subject: subj(T.s), html, text };
}

/**
 * v57: şifre sıfırlama — tek kullanımlık bağlantı (varsa) + aynı istek için 6 haneli kod. İkisi de `minutes` dakika geçerlidir.
 * İsteği hesap sahibi yapmadıysa hiçbir şey değişmez ve hesap kilitlenmez (metinde açıkça yazılır).
 */
export function resetMail(lang, { code, url = "", minutes = 15 }) {
  const lg = L(lang), en = lg === "en";
  const blocks = [
    p(esc(en ? "We received a request to reset the password of your Alpvefit account. Use the button below to choose a new password:"
             : "Alpvefit hesabınızın şifresini sıfırlama isteği aldık. Yeni şifrenizi belirlemek için aşağıdaki düğmeyi kullanın:")),
    button(en ? "Reset my password" : "Şifremi sıfırla", url),
    p(esc(url ? (en ? "Or enter this code on the password reset screen:" : "Ya da bu kodu şifre sıfırlama ekranına girin:")
              : (en ? "Enter this code on the password reset screen:" : "Bu kodu şifre sıfırlama ekranına girin:"))),
    codeBox(code, VALID[lg](minutes)),
    callout(esc(en
      ? "If you did not request this, ignore this email: your password will not change and your account will not be locked. Never share the link or the code."
      : "Bu isteği siz yapmadıysanız bu e-postayı dikkate almayın: şifreniz değişmez ve hesabınız kilitlenmez. Bağlantıyı ve kodu kimseyle paylaşmayın.")),
  ];
  const t = en ? "Reset your password" : "Şifrenizi sıfırlayın";
  const { html, text } = layout(lg, { preheader: `${t} — ${code}`, eyebrow: en ? "Account recovery" : "Hesap kurtarma", title: t, blocks });
  return { subject: subj(en ? "Password Reset" : "Şifre Sıfırlama"), html, text };
}

// ---------- BİLDİRİMLER (kodsuz) ----------
export function noticeMail(kind, lang, extra = {}) {
  const lg = L(lang), en = lg === "en";
  const N = {
    password_changed: en
      ? { s: "Your Password Was Changed", e: "Account security", t: "Your password was changed", b: [p("The password for your Alpvefit account was just changed. For your security, all sessions were signed out.")], warn: NOT_YOU_DONE.en }
      : { s: "Şifreniz Değiştirildi", e: "Hesap güvenliği", t: "Şifreniz değiştirildi", b: [p("Alpvefit hesabınızın şifresi az önce değiştirildi. Güvenliğiniz için tüm oturumlar kapatıldı.")], warn: NOT_YOU_DONE.tr },
    // v59: Hesabım'dan şifre değişikliği — değişikliği yapan cihazın oturumu açık kalır, diğer tüm oturumlar kapanır
    password_changed_kept: en
      ? { s: "Your Password Was Changed", e: "Account security", t: "Your password was changed", b: [p("The password for your Alpvefit account was just changed. You stay signed in on the device you used; all other sessions were signed out.")], warn: NOT_YOU_DONE.en }
      : { s: "Şifreniz Değiştirildi", e: "Hesap güvenliği", t: "Şifreniz değiştirildi", b: [p("Alpvefit hesabınızın şifresi az önce değiştirildi. Değişikliği yaptığınız cihazdaki oturumunuz açık kaldı; diğer tüm cihazlardaki oturumlar kapatıldı.")], warn: NOT_YOU_DONE.tr },
    email_changed: en
      ? { s: "Your Email Address Was Changed", e: "Account security", t: "Your email address was changed", b: [p("The email address of your Alpvefit account was changed. Messages about your account will now go to the new address.")], warn: NOT_YOU_DONE.en }
      : { s: "E-posta Adresiniz Değiştirildi", e: "Hesap güvenliği", t: "E-posta adresiniz değiştirildi", b: [p("Alpvefit hesabınızın e-posta adresi değiştirildi. Hesabınızla ilgili iletiler artık yeni adrese gönderilecek.")], warn: NOT_YOU_DONE.tr },
    totp_enabled: en
      ? { s: "Two-Step Verification Is On", e: "Account security", t: "Google Authenticator is now on", b: [p("Two-step verification with Google Authenticator was turned on for your account. Keep your recovery codes somewhere safe; they are the only way back in if you lose your phone.")], warn: NOT_YOU_DONE.en, tone: "ok" }
      : { s: "İki Adımlı Doğrulama Etkin", e: "Hesap güvenliği", t: "Google Authenticator etkinleştirildi", b: [p("Hesabınızda Google Authenticator ile iki adımlı doğrulama etkinleştirildi. Kurtarma kodlarınızı güvenli bir yerde saklayın; telefonunuzu kaybederseniz hesabınıza yalnız bu kodlarla erişebilirsiniz.")], warn: NOT_YOU_DONE.tr, tone: "ok" },
    recovery_regenerated: en
      ? { s: "Your Recovery Codes Were Renewed", e: "Account security", t: "Your recovery codes were renewed", b: [p("Your account's recovery codes were renewed; all old codes are now invalid.")], warn: NOT_YOU_DONE.en }
      : { s: "Kurtarma Kodlarınız Yenilendi", e: "Hesap güvenliği", t: "Kurtarma kodlarınız yenilendi", b: [p("Hesabınızın kurtarma kodları yenilendi; eski kodların tamamı geçersiz oldu.")], warn: NOT_YOU_DONE.tr },
    totp_disabled: en
      ? { s: "Google Authenticator Was Removed", e: "Account security", t: "Google Authenticator was removed", b: [p("Two-step sign-in verification with Google Authenticator was removed from your account. Signing in now requires your password only; you can turn it back on from your account at any time.")], warn: NOT_YOU_DONE.en }
      : { s: "Google Authenticator Kaldırıldı", e: "Hesap güvenliği", t: "Google Authenticator kaldırıldı", b: [p("Hesabınızdan Google Authenticator ile iki adımlı giriş doğrulaması kaldırıldı. Girişte artık yalnız şifreniz istenir; dilediğiniz zaman hesabınızdan yeniden etkinleştirebilirsiniz.")], warn: NOT_YOU_DONE.tr },
    recovery_used: en
      ? { s: "A Recovery Code Was Used to Sign In", e: "Security alert", t: "A recovery code was used on your account", b: [p("Someone signed in to your account with your password and one of your recovery codes. That code can no longer be used."), rows([["IP", extra.ip], ["Recovery codes left", extra.left]]), p("If you lost access to Google Authenticator, open My Account › Account Settings › Two-Step Verification and choose “Renew Authenticator”: after email verification you set it up on your new phone and get new recovery codes. If you cannot access your email either, write to " + SUPPORT_EMAIL + ".")], warn: NOT_YOU_DONE.en, tone: "danger" }
      : { s: "Hesabınıza Kurtarma Koduyla Giriş Yapıldı", e: "Güvenlik uyarısı", t: "Hesabınızda kurtarma kodu kullanıldı", b: [p("Hesabınıza şifreniz ve kurtarma kodlarınızdan biriyle giriş yapıldı. Kullanılan kod artık geçersizdir."), rows([["IP", extra.ip], ["Kalan kurtarma kodu", extra.left]]), p("Google Authenticator'a erişiminizi kaybettiyseniz Hesabım › Hesap Ayarları › İki Adımlı Doğrulama bölümünden “Authenticator'ı yenile”yi seçin: e-posta doğrulamasından sonra yeni telefonunuza kurar ve yeni kurtarma kodları alırsınız. E-postanıza da erişemiyorsanız " + SUPPORT_EMAIL + " adresine yazın.")], warn: NOT_YOU_DONE.tr, tone: "danger" },
    account_locked: en
      ? { s: "Your Account Was Temporarily Locked", e: "Security alert", t: "Your account is locked for " + (extra.minutes || 30) + " minutes", b: [p(`A verification code (email, Google Authenticator or recovery code) was entered incorrectly 6 times in a row on your account, so it was locked for ${esc(extra.minutes || 30)} minutes for your security. All sessions were signed out.`), rows([["Lock ends", extra.until ? fmtDate(extra.until, "en") : ""]]), p("The lock lifts by itself when the time is up. You can also unlock it now by resetting your password with “Forgot password” on the website.")], warn: "If these attempts weren't you, reset your password now. Need help? Write to " + SUPPORT_EMAIL + ".", tone: "danger" }
      : { s: "Hesabınız Geçici Olarak Kilitlendi", e: "Güvenlik uyarısı", t: "Hesabınız " + (extra.minutes || 30) + " dakika kilitlendi", b: [p(`Hesabınızda bir doğrulama kodu (e-posta kodu, Google Authenticator veya kurtarma kodu) art arda 6 kez hatalı girildiği için hesabınız güvenliğiniz amacıyla ${esc(extra.minutes || 30)} dakika kilitlendi. Tüm oturumlar kapatıldı.`), rows([["Kilidin bitişi", extra.until ? fmtDate(extra.until, "tr") : ""]]), p("Süre dolunca kilit kendiliğinden kalkar. Beklemek istemezseniz sitedeki “Şifremi unuttum” ile şifrenizi yenileyerek kilidi hemen kaldırabilirsiniz.")], warn: "Bu denemeleri siz yapmadıysanız şifrenizi hemen yenileyin. Yardım için: " + SUPPORT_EMAIL, tone: "danger" },
    password_lock: en
      ? { s: "Sign-in Attempts Paused on Your Account", e: "Security alert", t: "Sign-in is paused for " + (extra.minutes || 30) + " minutes", b: [p(`The wrong password was entered several times in a row for your account, so sign-in is paused for ${esc(extra.minutes || 30)} minutes for your security. Your password has not been changed, and these failed attempts did not sign anyone in.`), rows([["Pause ends", extra.until ? fmtDate(extra.until, "en") : ""]]), p("The pause ends by itself. You can also lift it now by resetting your password with “Forgot password” on the website.")], warn: "If these attempts weren't you, reset your password now. Need help? Write to " + SUPPORT_EMAIL + ".", tone: "danger" }
      : { s: "Hesabınızda Girişler Bekletiliyor", e: "Güvenlik uyarısı", t: "Girişler " + (extra.minutes || 30) + " dakika bekletiliyor", b: [p(`Hesabınız için art arda birkaç kez hatalı şifre girildiği için girişler güvenliğiniz amacıyla ${esc(extra.minutes || 30)} dakika bekletiliyor. Şifreniz değiştirilmedi; bu hatalı denemelerle hesabınıza giriş yapılmadı.`), rows([["Beklemenin bitişi", extra.until ? fmtDate(extra.until, "tr") : ""]]), p("Bekleme süre dolunca kendiliğinden kalkar. Beklemek istemezseniz sitedeki “Şifremi unuttum” ile şifrenizi yenileyerek hemen kaldırabilirsiniz.")], warn: "Bu denemeleri siz yapmadıysanız şifrenizi hemen yenileyin. Yardım için: " + SUPPORT_EMAIL, tone: "danger" },
    totp_renewed: en
      ? { s: "Google Authenticator Was Renewed", e: "Account security", t: "Google Authenticator was set up again", b: [p("Google Authenticator was moved to a new app on your account after email verification. The previous setup and all previous recovery codes no longer work, and other sessions were signed out.")], warn: NOT_YOU_DONE.en, tone: "danger" }
      : { s: "Google Authenticator Yenilendi", e: "Hesap güvenliği", t: "Google Authenticator yeniden kuruldu", b: [p("Hesabınızda e-posta doğrulamasıyla Google Authenticator yeni bir uygulamaya taşındı. Önceki kurulum ve önceki kurtarma kodlarının tamamı artık geçersizdir; diğer oturumlar kapatıldı.")], warn: NOT_YOU_DONE.tr, tone: "danger" },
    account_deleted: en
      ? { s: "Your Account Was Deleted", e: "Account", t: "Your account was deleted", b: [p("Your account and personal data have been permanently deleted."), p("You can sign up again with this email address at any time.")], warn: null }
      : { s: "Hesabınız Silindi", e: "Hesap", t: "Hesabınız silindi", b: [p("Hesabınız ve kişisel verileriniz kalıcı olarak silindi."), p("Dilerseniz bu e-posta adresiyle istediğiniz zaman yeniden kayıt olabilirsiniz.")], warn: null },
  }[kind];
  if (!N) throw new Error("unknown notice: " + kind);
  const blocks = N.b.slice();
  if (N.warn) blocks.push(callout(esc(N.warn), N.tone === "danger" ? "danger" : undefined));
  const { html, text } = layout(lg, { eyebrow: N.e, title: N.t, blocks });
  return { subject: subj(N.s), html, text };
}

// ---------- ORTAK ----------
const fmtDate = (d, lg) => { try { return new Date(d).toLocaleString(lg === "en" ? "en-GB" : "tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) + (lg === "en" ? " (Istanbul)" : " (TSİ)"); } catch { return ""; } };
export const SUPPORT_EMAIL = "destek@alpvefit.com";

/** Yeni plan yayınlandı. Plan içeriği e-postaya konmaz (sağlık verisi); yalnız bildirim ve panele bağlantı. o: { kindLabel, authorName } */
export function planPublishedMail(lang, o) {
  const lg = L(lang), en = lg === "en", base = siteBase();
  const t = en ? "A new plan was added to your account" : "Hesabınıza yeni bir plan eklendi";
  const blocks = [
    p(esc(en ? "A new plan was published for you. For your privacy, its content is not included in this email; sign in to your account to read it."
             : "Sizin için yeni bir plan yayınlandı. Gizliliğiniz için içeriği bu e-postada yer almaz; okumak için hesabınıza giriş yapın.")),
    rows([[en ? "Plan" : "Plan", o.kindLabel], [en ? "Prepared by" : "Hazırlayan", o.authorName]]),
    button(en ? "View my plans" : "Planlarımı görüntüle", base ? `${base}/panel` : ""),
  ];
  const { html, text } = layout(lg, { preheader: t, eyebrow: en ? "New plan" : "Yeni plan", title: t, blocks });
  return { subject: subj(en ? "New Plan Published" : "Yeni Plan Yayınlandı"), html, text };
}

/** Ödeme onaylandı. o: { orderNumber, dueAt } — planlar ödemeden itibaren 7 gün içinde hazırlanır. */
export function orderPaidMail(lang, o) {
  const lg = L(lang), en = lg === "en", base = siteBase();
  const t = en ? "Your payment is confirmed" : "Ödemeniz onaylandı";
  const blocks = [
    p(esc(en ? "Thank you. Your payment was received and confirmed. Your nutrition, training and supplement programs are prepared by our experts within 7 days; you will be notified when each plan is published."
             : "Teşekkür ederiz. Ödemeniz alındı ve onaylandı. Beslenme, antrenman ve takviye programlarınız uzmanlarımız tarafından 7 gün içinde hazırlanır; her plan yayınlandığında bildirim alırsınız.")),
    rows([[en ? "Order" : "Sipariş", o.orderNumber], [en ? "Plans ready by" : "Planların hazır olacağı tarih", o.dueAt ? fmtDate(o.dueAt, lg) : ""]]),
    button(en ? "Go to my panel" : "Panelime git", base ? `${base}/panel` : ""),
  ];
  const { html, text } = layout(lg, { preheader: t, eyebrow: en ? "Order" : "Sipariş", title: t, blocks });
  return { subject: subj(en ? "Payment Confirmed" : "Ödeme Onaylandı"), html, text };
}
