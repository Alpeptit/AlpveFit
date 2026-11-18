/* AlpveFit — Forum Ayarları (üye paneli): herkese açık kullanıcı adı, avatar, imza (+ görsel/GIF), sosyal bağlantılar, bildirimler, seviye.
   Kurallar sunucudan gelir (GET /api/forum/rules); her kayıt sunucuda ayrıca denetlenir. Kullanıcı verisi yalnız textContent ile yazılır. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var SOC_ICON = { instagram: "instagram", tiktok: "tiktok", facebook: "facebook", twitter: "xlogo" };
  var LV_ICON = ["spark", "dumb", "target", "shield", "layers", "award", "flame", "eye"];
  function media(id) { return "/api/forum/media/" + id; }
  function rulesList(items) { return h("ul", { class: "fs-rules" }, items.map(function (t) { return h("li", null, AVF.icon("check"), h("span", { text: t })); })); }
  function sec(icon, title, sub, body) { return h("section", { class: "card fs-sec" }, h("div", { class: "fs-h" }, h("span", { class: "tile" }, AVF.icon(icon)), h("div", null, h("h3", { text: title }), sub ? h("p", { class: "hint", text: sub }) : null)), body); }
  function upload(kind, file, accept) {
    var headers = { "Content-Type": "application/octet-stream", "x-avf-lang": AVF.lang || "tr", Accept: "application/json" };
    var c = AVF.cookie("avf_csrf"); if (c) headers["x-csrf-token"] = c;
    return fetch("/api/forum/me/media/" + kind + (accept ? "?acceptRules=1" : ""), { method: "POST", credentials: "same-origin", headers: headers, body: file }).then(function (r) {
      return r.text().then(function (t) { var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) { d = null; } if (r.ok) return d; throw { status: r.status, data: d || {} }; });
    }, function () { throw { status: 0, data: { error: "network" } }; });
  }
  /** Tarayıcıda ön denetim (boyut / tür / piksel); asıl denetim sunucudadır. */
  function precheck(file, kind) {
    return new Promise(function (ok) {
      var types = kind === "avatar" ? ["image/png", "image/jpeg"] : ["image/png", "image/jpeg", "image/gif"];
      if (types.indexOf(file.type) < 0) return ok(kind === "avatar" ? "Avatar için yalnız PNG veya JPG yüklenebilir." : "İmza görseli için yalnız PNG, JPG veya GIF yüklenebilir.");
      if (file.size > 1024 * 1024) return ok("Görsel en fazla 1 MB olabilir.");
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var w = im.naturalWidth, hh = im.naturalHeight; URL.revokeObjectURL(url);
        if (kind === "avatar" && (w < 128 || hh < 128 || w > 1024 || hh > 1024 || Math.max(w, hh) / Math.min(w, hh) > 1.25)) return ok("Avatar en az 128×128, en fazla 1024×1024 piksel ve kareye yakın olmalıdır.");
        if (kind === "sig" && (w > 600 || hh > 150)) return ok("İmza görseli en fazla 600×150 piksel olabilir.");
        ok(null);
      };
      im.onerror = function () { URL.revokeObjectURL(url); ok("Görsel okunamadı."); };
      im.src = url;
    });
  }

  AVF.forumSettingsView = function (el) {
    AVF.mount(el, h("h2", { class: "ptitle", text: "Forum Ayarları" }), AVF.skeleton(3));
    Promise.all([AVF.api("GET", "/forum/me"), AVF.api("GET", "/forum/rules")]).then(function (r) { draw(r[0], r[1]); }, function (e) {
      AVF.mount(el, h("h2", { class: "ptitle", text: "Forum Ayarları" }), AVF.state("alert", "Forum ayarları yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { AVF.forumSettingsView(el); } }, "Tekrar dene")));
    });

    function draw(st, R) {
      var accepted = !!st.rulesAcceptedAt;
      var acc = h("input", { type: "checkbox" });
      var accBox = accepted ? null : h("label", { class: "check fs-acc" }, acc, h("span", null, "Forum kurallarını (kullanıcı adı, avatar, imza ve bağlantı kuralları) okudum ve kabul ediyorum."));
      function needAccept(box) { if (accepted || acc.checked) return false; msg(box, "Devam etmek için forum kurallarını onaylayın.", true); if (accBox) accBox.scrollIntoView({ block: "center", behavior: "smooth" }); return true; }
      function msg(box, t, bad) { AVF.mount(box, t ? h("div", { class: "note" + (bad ? " err" : " ok"), role: bad ? "alert" : "status", text: t }) : null); }
      function refresh(nst, okText) { st = nst; if (nst.rulesAcceptedAt) accepted = true; if (okText) AVF.toast(okText); draw(st, R); }

      // ---- kimlik kartı + seviye
      var lv = st.level, idx = Math.max(0, Math.min(7, (lv.n || 1) - 1));
      var prog = null;
      if (st.nextLevel && !lv.assigned && !lv.manual) {
        var cur = (R.levels[lv.n - 1] || R.levels[0]).min, pct = Math.max(0, Math.min(100, ((lv.score - cur) / (st.nextLevel.min - cur)) * 100));
        prog = h("div", { class: "fs-prog" }, h("div", { class: "fs-bar" }, h("i", { style: "width:" + pct.toFixed(1) + "%" })), h("small", null, h("span", { "data-notr": "", text: String(lv.score) + " / " + st.nextLevel.min }), " · ", h("span", { text: "Sonraki seviye" }), ": ", h("b", { text: st.nextLevel.name })));
      }
      var avatarEl = st.avatarId ? h("img", { class: "fs-av", src: media(st.avatarId), alt: "Avatar" }) : h("span", { class: "fs-av ph" }, AVF.icon("user"));
      var idCard = h("section", { class: "card fs-id" }, avatarEl, h("div", { class: "fs-idt" },
        h("b", { class: "fs-un", "data-notr": "", text: "@" + st.username }),
        h("span", { class: "lvl big" }, AVF.icon(lv.assigned ? "shield" : LV_ICON[idx]), h("span", { text: lv.name }), lv.manual ? h("small", { text: "(yönetici tarafından verildi)" }) : null),
        prog,
        h("div", { class: "fstats" }, h("span", { title: "Konu" }, AVF.icon("msg"), String(st.stats.topics)), h("span", { title: "Mesaj" }, AVF.icon("chat"), String(st.stats.posts)), h("span", { title: "Beğeni" }, AVF.icon("like"), String(st.stats.likes)), h("span", { title: "Beğenmeme" }, AVF.icon("dislike"), String(st.stats.dislikes))),
        h("p", { class: "hint" }, AVF.icon(st.messagingUnlocked ? "check" : "lock", "bico"), h("span", { text: st.messagingUnlocked ? "Özel mesajlaşma açık." : "Özel mesajlaşma " + R.levels[R.messagingLevel - 1].name + " seviyesinde açılır." }))));

      // ---- avatar
      var avBox = h("div"), avPick = h("input", { type: "file", accept: ".png,.jpg,.jpeg,image/png,image/jpeg", hidden: "", tabindex: "-1" });
      avPick.addEventListener("change", function () {
        var f = avPick.files && avPick.files[0]; avPick.value = ""; if (!f) return;
        if (needAccept(avBox)) return;
        precheck(f, "avatar").then(function (e) { if (e) return msg(avBox, e, true); msg(avBox, "Yükleniyor…"); upload("avatar", f, !accepted).then(function (n) { refresh(n, "Avatar güncellendi."); }, function (er) { msg(avBox, AVF.errText(er), true); }); });
      });
      var avSec = sec("user", "Avatar", "Forumda adınızın yanında görünür.", [rulesList(R.avatar),
        h("div", { class: "row" }, h("button", { class: "btn sm", type: "button", onclick: function () { avPick.click(); } }, AVF.icon("image", "bico"), st.avatarId ? "Avatarı değiştir" : "Avatar yükle"),
          st.avatarId ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { AVF.api("DELETE", "/forum/me/media/avatar").then(function (n) { refresh(n, "Avatar kaldırıldı."); }, function (er) { msg(avBox, AVF.errText(er), true); }); } }, AVF.icon("x", "bico"), "Kaldır") : null), avPick, avBox]);

      // ---- kullanıcı adı
      var un = AVF.input("text", { maxlength: "20", value: st.username, autocomplete: "username", spellcheck: "false", autocapitalize: "off" });
      var pw = AVF.input("password", { autocomplete: "current-password", placeholder: "Mevcut şifreniz" });
      un.addEventListener("input", function () { var v = un.value.toLowerCase().replace(/[^a-z0-9._]/g, ""); if (v !== un.value) un.value = v; });
      var unBox = h("div"), unBtn = h("button", { class: "btn sm", type: "submit", disabled: !!st.usernameNextChangeAt }, AVF.icon("save", "bico"), "Kullanıcı adını değiştir");
      var unSec = sec("atsign", "Kullanıcı Adı", "Herkese açıktır; forumda ve girişte kullanılır.", h("form", { novalidate: true, onsubmit: function (e) {
        e.preventDefault(); msg(unBox, null);
        AVF.busy(unBtn, true, "Kaydediliyor…");
        AVF.api("PUT", "/forum/me/username", { username: un.value.trim(), password: pw.value }).then(function (n) { pw.value = ""; if (AVF.session && AVF.session.user) AVF.session.user.username = n.username; refresh(n, "Kullanıcı adınız güncellendi. Girişte yeni kullanıcı adınızı kullanın."); }, function (er) { AVF.busy(unBtn, false); msg(unBox, AVF.errText(er), true); });
      } }, rulesList(R.username), AVF.field("Yeni kullanıcı adı", un, { icon: "atsign", optional: true }), AVF.field("Mevcut şifre", pw, { icon: "lock", optional: true }),
        st.usernameNextChangeAt ? h("p", { class: "note" }, h("span", { text: "Bir sonraki değişiklik tarihi: " }), h("b", { text: AVF.fmtDateTime(st.usernameNextChangeAt) })) : null, unBox, h("div", { class: "row" }, unBtn)));

      // ---- imza
      var sig = h("textarea", { class: "inp", rows: "3", maxlength: String(R.signatureMax), placeholder: "Kısa bir imza (isteğe bağlı)" }); sig.value = st.signature || "";
      var cnt = h("small", { class: "hint", "data-notr": "" }), prev = h("div", { class: "fs-sigprev" });
      function paintPrev() {
        cnt.textContent = sig.value.length + " / " + R.signatureMax;
        AVF.mount(prev, sig.value || st.sigImageId ? [h("small", { class: "hint", text: "Önizleme" }), sig.value ? h("p", { "data-notr": "", text: sig.value }) : null, st.sigImageId ? h("img", { src: media(st.sigImageId), alt: "İmza görseli" }) : null] : null);
      }
      sig.addEventListener("input", paintPrev); paintPrev();
      var sigBox = h("div"), sigBtn = h("button", { class: "btn sm", type: "button" }, AVF.icon("save", "bico"), "İmzayı kaydet");
      sigBtn.addEventListener("click", function () {
        msg(sigBox, null); if (sig.value.trim() && needAccept(sigBox)) return;
        AVF.busy(sigBtn, true, "Kaydediliyor…");
        AVF.api("PUT", "/forum/me", { signature: sig.value, acceptRules: acc.checked || undefined }).then(function (n) { refresh(n, "İmza kaydedildi."); }, function (er) { AVF.busy(sigBtn, false); msg(sigBox, AVF.errText(er), true); });
      });
      var sgPick = h("input", { type: "file", accept: ".png,.jpg,.jpeg,.gif,image/png,image/jpeg,image/gif", hidden: "", tabindex: "-1" });
      sgPick.addEventListener("change", function () {
        var f = sgPick.files && sgPick.files[0]; sgPick.value = ""; if (!f) return;
        if (needAccept(sigBox)) return;
        precheck(f, "sig").then(function (e) { if (e) return msg(sigBox, e, true); msg(sigBox, "Yükleniyor…"); upload("sig", f, !accepted).then(function (n) { refresh(n, "İmza görseli güncellendi."); }, function (er) { msg(sigBox, AVF.errText(er), true); }); });
      });
      var sigSec = sec("pen", "İmza", "Forum mesajlarınızın altında görünür.", [h("p", { class: "note warn" }, AVF.icon("alert", "bico"), h("b", { text: "Reklam yasaktır." }), " ", h("span", { text: "İmzada bağlantı, alan adı, e-posta, telefon, @kullanıcı adı ve satış/indirim ifadeleri kullanılamaz." })),
        rulesList(R.signature), AVF.emojiPicker ? h("div", { class: "row" }, AVF.emojiPicker(sig)) : null, sig, cnt,
        h("div", { class: "row" }, sigBtn, h("button", { class: "btn ghost sm", type: "button", onclick: function () { sgPick.click(); } }, AVF.icon("image", "bico"), st.sigImageId ? "Görseli değiştir" : "Görsel / GIF ekle"),
          st.sigImageId ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { AVF.api("DELETE", "/forum/me/media/sig").then(function (n) { refresh(n, "İmza görseli kaldırıldı."); }, function (er) { msg(sigBox, AVF.errText(er), true); }); } }, AVF.icon("x", "bico"), "Görseli kaldır") : null),
        sgPick, sigBox, prev]);

      // ---- sosyal bağlantılar
      var socIn = {};
      var socRows = Object.keys(R.socials).map(function (k) {
        var i = AVF.input("text", { maxlength: "60", value: st.socials[k] || "", placeholder: "kullaniciadi", "aria-label": R.socials[k].label + " kullanıcı adı", spellcheck: "false", autocapitalize: "off" });
        socIn[k] = i;
        var link = st.socials[k] ? h("a", { class: "fs-sl", href: R.socials[k].url + st.socials[k], target: "_blank", rel: "noopener noreferrer nofollow" }, AVF.icon("ext")) : null;
        return h("div", { class: "fs-soc" }, h("span", { class: "fs-si s-" + k, title: R.socials[k].label }, AVF.icon(SOC_ICON[k])), h("div", { class: "fs-sin" }, h("small", { text: R.socials[k].label }), h("div", { class: "fs-pre" }, h("span", { "data-notr": "", text: R.socials[k].url.replace(/^https:\/\/(www\.)?/, "") }), i)), link);
      });
      var socBox = h("div"), socBtn = h("button", { class: "btn sm", type: "button" }, AVF.icon("save", "bico"), "Bağlantıları kaydet");
      socBtn.addEventListener("click", function () {
        msg(socBox, null); var v = {}; Object.keys(socIn).forEach(function (k) { v[k] = socIn[k].value.trim(); });
        if (Object.keys(v).some(function (k) { return v[k]; }) && needAccept(socBox)) return;
        AVF.busy(socBtn, true, "Kaydediliyor…");
        AVF.api("PUT", "/forum/me", { socials: v, acceptRules: acc.checked || undefined }).then(function (n) { refresh(n, "Bağlantılar kaydedildi."); }, function (er) { AVF.busy(socBtn, false); msg(socBox, AVF.errText(er), true); });
      });
      var socSec = sec("globe", "Bağlantılar", "Yalnız kullanıcı adınızı girin; bağlantı resmî adresten oluşturulur. Profilinizde görünür.", [h("div", { class: "fs-socs" }, socRows), socBox, h("div", { class: "row" }, socBtn)]);

      // ---- bildirimler
      var nBox = h("div");
      var nRows = R.notify.map(function (n) {
        var c = h("input", { type: "checkbox", checked: !!st.notify[n.key], disabled: n.locked });
        c.addEventListener("change", function () {
          var v = {}; R.notify.forEach(function (x) { v[x.key] = x.key === n.key ? c.checked : !!st.notify[x.key]; });
          AVF.api("PUT", "/forum/me", { notify: v }).then(function (ns) { st = ns; msg(nBox, "Bildirim tercihi kaydedildi."); }, function (er) { c.checked = !c.checked; msg(nBox, AVF.errText(er), true); });
        });
        return h("label", { class: "fs-tg" + (n.locked ? " off" : "") }, h("span", { text: n.label }), h("span", { class: "sw" }, c, h("i")), n.locked ? h("small", { class: "hint", text: "Kapatılamaz" }) : null);
      });
      var nSec = sec("bell", "Forum Bildirimleri", "Hangi forum olaylarında bildirim almak istediğinizi seçin.", [h("div", { class: "fs-tgs" }, nRows), nBox]);

      // ---- seviyeler
      var lvSec = sec("award", "Seviyeler", "Seviyeniz forumdaki etkinliğinize göre otomatik değişir: açtığınız konular, yazdığınız mesajlar ve aldığınız beğeniler puanı artırır; beğenmemeler ve haklı bulunan şikâyetler düşürür.", [
        h("ol", { class: "fs-lv" }, R.levels.map(function (l, i) {
          var me = !lv.assigned && lv.n === l.n;
          return h("li", { class: me ? "on" : "" }, h("span", { class: "chi" }, AVF.icon(LV_ICON[i])), h("b", { text: l.name }), h("small", { "data-notr": "", text: l.min + "+" }), l.n === R.messagingLevel ? h("span", { class: "chip", text: "Mesajlaşma açılır" }) : null, me ? h("span", { class: "chip lime", text: "Siz" }) : null);
        })),
        h("p", { class: "hint", text: "Moderatör ve Admin unvanları puanla kazanılmaz; yalnız atama ile verilir." }),
        h("p", { class: "hint", text: "Puan = konu × 5 + mesaj × 2 + beğeni × 3 − beğenmeme × 2 − haklı bulunan şikâyet × 25" })]);

      AVF.mount(el, h("h2", { class: "ptitle", text: "Forum Ayarları" }), idCard, accBox, avSec, unSec, sigSec, socSec, nSec, lvSec);
    }
  };
})();
