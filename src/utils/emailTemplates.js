// AlpveFit e-posta şablonları (tek merkez). Kimlik: siteyle aynı — antrasit siyah (#111113), sıcak kâğıt zemini, beyaz kart,
// siyah "A" rozeti ve düz siyah düğme; vurgu rengi yok.
// • E-posta istemcisi uyumluluğu: tablo düzeni, satır içi stil, harici yazı tipi/görsel/izleme pikseli YOK
//   (görseller kapalıyken de eksiksiz görünür; alıcı hakkında hiçbir veri dışarı sızmaz).
// • Her ileti TR/EN; dil, isteği yapan tarayıcının dilinden (X-Avf-Lang) veya üyenin kayıtlı dilinden gelir.
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
  ink: "#111113", body: "#26262A", muted: "#5E5E66", soft: "#8A8A92", line: "#E5E4DF", line2: "#D5D4CE", page: "#F6F6F3", card: "#FFFFFF",
  tint: "#F6F6F3", strong: "#ECEBE7",
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace";

// ---------- yapı taşları (her biri { html, text }) ----------
const p = (s) => ({ html: `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${C.body}">${s}</p>`, text: strip(s) });
const codeBox = (code, note) => ({
  html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:22px auto 8px"><tr>
<td align="center" style="background:${C.tint};border:1px solid ${C.line2};border-radius:14px;padding:18px 30px">
<div style="font-family:${MONO};font-size:34px;line-height:1.1;font-weight:800;letter-spacing:10px;color:${C.ink};padding-left:10px">${esc(code)}</div>
</td></tr></table>
<p style="margin:0 0 20px;text-align:center;font-size:12.5px;line-height:1.5;color:${C.muted};font-weight:600">${esc(note)}</p>`,
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
const callout = (s, tone) => {
  // Yalnız siyah/beyaz/gri: uyarı (danger) daha koyu zemin ve kalın siyah şeritle ayrılır; renk kullanılmaz.
  const t = tone === "danger" ? [C.strong, C.ink, C.ink, 4, "700"] : [C.tint, C.ink, C.body, 3, "400"];
  return { html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 18px"><tr><td style="background:${t[0]};border-left:${t[3]}px solid ${t[1]};border-radius:8px;padding:12px 14px;font-size:13.5px;line-height:1.6;color:${t[2]};font-weight:${t[4]}">${s}</td></tr></table>`, text: strip(s) };
};
const button = (label, href) => {
  if (!href) return { html: "", text: "" };
  return {
    html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 22px"><tr><td align="center" bgcolor="${C.ink}" style="border-radius:12px">
<a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font-family:${FONT};font-size:14.5px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px">${esc(label)}</a></td></tr></table>`,
    text: `${label}: ${href}`,
  };
};
function strip(s) { return String(s).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"); }

const FOOT = {
  tr: { auto: "Bu e-posta AlpveFit hesabınızla ilgili bir işlem nedeniyle otomatik olarak gönderildi; lütfen yanıtlamayın. Yardım için destek@alpvefit.com adresine yazabilir veya panelinizden destek talebi oluşturabilirsiniz.",
        never: "AlpveFit sizden hiçbir zaman şifrenizi, doğrulama kodunuzu veya kurtarma kodlarınızı istemez." },
  en: { auto: "This email was sent automatically because of an action on your AlpveFit account; please do not reply. For help, write to destek@alpvefit.com or open a support request from your panel.",
        never: "AlpveFit will never ask you for your password, verification code or recovery codes." },
};

/** Ortak çerçeve: marka satırı, kart, alt bilgi. blocks = [{html,text}] */
function layout(lang, { preheader, eyebrow, title, blocks, footer }) {
  const lg = L(lang), f = FOOT[lg], year = new Date().getUTCFullYear();
  const foot = footer || f.auto;
  const html = `<!doctype html>
<html lang="${lg}" xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"><title>${esc(title)}</title>
<style>@media only screen and (max-width:480px){.ap-out{padding:16px 8px!important}.ap-px{padding-left:20px!important;padding-right:20px!important}.ap-h1{font-size:20px!important}}</style></head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader || title)}&#8203;&#8199;&#8203;&#8199;&#8203;&#8199;&#8203;&#8199;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page}"><tr><td align="center" class="ap-out" style="padding:32px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;font-family:${FONT}">
<tr><td style="padding:0 4px 16px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="34" height="34" align="center" valign="middle" bgcolor="${C.ink}" style="width:34px;height:34px;border-radius:10px;background:${C.ink};color:#ffffff;font-family:${FONT};font-size:18px;font-weight:800;line-height:34px">A</td>
<td style="padding-left:10px;font-family:${FONT};font-size:18px;font-weight:800;letter-spacing:-.01em;color:${C.ink}">AlpveFit</td>
</tr></table></td></tr>
<tr><td class="ap-px" style="background:${C.card};border:1px solid ${C.line};border-bottom:0;border-radius:18px 18px 0 0;padding:32px 30px 14px">
${eyebrow ? `<div style="font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${C.soft};margin:0 0 10px">${esc(eyebrow)}</div>` : ""}
<h1 class="ap-h1" style="margin:0 0 16px;font-size:23px;line-height:1.3;color:${C.ink};font-weight:800;letter-spacing:-.01em">${esc(title)}</h1>
${blocks.map((b) => b.html).join("\n")}
</td></tr>
<tr><td class="ap-px" style="background:${C.card};border:1px solid ${C.line};border-top:0;border-radius:0 0 18px 18px;padding:0 30px 26px">
<div style="border-top:1px solid ${C.line};padding-top:16px;font-size:12px;line-height:1.6;color:${C.muted}">${foot}<br><span style="color:${C.soft}">${esc(f.never)}</span></div></td></tr>
<tr><td align="center" style="padding:18px 8px 0;font-size:11.5px;color:${C.soft}">&copy; ${year} AlpveFit · <a href="${BRAND_URL}" style="color:${C.soft};text-decoration:underline">alpvefit.com</a></td></tr>
</table></td></tr></table></body></html>`;
  const text = [`ALPVEFIT`, ``, title, ``, ...blocks.map((b) => b.text).filter(Boolean), ``, `—`, strip(foot), f.never, `\n${BRAND_URL}`].join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  return { html, text };
}

const subj = (s) => `AlpveFit — ${s}`;
const VALID = { tr: (m) => `${m} dakika geçerlidir · kimseyle paylaşmayın`, en: (m) => `Valid for ${m} minutes · do not share it with anyone` };
const NOT_YOU = {
  tr: "Bu işlemi siz başlatmadıysanız bu e-postayı dikkate almayın ve kodu kimseyle paylaşmayın; şifrenizi değiştirmenizi öneririz.",
  en: "If you did not start this, ignore this email and do not share the code; we recommend changing your password.",
};
const NOT_YOU_DONE = {
  tr: "Bu işlemi siz yapmadıysanız hemen şifrenizi değiştirin ve destek@alpvefit.com adresinden bizimle iletişime geçin.",
  en: "If this wasn't you, change your password immediately and contact us at destek@alpvefit.com.",
};

// ---------- KODLU İLETİLER ----------
// purpose → metin. Tümü aynı düzende: başlık, açıklama, kod kutusu, "siz değilseniz" uyarısı.
const CODE_TEXT = {
  register: {
    tr: { s: "E-posta Doğrulama", e: "Hoş geldiniz", t: "E-posta adresinizi doğrulayın", d: "AlpveFit hesabınızı oluşturmak için aşağıdaki doğrulama kodunu kayıt ekranına girin." },
    en: { s: "Email Verification", e: "Welcome", t: "Verify your email address", d: "Enter the verification code below on the sign-up screen to create your AlpveFit account." },
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
    tr: { s: "Yeni E-posta Adresini Doğrulayın", e: "Hesap bilgileri", t: "Yeni e-posta adresinizi doğrulayın", d: "Bu adresi AlpveFit hesabınızın yeni e-posta adresi olarak onaylamak için aşağıdaki kodu girin." },
    en: { s: "Verify Your New Email", e: "Account details", t: "Verify your new email address", d: "Enter the code below to confirm this address as the new email for your AlpveFit account." },
  },
  delete_account: {
    tr: { s: "Hesap Silme Onayı", e: "Kalıcı işlem", t: "Hesap silme onayı", d: "Hesabınızı ve kişisel verilerinizi kalıcı olarak silmek için aşağıdaki kodu girin." },
    en: { s: "Confirm Account Deletion", e: "Permanent action", t: "Confirm account deletion", d: "Enter the code below to permanently delete your account and personal data." },
  },
  "2fa_enable": {
    tr: { s: "Google Authenticator Etkinleştirme Onayı", e: "Hesap güvenliği", t: "Google Authenticator'ı etkinleştirin", d: "Google Authenticator ile iki adımlı giriş doğrulamasını etkinleştirme işlemini onaylamak için aşağıdaki kodu girin." },
    en: { s: "Confirm Google Authenticator Setup", e: "Account security", t: "Turn on Google Authenticator", d: "Enter the code below to confirm turning on two-step sign-in verification with Google Authenticator." },
  },
  "2fa_disable": {
    tr: { s: "İki Adımlı Doğrulamayı Kapatma Onayı", e: "Hesap güvenliği", t: "İki adımlı doğrulamayı kapatın", d: "Google Authenticator ile iki adımlı giriş doğrulamasını kapatma talebinizi onaylamak için aşağıdaki kodu girin. Kapatıldığında girişte yalnız şifreniz istenir." },
    en: { s: "Confirm Turning Off Two-Step Verification", e: "Account security", t: "Turn off two-step verification", d: "Enter the code below to confirm turning off two-step sign-in verification with Google Authenticator. Afterwards only your password is required to sign in." },
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
    p(esc(en ? "We received a request to reset the password of your AlpveFit account. Use the button below to choose a new password:"
             : "AlpveFit hesabınızın şifresini sıfırlama isteği aldık. Yeni şifrenizi belirlemek için aşağıdaki düğmeyi kullanın:")),
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
      ? { s: "Your Password Was Changed", e: "Account security", t: "Your password was changed", b: [p("The password for your AlpveFit account was just changed. For your security, all sessions were signed out.")], warn: NOT_YOU_DONE.en }
      : { s: "Şifreniz Değiştirildi", e: "Hesap güvenliği", t: "Şifreniz değiştirildi", b: [p("AlpveFit hesabınızın şifresi az önce değiştirildi. Güvenliğiniz için tüm oturumlar kapatıldı.")], warn: NOT_YOU_DONE.tr },
    // v59: Hesabım'dan şifre değişikliği — değişikliği yapan cihazın oturumu açık kalır, diğer tüm oturumlar kapanır
    password_changed_kept: en
      ? { s: "Your Password Was Changed", e: "Account security", t: "Your password was changed", b: [p("The password for your AlpveFit account was just changed. You stay signed in on the device you used; all other sessions were signed out.")], warn: NOT_YOU_DONE.en }
      : { s: "Şifreniz Değiştirildi", e: "Hesap güvenliği", t: "Şifreniz değiştirildi", b: [p("AlpveFit hesabınızın şifresi az önce değiştirildi. Değişikliği yaptığınız cihazdaki oturumunuz açık kaldı; diğer tüm cihazlardaki oturumlar kapatıldı.")], warn: NOT_YOU_DONE.tr },
    email_changed: en
      ? { s: "Your Email Address Was Changed", e: "Account security", t: "Your email address was changed", b: [p("The email address of your AlpveFit account was changed. Messages about your account will now go to the new address.")], warn: NOT_YOU_DONE.en }
      : { s: "E-posta Adresiniz Değiştirildi", e: "Hesap güvenliği", t: "E-posta adresiniz değiştirildi", b: [p("AlpveFit hesabınızın e-posta adresi değiştirildi. Hesabınızla ilgili iletiler artık yeni adrese gönderilecek.")], warn: NOT_YOU_DONE.tr },
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

/** Plan güncellemesi — belirli bir süredeki tüm değişiklikler için tek e-posta. o: { kinds: [{ kind, label }] } */
export function planUpdatedMail(lang, o) {
  const lg = L(lang), en = lg === "en", base = siteBase();
  const EN = { nutrition: "Nutrition program", training: "Training program", supplement: "Supplement / vitamin / mineral plan", pharmacology: "Pharmacology plan", notes: "Valuable notes" };
  const t = en ? "Your plans have been updated" : "Planlarınızda güncelleme var";
  const list = (o.kinds || []).map((k) => (en ? EN[k.kind] || k.label : k.label)).join(", ");
  const blocks = [
    p(esc(en ? "Your coach has updated your plans. For your privacy, the content is not included in this email; sign in to your account to see the latest version."
             : "Koçunuz planlarınızı güncelledi. Gizliliğiniz için içerik bu e-postada yer almaz; güncel hâlini görmek için hesabınıza giriş yapın.")),
    list ? rows([[en ? "Updated" : "Güncellenen", list]]) : "",
    button(en ? "View my plans" : "Planlarımı görüntüle", base ? `${base}/panel` : ""),
  ];
  const { html, text } = layout(lg, { preheader: t, eyebrow: en ? "Plan update" : "Plan güncellemesi", title: t, blocks });
  return { subject: subj(en ? "Your Plans Were Updated" : "Planlarınız Güncellendi"), html, text };
}

/** Forum seviyesi yükseldi. o: { name } */
export function levelUpMail(lang, o) {
  const lg = L(lang), en = lg === "en", base = siteBase();
  const EN = { "Yeni Başlayan": "Beginner", "Barın Çırağı": "Bar Apprentice", "Pump Avcısı": "Pump Hunter", "Demir Eri": "Iron Soldier", "Hacim Ustası": "Volume Master", "Sahne Savaşçısı": "Stage Warrior", "Demir Efsanesi": "Iron Legend", "Ayna Tanrısı": "Mirror God", "Moderatör": "Moderator", "Admin": "Admin", "AlpveFit": "AlpveFit", "AlpveFit Ekibi": "AlpveFit Team" };
  const name = en ? EN[o.name] || o.name : o.name;
  const t = en ? "Congratulations — you reached a new level!" : "Tebrikler — yeni bir seviyeye ulaştınız!";
  const blocks = [
    p(esc(en ? "Your forum activity paid off. Your new title is shown next to your username." : "Forumdaki emeğiniz karşılığını buldu. Yeni unvanınız kullanıcı adınızın yanında görünür.")),
    rows([[en ? "New level" : "Yeni seviye", name]]),
    button(en ? "See my forum profile" : "Forum profilimi gör", base ? `${base}/panel/forum-ayarlari/seviye` : ""),
  ];
  const { html, text } = layout(lg, { preheader: t, eyebrow: en ? "Forum" : "Forum", title: t, blocks });
  return { subject: subj(en ? "New Forum Level: " + name : "Yeni Forum Seviyesi: " + name), html, text };
}

/** Ödeme onaylandı. o: { orderNumber, dueAt } — planlar ödemeden itibaren 24 saat içinde hazırlanır. */
export function orderPaidMail(lang, o) {
  const lg = L(lang), en = lg === "en", base = siteBase();
  const t = en ? "Your payment is confirmed" : "Ödemeniz onaylandı";
  const blocks = [
    p(esc(en ? "Thank you. Your payment was received and confirmed. Your nutrition, training and supplement programs are prepared by your coach within 24 hours; you will be notified when each plan is published."
             : "Teşekkür ederiz. Ödemeniz alındı ve onaylandı. Beslenme, antrenman ve takviye programlarınız tarafımızca 24 saat içinde hazırlanır; her plan yayınlandığında bildirim alırsınız.")),
    rows([[en ? "Order" : "Sipariş", o.orderNumber], [en ? "Plans ready by" : "Planların hazır olacağı zaman", o.dueAt ? fmtDate(o.dueAt, lg) : ""]]),
    button(en ? "Go to my panel" : "Panelime git", base ? `${base}/panel` : ""),
  ];
  const { html, text } = layout(lg, { preheader: t, eyebrow: en ? "Order" : "Sipariş", title: t, blocks });
  return { subject: subj(en ? "Payment Confirmed" : "Ödeme Onaylandı"), html, text };
}

/** Uzman / yönetici: plan teslim zamanı yaklaşan ya da geçen siparişler (bir turdaki tüm siparişler tek e-postada; üye adı yok). */
export function planDueMail(lang, o = {}) {
  const lg = L(lang), en = lg === "en", base = siteBase();
  const items = (o.items || []).slice(0, 30), late = items.some((i) => i.overdue);
  const t = late ? (en ? "Plan delivery time has passed" : "Plan teslim zamanı geçti") : (en ? "Plan delivery time is approaching" : "Plan teslim zamanı yaklaşıyor");
  const blocks = [
    p(esc(en ? "The following paid orders are not marked as delivered yet. Publish the plans and set the delivery status in the panel."
             : "Aşağıdaki ödenmiş siparişler henüz “Teslim edildi” olarak işaretlenmedi. Planları yayınlayıp panelden teslim durumunu güncelleyin.")),
    rows(items.map((i) => [i.orderNumber, (i.overdue ? (en ? "Overdue · " : "Gecikti · ") : (en ? "Due · " : "Teslim · ")) + fmtDate(i.dueAt, lg)])),
    button(en ? "Open the panel" : "Paneli aç", base ? `${base}/uzman` : ""),
  ];
  const { html, text } = layout(lg, { preheader: t, eyebrow: en ? "Delivery reminder" : "Teslim hatırlatması", title: t, blocks });
  return { subject: subj(late ? (en ? "Plan Delivery Overdue" : "Plan Teslimi Gecikti") : (en ? "Plan Delivery Approaching" : "Plan Teslimi Yaklaşıyor")), html, text };
}

/** Hesap etkinleştirildi (kayıt doğrulaması tamamlandı). */
export function welcomeMail(lang, o = {}) {
  const lg = L(lang), en = lg === "en", base = siteBase();
  const t = en ? "Welcome to AlpveFit" : "AlpveFit'e hoş geldiniz";
  const blocks = [
    p(esc(en ? `${o.name ? `Hi ${o.name}, your` : "Your"} account is ready. AlpveFit is a remote education and coaching platform: every program is prepared by us from scratch, entirely for you.`
             : `${o.name ? `Merhaba ${o.name}, hesabınız` : "Hesabınız"} hazır. AlpveFit uzaktan eğitim ve koçluk platformudur: her program tarafımızca sıfırdan, tamamen size özel hazırlanır.`)),
    rows([[en ? "1. Choose" : "1. Seçin", en ? "a package that fits your goal" : "Hedefinize uygun paketi"], [en ? "2. Pay" : "2. Ödeyin", en ? "securely on the website" : "Sitede güvenle"], [en ? "3. Receive" : "3. Teslim alın", en ? "your programs in your panel within 24 hours" : "Programlarınızı 24 saat içinde panelinizde"]]),
    button(en ? "View packages" : "Paketleri incele", base ? `${base}/paketler` : ""),
    callout(esc(en ? "Tip: turn on two-step verification (Google Authenticator) in My Account › Account Settings to keep your account safer." : "İpucu: hesabınızı daha güvende tutmak için Hesabım › Hesap Ayarları bölümünden iki adımlı doğrulamayı (Google Authenticator) açın.")),
  ];
  const { html, text } = layout(lg, { preheader: t, eyebrow: en ? "Account ready" : "Hesap hazır", title: t, blocks });
  return { subject: subj(en ? "Welcome" : "Hoş Geldiniz"), html, text };
}

/** Destek talebine yanıt verildi. Yanıt metni e-postaya konmaz; yalnız bildirim ve panele bağlantı. */
export function ticketReplyMail(lang, o) {
  const lg = L(lang), en = lg === "en", base = siteBase();
  const t = en ? "Your support request was answered" : "Destek talebinize yanıt verildi";
  const blocks = [
    p(esc(en ? "We replied to your support request. For your privacy, the reply is not included in this email; sign in to your panel to read it."
             : "Destek talebinize yanıt verdik. Gizliliğiniz için yanıt bu e-postada yer almaz; okumak için panelinize giriş yapın.")),
    rows([[en ? "Request" : "Talep", o.ticketNumber]]),
    button(en ? "View my requests" : "Taleplerimi görüntüle", base ? `${base}/panel/destek` : ""),
  ];
  const { html, text } = layout(lg, { preheader: t, eyebrow: en ? "Support" : "Destek", title: t, blocks });
  return { subject: subj(en ? "Support Request Answered" : "Destek Talebi Yanıtlandı"), html, text };
}

/** Haftalık forum özeti (yalnız açıkça isteyen üyelere). o: { topics: [{ title, url, meta }], guides: [{ title, url }], challenge: { title, text }, settingsUrl } */
export function digestMail(lang, o) {
  const lg = L(lang), base = siteBase();
  const t = "Forumda bu hafta";
  const link = (x) => `<a href="${esc(x.url)}" style="color:${C.ink};font-weight:700;text-decoration:underline">${esc(x.title)}</a>`;
  const blocks = [p(esc("Haftanın öne çıkan konuları, yeni ekip rehberleri ve bu haftanın meydan okuması aşağıda. İyi antrenmanlar!"))];
  if (o.topics.length) blocks.push(p(`<b>Öne çıkan konular</b><br>${o.topics.map((x) => `• ${link(x)} <span style="color:${C.muted}">— ${esc(x.meta)}</span>`).join("<br>")}`));
  if (o.guides.length) blocks.push(p(`<b>Yeni ekip rehberleri</b><br>${o.guides.map((x) => `• ${link(x)}`).join("<br>")}`));
  if (o.challenge) blocks.push(callout(`<b>Haftanın meydan okuması: ${esc(o.challenge.title)}</b><br>${esc(o.challenge.text)} 7 günün en az 5'inde tamamla, rozeti kap!`));
  blocks.push(button("Foruma git", base ? `${base}/forum` : ""));
  blocks.push(p(`<span style="font-size:12.5px;color:${C.muted}">${esc("Bu e-postayı Forum Ayarları'nda haftalık özeti açtığın için alıyorsun. Kapatmak için:")} <a href="${esc(o.settingsUrl)}" style="color:${C.muted}">${esc("Bildirim ve Gizlilik")}</a></span>`));
  const { html, text } = layout(lg, { preheader: t, eyebrow: "Forum", title: t, blocks });
  return { subject: subj("Haftalık Forum Özeti"), html, text };
}
