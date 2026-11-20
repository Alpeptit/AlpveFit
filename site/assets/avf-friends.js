/* AlpveFit — Arkadaşlar ve Mesajlar (üye paneli).
   Sol: arama, gelen / giden istekler, arkadaşlar. Sağ (mobilde ayrı ekran): seçili arkadaşla sohbet.
   Mesajlar yalnız arkadaşlar arasında ve mesajlaşma seviyesine ulaşıldığında gönderilebilir (sunucu denetler). */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var REASONS = [["spam", "Spam / istenmeyen mesaj"], ["abuse", "Hakaret / taciz"], ["obscene", "Müstehcen içerik"], ["political", "Siyasi / ideolojik içerik"], ["scam", "Dolandırıcılık / reklam"], ["other", "Diğer"]];
  function av(u, cls) { return AVF.framed(avEl(u, cls), u && u.frame, /lg|big/.test(cls || "") ? "lg" : "sm"); }
  function brand(u) { return !!(u && u.level && u.level.brand); }
  function nm(u) { return brand(u) ? "AlpveFit" : "@" + u.username; }
  function avEl(u, cls) { if (brand(u)) return h("img", { class: "fr-av brand " + (cls || ""), src: "/assets/brand/alpvefit.svg", alt: "AlpveFit" }); return u.avatarId ? h("img", { class: "fr-av " + (cls || ""), src: "/api/forum/media/" + u.avatarId, alt: "" }) : h("span", { class: "fr-av ph " + (cls || "") }, AVF.icon("user")); }
  function go(p) { if (AVF.go) AVF.go(p); else location.href = p; }
  function hm(t) { var d = new Date(t); return d.toLocaleTimeString(AVF.lang === "en" ? "en-GB" : "tr-TR", { hour: "2-digit", minute: "2-digit" }); }
  function dayKey(t) { var d = new Date(t); return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate(); }
  var pollT = null, offs = [];
  function unsub() { offs.forEach(function (f) { f(); }); offs = []; }

  AVF.friendsView = function (el, peerId) {
    clearTimeout(pollT); unsub();
    // liste: arkadaşlık olayı ya da yeni mesaj gelince sayaçlar anında tazelenir
    if (AVF.live) { offs.push(AVF.live.on("notif", function (d) { if (d.kind === "friend" && listCol.isConnected) loadList(); })); offs.push(AVF.live.on("dm", function () { if (listCol.isConnected) loadList(); })); }
    var listCol = h("div", { class: "fr-list" }), chatCol = h("div", { class: "fr-chat" });
    var wrap = h("div", { class: "fr" + (peerId ? " has-chat" : "") }, listCol, chatCol);
    AVF.mount(el, h("h2", { class: "ptitle", text: "Arkadaşlar ve Mesajlar" }), wrap);
    var data = null;
    function loadList() {
      return AVF.api("GET", "/friends").then(function (d) { data = d; drawList(); return d; }, function (e) { AVF.mount(listCol, AVF.state("alert", "Arkadaş listesi yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: loadList }, "Tekrar dene"))); });
    }
    AVF.mount(listCol, AVF.skeleton(3));
    if (peerId) chat(peerId); else AVF.mount(chatCol, h("div", { class: "fr-empty" }, h("span", { class: "fr-eic" }, AVF.icon("chat")), h("b", { text: "Bir sohbet seçin" }), h("small", { text: "Arkadaşlarınızla burada mesajlaşabilirsiniz." })));
    loadList();
    if (peerId && window.matchMedia && window.matchMedia("(max-width: 900px)").matches) setTimeout(function () { chatCol.scrollIntoView({ block: "start" }); }, 60);

    function act(method, path, okText) {
      return AVF.api(method, path, {}).then(function () { if (okText) AVF.toast(AVF.t(okText)); if (AVF.refreshUnread) AVF.refreshUnread(); return loadList(); }, function (e) { AVF.toast(AVF.errText(e)); });
    }
    function drawList() {
      var q = h("input", { class: "inp", type: "search", placeholder: AVF.t("Kullanıcı adıyla ara (en az 3 harf)"), "aria-label": AVF.t("Kullanıcı ara"), autocomplete: "off", spellcheck: "false", autocapitalize: "off" });
      var res = h("div", { class: "fr-res" }), t = null;
      q.addEventListener("input", function () {
        clearTimeout(t); var v = q.value.trim().replace(/^@/, "").toLowerCase();
        if (v.length < 3) return AVF.mount(res, null);
        t = setTimeout(function () {
          AVF.api("GET", "/friends/search?q=" + encodeURIComponent(v)).then(function (rows) {
            AVF.mount(res, rows.length ? rows.map(function (u) {
              var b = u.relation === "none" ? h("button", { class: "btn sm", type: "button", onclick: function (e) {
                  var bt = e.currentTarget; AVF.busy(bt, true, "Gönderiliyor…");
                  AVF.api("POST", "/friends/request", { username: u.username }).then(function (r) { AVF.toast(AVF.t(r.status === "friend" ? "Artık arkadaşsınız." : "Arkadaşlık isteği gönderildi.")); q.value = ""; AVF.mount(res, null); loadList(); }, function (er) { AVF.busy(bt, false); AVF.toast(AVF.errText(er)); });
                } }, AVF.icon("userplus", "bico"), "Ekle")
                : h("span", { class: "chip", text: u.relation === "friend" ? "Arkadaş" : u.relation === "outgoing" ? "İstek gönderildi" : "Size istek gönderdi" });
              return h("div", { class: "fr-row" }, av(u), h("div", { class: "fr-t" }, h("b", { "data-notr": "", text: nm(u) }), h("small", { text: u.level.name })), b);
            }) : h("p", { class: "hint", text: "Kullanıcı bulunamadı." }));
          }, function (er) { AVF.mount(res, h("p", { class: "note err", text: AVF.errText(er) })); });
        }, 300);
      });
      var sections = [];
      if (data.incoming.length) sections.push(h("div", { class: "fr-sec" }, h("h4", null, AVF.icon("userplus"), h("span", { text: "Gelen istekler" }), h("span", { class: "badge", text: String(data.incoming.length) })), data.incoming.map(function (u) {
        return h("div", { class: "fr-row" }, av(u), h("div", { class: "fr-t" }, h("b", { "data-notr": "", text: nm(u) }), h("small", { text: u.level.name })),
          h("button", { class: "btn sm", type: "button", onclick: function () { act("POST", "/friends/" + u.id + "/accept", "Arkadaşlık isteği kabul edildi."); } }, AVF.icon("check", "bico"), "Kabul et"),
          h("button", { class: "ibtn sm", type: "button", "aria-label": AVF.t("Reddet"), title: AVF.t("Reddet"), onclick: function () { act("DELETE", "/friends/" + u.id, "İstek reddedildi."); } }, AVF.icon("x")));
      })));
      sections.push(h("div", { class: "fr-sec" }, h("h4", null, AVF.icon("users"), h("span", { text: "Arkadaşlarım" }), h("small", { "data-notr": "", text: String(data.friends.length) })),
        data.friends.length ? data.friends.map(function (u) {
          var a = h("a", { class: "fr-row link" + (u.id === peerId ? " on" : ""), href: "/panel/arkadaslar/" + u.id, onclick: function (e) { e.preventDefault(); go("/panel/arkadaslar/" + u.id); } },
            av(u), h("div", { class: "fr-t" }, h("b", { "data-notr": "", text: nm(u) }), h("small", { text: u.lastAt ? AVF.fmtDateTime(u.lastAt) : u.level.name })), u.unread ? h("span", { class: "badge", text: String(u.unread) }) : null);
          return a;
        }) : h("p", { class: "hint", text: "Henüz arkadaşınız yok. Kullanıcı adıyla arayıp istek gönderebilirsiniz." })));
      if (data.outgoing.length) sections.push(h("div", { class: "fr-sec" }, h("h4", null, AVF.icon("send"), h("span", { text: "Gönderilen istekler" })), data.outgoing.map(function (u) {
        return h("div", { class: "fr-row" }, av(u), h("div", { class: "fr-t" }, h("b", { "data-notr": "", text: nm(u) }), h("small", { text: "Yanıt bekleniyor" })),
          h("button", { class: "btn ghost sm", type: "button", onclick: function () { act("DELETE", "/friends/" + u.id, "İstek geri çekildi."); } }, "Geri çek"));
      })));
      if (data.blocked.length) sections.push(h("div", { class: "fr-sec" }, h("h4", null, AVF.icon("lock"), h("span", { text: "Engellenenler" })), data.blocked.map(function (u) {
        return h("div", { class: "fr-row" }, av(u), h("div", { class: "fr-t" }, h("b", { "data-notr": "", text: nm(u) })),
          h("button", { class: "btn ghost sm", type: "button", onclick: function () { act("DELETE", "/friends/" + u.id, "Engel kaldırıldı."); } }, "Engeli kaldır"));
      })));
      AVF.mount(listCol, h("div", { class: "card fr-search" }, h("label", { class: "fr-sl" }, AVF.icon("users"), h("span", { text: "Arkadaş ekle" })), q, res),
        data.canMessage ? null : h("p", { class: "note" }, AVF.icon("lock", "bico"), h("span", { text: AVF.t("Özel mesajlaşma " + data.messagingLevel + " seviyesinde açılır.") }), " ", h("span", { text: "Arkadaş eklemeye şimdiden başlayabilirsiniz." })),
        h("div", { class: "card fr-secs" }, sections));
    }

    function chat(id) {
      var log = h("div", { class: "fr-log", role: "log", "aria-live": "polite" }), comp = h("div"), head = h("div", { class: "fr-ch" }), oldest = null, lastIds = "";
      var typing = h("div", { class: "fr-typing", hidden: "", "aria-live": "polite" }, h("span", { class: "fr-dots", "aria-hidden": "true" }, h("i"), h("i"), h("i")), h("span", { text: AVF.t("yazıyor…") })), typT = null;
      var pending = [];   // gönderilmekte olan / gönderilemeyen mesajlar (iyimser gösterim)
      AVF.mount(chatCol, head, log, typing, comp);
      // anlık: bu sohbetteki yeni mesaj, okundu ve yazıyor bilgisi
      if (AVF.live) {
        offs.push(AVF.live.on("dm", function (d) { if (chatCol.isConnected && (d.from === id || d.to === id)) { if (d.from === id) showTyping(false); load(true); } }));
        offs.push(AVF.live.on("read", function (d) { if (chatCol.isConnected && d.by === id) load(true); }));
        offs.push(AVF.live.on("typing", function (d) { if (chatCol.isConnected && d.from === id) showTyping(true); }));
      }
      function showTyping(on) { clearTimeout(typT); typing.hidden = !on; if (on) { var nb = log.scrollHeight - log.scrollTop - log.clientHeight < 80; if (nb) log.scrollTop = log.scrollHeight; typT = setTimeout(function () { typing.hidden = true; }, 4500); } }
      AVF.mount(log, AVF.skeleton(2));
      function paint(r, keepScroll) {
        AVF.mount(head, h("a", { class: "ibtn fr-back", href: "/panel/arkadaslar", "aria-label": AVF.t("Listeye dön"), onclick: function (e) { e.preventDefault(); go("/panel/arkadaslar"); } }, AVF.icon("back")),
          av(r.peer, "lg"), h("div", { class: "fr-t" }, h("b", { "data-notr": "", text: nm(r.peer) }), h("small", { text: r.peer.level.name })),
          h("details", { class: "fr-more" }, h("summary", { class: "ibtn", "aria-label": AVF.t("Diğer işlemler") }, AVF.icon("more")),
            h("div", { class: "fr-menu" },
              h("button", { type: "button", onclick: function () { AVF.confirmDialog({ icon: "users", title: "Arkadaşlıktan çıkarılsın mı?", text: "Sohbet geçmişi silinmez; yeniden arkadaş olursanız görünür.", confirm: "Çıkar", cancel: "Vazgeç" }).then(function (y) { if (y) AVF.api("DELETE", "/friends/" + id, {}).then(function () { go("/panel/arkadaslar"); }); }); } }, AVF.icon("x"), h("span", { text: "Arkadaşlıktan çıkar" })),
              h("button", { type: "button", class: "danger", onclick: function () { AVF.confirmDialog({ icon: "lock", danger: true, title: "Kullanıcı engellensin mi?", text: "Size istek ve mesaj gönderemez. Engeli dilediğiniz zaman kaldırabilirsiniz.", confirm: "Engelle", cancel: "Vazgeç" }).then(function (y) { if (y) AVF.api("POST", "/friends/" + id + "/block", {}).then(function () { AVF.toast(AVF.t("Kullanıcı engellendi.")); go("/panel/arkadaslar"); }); }); } }, AVF.icon("lock"), h("span", { text: "Engelle" })))));
        var prevDay = null, sc = log.scrollHeight - log.scrollTop;
        AVF.mount(log, r.messages.length ? r.messages.map(function (m) {
          var dk = dayKey(m.at), sep = dk !== prevDay ? h("div", { class: "fr-day", text: AVF.fmtDate(m.at) }) : null; prevDay = dk;
          var bubble = h("div", { class: "fr-m" + (m.mine ? " me" : "") + (m.removed ? " rm" : "") },
            m.removed ? h("i", { text: "Bu mesaj moderasyon tarafından kaldırıldı." }) : [m.imageId ? h("a", { href: "/api/dm-media/" + m.imageId, target: "_blank", rel: "noopener" }, h("img", { class: "fr-img", src: "/api/dm-media/" + m.imageId, alt: AVF.t("Görsel"), loading: "lazy" })) : null, m.body ? h("p", { "data-notr": "", text: m.body }) : null],
            h("small", null, hm(m.at), m.mine ? h("span", { class: "rd", title: AVF.t(m.read ? "Okundu" : "Gönderildi"), "aria-label": AVF.t(m.read ? "Okundu" : "Gönderildi") }, AVF.icon(m.read ? "checks" : "check")) : null),
            h("div", { class: "fr-mact" },
              !m.mine && !m.removed ? h("button", { type: "button", title: AVF.t("Şikâyet et"), "aria-label": AVF.t("Şikâyet et"), onclick: function () { report(m); } }, AVF.icon("flag")) : null,
              h("button", { type: "button", title: AVF.t("Benden sil"), "aria-label": AVF.t("Benden sil"), onclick: function () { AVF.api("DELETE", "/messages/m/" + m.id, {}).then(function () { load(true); }); } }, AVF.icon("trash"))));
          return [sep, bubble];
        }) : (pending.length ? null : h("div", { class: "fr-empty sm" }, h("span", { class: "fr-eic" }, AVF.icon("chat")), h("small", { text: "Henüz mesaj yok. İlk mesajı sen gönder. 👋" }))));
        pending.forEach(function (pm) { log.appendChild(pendingBubble(pm)); });
        if (keepScroll) log.scrollTop = log.scrollHeight - sc; else log.scrollTop = log.scrollHeight;
        if (!comp.firstChild) composer(r);
      }
      function pendingBubble(pm) {
        return h("div", { class: "fr-m me pend" + (pm.failed ? " fail" : "") }, h("p", { "data-notr": "", text: pm.body }),
          h("small", null, pm.failed ? [AVF.icon("alert"), h("span", { text: AVF.t("Gönderilemedi") }), h("button", { type: "button", class: "fr-retry", onclick: function () { pm.failed = false; sendText(pm); } }, AVF.t("Tekrar dene")),
            h("button", { type: "button", class: "fr-retry", onclick: function () { pending = pending.filter(function (x) { return x !== pm; }); repaintPending(); } }, AVF.t("Sil"))]
            : [h("span", { text: AVF.t("Gönderiliyor") }), h("span", { class: "rd", "aria-label": AVF.t("Gönderiliyor") }, AVF.icon("clock"))]));
      }
      function repaintPending() { Array.prototype.forEach.call(log.querySelectorAll(".fr-m.pend"), function (n) { n.remove(); }); pending.forEach(function (pm) { log.appendChild(pendingBubble(pm)); }); log.scrollTop = log.scrollHeight; }
      // iyimser gönderim: mesaj anında baloncuk olarak görünür; sunucu onaylayınca gerçek mesajla değişir, hata olursa "Tekrar dene"
      function sendText(pm) {
        if (pending.indexOf(pm) < 0) pending.push(pm);
        repaintPending();
        AVF.api("POST", "/messages/" + id, { body: pm.body }).then(function () { pending = pending.filter(function (x) { return x !== pm; }); load(); },
          function (er) { pm.failed = true; repaintPending(); AVF.toast(AVF.errText(er)); });
      }
      function composer(r) {
        if (!r.canMessage) return AVF.mount(comp, h("p", { class: "note fr-lock" }, AVF.icon("lock", "bico"), h("span", { text: r.meCanMessage ? AVF.t("Bu kullanıcı henüz mesaj alabilecek seviyede değil.") : AVF.t("Özel mesajlaşma " + r.messagingLevel + " seviyesinde açılır.") })));
        var ta = h("textarea", { class: "inp", rows: "1", maxlength: "2000", placeholder: AVF.t("Mesaj yazın…"), "aria-label": AVF.t("Mesaj") });
        var pick = h("input", { type: "file", accept: ".png,.jpg,.jpeg,.gif,image/png,image/jpeg,image/gif", hidden: "", tabindex: "-1" });
        var send = h("button", { class: "btn fr-send", type: "submit", "aria-label": AVF.t("Gönder") }, AVF.icon("send"));
        function grow() { ta.style.height = "auto"; ta.style.height = Math.min(140, ta.scrollHeight) + "px"; }
        var lastTyping = 0;
        ta.addEventListener("input", function () {
          grow();
          // "yazıyor…" işareti: en çok 2,5 sn'de bir
          if (ta.value.trim() && Date.now() - lastTyping > 2500) { lastTyping = Date.now(); AVF.api("POST", "/messages/" + id + "/typing", {}).then(null, function () {}); }
        });
        ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { cancelable: true })); } });
        pick.addEventListener("change", function () {
          var f = pick.files && pick.files[0]; pick.value = ""; if (!f) return;
          if (["image/png", "image/jpeg", "image/gif"].indexOf(f.type) < 0) return AVF.toast(AVF.t("Yalnız PNG, JPG veya GIF gönderilebilir."));
          if (f.size > 4 * 1024 * 1024) return AVF.toast(AVF.t("Görsel en fazla 4 MB olabilir."));
          var hd = { "Content-Type": "application/octet-stream", Accept: "application/json", "x-avf-lang": AVF.lang || "tr" }, c = AVF.cookie("avf_csrf"); if (c) hd["x-csrf-token"] = c;
          AVF.busy(send, true, "");
          fetch("/api/messages/" + id + "/image", { method: "POST", credentials: "same-origin", headers: hd, body: f }).then(function (rs) { return rs.json().then(function (d) { if (!rs.ok) throw { status: rs.status, data: d }; return d; }); })
            .then(function () { AVF.busy(send, false); load(); }, function (er) { AVF.busy(send, false); AVF.toast(AVF.errText(er)); });
        });
        var form = h("form", { class: "fr-comp", novalidate: true, onsubmit: function (e) {
          e.preventDefault(); var v = ta.value.trim(); if (!v) return;
          if (v.length > 2000) return AVF.toast(AVF.t("Mesaj en fazla 2000 karakter olabilir."));
          ta.value = ""; grow(); ta.focus(); lastTyping = 0;
          sendText({ body: v });
        } }, h("button", { class: "ibtn", type: "button", "aria-label": AVF.t("Görsel gönder"), title: AVF.t("Görsel gönder"), onclick: function () { pick.click(); } }, AVF.icon("image")), AVF.emojiPicker ? AVF.emojiPicker(ta) : null, ta, pick, send);
        AVF.mount(comp, form);
      }
      function report(m) {
        var sel = h("select", { class: "inp", "aria-label": AVF.t("Şikâyet nedeni") }, h("option", { value: "", text: AVF.t("Neden seçin…") }), REASONS.map(function (r) { return h("option", { value: r[0], text: AVF.t(r[1]) }); }));
        var note = AVF.input("text", { maxlength: "300", placeholder: AVF.t("Açıklama (isteğe bağlı)") });
        var ov = h("div", { class: "modal-o", role: "dialog", "aria-modal": "true" }), eb = h("div");
        function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
        AVF.mount(ov, h("div", { class: "card modal" }, h("h3", null, AVF.icon("flag", "bico"), h("span", { text: "Mesajı şikâyet et" })), h("p", { class: "hint", text: "Şikâyetiniz yalnız yetkili ekip tarafından incelenir; karşı tarafa bildirilmez." }), sel, note, eb,
          h("div", { class: "row" }, h("button", { class: "btn", type: "button", onclick: function () {
            if (!sel.value) return AVF.mount(eb, h("p", { class: "note err", text: AVF.t("Şikâyet nedeni seçin.") }));
            AVF.api("POST", "/messages/m/" + m.id + "/report", { reason: sel.value, note: note.value }).then(function () { close(); AVF.toast(AVF.t("Şikâyetiniz alındı. Teşekkür ederiz.")); }, function (er) { AVF.mount(eb, h("p", { class: "note err", text: AVF.errText(er) })); });
          } }, "Şikâyet et"), h("button", { class: "btn ghost", type: "button", onclick: close }, "Vazgeç"))));
        ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
        document.body.appendChild(ov); sel.focus();
      }
      function load(keep) {
        clearTimeout(pollT);
        AVF.api("GET", "/messages/" + id).then(function (r) {
          if (!chatCol.isConnected) return;
          var ids = r.messages.map(function (m) { return m.id + (m.read ? "r" : ""); }).join(",");
          if (ids !== lastIds || !head.firstChild) { var atBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 60; paint(r, keep || !atBottom && lastIds); lastIds = ids; }
          if (AVF.refreshUnread) AVF.refreshUnread();
          // yedek yoklama: anlık bağlantı varken 30 sn, yokken 8 sn
          var every = AVF.live && AVF.live.connected() ? 30000 : 8000;
          pollT = setTimeout(function poll() { if (!chatCol.isConnected) return; if (!document.hidden) load(true); else pollT = setTimeout(poll, every); }, every);
        }, function (e) {
          AVF.mount(head, h("a", { class: "ibtn fr-back", href: "/panel/arkadaslar", onclick: function (ev) { ev.preventDefault(); go("/panel/arkadaslar"); } }, AVF.icon("back")));
          AVF.mount(log, AVF.state("lock", "Sohbet açılamadı", AVF.errText(e)));
        });
      }
      load();
    }
  };
})();
