/* AlpveFit — canlı destek penceresi (mantar maskotlu) ve üye panelindeki destek talepleri (ticket).
   Akış Alpeptit canlı desteğiyle aynıdır: çevrimiçi/çevrimdışı durum, misafir (ad + e-posta) veya üye ile görüşme, çevrimdışı mesaj,
   kapanan görüşme ve yeni görüşme. Mesajlar yalnız textContent ile yazılır. Misafir anahtarı yalnız bu tarayıcıda (localStorage) tutulur. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var KEY = "avf_chat_v1", MAXLEN = 1444;

  function lsGet() { try { var r = JSON.parse(localStorage.getItem(KEY) || "null"); return r && r.id ? r : null; } catch (e) { return null; } }
  function lsSet(r) { try { if (r) localStorage.setItem(KEY, JSON.stringify(r)); else localStorage.removeItem(KEY); } catch (e) { /* yok say */ } }
  function hdr(ref) { return ref && ref.token ? { "X-Chat-Token": ref.token } : null; }
  function pad(n) { return String(n).padStart(2, "0") + ":00"; }
  function tm(iso) { try { return new Date(iso).toLocaleTimeString(AVF.locale ? AVF.locale() : "tr-TR", { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } }

  var st = { open: false, status: { online: false, hours: { open: 9, close: 22 } }, ref: null, chat: null, timer: null, statusTimer: null, offSent: false, busy: false };
  var launcher, panel, bodyEl, pip;

  function avatar(cls) { return h("span", { class: "chat-av" + (cls ? " " + cls : "") }, AVF.mascotMini()); }
  function statusLine() {
    var on = st.status.online, hrs = pad(st.status.hours.open) + "–" + pad(st.status.hours.close);
    return h("span", { class: "chat-st" + (on ? " on" : "") }, h("i", { "aria-hidden": "true" }), h("span", { text: on ? "Çevrimiçi" : "Çevrimdışı" }), h("span", { class: "hrs", "data-notr": "", text: " · " + hrs }));
  }
  function loadStatus() {
    return AVF.api("GET", "/live-chat/status").then(function (s) { st.status = s; paintPip(); return s; }, function () { return st.status; });
  }
  function paintPip() { if (pip) pip.className = "pip" + (st.status.online ? " on" : ""); }

  function build() {
    pip = h("span", { class: "pip", "aria-hidden": "true" });
    launcher = h("button", { class: "chat-launch", type: "button", "aria-label": "Canlı desteği aç", "aria-expanded": "false", onclick: function () { st.open ? close() : open(); } },
      h("span", { class: "chat-launch-av" }, AVF.mascotMini(), pip), h("span", { class: "lbl", text: "Canlı Destek" }));
    bodyEl = h("div", { class: "chat-body" });
    panel = h("div", { class: "chat-panel", role: "dialog", "aria-modal": "false", "aria-labelledby": "chat-title", hidden: true },
      h("div", { class: "chat-head" }, avatar("lg"),
        h("div", { class: "chat-ttl" }, h("b", { id: "chat-title", text: "Canlı Destek" }), h("span", { class: "sub", text: "AlpveFit destek ekibi" }), h("span", { class: "stslot" })),
        h("button", { class: "chat-x", type: "button", "aria-label": "Canlı desteği kapat", onclick: close }, AVF.icon("x"))),
      bodyEl);
    document.body.appendChild(panel); document.body.appendChild(launcher);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && st.open) close(); });
  }
  function paintHead() { var slot = panel.querySelector(".stslot"); AVF.mount(slot, statusLine()); }

  function open() {
    st.open = true; panel.hidden = false; launcher.setAttribute("aria-expanded", "true"); document.body.classList.add("chat-open");
    requestAnimationFrame(function () { panel.classList.add("in"); });
    loadStatus().then(function () { paintHead(); render(); if (st.ref) sync(); });
    paintHead(); render(); tick(true);
  }
  function close() {
    st.open = false; panel.classList.remove("in"); launcher.setAttribute("aria-expanded", "false"); document.body.classList.remove("chat-open");
    setTimeout(function () { if (!st.open) panel.hidden = true; }, 220); tick(false);
    try { launcher.focus(); } catch (e) { /* yok say */ }
  }
  function tick(on) {
    clearTimeout(st.timer); st.timer = null;
    if (!on) return;
    var run = function () { if (!st.open) return; if (!document.hidden && st.ref) sync(); st.timer = setTimeout(run, 4000); };
    st.timer = setTimeout(run, 4000);
  }

  function sync() {
    var ref = st.ref; if (!ref) return Promise.resolve();
    return AVF.api("GET", "/live-chat/" + ref.id + "/messages", undefined, hdr(ref)).then(function (d) {
      if (st.ref !== ref) return;
      var key = d.messages.length + ":" + d.status, changed = !st.chat || st.chat.key !== key;
      st.chat = { status: d.status, messages: d.messages, key: key };
      if (changed && st.open) render();
    }, function (e) {
      if (e && e.status === 404) { st.ref = null; st.chat = null; lsSet(null); if (st.open) render(); }
    });
  }

  function render() {
    if (!bodyEl) return;
    var u = AVF.session.user;
    if (st.ref && st.chat && st.chat.status === "closed") return AVF.mount(bodyEl, closedView());
    if (st.ref) return AVF.mount(bodyEl, convView());
    if (!st.status.online) return AVF.mount(bodyEl, offlineView(u));
    if (u) return AVF.mount(bodyEl, startMemberView());
    AVF.mount(bodyEl, guestView());
  }
  function bubble(text) { return h("div", { class: "chat-hello" }, avatar(), h("div", { class: "msg theirs" }, h("div", { class: "bub", text: text }))); }
  function errBox() { return h("p", { class: "chat-err", role: "alert" }); }
  function showErr(box, e) { box.textContent = typeof e === "string" ? e : AVF.errText(e); box.classList.add("shake"); setTimeout(function () { box.classList.remove("shake"); }, 400); }

  function startMemberView() {
    var btn = h("button", { class: "btn block", type: "button" }, AVF.icon("chat", "bico"), "Görüşmeyi başlat"), err = errBox();
    btn.addEventListener("click", function () { start({}, btn, err); });
    return h("div", { class: "chat-pad" }, bubble("Merhaba! Üye hesabınızla bağlanabilirsiniz. Görüşmeyi başlatın, destek ekibimiz yanıtlasın."), err, btn);
  }
  function guestView() {
    var name = AVF.input("text", { placeholder: "Adınız", autocomplete: "name", maxlength: "60" });
    var mail = AVF.input("email", { placeholder: "ornek@mail.com", autocomplete: "email", maxlength: "254" });
    var err = errBox(), btn = h("button", { class: "btn block", type: "submit" }, AVF.icon("chat", "bico"), "Görüşmeyi başlat");
    var form = h("form", { class: "chat-pad", novalidate: true, onsubmit: function (e) { e.preventDefault(); start({ name: name.value.trim().replace(/\s+/g, " "), email: mail.value.trim().toLowerCase() }, btn, err); } },
      bubble("Merhaba! Canlı desteğe bağlanmak için adınızı ve e-posta adresinizi girin."),
      AVF.field("Adınız", name, { icon: "id" }), AVF.field("E-posta adresi", mail, { icon: "mail" }), err, btn,
      h("p", { class: "chat-fine" }, "Bilgileriniz yalnızca bu görüşme için kullanılır. ", h("a", { href: "/yasal/kvkk", "data-link": "" }, "KVKK Aydınlatma Metni"),
        " · ", h("a", { href: "#", onclick: function (e) { e.preventDefault(); close(); AVF.auth.open("login"); } }, "Üye girişi")));
    return form;
  }
  function start(body, btn, err) {
    if (st.busy) return; st.busy = true; AVF.busy(btn, true);
    AVF.api("POST", "/live-chat/start", body).then(function (d) {
      st.busy = false; AVF.busy(btn, false);
      st.ref = { id: d.chatId, member: !!d.member, token: d.guestToken || null }; lsSet(st.ref);
      st.chat = { status: "open", messages: [], key: "0:open" }; render(); sync();
    }, function (e) {
      st.busy = false; AVF.busy(btn, false);
      if (e && e.data && e.data.code === "SUPPORT_OFFLINE") { st.status.online = false; paintPip(); paintHead(); return render(); }
      showErr(err, e);
    });
  }
  function convView() {
    var msgs = (st.chat && st.chat.messages) || [];
    var list = h("div", { class: "chat-list", "aria-live": "polite" });
    if (!msgs.length) list.appendChild(bubble(st.ref.member ? "Merhaba! Üye hesabınızla bağlandınız. Mesajınızı yazın, destek ekibimiz yanıtlayacaktır." : "Merhaba! Size nasıl yardımcı olabiliriz? Mesajınızı yazın, destek ekibimiz yanıtlayacaktır."));
    var last = null;
    msgs.forEach(function (m) {
      var mine = m.sender === "visitor", showAgent = !mine && m.agent_name !== last; if (!mine) last = m.agent_name;
      list.appendChild(h("div", { class: "msg" + (mine ? " mine" : " theirs") }, mine ? null : avatar(),
        h("div", { class: "bub-w" }, showAgent ? h("span", { class: "agent", "data-notr": "", text: m.agent_name }) : null, h("div", { class: "bub", "data-notr": "", text: m.body }), h("span", { class: "t", text: tm(m.created_at) }))));
    });
    var ta = h("textarea", { class: "inp", rows: "2", maxlength: String(MAXLEN), placeholder: "Mesajınızı yazın…", "aria-label": "Canlı destek mesajı" });
    var cnt = h("span", { class: "cnt", text: "0 / " + MAXLEN }), err = h("span", { class: "chat-err", role: "alert" });
    var send = h("button", { class: "chat-send", type: "submit", "aria-label": "Mesajı gönder" }, AVF.icon("send"));
    ta.addEventListener("input", function () { cnt.textContent = ta.value.length + " / " + MAXLEN; });
    ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit")); } });
    var form = h("form", { class: "chat-comp", novalidate: true, onsubmit: function (e) {
      e.preventDefault(); var v = ta.value.trim(); if (!v || st.busy) return;
      st.busy = true; send.disabled = true; err.textContent = "";
      AVF.api("POST", "/live-chat/" + st.ref.id + "/messages", { message: v }, hdr(st.ref)).then(function () {
        st.busy = false; ta.value = ""; return sync().then(function () { var t2 = bodyEl.querySelector("textarea"); if (t2) t2.focus(); });
      }, function (e2) { st.busy = false; send.disabled = false; err.textContent = AVF.errText(e2); if (e2 && e2.status === 409) sync(); });
    } }, h("div", { class: "row-in" }, ta, send), h("div", { class: "foot" }, err, cnt));
    var wrap = h("div", { class: "chat-conv" }, list, form);
    requestAnimationFrame(function () { list.scrollTop = list.scrollHeight; });
    return wrap;
  }
  function closedView() {
    var b = h("button", { class: "btn ghost block", type: "button", onclick: function () { st.ref = null; st.chat = null; lsSet(null); render(); } }, AVF.icon("plus", "bico"), "Yeni görüşme");
    return h("div", { class: "chat-pad center" }, h("span", { class: "tile ok" }, AVF.icon("check")), h("b", { text: "Bu görüşme kapatıldı." }), h("p", { class: "muted", text: "Yeni bir görüşme başlatabilir veya panelinizden destek talebi oluşturabilirsiniz." }), b);
  }
  function offlineView(u) {
    if (st.offSent) return h("div", { class: "chat-pad center" }, h("span", { class: "tile ok" }, AVF.icon("check")), h("b", { text: "Mesajınız alındı" }),
      h("p", { class: "muted", text: "Destek ekibimiz çalışma saatleri içinde e-posta ile dönüş yapacak." }), h("button", { class: "btn ghost block", type: "button", onclick: close }, "Kapat"));
    var name = u ? null : AVF.input("text", { placeholder: "Adınız", autocomplete: "name", maxlength: "60" });
    var mail = u ? null : AVF.input("email", { placeholder: "ornek@mail.com", autocomplete: "email", maxlength: "254" });
    var ta = h("textarea", { class: "inp", rows: "4", maxlength: String(MAXLEN), placeholder: "Size nasıl yardımcı olabiliriz?" });
    var err = errBox(), btn = h("button", { class: "btn block", type: "submit" }, AVF.icon("send", "bico"), "Mesajı gönder");
    return h("form", { class: "chat-pad", novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      var body = { message: ta.value.trim() }; if (!u) { body.name = name.value.trim().replace(/\s+/g, " "); body.email = mail.value.trim().toLowerCase(); }
      AVF.busy(btn, true);
      AVF.api("POST", "/live-chat/offline-message", body).then(function () { AVF.busy(btn, false); st.offSent = true; render(); }, function (e2) { AVF.busy(btn, false); showErr(err, e2); });
    } },
      h("div", { class: "chat-off" }, AVF.icon("clock"), h("div", {}, h("b", { text: "Şu anda çevrimdışıyız" }), h("span", { text: "Mesajınızı bırakın; en kısa sürede e-posta ile dönüş yapalım." }))),
      u ? h("p", { class: "chat-fine", text: "Yanıtımız üye hesabınızın e-posta adresine gönderilecek." }) : [AVF.field("Adınız", name, { icon: "id" }), AVF.field("E-posta adresi", mail, { icon: "mail" })],
      AVF.field("Mesajınız", ta, { icon: "chat" }), err, btn);
  }

  AVF.chat = {
    init: function () {
      if (panel) return;
      build(); st.ref = lsGet(); loadStatus().then(paintHead);
      st.statusTimer = setInterval(function () { if (!document.hidden) loadStatus().then(function () { if (st.open) { paintHead(); if (!st.ref) render(); } }); }, 60000);
      AVF.onLangChange = AVF.onLangChange || [];
      AVF.onLangChange.push(function () { if (panel) { paintHead(); render(); } });
    },
    open: function () { if (!panel) AVF.chat.init(); open(); },
    // Oturum açılınca/kapanınca: misafir görüşmesi üyeye, üye görüşmesi misafire taşınmaz (erişim kuralı sunucuda da aynıdır).
    sessionChanged: function () {
      var u = AVF.session.user;
      if (st.ref && ((u && !st.ref.member) || (!u && st.ref.member))) { st.ref = null; st.chat = null; lsSet(null); }
      if (st.open) render();
    },
  };

  // ---------- üye paneli: destek talepleri ----------
  var TSTATUS = { open: ["Yanıt bekleniyor", "chip"], answered: ["Yanıtlandı", "chip dk"], closed: ["Kapatıldı", "chip mute"] };
  function tchip(s) { var m = TSTATUS[s] || [s, "chip"]; return h("span", { class: m[1], text: m[0] }); }
  function plink(href, kids, attrs) { attrs = attrs || {}; attrs.href = href; attrs["data-link"] = ""; return h("a", attrs, kids); }
  AVF.ticketsView = function (el, sub) {
    if (sub === "yeni") return newTicket(el);
    if (sub) return ticketDetail(el, sub);
    AVF.mount(el, h("div", { class: "row between", style: "margin-bottom:18px" }, h("h2", { class: "ptitle", style: "margin:0", text: "Destek Taleplerim" }), plink("/panel/destek/yeni", "Yeni talep oluştur", { class: "btn sm" })));
    var list = h("div", { class: "stack" }, AVF.skeleton(2)); el.appendChild(list);
    AVF.api("GET", "/tickets").then(function (rows) {
      if (!rows.length) return AVF.mount(list, AVF.state("ticket", "Henüz destek talebiniz yok", "Sorularınız için yeni bir destek talebi oluşturabilir veya canlı destekten bize yazabilirsiniz.", plink("/panel/destek/yeni", "Yeni talep oluştur", { class: "btn" })));
      AVF.mount(list, rows.map(function (t) {
        return plink("/panel/destek/" + t.id, [h("span", { class: "tile" }, AVF.icon("ticket")), h("span", { class: "t" }, h("b", { "data-notr": "", text: t.title }), h("small", {}, t.ticket_number + " · " + t.subject + " · " + AVF.fmtDateTime(t.updated_at))), tchip(t.status), AVF.icon("chev", "chev")], { class: "card ordrow" });
      }));
    }, function (e) { AVF.mount(list, AVF.state("alert", "Destek talepleri yüklenemedi", AVF.errText(e))); });
  };
  function newTicket(el) {
    var title = AVF.input("text", { maxlength: "144", placeholder: "Kısaca konu başlığı" });
    var subj = h("select", { class: "inp", id: "tsubj" });
    var msg = h("textarea", { class: "inp", id: "tmsg", rows: "6", maxlength: String(MAXLEN), placeholder: "Talebinizi ayrıntılı olarak yazın…" });
    var err = h("p", { class: "err", role: "alert" }), btn = h("button", { class: "btn", type: "submit" }, "Talebi gönder");
    AVF.mount(el, h("div", { class: "row between", style: "margin-bottom:18px" }, h("h2", { class: "ptitle", style: "margin:0", text: "Yeni destek talebi" }), plink("/panel/destek", "Taleplerime dön", { class: "btn ghost sm" })),
      h("form", { class: "card", style: "padding:22px", novalidate: true, onsubmit: function (e) {
        e.preventDefault(); err.textContent = ""; AVF.busy(btn, true);
        AVF.api("POST", "/tickets", { title: title.value.trim(), subject: subj.value, message: msg.value.trim() }).then(function (t) { AVF.toast("Destek talebiniz oluşturuldu."); AVF.go("/panel/destek/" + t.id); },
          function (e2) { AVF.busy(btn, false); err.textContent = AVF.errText(e2); });
      } }, AVF.field("Başlık", title, { icon: "file" }), AVF.field("Konu", subj, { icon: "list" }), AVF.field("Mesajınız", msg, { icon: "chat", hint: "En fazla " + MAXLEN + " karakter." }), err, btn));
    AVF.api("GET", "/tickets/subjects").then(function (list) { AVF.mount(subj, list.map(function (s) { return h("option", { value: s, text: s }); })); }, function () {});
  }
  function ticketDetail(el, id) {
    AVF.mount(el, h("h2", { class: "ptitle", text: "Destek talebi" }), AVF.skeleton(2));
    AVF.api("GET", "/tickets/" + encodeURIComponent(id)).then(function (t) {
      var thread = h("div", { class: "tthread" }, t.messages.map(function (m) {
        var mine = m.from_role === "user";
        return h("div", { class: "msg" + (mine ? " mine" : " theirs") }, mine ? null : avatar(), h("div", { class: "bub-w" }, mine ? null : h("span", { class: "agent", "data-notr": "", text: "AlpveFit Destek" }), h("div", { class: "bub", "data-notr": "", text: m.body }), h("span", { class: "t", text: AVF.fmtDateTime(m.created_at) })));
      }));
      var reply = null;
      if (t.status !== "closed") {
        var ta = h("textarea", { class: "inp", rows: "3", maxlength: String(MAXLEN), placeholder: "Yanıtınızı yazın…", "aria-label": "Yanıtınız" }), err = h("p", { class: "err", role: "alert" });
        var sb = h("button", { class: "btn", type: "submit" }, "Gönder"), rb = h("button", { class: "btn ghost", type: "button" }, AVF.icon("check", "bico"), "Çözüldü olarak kapat");
        rb.addEventListener("click", function () { AVF.busy(rb, true); AVF.api("POST", "/tickets/" + t.id + "/resolve", {}).then(function () { ticketDetail(el, id); }, function (e) { AVF.busy(rb, false); err.textContent = AVF.errText(e); }); });
        reply = h("form", { class: "card", style: "padding:18px", novalidate: true, onsubmit: function (e) {
          e.preventDefault(); err.textContent = ""; AVF.busy(sb, true);
          AVF.api("POST", "/tickets/" + t.id + "/messages", { message: ta.value.trim() }).then(function () { ticketDetail(el, id); }, function (e2) { AVF.busy(sb, false); err.textContent = AVF.errText(e2); });
        } }, ta, err, h("div", { class: "row", style: "margin-top:10px" }, sb, rb));
      }
      AVF.mount(el, h("div", { class: "row between", style: "margin-bottom:14px;gap:10px;flex-wrap:wrap" }, h("h2", { class: "ptitle", style: "margin:0", "data-notr": "", text: t.title }), tchip(t.status)),
        h("p", { class: "muted", style: "margin:0 0 16px" }, t.ticket_number + " · " + t.subject + " · " + AVF.fmtDateTime(t.created_at)),
        h("div", { class: "card", style: "padding:18px;margin-bottom:14px" }, thread),
        reply || h("div", { class: "note" }, "Bu destek talebi kapatıldı. Gerekirse yeni bir talep oluşturabilirsiniz."),
        h("div", { style: "margin-top:14px" }, plink("/panel/destek", "Taleplerime dön", { class: "btn ghost sm" })));
    }, function (e) { AVF.mount(el, h("h2", { class: "ptitle", text: "Destek talebi" }), AVF.state("alert", "Destek talebi bulunamadı", AVF.errText(e), plink("/panel/destek", "Taleplerime dön", { class: "btn" }))); });
  }
})();
