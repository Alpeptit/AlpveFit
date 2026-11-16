/* Alpvefit — Hesap Ayarları: ad soyad, e-posta, şifre, iki adımlı doğrulama, son girişler, hesabı sil.
   Alpeptit ile aynı kurallar: her hassas değişiklik hesaba kayıtlı e-postaya gelen 6 haneli kodla onaylanır (sunucu denetler). */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;

  function msg(box, text, kind) { AVF.mount(box, text ? h("div", { class: "note" + (kind ? " " + kind : ""), role: kind === "err" ? "alert" : "status", text: text }) : null); }

  // Kod adımı: giriş + onayla + yeniden gönder. confirm(code) → Promise; sonuç parent'a bırakılır.
  function codeStep(o) {
    var code = AVF.input("text", { class: "codeinp", inputmode: "numeric", autocomplete: "one-time-code", maxlength: "6", placeholder: "••••••", "aria-label": "Onay kodu" });
    var box = h("div"), btn = h("button", { class: "btn", type: "submit" }, o.button || "Onayla");
    var f = h("form", { novalidate: true, onsubmit: function (e) {
      e.preventDefault(); msg(box, "");
      if (!/^\d{6}$/.test(code.value)) return msg(box, "Lütfen 6 haneli kodu girin.", "err");
      AVF.busy(btn, true, "Onaylanıyor…");
      o.confirm(code.value).then(function () { AVF.busy(btn, false); }, function (er) { AVF.busy(btn, false); msg(box, AVF.errText(er), "err"); });
    } }, h("p", { class: "hint", text: o.text || "Hesabınıza kayıtlı e-posta adresine 6 haneli bir kod gönderdik." }), AVF.field("Onay kodu", code, { optional: true }), box,
      h("div", { class: "row" }, btn, o.purpose ? h("button", { type: "button", class: "lnk", onclick: function () {
        AVF.api("POST", "/account/resend-code", { purpose: o.purpose }).then(function () { AVF.toast("Yeni kod gönderildi."); }, function (er) { msg(box, AVF.errText(er), "err"); });
      } }, "Kodu yeniden gönder") : null, o.cancel ? h("button", { type: "button", class: "lnk", onclick: o.cancel }, "Vazgeç") : null));
    setTimeout(function () { code.focus(); }, 30);
    return f;
  }
  function codesList(codes) { return h("div", null, h("div", { class: "note warn" }, "Kurtarma kodlarınızı şimdi güvenli bir yere kaydedin. Bir daha gösterilmeyecek; her kod yalnız bir kez kullanılır."), h("div", { class: "codes" }, codes.map(function (c) { return h("span", { text: c }); }))); }

  // ---------- Ad soyad ----------
  function nameSection(user, refresh) {
    var acc = AVF.accordion({ icon: "id", title: "Ad Soyad", sub: AVF.maskName(user.full_name) });
    function start(p) {
      var inp = AVF.input("text", { value: user.full_name, maxlength: "100", autocomplete: "name" }); var box = h("div"), btn = h("button", { class: "btn", type: "submit" }, "Kod Gönder");
      AVF.mount(p, h("form", { novalidate: true, onsubmit: function (e) {
        e.preventDefault(); msg(box, ""); AVF.busy(btn, true, "Gönderiliyor…");
        AVF.api("POST", "/account/request-name-change", { newName: inp.value.trim() }).then(function () {
          AVF.mount(p, codeStep({ purpose: "name_change", text: "Ad soyad değişikliğini onaylamak için e-postanıza gelen kodu girin.", cancel: function () { start(p); }, confirm: function (c) {
            return AVF.api("POST", "/account/confirm-name-change", { code: c }).then(function (r) { user.full_name = r.fullName; acc.setTitleSub(AVF.maskName(r.fullName)); refresh(); AVF.toast("Ad soyadınız güncellendi."); start(p); });
          } }));
        }, function (er) { AVF.busy(btn, false); msg(box, AVF.errText(er), "err"); });
      } }, h("p", { class: "hint", text: "Ad soyad ayda en fazla bir kez değiştirilebilir." }), AVF.field("Yeni ad soyad", inp, { optional: true }), box, btn));
    }
    start(acc.querySelector(".panel")); return acc;
  }

  // ---------- E-posta ----------
  function emailSection(user, refresh) {
    var acc = AVF.accordion({ icon: "mail", title: "E-posta Adresi", sub: user.email });
    function start(p) {
      var inp = AVF.input("email", { maxlength: "200", autocomplete: "email", autocapitalize: "none" }); var box = h("div"), btn = h("button", { class: "btn", type: "submit" }, "Kod Gönder");
      AVF.mount(p, h("form", { novalidate: true, onsubmit: function (e) {
        e.preventDefault(); msg(box, ""); AVF.busy(btn, true, "Gönderiliyor…");
        AVF.api("POST", "/account/request-email-change", { newEmail: inp.value.trim() }).then(function () {
          AVF.mount(p, codeStep({ purpose: "email_change_old", text: "Önce MEVCUT e-posta adresinize gelen kodu girin.", cancel: function () { start(p); }, confirm: function (c) {
            return AVF.api("POST", "/account/confirm-email-change-old", { code: c }).then(function (r) {
              AVF.mount(p, codeStep({ purpose: "email_change", text: "Şimdi YENİ adresinize (" + r.maskedEmail + ") gelen kodu girin.", cancel: function () { start(p); }, confirm: function (c2) {
                return AVF.api("POST", "/account/confirm-email-change", { code: c2 }).then(function (r2) { user.email = r2.email; acc.setTitleSub(r2.email); refresh(); AVF.toast("E-posta adresiniz güncellendi."); start(p); });
              } }));
            });
          } }));
        }, function (er) { AVF.busy(btn, false); msg(box, AVF.errText(er), "err"); });
      } }, h("p", { class: "hint", text: "Değişiklik iki adımda onaylanır: önce mevcut, sonra yeni adresinize kod gönderilir." }), AVF.field("Yeni e-posta adresi", inp, { optional: true }), box, btn));
    }
    start(acc.querySelector(".panel")); return acc;
  }

  // ---------- Şifre ----------
  function passwordSection(user, refresh, afterLogout) {
    var acc = AVF.accordion({ icon: "lock", title: "Şifre", sub: "••••••••" });
    function start(p) {
      var o = AVF.passwordInput({ autocomplete: "current-password", maxlength: "200" }), n = AVF.passwordInput({ autocomplete: "new-password", maxlength: "200" });
      var box = h("div"), btn = h("button", { class: "btn", type: "submit" }, "Kod Gönder");
      AVF.mount(p, h("form", { novalidate: true, onsubmit: function (e) {
        e.preventDefault(); msg(box, "");
        var pe = AVF.passwordError(n.input.value, user.full_name, user.username); if (pe) return msg(box, pe, "err");
        AVF.busy(btn, true, "Gönderiliyor…");
        AVF.api("POST", "/account/request-password-change", { oldPassword: o.input.value, newPassword: n.input.value }).then(function () {
          AVF.mount(p, codeStep({ purpose: "password_change", text: "Şifre değişikliğini onaylamak için e-postanıza gelen kodu girin. Onaydan sonra diğer cihazlardaki oturumlar kapanır.", cancel: function () { start(p); }, confirm: function (c) {
            return AVF.api("POST", "/account/confirm-password-change", { code: c }).then(function (r) { AVF.toast(r.message); if (!r.keptSession) afterLogout(); else start(p); });
          } }));
        }, function (er) { AVF.busy(btn, false); msg(box, AVF.errText(er), "err"); });
      } }, AVF.field("Mevcut şifre", o, { optional: true }), AVF.field("Yeni şifre", n, { optional: true, hint: "En az 8 karakter; en az 1 harf ve 1 noktalama işareti; boşluk ve ardışık sayı olmaz." }), box, btn));
    }
    start(acc.querySelector(".panel")); return acc;
  }

  // ---------- İki adımlı doğrulama (Google Authenticator) ----------
  function tfaSection(user, refresh) {
    var panelRole = user.role === "coach" || user.role === "admin";
    var acc = AVF.accordion({ icon: "shield", teal: true, title: "İki Adımlı Doğrulama", sub: (user.totp_enabled ? "Açık" : "Kapalı") + " · Google Authenticator" });
    var p = acc.querySelector(".panel");
    function render() {
      acc.setTitleSub((user.totp_enabled ? "Açık" : "Kapalı") + " · Google Authenticator");
      var box = h("div");
      if (!user.totp_enabled) {
        AVF.mount(p, panelRole ? h("div", { class: "note warn" }, "Uzman ve yönetici hesaplarında iki adımlı doğrulama zorunludur. Etkinleştirmeden panele erişilemez.") : null,
          h("p", { class: "hint", text: "Girişte şifrenize ek olarak telefonunuzdaki Google Authenticator kodu istenir." }), box,
          h("button", { class: "btn", type: "button", onclick: function (ev) {
            var b = ev.currentTarget; AVF.busy(b, true, "Gönderiliyor…");
            AVF.api("POST", "/2fa/request-toggle", { method: "totp" }).then(function () {
              AVF.mount(p, codeStep({ text: "Etkinleştirmeyi onaylamak için e-postanıza gelen kodu girin.", cancel: render, confirm: function (c) {
                return AVF.api("POST", "/2fa/confirm-toggle", { code: c }).then(function (r) { setup(r, "/2fa/activate", {}); });
              } }));
            }, function (er) { AVF.busy(b, false); msg(box, AVF.errText(er), "err"); });
          } }, "Etkinleştir"));
      } else {
        AVF.mount(p, h("p", { class: "hint", text: "Kalan kurtarma kodu: " + (user.recovery_codes_left == null ? "—" : user.recovery_codes_left) }), box,
          h("div", { class: "row" },
            h("button", { class: "btn ghost sm", type: "button", onclick: function () { recovery(); } }, "Kurtarma kodlarını yenile"),
            h("button", { class: "btn ghost sm", type: "button", onclick: function () { renew(); } }, "Authenticator'ı yenile"),
            panelRole ? null : h("button", { class: "btn ghost sm", type: "button", onclick: function () { disable(); } }, "Kapat")));
      }
    }
    function setup(r, activatePath, extra) {
      var code = AVF.input("text", { class: "codeinp", inputmode: "numeric", maxlength: "6", placeholder: "••••••", autocomplete: "one-time-code" }), box = h("div"), btn = h("button", { class: "btn", type: "submit" }, "Doğrula ve Etkinleştir");
      AVF.mount(p, h("p", { class: "hint", text: "1) Google Authenticator'da “+” ile QR kodu okutun. 2) Uygulamadaki 6 haneli kodu aşağıya girin." }),
        h("img", { class: "qr", src: r.qrDataUrl, alt: "Authenticator QR kodu" }), h("p", { class: "hint center" }, "Okutamıyorsanız anahtarı elle girin: ", h("b", { text: r.secret })),
        h("form", { novalidate: true, onsubmit: function (e) {
          e.preventDefault(); msg(box, ""); AVF.busy(btn, true, "Doğrulanıyor…");
          var payload = { token: code.value }; Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; }); if (r.renewTicket) payload.renewTicket = r.renewTicket;
          AVF.api("POST", activatePath, payload).then(function (d) { user.totp_enabled = true; user.recovery_codes_left = (d.backupCodes || []).length; refresh(); AVF.mount(p, codesList(d.backupCodes || []), h("button", { class: "btn", type: "button", onclick: render }, "Kaydettim")); AVF.toast("İki adımlı doğrulama etkin."); },
            function (er) { AVF.busy(btn, false); msg(box, AVF.errText(er), "err"); });
        } }, AVF.field("Uygulama kodu", code, { optional: true }), box, btn));
    }
    function recovery() {
      var box = h("div"); AVF.api("POST", "/2fa/recovery/request", {}).then(function () {
        AVF.mount(p, codeStep({ text: "Kurtarma kodlarını yenilemek için e-postanıza gelen kodu girin. Eski kodların tamamı geçersiz olur.", cancel: render, confirm: function (c) {
          return AVF.api("POST", "/2fa/recovery/confirm", { code: c }).then(function (d) { user.recovery_codes_left = (d.backupCodes || []).length; refresh(); AVF.mount(p, codesList(d.backupCodes || []), h("button", { class: "btn", type: "button", onclick: render }, "Kaydettim")); });
        } }));
      }, function (er) { AVF.toast(AVF.errText(er), "err"); });
    }
    function renew() {
      AVF.api("POST", "/2fa/renew/request", {}).then(function () {
        var af = AVF.input("text", { maxlength: "20", autocomplete: "off", placeholder: "Mevcut Authenticator veya kurtarma kodu" }), box = h("div");
        var step = codeStep({ text: "Yeni telefona taşımak için e-postanıza gelen kodu girin. Yeni kurulum doğrulanana kadar mevcut kurulum geçerli kalır." + (panelRole ? " Güvenlik için mevcut Authenticator (veya kurtarma) kodunuz da gerekir." : ""), cancel: render, confirm: function (c) {
          var pl = { code: c }; if (panelRole) pl.adminFactor = af.value.trim();
          return AVF.api("POST", "/2fa/renew/confirm", pl).then(function (r) { setup(r, "/2fa/renew/activate", {}); });
        } });
        if (panelRole) step.insertBefore(AVF.field("Mevcut Authenticator / kurtarma kodu", af, { optional: true }), step.querySelector(".field"));
        AVF.mount(p, step);
      }, function (er) { AVF.toast(AVF.errText(er), "err"); });
    }
    function disable() {
      AVF.api("POST", "/2fa/request-toggle", { method: "totp" }).then(function () {
        AVF.mount(p, codeStep({ text: "Kapatmak için Google Authenticator uygulamanızdaki 6 haneli kodu girin.", cancel: render, confirm: function (c) {
          return AVF.api("POST", "/2fa/confirm-toggle", { code: c }).then(function () { user.totp_enabled = false; refresh(); AVF.toast("İki adımlı doğrulama kapatıldı."); render(); });
        } }));
      }, function (er) { AVF.toast(AVF.errText(er), "err"); });
    }
    render(); return acc;
  }

  // ---------- Son girişler ----------
  function historySection() {
    var loaded = false;
    var acc = AVF.accordion({ icon: "list", title: "Son Girişler", sub: "Hesabınıza yapılan son girişler", onOpen: function (p) {
      if (loaded) return; AVF.mount(p, AVF.skeleton(2));
      AVF.api("GET", "/account/login-history").then(function (rows) {
        loaded = true;
        AVF.mount(p, rows.length ? h("table", { class: "t stackm" }, h("thead", null, h("tr", null, h("th", { text: "Tarih" }), h("th", { text: "IP" }), h("th", { text: "Cihaz" }))),
          h("tbody", null, rows.map(function (r) { return h("tr", null, h("td", { text: AVF.fmtDateTime(r.created_at) }), h("td", { text: r.ip_address || "—" }), h("td", { text: String(r.user_agent || "—").slice(0, 80) })); })))
          : h("p", { class: "hint", text: "Henüz giriş kaydı yok." }));
      }, function (er) { AVF.mount(p, h("div", { class: "note err", text: AVF.errText(er) }), h("button", { class: "btn ghost sm", type: "button", onclick: function () { loaded = false; acc.querySelector("button").click(); acc.querySelector("button").click(); } }, "Tekrar dene")); });
    } });
    return acc;
  }

  // ---------- Hesabı sil ----------
  function deleteSection(user, afterLogout) {
    var acc = AVF.accordion({ icon: "trash", title: "Hesabı Sil", sub: "Hesabınızı ve kişisel verilerinizi kalıcı olarak siler" });
    function start(p) {
      var pw = AVF.passwordInput({ autocomplete: "current-password", maxlength: "200" }), box = h("div"), btn = h("button", { class: "btn danger", type: "submit" }, "Kod Gönder");
      AVF.mount(p, h("form", { novalidate: true, onsubmit: function (e) {
        e.preventDefault(); msg(box, ""); AVF.busy(btn, true, "Gönderiliyor…");
        AVF.api("POST", "/me/request-delete", { password: pw.input.value }).then(function () {
          AVF.mount(p, codeStep({ purpose: "delete_account", button: "Hesabı Kalıcı Olarak Sil", text: "Bu işlem geri alınamaz. Onaylamak için e-postanıza gelen kodu girin.", cancel: function () { start(p); }, confirm: function (c) {
            return AVF.api("POST", "/me/confirm-delete", { code: c }).then(function (r) { AVF.toast(r.message); afterLogout(); });
          } }));
        }, function (er) { AVF.busy(btn, false); msg(box, AVF.errText(er), "err"); });
      } }, h("div", { class: "note warn" }, "Hesabınız ve size bağlı tüm planlar kalıcı olarak silinir."), AVF.field("Şifreniz", pw, { optional: true }), box, btn));
    }
    start(acc.querySelector(".panel")); return acc;
  }

  AVF.accountSections = function (user, refresh, afterLogout) {
    return [nameSection(user, refresh), emailSection(user, refresh), passwordSection(user, refresh, afterLogout), tfaSection(user, refresh), historySection(), deleteSection(user, afterLogout)];
  };
})();
