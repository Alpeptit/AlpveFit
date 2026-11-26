/* AlpveFit — Koç Asistanı (v25): yalnız koçluk üyeleri; kalori / makro, antrenman programı, kilo ve ölçü takibi.
   Açık rıza olmadan soru gönderilemez; yanıtlar düz metindir (HTML yorumlanmaz). */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var SUGG = ["Bugünkü planımın toplam kalorisi ve makroları ne?", "Yulaf ezmesini aynı kaloride neyle değiştirebilirim?", "Programımdaki bench press için teknik ipuçları verir misin?", "Son haftalarda kilom nasıl değişti?"];

  AVF.assistantView = function (el) {
    AVF.mount(el, h("h2", { class: "ptitle", text: "Koç Asistanı" }), AVF.skeleton(2));
    AVF.api("GET", "/assistant").then(function (s) { paint(el, s); }, function (e) {
      AVF.mount(el, h("h2", { class: "ptitle", text: "Koç Asistanı" }), AVF.state("alert", "Asistan yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { AVF.assistantView(el); } }, "Tekrar dene")));
    });
  };

  function paint(el, s) {
    var head = [h("h2", { class: "ptitle", text: "Koç Asistanı" }), h("p", { class: "psub", text: "Kalori ve makrolar, antrenman programın ve kilo takibin hakkında sorularını yanıtlar. Planını yalnız koçun değiştirir." })];
    if (!s.eligible) return AVF.mount(el, head, AVF.state("lock", "Asistan koçluk üyelerine özeldir", "Bir koçluk paketi aldığında ve plan bölümlerin açıldığında kullanabilirsin.", h("a", { class: "btn", href: "/paketler" }, "Paketleri incele")));
    if (!s.enabled) return AVF.mount(el, head, AVF.state("clock", "Asistan şu an kapalı", "Kısa süre içinde yeniden açılacak. Sorun için koçuna destek talebiyle yazabilirsin."));
    if (!s.consent) return AVF.mount(el, head, consentCard(el, s));
    var list = h("div", { class: "ai-list", role: "log", "aria-live": "polite", "aria-label": "Asistan görüşmesi" }), use = h("small", { class: "ai-use", "data-notr": "" });
    var ta = h("textarea", { class: "inp ai-in", rows: "2", maxlength: "1000", placeholder: "Sorunu yaz… (ör. “Akşam öğünümdeki pirinci azaltırsam kaç kalori düşer?”)", "aria-label": "Sorun" });
    var send = h("button", { class: "btn", type: "button" }, AVF.icon("send", "bico"), "Sor"), msg = h("div", { class: "ai-err", role: "alert" });
    var msgs = (s.messages || []).slice(), usage = s.usage;
    function paintUse() { use.textContent = (AVF.lang === "en" ? "Today: " : "Bugün: ") + usage.today + " / " + usage.limit; }
    function bubble(m) {
      return h("div", { class: "ai-m " + (m.role === "user" ? "me" : "bot") + (m.fixed ? " fixed" : "") },
        m.role === "user" ? null : h("span", { class: "ai-av", "aria-hidden": "true" }, AVF.icon("spark")),
        h("div", { class: "ai-b" }, h("p", { "data-notr": "", text: m.body }), h("small", { text: (m.role === "user" ? (AVF.lang === "en" ? "You" : "Sen") : "Koç Asistanı · yapay zekâ") + " · " + AVF.fmtTime(m.at) })));
    }
    function paintList() {
      AVF.mount(list, msgs.length ? msgs.map(bubble) : h("div", { class: "ai-empty" }, h("span", { class: "tile" }, AVF.icon("spark")), h("b", { text: "Merhaba! Ne sormak istersin?" }),
        h("p", { class: "hint", text: "Planına ve kayıtlarına bakarak yanıt veririm. Aşağıdaki örneklerden birine dokunabilirsin." })));
      list.scrollTop = list.scrollHeight;
    }
    function ask(text) {
      text = String(text || "").trim(); if (text.length < 2) { ta.focus(); return; }
      msg.textContent = ""; AVF.busy(send, true, "Yanıtlanıyor…"); ta.disabled = true;
      var tmp = { role: "user", body: text, at: new Date().toISOString() }; msgs.push(tmp); paintList();
      var typing = h("div", { class: "ai-m bot typing" }, h("span", { class: "ai-av", "aria-hidden": "true" }, AVF.icon("spark")), h("div", { class: "ai-b" }, h("span", { class: "ai-dots", "aria-label": "Yazıyor" }, h("i"), h("i"), h("i"))));
      list.appendChild(typing); list.scrollTop = list.scrollHeight;
      AVF.api("POST", "/assistant/messages", { text: text }).then(function (r) {
        msgs.pop(); msgs = msgs.concat(r.messages); usage = r.usage; ta.value = ""; paintList(); paintUse();
      }, function (e) { msgs.pop(); paintList(); msg.textContent = AVF.errText(e); if (!ta.value) ta.value = text; })
        .then(function () { AVF.busy(send, false); ta.disabled = false; ta.focus(); });
    }
    send.addEventListener("click", function () { ask(ta.value); });
    ta.addEventListener("input", function () { ta.style.height = "52px"; ta.style.height = Math.min(160, ta.scrollHeight + 2) + "px"; });
    ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(ta.value); } });
    var chips = h("div", { class: "ai-sugg", role: "group", "aria-label": "Örnek sorular" }, SUGG.map(function (q) { return h("button", { type: "button", class: "ai-chip", onclick: function () { ask(AVF.t(q)); } }, h("span", { text: q })); }));
    var tools = h("div", { class: "ai-tools" },
      h("button", { type: "button", class: "btn ghost sm", onclick: function () {
        AVF.confirmDialog({ icon: "trash", danger: true, title: "Görüşme geçmişi silinsin mi?", text: "Tüm soruların ve yanıtlar kalıcı olarak silinir.", confirm: "Sil", cancel: "Vazgeç" }).then(function (y) {
          if (y) AVF.api("DELETE", "/assistant/messages").then(function () { msgs = []; paintList(); AVF.toast(AVF.t("Görüşme geçmişi silindi.")); }, function (e) { AVF.toast(AVF.errText(e)); });
        });
      } }, AVF.icon("trash", "bico"), "Geçmişi sil"),
      h("button", { type: "button", class: "btn ghost sm", onclick: function () {
        AVF.confirmDialog({ icon: "shield", title: "Açık rıza geri çekilsin mi?", text: "Asistan kapanır ve verilerin artık yapay zekâ hizmetine gönderilmez. Geçmişi ayrıca silebilirsin.", confirm: "Geri çek", cancel: "Vazgeç" }).then(function (y) {
          if (y) AVF.api("POST", "/assistant/consent", { accept: false }).then(function () { AVF.assistantView(el); }, function (e) { AVF.toast(AVF.errText(e)); });
        });
      } }, AVF.icon("shield", "bico"), "Rızayı geri çek"));
    AVF.mount(el, head, h("section", { class: "card ai-card" }, list, chips, h("div", { class: "ai-form" }, ta, send), msg,
      h("div", { class: "ai-foot" }, h("small", { class: "hint", text: "Yapay zekâ yanıtları hatalı olabilir ve tıbbi tavsiye değildir. İlaç, hormon ve supplement dozu konularında yanıt vermez." }), use)), tools);
    paintList(); paintUse();
  }

  function consentCard(el, s) {
    var chk = h("input", { type: "checkbox", id: "aic" }), go = h("button", { class: "btn", type: "button", disabled: "" }, AVF.icon("check", "bico"), "Onaylıyorum, başla");
    chk.addEventListener("change", function () { go.disabled = !chk.checked; });
    go.addEventListener("click", function () {
      AVF.busy(go, true, "Kaydediliyor…");
      AVF.api("POST", "/assistant/consent", { accept: true }).then(function () { AVF.assistantView(el); }, function (e) { AVF.busy(go, false); AVF.toast(AVF.errText(e)); });
    });
    return h("section", { class: "card ai-consent" }, h("span", { class: "tile" }, AVF.icon("shield")), h("h3", { text: "Başlamadan önce: açık rıza" }),
      h("p", { text: "Asistan, sorularını yanıtlayabilmek için aşağıdaki bilgilerini yapay zekâ hizmet sağlayıcımıza (yurt dışında olabilir) iletir. Bu bilgiler sağlık verisi niteliği taşıyabilir; bu yüzden açık rızan olmadan hiçbir veri gönderilmez." }),
      h("ul", { class: "ai-ul" },
        h("li", { text: "Koçunun hazırladığı beslenme ve antrenman planın" }), h("li", { text: "Gelişim Günlüğündeki kilo ve bel ölçün (son 4 ay)" }), h("li", { text: "Ağırlık Takibi kayıtların (son 4 ay)" }),
        h("li", { text: "Paylaştıysan boy, yaş, haftalık antrenman günü ve hedefin" })),
      h("p", { class: "hint", text: "Gönderilmez: adın, e-postan, farmakoloji ve supplement planların, sağlık notların, kan grubun. Görüşme geçmişin yalnız sana görünür ve " + (s.keepDays || 90) + " gün sonra silinir; istediğin an silebilir ve rızanı geri çekebilirsin." }),
      h("label", { class: "check", for: "aic" }, chk, h("span", { text: "Yukarıdaki bilgilerimin koçluk asistanı için yapay zekâ hizmet sağlayıcısına aktarılmasına açık rıza veriyorum." })),
      h("div", { class: "row" }, go, h("a", { class: "btn ghost", href: "/yasal/kvkk" }, "KVKK metni")));
  }
})();
