/* AlpveFit — giriş / kayıt / şifre sıfırlama / ikinci adım penceresi.
   Kurallar Alpeptit ile aynıdır: iki adımlı kayıt (e-postaya 6 haneli kod), reCAPTCHA, şifre kuralları, Authenticator + kurtarma kodu,
   şifre sıfırlama (kod veya e-posta bağlantısı), 6 hatalı koddan sonra 30 dk hesap kilidi (sunucu uygular, burada yalnız gösterilir). */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h, ov = null, dlg = null, body = null, lastFocus = null, onDone = null;
  var S = {};   // akış durumu (userId, loginTicket, resetId, ticket…)

  function close() {
    if (!ov) return;
    document.removeEventListener("keydown", onKey, true);
    ov.parentNode && ov.parentNode.removeChild(ov); ov = dlg = body = null; S = {}; onDone = null;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === "Escape") { e.stopPropagation(); close(); return; }
    if (e.key !== "Tab" || !dlg) return;
    var f = dlg.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href]'); if (!f.length) return;
    var a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
  function shell() {
    if (ov) return;
    lastFocus = document.activeElement;
    body = h("div");
    dlg = h("div", { class: "dlg", role: "dialog", "aria-modal": "true", "aria-labelledby": "auth-title" },
      AVF.logo(false),
      h("button", { class: "x", type: "button", "aria-label": "Kapat", onclick: close }, AVF.icon("x")), body);
    ov = h("div", { class: "ov", onmousedown: function (e) { if (e.target === ov) close(); } }, dlg);
    document.body.appendChild(ov); document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey, true);
  }
  // Pencere açılınca giriş alanına OTOMATİK odaklanılmaz (mobilde klavye kendiliğinden açılmasın); odak pencerenin kendisine
  // verilir — ekran okuyucu başlığı okur, kullanıcı alana dokunduğunda yazmaya başlar.
  function softFocus() { if (!dlg) return; if (!dlg.hasAttribute("tabindex")) dlg.setAttribute("tabindex", "-1"); try { dlg.focus({ preventScroll: true }); } catch (e) { dlg.focus(); } }
  function view(title, sub) { var t = h("h2", { id: "auth-title", text: title }); AVF.mount(body, t, sub ? h("p", { class: "sub", text: sub }) : null); return body; }
  function ssl() { return h("div", { class: "ssl" }, AVF.icon("lock"), "256-bit SSL ile korunan güvenli bağlantı"); }
  function err(box, msg) { AVF.mount(box, msg ? h("p", { class: "err", role: "alert", text: msg }) : null); }
  function captchaNote() { return h("div", { class: "rc" }, AVF.icon("shield"), h("span", null, "Bu form reCAPTCHA ile korunmaktadır; Google ", h("a", { href: "https://policies.google.com/privacy", target: "_blank", rel: "noopener" }, "Gizlilik Politikası"), " ve ", h("a", { href: "https://policies.google.com/terms", target: "_blank", rel: "noopener" }, "Hizmet Şartları"), " geçerlidir.")); }
  function seg(active) {
    return h("div", { class: "seg", role: "tablist" },
      h("button", { type: "button", role: "tab", "aria-selected": String(active === "login"), onclick: function () { login(); } }, "Giriş Yap"),
      h("button", { type: "button", role: "tab", "aria-selected": String(active === "register"), onclick: function () { register(); } }, "Kayıt Ol"));
  }
  function finish(user, extra) {
    AVF.session.user = user; var cb = onDone; close();
    if (extra && extra.recoveryUsed) AVF.toast("Kurtarma kodu kullanıldı. Authenticator'ınızı yenilemeniz önerilir.");
    if (cb) cb(user); else if (AVF.onLogin) AVF.onLogin(user);
  }
  // Ortak yanıt işleme (kilit / hatalı kimlik / ban)
  function fail(box, e, btn) { if (btn) AVF.busy(btn, false); err(box, AVF.errText(e)); if (e && e.data && e.data.error === "account_locked") lockedView(e.data); }

  // ---------- GİRİŞ ----------
  function login(prefill) {
    shell(); var v = view("Tekrar hoş geldiniz", "Hesabınıza giriş yaparak devam edin.");
    var remembered = ""; try { remembered = localStorage.getItem("avf_remember") || ""; } catch (e) { /* kullanılamıyor */ }
    var id = AVF.input("text", { autocomplete: "username", placeholder: "Kullanıcı adı veya e-posta", value: prefill || remembered, maxlength: "100", autocapitalize: "none", spellcheck: "false" });
    var pw = AVF.passwordInput({ autocomplete: "current-password", placeholder: "••••••••", maxlength: "200" });
    var rem = h("input", { type: "checkbox", id: "rem" }); if (remembered) rem.checked = true;
    var box = h("div"); var btn = h("button", { class: "btn block", type: "submit" }, "Giriş Yap");
    var form = h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault(); err(box, "");
      if (!id.value.trim() || !pw.input.value) return err(box, "Lütfen tüm alanları doldurun.");
      if (/\s/.test(pw.input.value)) return err(box, "Şifre boşluk içeremez.");
      AVF.busy(btn, true, "Giriş yapılıyor…");
      AVF.captcha("login").then(function (tok) { return AVF.api("POST", "/auth/login", { identifier: id.value.trim(), password: pw.input.value, recaptchaToken: tok }); })
        .then(function (r) {
          try { if (rem.checked) localStorage.setItem("avf_remember", id.value.trim()); else localStorage.removeItem("avf_remember"); } catch (e2) { /* yok say */ }
          if (r.user) return finish(r.user);
          S.userId = r.userId;
          if (r.secondFactor === "totp") { S.ticket = r.loginTicket; return totp(); }
          if (r.secondFactor === "register_verify") return regCode(r.message);
          AVF.busy(btn, false);
        }, function (e) { fail(box, e, btn); });
    } },
      AVF.field("Kullanıcı Adı veya E-Posta", id, { icon: "user" }), AVF.field("Şifre", pw, { icon: "lock" }),
      h("div", { class: "row between" }, h("label", { class: "check", style: "margin:0" }, rem, "Kullanıcı bilgilerimi hatırla"), h("button", { type: "button", class: "lnk", onclick: forgot }, "Şifremi Unuttum")),
      captchaNote(), box, btn,
      h("p", { class: "center", style: "margin:14px 0 0" }, "Hesabın yok mu? ", h("button", { type: "button", class: "lnk", onclick: function () { register(); } }, "Kayıt Ol")), ssl());
    v.insertBefore(seg("login"), v.children[2] || null); v.appendChild(form); softFocus();
  }

  // ---------- KAYIT ----------
  function register() {
    shell(); var v = view("Hesap oluşturun", "Bilgilerinizi girin; e-posta adresinize bir doğrulama kodu göndereceğiz.");
    var name = AVF.input("text", { autocomplete: "name", placeholder: "Ad Soyad", maxlength: "100" });
    var user = AVF.input("text", { autocomplete: "username", placeholder: "Kullanıcı adı (boşluksuz, Türkçe karakter yok)", maxlength: "40", autocapitalize: "none", spellcheck: "false" });
    var mail = AVF.input("email", { autocomplete: "email", placeholder: "E-posta adresi", maxlength: "200", autocapitalize: "none" });
    var pw = AVF.passwordInput({ autocomplete: "new-password", placeholder: "En az 8 karakter", maxlength: "200" });
    var k1 = h("input", { type: "checkbox" }), k2 = h("input", { type: "checkbox" });
    var box = h("div"); var btn = h("button", { class: "btn block", type: "submit" }, "Doğrulama Kodu Gönder");
    var form = h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault(); err(box, "");
      var n = name.value.trim().replace(/\s+/g, " "), u = user.value.trim(), m = mail.value.trim();
      if (!n || !u || !m || !pw.input.value) return err(box, "Lütfen tüm alanları doldurun.");
      if (!/^\S+@\S+\.\S+$/.test(m)) return err(box, "Lütfen geçerli bir e-posta adresi giriniz.");
      if (/\s/.test(u)) return err(box, "Kullanıcı adı birleşik olmalıdır, boşluk içeremez.");
      if (/[çÇğĞıİöÖşŞüÜ]/.test(u)) return err(box, "Kullanıcı adı Türkçe karakter içeremez.");
      var pe = AVF.passwordError(pw.input.value, n, u); if (pe) return err(box, pe);
      if (!k1.checked || !k2.checked) return err(box, "Devam etmek için onay kutularını işaretlemeniz gerekir.");
      AVF.busy(btn, true, "Gönderiliyor…");
      AVF.captcha("register").then(function (tok) { return AVF.api("POST", "/auth/register", { fullName: n, username: u, email: m, password: pw.input.value, recaptchaToken: tok, kvkkAccepted: true, aboutAccepted: true }); })
        .then(function (r) { S.userId = r.userId; S.email = m; regCode(r.message); },
          function (e2) { if (e2.data && e2.data.userId) { S.userId = e2.data.userId; } fail(box, e2, btn); });
    } },
      AVF.field("Ad Soyad", name, { icon: "id" }), AVF.field("Kullanıcı Adı", user, { icon: "user" }), AVF.field("E-posta", mail, { icon: "mail" }),
      AVF.field("Şifre", pw, { icon: "lock", hint: "En az 8 karakter; en az 1 harf ve 1 noktalama işareti; boşluk ve ardışık sayı (123) olmaz." }),
      h("label", { class: "check" }, k1, h("span", null, h("a", { href: "/yasal/kvkk", target: "_blank", rel: "noopener" }, "KVKK Aydınlatma Metni"), " ve ", h("a", { href: "/yasal/gizlilik-cerez", target: "_blank", rel: "noopener" }, "Gizlilik ve Çerez Politikası"), "’nı okudum.")),
      h("label", { class: "check" }, k2, h("span", null, h("a", { href: "/yasal/kullanim-kosullari", target: "_blank", rel: "noopener" }, "Hizmet Şartları"), " ile ", h("a", { href: "/yasal/sorumluluk-reddi", target: "_blank", rel: "noopener" }, "Sağlık ve Farmakoloji Sorumluluk Beyanı"), "’nı okudum ve kabul ediyorum.")),
      captchaNote(), box, btn,
      h("p", { class: "center", style: "margin:14px 0 0" }, "Zaten hesabın var mı? ", h("button", { type: "button", class: "lnk", onclick: function () { login(); } }, "Giriş Yap")), ssl());
    v.insertBefore(seg("register"), v.children[2] || null); v.appendChild(form); softFocus();
  }

  // ---------- KAYIT KODU ----------
  function regCode(msg) {
    shell(); var v = view("E-postanızı doğrulayın", msg || "E-posta adresinize 6 haneli bir doğrulama kodu gönderdik. Kod 5 dakika geçerlidir.");
    var code = AVF.input("text", { class: "codeinp", inputmode: "numeric", autocomplete: "one-time-code", maxlength: "6", placeholder: "••••••", "aria-label": "Doğrulama kodu" });
    var box = h("div"); var btn = h("button", { class: "btn block", type: "submit" }, "Doğrula");
    var resend = h("button", { type: "button", class: "lnk", onclick: function () {
      AVF.api("POST", "/auth/register/resend", { userId: S.userId }).then(function () { AVF.toast("Yeni kod gönderildi."); err(box, ""); }, function (e) { err(box, AVF.errText(e)); });
    } }, "Kodu yeniden gönder");
    v.appendChild(h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault(); err(box, "");
      if (!/^\d{6}$/.test(code.value)) return err(box, "Lütfen 6 haneli kodu girin.");
      AVF.busy(btn, true, "Doğrulanıyor…");
      AVF.captcha("register_verify").then(function (tok) { return AVF.api("POST", "/auth/register/verify", { userId: S.userId, code: code.value, recaptchaToken: tok }); })
        .then(function (r) { finish(r.user); AVF.toast("Hesabınız oluşturuldu. Hoş geldiniz!"); }, function (e2) { fail(box, e2, btn); });
    } }, AVF.field("Doğrulama kodu", code, { optional: true }), box, btn,
      h("p", { class: "center", style: "margin:14px 0 0" }, resend, " · ", h("button", { type: "button", class: "lnk", onclick: function () { login(); } }, "Girişe dön")), ssl()));
    softFocus();
  }

  // ---------- İKİNCİ ADIM: Authenticator / kurtarma kodu ----------
  function totp(useRecovery) {
    shell(); var v = view("İki adımlı doğrulama", useRecovery ? "Hesabınızın 12 karakterli kurtarma kodlarından birini girin. Her kod yalnız bir kez kullanılır." : "Google Authenticator uygulamanızdaki 6 haneli kodu girin.");
    var code = AVF.input("text", useRecovery ? { autocomplete: "off", maxlength: "20", autocapitalize: "characters", placeholder: "Kurtarma kodu", spellcheck: "false" } : { class: "codeinp", inputmode: "numeric", autocomplete: "one-time-code", maxlength: "6", placeholder: "••••••" });
    var box = h("div"); var btn = h("button", { class: "btn block", type: "submit" }, "Doğrula");
    v.appendChild(h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault(); err(box, ""); var val = code.value.trim();
      if (!val || (!useRecovery && !/^\d{6}$/.test(val))) return err(box, useRecovery ? "Lütfen kurtarma kodunu girin." : "Lütfen 6 haneli kodu girin.");
      AVF.busy(btn, true, "Doğrulanıyor…");
      var payload = { userId: S.userId, loginTicket: S.ticket }; if (useRecovery) payload.recoveryCode = val; else payload.token = val;
      AVF.api("POST", "/auth/login/verify-totp", payload).then(function (r) { finish(r.user, r); }, function (e2) { fail(box, e2, btn); });
    } }, AVF.field(useRecovery ? "Kurtarma kodu" : "Doğrulama kodu", code, { optional: true }), box, btn,
      h("p", { class: "center", style: "margin:14px 0 0" }, h("button", { type: "button", class: "lnk", onclick: function () { totp(!useRecovery); } }, useRecovery ? "Authenticator kodunu kullan" : "Telefonuma erişemiyorum — kurtarma kodu kullan")), ssl()));
    softFocus();
  }

  // ---------- ŞİFREMİ UNUTTUM ----------
  function forgot() {
    shell(); var v = view("Şifrenizi sıfırlayın", "Kullanıcı adınızı veya e-posta adresinizi girin; hesap varsa size bir bağlantı ve kod göndereceğiz.");
    var id = AVF.input("text", { placeholder: "Kullanıcı adı veya e-posta", maxlength: "100", autocapitalize: "none", autocomplete: "username" });
    var box = h("div"); var btn = h("button", { class: "btn block", type: "submit" }, "Sıfırlama Kodu Gönder");
    v.appendChild(h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault(); err(box, ""); if (!id.value.trim()) return err(box, "Lütfen kullanıcı adı veya e-posta adresinizi giriniz.");
      AVF.busy(btn, true, "Gönderiliyor…");
      AVF.captcha("forgot").then(function (tok) { return AVF.api("POST", "/auth/forgot-password", { identifier: id.value.trim(), recaptchaToken: tok }); })
        .then(function (r) { S.resetId = r.resetId; resetCode(r.message); }, function (e2) { fail(box, e2, btn); });
    } }, AVF.field("Kullanıcı adı veya e-posta", id, { icon: "user" }), captchaNote(), box, btn,
      h("p", { class: "center", style: "margin:14px 0 0" }, h("button", { type: "button", class: "lnk", onclick: function () { login(); } }, "Girişe dön")), ssl()));
    softFocus();
  }
  function resetCode(msg) {
    shell(); var v = view("Kodu girin", msg || "E-postanıza gelen 6 haneli kodu girin veya e-postadaki bağlantıya tıklayın. Kod 15 dakika geçerlidir.");
    var code = AVF.input("text", { class: "codeinp", inputmode: "numeric", autocomplete: "one-time-code", maxlength: "6", placeholder: "••••••" });
    var box = h("div"); var btn = h("button", { class: "btn block", type: "submit" }, "Devam");
    v.appendChild(h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault(); err(box, ""); if (!/^\d{6}$/.test(code.value)) return err(box, "Lütfen 6 haneli kodu girin.");
      AVF.busy(btn, true, "Doğrulanıyor…");
      AVF.api("POST", "/auth/reset-password/verify", { resetId: S.resetId, code: code.value }).then(function (r) { S.ticket = r.ticket; newPass(); },
        function (e2) { if (e2.data && (e2.data.error === "reset_expired" || e2.data.error === "reset_too_many")) { AVF.busy(btn, false); return expired(e2.data.message); } fail(box, e2, btn); });
    } }, AVF.field("Doğrulama kodu", code, { optional: true }), box, btn,
      h("p", { class: "center", style: "margin:14px 0 0" }, h("button", { type: "button", class: "lnk", onclick: function () {
        AVF.api("POST", "/auth/reset-password/resend", { resetId: S.resetId }).then(function () { AVF.toast("Yeni bağlantı ve kod gönderildi."); }, function (e) { err(box, AVF.errText(e)); });
      } }, "Kodu yeniden gönder")), ssl()));
    softFocus();
  }
  function expired(msg) {
    shell(); var v = view("İstek geçersiz", msg || "Sıfırlama isteğinin süresi doldu veya geçersiz.");
    v.appendChild(h("button", { class: "btn block", type: "button", onclick: forgot }, "Yeniden başlat"));
  }
  function newPass() {
    shell(); var v = view("Yeni şifre belirleyin", "Yeni şifreniz kaydedildiğinde tüm cihazlardaki oturumlar kapanır.");
    var pw = AVF.passwordInput({ autocomplete: "new-password", maxlength: "200", placeholder: "Yeni şifre" });
    var box = h("div"); var btn = h("button", { class: "btn block", type: "submit" }, "Şifreyi Kaydet");
    v.appendChild(h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault(); err(box, ""); var pe = AVF.passwordError(pw.input.value, "", ""); if (pe) return err(box, pe);
      AVF.busy(btn, true, "Kaydediliyor…");
      AVF.api("POST", "/auth/reset-password", { ticket: S.ticket, newPassword: pw.input.value }).then(function (r) {
        login(); AVF.toast(r.unlocked ? "Şifreniz yenilendi ve hesap kilidi kaldırıldı. Giriş yapabilirsiniz." : "Şifreniz yenilendi. Giriş yapabilirsiniz.");
      }, function (e2) { if (e2.data && e2.data.error === "reset_expired") { AVF.busy(btn, false); return expired(e2.data.message); } fail(box, e2, btn); });
    } }, AVF.field("Yeni şifre", pw, { icon: "lock", hint: "En az 8 karakter; en az 1 harf ve 1 noktalama işareti; boşluk ve ardışık sayı olmaz." }), box, btn, ssl()));
    softFocus();
  }

  // ---------- KİLİTLİ HESAP ----------
  function lockedView(d) {
    shell(); var v = view("Hesabınız geçici olarak kilitli");
    v.appendChild(h("div", { class: "note err" }, AVF.errText({ status: 403, data: d })));
    v.appendChild(h("button", { class: "btn block", type: "button", onclick: forgot }, "Şifremi sıfırla"));
  }

  // ---------- e-postadaki bağlantı: /#sifre-sifirla=<anahtar> ----------
  function checkResetLink() {
    var m = /^#sifre-sifirla=([A-Za-z0-9_-]{43})$/.exec(location.hash || ""); if (!m) return;
    history.replaceState(null, "", location.pathname + location.search);   // anahtar adres çubuğundan ve geçmişten hemen silinir
    AVF.api("POST", "/auth/reset-password/link", { token: m[1] }).then(function (r) { S.ticket = r.ticket; newPass(); }, function (e) { expired(e.data && e.data.message); });
  }

  AVF.auth = { open: function (viewName, cb) { onDone = cb || null; (viewName === "register" ? register : login)(); }, close: close, checkResetLink: checkResetLink, locked: lockedView };
})();
