/* AlpveFit — Forum Ayarları (üye paneli): alt sekmeler — Profil (avatar + herkese açık kullanıcı adı), İmza (+ görsel / GIPHY),
   Bağlantılar, Bildirim tercihleri, Seviye. Kurallar sunucudan gelir (GET /api/forum/rules); her kayıt sunucuda ayrıca denetlenir.
   Seviye atlama mantığı (puan, eşik) üyeye gösterilmez. Kullanıcı verisi yalnız textContent ile yazılır. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  AVF.FORUM_TABS = [["profil", "user", "Profil"], ["imza", "pen", "İmza"], ["baglantilar", "globe", "Bağlantılar"], ["bildirimler", "bell", "Bildirim ve Gizlilik"], ["seviye", "award", "Seviye"]];
  var SOC_ICON = { instagram: "instagram", tiktok: "tiktok", facebook: "facebook", twitter: "xlogo" };
  var LV_ICON = ["spark", "dumb", "target", "shield", "layers", "award", "flame", "eye"];
  var R = null, ST = null;
  function media(id) { return "/api/forum/media/" + id; }
  AVF.myAvatar = function () {
    var u = AVF.session.user; if (!u || !u.avatar_id) return AVF.icon("user");
    return h("img", { class: "acct-av", src: media(u.avatar_id), alt: "" });
  };
  function rulesList(items) { return h("ul", { class: "fs-rules" }, items.map(function (t) { return h("li", null, AVF.icon("check"), h("span", { text: t })); })); }
  function sec(icon, title, sub, body) { return h("section", { class: "card fs-sec" }, h("div", { class: "fs-h" }, h("span", { class: "tile" }, AVF.icon(icon)), h("div", null, h("h3", { text: title }), sub ? h("p", { class: "hint", text: sub }) : null)), body); }
  function csrfHeaders(ct) { var hd = { "Content-Type": ct, "x-avf-lang": AVF.lang || "tr", Accept: "application/json" }; var c = AVF.cookie("avf_csrf"); if (c) hd["x-csrf-token"] = c; return hd; }
  function upload(kind, file, accept) {
    return fetch("/api/forum/me/media/" + kind + (accept ? "?acceptRules=1" : ""), { method: "POST", credentials: "same-origin", headers: csrfHeaders("application/octet-stream"), body: file }).then(function (r) {
      return r.text().then(function (t) { var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) { d = null; } if (r.ok) return d; throw { status: r.status, data: d || {} }; });
    }, function () { throw { status: 0, data: { error: "network" } }; });
  }
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
  function msg(box, t, bad) { AVF.mount(box, t ? h("div", { class: "note" + (bad ? " err" : " ok"), role: bad ? "alert" : "status", text: t }) : null); }

  AVF.forumSettingsView = function (el, tab) {
    tab = AVF.FORUM_TABS.some(function (t) { return t[0] === tab; }) ? tab : "profil";
    var head = h("div", null, h("h2", { class: "ptitle", text: "Forum Ayarları" }), tabsNav(tab));
    var body = h("div");
    AVF.mount(el, head, body);
    if (R && ST) draw(); else AVF.mount(body, AVF.skeleton(3));
    Promise.all([AVF.api("GET", "/forum/me"), R ? R : AVF.api("GET", "/forum/rules")]).then(function (r) { ST = r[0]; R = r[1]; if (el.isConnected) draw(); }, function (e) {
      if (!ST) AVF.mount(body, AVF.state("alert", "Forum ayarları yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { AVF.forumSettingsView(el, tab); } }, "Tekrar dene")));
    });
    function tabsNav(cur) {
      var nav = h("nav", { class: "ktabs", "aria-label": "Forum ayarları bölümleri" }, AVF.FORUM_TABS.map(function (t) {
        var a = h("a", { class: "ktab", href: "/panel/forum-ayarlari/" + t[0], "data-link": "" }, AVF.icon(t[1]), h("span", { text: t[2] }));
        if (t[0] === cur) a.setAttribute("aria-current", "page"); return a;
      }));
      AVF.stripCenter(nav, "fs-tabs");
      return nav;
    }
    function refresh(n, okText) { ST = n; if (AVF.session.user) { AVF.session.user.avatar_id = n.avatarId; AVF.session.user.username = n.username; if (AVF.renderChrome) AVF.renderChrome(); } if (okText) AVF.toast(AVF.t(okText)); draw(); }
    function draw() {
      var accepted = !!ST.rulesAcceptedAt, acc = h("input", { type: "checkbox" });
      var accBox = accepted ? null : h("label", { class: "check fs-acc" }, acc, h("span", null, "Forum kurallarını (kullanıcı adı, avatar, imza ve bağlantı kuralları) okudum ve kabul ediyorum."));
      function needAccept(box) { if (accepted || acc.checked) return false; msg(box, "Devam etmek için forum kurallarını onaylayın.", true); if (accBox) accBox.scrollIntoView({ block: "center", behavior: "smooth" }); return true; }
      var V = { profil: profile, imza: signature, baglantilar: links, bildirimler: notify, seviye: level }[tab];
      AVF.mount(body, ["profil", "imza", "baglantilar"].indexOf(tab) >= 0 ? accBox : null, V(needAccept, acc));
    }

    // ---- Profil: avatar ve herkese açık kullanıcı adı tek kartta
    function profile(needAccept, acc) {
      var lv = ST.level, idx = Math.max(0, Math.min(7, (lv.n || 1) - 1));
      var avBox = h("div"), pick = h("input", { type: "file", accept: ".png,.jpg,.jpeg,image/png,image/jpeg", hidden: "", tabindex: "-1" });
      pick.addEventListener("change", function () {
        var f = pick.files && pick.files[0]; pick.value = ""; if (!f) return;
        if (needAccept(avBox)) return;
        precheck(f, "avatar").then(function (e) { if (e) return msg(avBox, AVF.t(e), true); msg(avBox, AVF.t("Yükleniyor…")); upload("avatar", f, acc.checked).then(function (n) { refresh(n, "Avatar güncellendi."); }, function (er) { msg(avBox, AVF.errText(er), true); }); });
      });
      var av = h("button", { class: "fs-avb", type: "button", "aria-label": AVF.t(ST.avatarId ? "Avatarı değiştir" : "Avatar yükle"), title: AVF.t(ST.avatarId ? "Avatarı değiştir" : "Avatar yükle"), onclick: function () { pick.click(); } },
        ST.avatarId ? h("img", { class: "fs-av", src: media(ST.avatarId), alt: "" }) : h("span", { class: "fs-av ph" }, AVF.icon("user")), h("span", { class: "fs-cam" }, AVF.icon("image")));
      var un = AVF.input("text", { maxlength: "20", value: ST.username, autocomplete: "username", spellcheck: "false", autocapitalize: "off", "aria-label": "Kullanıcı adı" });
      var pw = AVF.input("password", { autocomplete: "current-password", placeholder: "Mevcut şifreniz", "aria-label": "Mevcut şifre" });
      un.addEventListener("input", function () { var v = un.value.toLowerCase().replace(/[^a-z0-9._]/g, ""); if (v !== un.value) un.value = v; pwRow.hidden = v === ST.username; });
      var pwRow = h("div", { hidden: "" }, AVF.field("Mevcut şifre", pw, { icon: "lock", optional: true }));
      var unBox = h("div"), unBtn = h("button", { class: "btn sm", type: "submit", disabled: !!ST.usernameNextChangeAt }, AVF.icon("save", "bico"), "Kullanıcı adını değiştir");
      var form = h("form", { class: "fs-unf", novalidate: true, onsubmit: function (e) {
        e.preventDefault(); msg(unBox, null);
        if (un.value === ST.username) return msg(unBox, AVF.t("Yeni kullanıcı adı mevcut adınızla aynı."), true);
        AVF.busy(unBtn, true, "Kaydediliyor…");
        AVF.api("PUT", "/forum/me/username", { username: un.value.trim(), password: pw.value }).then(function (n) { pw.value = ""; refresh(n, "Kullanıcı adınız güncellendi. Girişte yeni kullanıcı adınızı kullanın."); }, function (er) { AVF.busy(unBtn, false); msg(unBox, AVF.errText(er), true); });
      } }, h("div", { class: "fs-un-in" }, h("span", { class: "at" }, "@"), un), pwRow,
        ST.usernameNextChangeAt ? h("p", { class: "hint" }, h("span", { text: "Bir sonraki değişiklik tarihi: " }), h("b", { text: AVF.fmtDateTime(ST.usernameNextChangeAt) })) : null, unBox, h("div", { class: "row" }, unBtn));
      return [
        h("section", { class: "card fs-id" }, h("div", { class: "fs-avw" }, av, ST.avatarId ? h("button", { class: "lnk sm", type: "button", onclick: function () {
            AVF.api("DELETE", "/forum/me/media/avatar").then(function (n) { refresh(n, "Avatar kaldırıldı."); }, function (er) { msg(avBox, AVF.errText(er), true); });
          } }, "Kaldır") : null, pick),
          h("div", { class: "fs-idt" },
            h("div", { class: "fs-unr" }, h("b", { class: "fs-un", "data-notr": "", text: "@" + ST.username }), h("span", { class: "lvl big" }, AVF.icon(lv.assigned ? "shield" : LV_ICON[idx]), h("span", { text: lv.name }))),
            h("div", { class: "fstats" }, h("span", { title: AVF.t("Konu") }, AVF.icon("msg"), String(ST.stats.topics)), h("span", { title: AVF.t("Mesaj") }, AVF.icon("chat"), String(ST.stats.posts)), h("span", { title: AVF.t("Beğeni") }, AVF.icon("like"), String(ST.stats.likes)), h("span", { title: AVF.t("Beğenmeme") }, AVF.icon("dislike"), String(ST.stats.dislikes))),
            form)),
        avBox,
        sec("user", "Avatar kuralları", "Avatarınızı değiştirmek için görselinize dokunun.", rulesList(R.avatar)),
        sec("atsign", "Kullanıcı adı kuralları", "Herkese açıktır; forumda ve girişte kullanılır.", rulesList(R.username))];
    }

    // ---- İmza
    function signature(needAccept, acc) {
      var sig = h("textarea", { class: "inp", rows: "3", maxlength: String(R.signatureMax), placeholder: "Kısa bir imza (isteğe bağlı)", "aria-label": "İmza" }); sig.value = ST.signature || "";
      var cnt = h("small", { class: "hint", "data-notr": "" }), prev = h("div", { class: "fs-sigprev" });
      function paintPrev() {
        cnt.textContent = sig.value.length + " / " + R.signatureMax;
        AVF.mount(prev, sig.value || ST.sigImageId ? [h("small", { class: "hint", text: "Önizleme" }), sig.value ? h("p", { "data-notr": "", text: sig.value }) : null, ST.sigImageId ? h("img", { src: media(ST.sigImageId), alt: "" }) : null] : null);
      }
      sig.addEventListener("input", paintPrev); paintPrev();
      var box = h("div"), btn = h("button", { class: "btn sm", type: "button" }, AVF.icon("save", "bico"), "İmzayı kaydet");
      btn.addEventListener("click", function () {
        msg(box, null); if (sig.value.trim() && needAccept(box)) return;
        AVF.busy(btn, true, "Kaydediliyor…");
        AVF.api("PUT", "/forum/me", { signature: sig.value, acceptRules: acc.checked || undefined }).then(function (n) { refresh(n, "İmza kaydedildi."); }, function (er) { AVF.busy(btn, false); msg(box, AVF.errText(er), true); });
      });
      var pick = h("input", { type: "file", accept: ".png,.jpg,.jpeg,.gif,image/png,image/jpeg,image/gif", hidden: "", tabindex: "-1" });
      pick.addEventListener("change", function () {
        var f = pick.files && pick.files[0]; pick.value = ""; if (!f) return;
        if (needAccept(box)) return;
        precheck(f, "sig").then(function (e) { if (e) return msg(box, AVF.t(e), true); msg(box, AVF.t("Yükleniyor…")); upload("sig", f, acc.checked).then(function (n) { refresh(n, "İmza görseli güncellendi."); }, function (er) { msg(box, AVF.errText(er), true); }); });
      });
      var gBox = h("div");
      var gBtn = h("button", { class: "btn ghost sm", type: "button", hidden: "" }, h("b", { class: "gif-b" }, "GIF"), "GIPHY'den ekle");
      AVF.api("GET", "/giphy/status").then(function (r) { gBtn.hidden = !r.enabled; }, function () {});
      gBtn.addEventListener("click", function () { if (needAccept(box)) return; if (gBox.firstChild) return AVF.mount(gBox, null); AVF.mount(gBox, giphyPicker(function (id, done) {
        AVF.api("POST", "/forum/me/media/sig/giphy", { id: id, acceptRules: acc.checked || undefined }).then(function (n) { AVF.mount(gBox, null); refresh(n, "İmza görseli güncellendi."); }, function (er) { done(); msg(box, AVF.errText(er), true); });
      })); });
      return sec("pen", "İmza", "Forum mesajlarınızın altında görünür.", [h("p", { class: "note warn" }, AVF.icon("alert", "bico"), h("b", { text: "Reklam yasaktır." }), " ", h("span", { text: "İmzada bağlantı, alan adı, e-posta, telefon, @kullanıcı adı ve satış/indirim ifadeleri kullanılamaz." })),
        rulesList(R.signature), AVF.emojiPicker ? h("div", { class: "row" }, AVF.emojiPicker(sig)) : null, sig, cnt,
        h("div", { class: "row" }, btn, h("button", { class: "btn ghost sm", type: "button", onclick: function () { pick.click(); } }, AVF.icon("image", "bico"), ST.sigImageId ? "Görseli değiştir" : "Görsel / GIF yükle"), gBtn,
          ST.sigImageId ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { AVF.api("DELETE", "/forum/me/media/sig").then(function (n) { refresh(n, "İmza görseli kaldırıldı."); }, function (er) { msg(box, AVF.errText(er), true); }); } }, AVF.icon("x", "bico"), "Görseli kaldır") : null),
        gBox, pick, box, prev]);
    }
    function giphyPicker(onPick) {
      var q = h("input", { class: "inp", type: "search", placeholder: AVF.t("GIF ara…"), "aria-label": AVF.t("GIF ara") }), grid = h("div", { class: "gp-grid" }), t = null, busy = false;
      function run() {
        AVF.mount(grid, AVF.skeleton(1));
        AVF.api("GET", "/giphy/search?q=" + encodeURIComponent(q.value) + "&lang=" + (AVF.lang === "en" ? "en" : "tr")).then(function (r) {
          AVF.mount(grid, r.items.length ? r.items.map(function (g) {
            return h("button", { type: "button", class: "gp-i", title: g.title, onclick: function (e) {
              if (busy) return; busy = true; var b = e.currentTarget; b.classList.add("load");
              onPick(g.id, function () { busy = false; b.classList.remove("load"); });
            } }, h("img", { src: g.anim, alt: g.title || "GIF", loading: "lazy", referrerpolicy: "no-referrer" }));
          }) : h("p", { class: "hint", text: "Sonuç yok." }));
        }, function (e) { AVF.mount(grid, h("p", { class: "note err", text: AVF.errText(e) })); });
      }
      q.addEventListener("input", function () { clearTimeout(t); t = setTimeout(run, 350); });
      run();
      return h("div", { class: "gp card" }, q, grid, h("small", { class: "gp-attr", "data-notr": "", text: "Powered by GIPHY" }));
    }

    // ---- Bağlantılar (site tasarımıyla uyumlu tek renk simgeler)
    function links(needAccept, acc) {
      var ins = {}, box = h("div"), btn = h("button", { class: "btn sm", type: "button" }, AVF.icon("save", "bico"), "Bağlantıları kaydet");
      var rows = Object.keys(R.socials).map(function (k) {
        var i = AVF.input("text", { maxlength: "60", value: ST.socials[k] || "", placeholder: "kullaniciadi", "aria-label": R.socials[k].label + " kullanıcı adı", spellcheck: "false", autocapitalize: "off" });
        ins[k] = i;
        return h("div", { class: "fs-soc" }, h("span", { class: "fs-si", title: R.socials[k].label }, AVF.icon(SOC_ICON[k])), h("div", { class: "fs-sin" }, h("small", { "data-notr": "", text: R.socials[k].label }), h("div", { class: "fs-pre" }, h("span", { "data-notr": "", text: R.socials[k].url.replace(/^https:\/\/(www\.)?/, "") }), i)),
          ST.socials[k] ? h("a", { class: "fs-sl", href: R.socials[k].url + ST.socials[k], target: "_blank", rel: "noopener noreferrer nofollow", "aria-label": AVF.t("Bağlantıyı aç") }, AVF.icon("ext")) : null);
      });
      btn.addEventListener("click", function () {
        msg(box, null); var v = {}; Object.keys(ins).forEach(function (k) { v[k] = ins[k].value.trim(); });
        if (Object.keys(v).some(function (k) { return v[k]; }) && needAccept(box)) return;
        AVF.busy(btn, true, "Kaydediliyor…");
        AVF.api("PUT", "/forum/me", { socials: v, acceptRules: acc.checked || undefined }).then(function (n) { refresh(n, "Bağlantılar kaydedildi."); }, function (er) { AVF.busy(btn, false); msg(box, AVF.errText(er), true); });
      });
      return sec("globe", "Bağlantılar", "Yalnız kullanıcı adınızı girin; bağlantı resmî adresten oluşturulur. Profilinizde görünür.", [h("div", { class: "fs-socs" }, rows), box, h("div", { class: "row" }, btn)]);
    }

    // ---- Bildirim tercihleri
    function notify() {
      var box = h("div");
      return [sec("bell", "Forum Bildirimleri", "Hangi forum olaylarında bildirim almak istediğinizi seçin.", [h("div", { class: "fs-tgs" }, R.notify.map(function (n) {
        var c = h("input", { type: "checkbox", checked: !!ST.notify[n.key], disabled: n.locked });
        c.addEventListener("change", function () {
          var v = {}; R.notify.forEach(function (x) { v[x.key] = x.key === n.key ? c.checked : !!ST.notify[x.key]; });
          AVF.api("PUT", "/forum/me", { notify: v }).then(function (ns) { ST = ns; msg(box, AVF.t("Bildirim tercihi kaydedildi.")); }, function (er) { c.checked = !c.checked; msg(box, AVF.errText(er), true); });
        });
        return h("label", { class: "fs-tg" + (n.locked ? " off" : "") }, h("span", { text: n.label }), h("span", { class: "sw" }, c, h("i")), n.locked ? h("small", { class: "hint", text: "Kapatılamaz" }) : null);
      })), box]), privacy()];
    }
    // Gizlilik: çevrimiçi durumunu gizleme (Pump Avcısı seviyesinde açılır)
    function privacy() {
      var box = h("div"), open = !!ST.hideOnlineUnlocked, lvName = (R.levels[(ST.hideOnlineLevel || 3) - 1] || {}).name || "Pump Avcısı";
      var c = h("input", { type: "checkbox", checked: !!ST.hideOnline, disabled: !open });
      c.addEventListener("change", function () {
        AVF.api("PUT", "/forum/me", { hideOnline: c.checked }).then(function (ns) { ST = ns; msg(box, AVF.t(c.checked ? "Çevrimiçi durumun artık gizli." : "Çevrimiçi durumun yeniden görünür.")); }, function (er) { c.checked = !c.checked; msg(box, AVF.errText(er), true); });
      });
      return sec("eyeoff", "Gizlilik", "Forumda ne kadar göründüğünü sen belirle.", [h("div", { class: "fs-tgs" },
        h("label", { class: "fs-tg" + (open ? "" : " off") }, h("span", null, h("span", { text: "Çevrimiçi durumumu gizle" }), h("small", { class: "hint", text: "Açıkken profilinde, mesajlarında ve üye listesinde “çevrimiçi” işaretin görünmez." })),
          h("span", { class: "sw" }, c, h("i")), open ? null : h("small", { class: "hint fs-lock" }, AVF.icon("lock", "bico"), h("span", { text: lvName + " seviyesinde açılır." })))), box]);
    }

    // ---- Seviye (yalnız unvanlar; nasıl kazanıldığı gösterilmez)
    function level() {
      var lv = ST.level;
      return [h("section", { class: "card fs-lvh" }, h("span", { class: "fs-lvi" }, AVF.icon(lv.assigned ? "shield" : LV_ICON[Math.max(0, Math.min(7, lv.n - 1))])), h("div", null, h("small", { text: "Şu anki seviyeniz" }), h("b", { text: lv.name }),
          h("p", { class: "hint" }, AVF.icon(ST.messagingUnlocked ? "check" : "lock", "bico"), h("span", { text: ST.messagingUnlocked ? AVF.t("Özel mesajlaşma açık.") : AVF.t("Özel mesajlaşma " + R.levels[R.messagingLevel - 1].name + " seviyesinde açılır.") })))),
        sec("award", "Seviyeler", "Forumdaki etkinliğiniz arttıkça seviyeniz kendiliğinden yükselir.", [
          h("ol", { class: "fs-lv" }, R.levels.map(function (l, i) {
            var me = !lv.assigned && lv.n === l.n, done = !lv.assigned && lv.n > l.n;
            return h("li", { class: me ? "on" : done ? "done" : "" }, h("span", { class: "chi" }, AVF.icon(LV_ICON[i])), h("b", { text: l.name }), l.n === R.messagingLevel ? h("span", { class: "chip", text: "Mesajlaşma açılır" }) : null, me ? h("span", { class: "chip lime", text: "Siz" }) : done ? AVF.icon("check", "lv-ok") : null);
          }))])];
    }
  };

  // ---- seviye atlama kutlaması: bildirimden tetiklenir (bir kez gösterilir)
  AVF.celebrateLevel = function (n) {
    var d = n.data || {}, seen;
    try { seen = JSON.parse(localStorage.getItem("avf_lvl_seen") || "[]"); } catch (e) { seen = []; }
    if (seen.indexOf(n.id) >= 0) return;
    try { seen.push(n.id); localStorage.setItem("avf_lvl_seen", JSON.stringify(seen.slice(-20))); } catch (e) {}
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var confetti = h("div", { class: "lvc-cf", "aria-hidden": "true" });
    if (!reduce) for (var i = 0; i < 28; i++) confetti.appendChild(h("i", { style: "--x:" + (Math.random() * 100).toFixed(1) + "%;--d:" + (Math.random() * .6).toFixed(2) + "s;--r:" + Math.floor(Math.random() * 360) + "deg;--c:" + i % 4 }));
    var ov = h("div", { class: "lvc", role: "dialog", "aria-modal": "true", "aria-labelledby": "lvc-t" });
    function close() { ov.classList.add("out"); setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 260); document.removeEventListener("keydown", esc, true); if (n.id) AVF.api("POST", "/notifications/" + n.id + "/read", {}).then(null, function () {}); }
    function esc(e) { if (e.key === "Escape") close(); }
    var ok = h("button", { class: "btn", type: "button", onclick: close }, "Harika!");
    AVF.mount(ov, confetti, h("div", { class: "lvc-box" }, h("span", { class: "lvc-badge" }, AVF.icon("award")), h("small", { text: "Tebrikler!" }), h("h2", { id: "lvc-t", text: d.name || "" }), h("p", { text: "Forum seviyeniz yükseldi. Yeni unvanınız kullanıcı adınızın yanında görünür." }), ok));
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.body.appendChild(ov); document.addEventListener("keydown", esc, true);
    setTimeout(function () { ok.focus(); }, 50);
  };
})();
