/* AlpveFit — üye panelindeki destek talepleri (ticket). Mesajlar yalnız textContent ile yazılır. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var MAXLEN = 1444;
  function avatar(cls) { return h("span", { class: "chat-av" + (cls ? " " + cls : "") }, AVF.mascotMini()); }

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
      if (!rows.length) return AVF.mount(list, AVF.state("ticket", "Henüz destek talebiniz yok", "Sorularınız için yeni bir destek talebi oluşturabilir veya destek@alpvefit.com adresine yazabilirsiniz.", plink("/panel/destek/yeni", "Yeni talep oluştur", { class: "btn" })));
      AVF.mount(list, rows.map(function (t) {
        return plink("/panel/destek/" + t.id, [h("span", { class: "tile" }, AVF.icon("ticket")), h("span", { class: "t" }, h("b", { "data-notr": "", text: t.title }), h("small", {}, t.ticket_number + " · " + t.subject + " · " + AVF.fmtDateTime(t.updated_at))), tchip(t.status), AVF.icon("chev", "chev")], { class: "card ordrow" });
      }));
    }, function (e) { AVF.mount(list, AVF.state("alert", "Destek talepleri yüklenemedi", AVF.errText(e))); });
  };
  var SUBJ_ICON = { "Hesap ve Güvenlik Ayarları": "shield", "Teknik Sorunlar": "wrench", "Ödeme Sorunları": "card", "Plan ve Programım": "list", "Revizasyon Ayı": "calendar", "Diğer": "help" };
  function newTicket(el) {
    var D = AVF.draft("ticket_new"), d = D.get() || {};
    var title = AVF.input("text", { maxlength: "244", placeholder: "Talebinizi kısaca özetleyin" });
    var tcnt = h("span", { class: "cnt", text: "0/244" });
    var msg = h("textarea", { class: "inp", id: "tmsg", rows: "6", maxlength: String(MAXLEN), placeholder: "Talebinizi ayrıntılı olarak yazın…" });
    var mcnt = h("span", { class: "cnt", text: "0/" + MAXLEN });
    var subjBox = h("div", { class: "field" }, h("label", null, h("span", { class: "tile" }, AVF.icon("list")), "Konu", h("span", { class: "req", text: "Zorunlu" })), AVF.skeleton(1)), subj = null;
    var files = AVF.fileBox({ scope: "ticket", files: d.files || [], onChange: function () { save(); } });
    function counts() { tcnt.textContent = title.value.length + "/244"; mcnt.textContent = msg.value.length + "/" + MAXLEN; mcnt.classList.toggle("near", msg.value.length > MAXLEN - 100); }
    function save() { if (!title || !files) return; D.set({ title: title.value, message: msg.value, subject: subj ? subj.get() : d.subject || "", files: files.list() }); }
    title.value = d.title || ""; msg.value = d.message || ""; counts();
    title.addEventListener("input", function () { counts(); save(); }); msg.addEventListener("input", function () { counts(); save(); });
    var err = h("p", { class: "err", role: "alert" }), btn = h("button", { class: "btn", type: "submit" }, AVF.icon("send", "bico"), "Talebi gönder");
    var restored = d.title || d.message || (d.files && d.files.length) ? h("div", { class: "note draftnote" }, AVF.icon("refresh", "ico"), h("span", { text: "Kaydedilmemiş talebiniz geri yüklendi." })) : null;
    AVF.mount(el, h("div", { class: "row between", style: "margin-bottom:18px" }, h("h2", { class: "ptitle", style: "margin:0", text: "Yeni destek talebi" }), plink("/panel/destek", "Taleplerime dön", { class: "btn ghost sm" })),
      restored,
      h("form", { class: "card tform", style: "padding:22px", novalidate: true, onsubmit: function (e) {
        e.preventDefault(); err.textContent = "";
        if (title.value.trim().length < 3) { err.textContent = "Lütfen en az 3 karakterlik bir başlık girin."; return title.focus(); }
        if (!subj || !subj.get()) { err.textContent = "Lütfen bir konu seçin."; return; }
        if (!msg.value.trim()) { err.textContent = "Mesaj zorunludur."; return msg.focus(); }
        if (files.busy()) { err.textContent = "Dosyalar yükleniyor; lütfen yükleme bitince gönderin."; return; }
        AVF.busy(btn, true);
        AVF.api("POST", "/tickets", { title: title.value.trim(), subject: subj.get(), message: msg.value.trim(), attachments: files.ids() }).then(function (t) { D.clear(); AVF.toast("Destek talebiniz oluşturuldu."); AVF.go("/panel/destek/" + t.id); },
          function (e2) { AVF.busy(btn, false); err.textContent = AVF.errText(e2); });
      } }, h("div", { class: "field" }, h("label", { for: title.id }, h("span", { class: "tile" }, AVF.icon("file")), "Başlık", h("span", { class: "req", text: "Zorunlu" })), title, h("div", { class: "row between" }, h("span"), tcnt)),
        subjBox,
        h("div", { class: "field" }, h("label", { for: "tmsg" }, h("span", { class: "tile" }, AVF.icon("chat")), "Mesajınız", h("span", { class: "req", text: "Zorunlu" })), msg, h("div", { class: "row between" }, AVF.emojiPicker(msg), mcnt)),
        files, err, btn));
    AVF.api("GET", "/tickets/subjects").then(function (list) {
      subj = AVF.choice({ label: "Konu", cols: 3, value: d.subject && list.indexOf(d.subject) >= 0 ? d.subject : "", onChange: save, items: list.map(function (x) { return { value: x, label: x, icon: SUBJ_ICON[x] || "help" }; }) });
      AVF.mount(subjBox, subjBox.firstChild, subj);
    }, function () { AVF.mount(subjBox, subjBox.firstChild, h("p", { class: "err", text: "Konular yüklenemedi, sayfayı yenileyin." })); });
  }
  function attList(list) {
    if (!list || !list.length) return null;
    return h("div", { class: "batt" }, list.map(function (a) {
      var img = a.mime === "image/png" || a.mime === "image/jpeg" || a.mime === "image/gif";
      return h("a", { class: "batt-i" + (img ? " img" : ""), href: "/api/attachments/" + a.id, target: "_blank", rel: "noopener", title: a.filename },
        img ? h("img", { src: "/api/attachments/" + a.id, alt: "", loading: "lazy" }) : [AVF.icon("file"), h("span", { "data-notr": "", text: a.filename })]);
    }));
  }
  function ticketDetail(el, id) {
    AVF.mount(el, h("h2", { class: "ptitle", text: "Destek talebi" }), AVF.skeleton(2));
    AVF.api("GET", "/tickets/" + encodeURIComponent(id)).then(function (t) {
      var thread = h("div", { class: "tthread" }, t.messages.map(function (m) {
        var mine = m.from_role === "user";
        return h("div", { class: "msg" + (mine ? " mine" : " theirs") }, mine ? null : avatar(), h("div", { class: "bub-w" }, mine ? null : h("span", { class: "agent", "data-notr": "", text: "AlpveFit Destek" }), h("div", { class: "bub", "data-notr": "", text: m.body }), attList(m.attachments), h("span", { class: "t", text: AVF.fmtDateTime(m.created_at) })));
      }));
      var reply = null;
      if (t.status !== "closed") {
        var RD = AVF.draft("ticket_" + t.id), rd = RD.get() || {};
        var ta = h("textarea", { class: "inp", rows: "3", maxlength: String(MAXLEN), placeholder: "Yanıtınızı yazın…", "aria-label": "Yanıtınız" }), err = h("p", { class: "err", role: "alert" });
        ta.value = rd.message || "";
        var rfiles = AVF.fileBox({ scope: "ticket", files: rd.files || [], onChange: function () { if (ta) RD.set({ message: ta.value, files: rfiles ? rfiles.list() : [] }); } });
        ta.addEventListener("input", function () { RD.set({ message: ta.value, files: rfiles.list() }); });
        var sb = h("button", { class: "btn", type: "submit" }, "Gönder"), rb = h("button", { class: "btn ghost", type: "button" }, AVF.icon("check", "bico"), "Çözüldü olarak kapat");
        rb.addEventListener("click", function () { AVF.busy(rb, true); AVF.api("POST", "/tickets/" + t.id + "/resolve", {}).then(function () { ticketDetail(el, id); }, function (e) { AVF.busy(rb, false); err.textContent = AVF.errText(e); }); });
        reply = h("form", { class: "card", style: "padding:18px", novalidate: true, onsubmit: function (e) {
          e.preventDefault(); err.textContent = "";
          if (!ta.value.trim()) { err.textContent = "Mesaj boş olamaz."; return ta.focus(); }
          if (rfiles.busy()) { err.textContent = "Dosyalar yükleniyor; lütfen yükleme bitince gönderin."; return; }
          AVF.busy(sb, true);
          AVF.api("POST", "/tickets/" + t.id + "/messages", { message: ta.value.trim(), attachments: rfiles.ids() }).then(function () { RD.clear(); ticketDetail(el, id); }, function (e2) { AVF.busy(sb, false); err.textContent = AVF.errText(e2); });
        } }, ta, h("div", { class: "row between", style: "margin:6px 0" }, AVF.emojiPicker(ta), h("span")), rfiles, err, h("div", { class: "row", style: "margin-top:10px" }, sb, rb));
      }
      AVF.mount(el, h("div", { class: "row between", style: "margin-bottom:14px;gap:10px;flex-wrap:wrap" }, h("h2", { class: "ptitle", style: "margin:0", "data-notr": "", text: t.title }), tchip(t.status)),
        h("p", { class: "muted", style: "margin:0 0 16px" }, t.ticket_number + " · " + t.subject + " · " + AVF.fmtDateTime(t.created_at)),
        h("div", { class: "card", style: "padding:18px;margin-bottom:14px" }, thread),
        reply || h("div", { class: "note" }, "Bu destek talebi kapatıldı. Gerekirse yeni bir talep oluşturabilirsiniz."),
        h("div", { style: "margin-top:14px" }, plink("/panel/destek", "Taleplerime dön", { class: "btn ghost sm" })));
    }, function (e) { AVF.mount(el, h("h2", { class: "ptitle", text: "Destek talebi" }), AVF.state("alert", "Destek talebi bulunamadı", AVF.errText(e), plink("/panel/destek", "Taleplerime dön", { class: "btn" }))); });
  }
})();
