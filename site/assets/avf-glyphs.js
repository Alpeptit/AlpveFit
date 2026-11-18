/* AlpveFit — kalem görselleri: her besin, supplement, vitamin, mineral ve farmakolojik madde için ayrı simge.
   Çizimler statik SVG'dir (kullanıcı verisi içermez). AVF.glyph(tür, anahtar, kod) → <span class="gly"> */
(function () {
  "use strict";
  var AVF = window.AVF;
  var NS = "http://www.w3.org/2000/svg";
  // 24×24, çizgi tabanlı; "f:" ile başlayan parça dolgu (renk tonu) olarak çizilir.
  var EGG = "M12 3c3.6 0 6.2 5.4 6.2 9.8A6.2 6.2 0 015.8 12.8C5.8 8.4 8.4 3 12 3z";
  var FISH = "M3 12c3-4.5 8-6 12.5-3.2L20 6v12l-4.5-2.8C11 18 6 16.5 3 12zM8 11.2v.01";
  var BOWL = "M3.5 11h17a8.5 8.5 0 01-17 0zM8 20.5h8";
  var D = {
    egg_white: [EGG], egg_whole: [EGG, "f:M12 15.2a3 3 0 100-6 3 3 0 000 6z"],
    chicken_breast: ["M14.5 3.5c3.4 0 6 2.6 6 5.8 0 3.6-3.4 6.2-7.4 6.2-.7 0-1.4-.1-2-.3L8 18.3a1.9 1.9 0 11-2.6-1.4 1.9 1.9 0 11-1.3-2.6l3-3a6 6 0 01-.2-1.6c0-3.6 3.6-6.2 7.6-6.2z"],
    beef: ["M5 7.5C7 4.5 12 3.5 16 5s5 5.5 3.5 9-6 6-10 5.5S3 15.5 3.5 12 4 8.5 5 7.5z", "M9 10.5a2.2 2.2 0 104.4 0 2.2 2.2 0 00-4.4 0z"],
    fish: [FISH], salmon: [FISH, "M11 9.5l1.2 5M13.6 9l1 4.6"],
    yogurt: ["M5 8h14l-1.6 11.2a2 2 0 01-2 1.8H8.6a2 2 0 01-2-1.8z", "M4 8h16M8 8c0-2.2 1.8-4 4-4s4 1.8 4 4"],
    lor: [BOWL, "M8 10.5c0-1.2 1-2 2-2s2 .8 2 2M12 10.5c0-1.4 1.1-2.4 2.4-2.4s2.1 1 2.1 2.4"],
    sweet_potato: ["M4 14c-1-3.5 2-8 6.5-9.5S19.5 4 20.5 7.5s-2 8.5-6.5 10.5S5 17.5 4 14z", "M3 16l-1 1M21 6.5l1-1"],
    potato: ["M5.5 8.5C7.5 4.5 14 3.5 17.5 6s3.5 9-.5 11.5-10 2.5-11.5-.5-1.5-5.5 0-8.5z", "M9 9.5v.01M14 8.5v.01M12.5 14v.01M16 12.5v.01"],
    oats: [BOWL, "M7.5 9.5l1-2M10.5 9.5l.5-2.6M13.5 9.5l-.2-2.6M16.5 9.5l-.8-2.2"],
    rice: [BOWL, "M8 9c.5-1 1.5-1 2 0M11 8.5c.5-1 1.5-1 2 0M14 9c.5-1 1.5-1 2 0", "M17 3l-5 6M20 4.5l-6 5"],
    bread: ["M4.5 10.5A3.5 3.5 0 017 4.5h10a3.5 3.5 0 012.5 6V19a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 19z", "M9 9l1.5 1.5M12.5 8.5L14 10"],
    banana: ["M4 6c0 7.5 5.5 13 13 13 1.8 0 3-.6 3.6-1.4-1-.4-2-.4-3.6-.6C11 16.4 7 12.5 6.4 5.8 6 4.6 4 4.6 4 6z", "M4.6 4.5L4 3"],
    pineapple: ["M12 9.5c3 0 5 2.6 5 6s-2 5.5-5 5.5-5-2-5-5.5 2-6 5-6z", "M12 9.5V3M12 6l-3-2.5M12 6l3-2.5M9 13l6 4M15 13l-6 4"],
    apple: ["f:M12 7.5c-1.6-1.2-4.5-1.3-6 .8-1.8 2.6-.6 7.6 1.6 10.4 1.2 1.6 2.6 2.4 4.4 1.4 1.8 1 3.2.2 4.4-1.4 2.2-2.8 3.4-7.8 1.6-10.4-1.5-2.1-4.4-2-6-.8z", "M12 7.5V4M12 5.5c1.2-1.6 2.6-2 4-2"],
    berries: ["M8 14.5a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM16 14.5a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM12 20.5a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z", "M8 8V6M16 8V6M12 14v-1.6"],
    raspberry: ["M12 7.5c3.6 0 6 3.4 6 7s-2.6 6-6 6-6-2.4-6-6 2.4-7 6-7z", "M9.5 11v.01M12 10v.01M14.5 11v.01M10.5 14v.01M13.5 14v.01M12 17v.01M12 7.5L10 4M12 7.5l2-3.5"],
    honey: ["M7 8h10v10.5a2.5 2.5 0 01-2.5 2.5h-5A2.5 2.5 0 017 18.5z", "M6 8h12M9 5h6v3M10 13.5l2-1.2 2 1.2v2.3l-2 1.2-2-1.2z"],
    oil: ["M10 3h4v3.5l1.6 2.2a5 5 0 011 3V19a2 2 0 01-2 2H9.4a2 2 0 01-2-2v-7.3a5 5 0 011-3L10 6.5z", "f:M7.4 14h9.2v5a2 2 0 01-2 2H9.4a2 2 0 01-2-2z"],
    coconut: ["M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17z", "f:M12 8a4.5 4.5 0 100 9 4.5 4.5 0 000-9z", "M10 6v.01M14 6v.01M12 5v.01"],
    avocado: ["M12 3c3 0 5.5 5 5.5 9.5A5.5 5.5 0 0112 21a5.5 5.5 0 01-5.5-8.5C6.5 8 9 3 12 3z", "f:M12 11a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6z"],
    // supplement / farmakoloji biçimleri
    tub: ["M5.5 8h13v11a2 2 0 01-2 2h-9a2 2 0 01-2-2z", "M5 5h14v3H5z", "f:M5.5 12h13v4h-13z"],
    capsule: ["M8.2 15.8a3.8 3.8 0 01-5.4-5.4l7.6-7.6a3.8 3.8 0 015.4 5.4z", "f:M8.2 15.8l4-4M12.2 11.8l-5.4-5.4", "M13.5 13.5l7.6 7.6"],
    softgel: ["f:M12 3.5c4.2 0 7 3.8 7 8.5s-2.8 8.5-7 8.5-7-3.8-7-8.5 2.8-8.5 7-8.5z", "M10 8.5c-.8.6-1.3 1.6-1.4 2.7"],
    tablet: ["M12 4a8 8 0 100 16 8 8 0 000-16z", "M6.4 6.4l11.2 11.2"],
    bottle: ["M9 3h6v3l2 2.5V19a2 2 0 01-2 2H9a2 2 0 01-2-2V8.5L9 6z", "f:M7 13h10v6a2 2 0 01-2 2H9a2 2 0 01-2-2z"],
    leaf: ["M5 19c0-8 5-14 15-15-1 10-7 15-15 15z", "M5 19l7-7"],
    element: ["M4 4h16v16H4z"],
    vial: ["M8 3h8v3H8z", "M9 6h6v13a2 2 0 01-2 2h-2a2 2 0 01-2-2z", "f:M9 12h6v7a2 2 0 01-2 2h-2a2 2 0 01-2-2z"],
    lyo: ["M8 3h8v3H8z", "M9 6h6v13a2 2 0 01-2 2h-2a2 2 0 01-2-2z", "f:M9 17h6v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z"],
    blister: ["M3.5 6.5h17v11h-17z", "M8 12a2 2 0 100-.01M16 12a2 2 0 100-.01M12 12a2 2 0 100-.01"],
    pill2: ["M9.5 20.5a6 6 0 01-6-6l7-7a6 6 0 018.5 8.5l-7 7a6 6 0 01-2.5-2.5z", "M7 10l7 7"],
  };
  // tür/anahtar → [çizim, ton]
  var FOOD = {
    egg_white_m: ["egg_white", "y", "M"], egg_whole_m: ["egg_whole", "y", "M"], egg_white_l: ["egg_white", "y", "L"], egg_whole_l: ["egg_whole", "y", "L"],
    chicken_breast: ["chicken_breast", "o"], beef_lean: ["beef", "r", "%5"], beef_low: ["beef", "r", "%15"], salmon: ["salmon", "o"], tuna: ["fish", "b", "TON"], tilapia: ["fish", "s", "TIL"], whiting: ["fish", "s", "MEZ"],
    greek_yogurt: ["yogurt", "s"], lor: ["lor", "s"], sweet_potato: ["sweet_potato", "o"], potato: ["potato", "y"], oats: ["oats", "y"], rice_basmati: ["rice", "s", "BAS"], rice_jasmine: ["rice", "s", "YAS"], rice_baldo: ["rice", "s", "BAL"],
    rye_bread: ["bread", "o", "ÇAV"], ww_bread: ["bread", "o", "TAM"], banana: ["banana", "y"], pineapple: ["pineapple", "y"], apple_green: ["apple", "g"], apple_red: ["apple", "r"], blueberry: ["berries", "b"],
    raspberry: ["raspberry", "r"], blackberry: ["berries", "p"], honey: ["honey", "y"], olive_oil: ["oil", "g"], coconut_oil: ["coconut", "s"], avocado: ["avocado", "g"],
  };
  var SHAPE_TONE = { tub: "s", capsule: "b", softgel: "y", tablet: "s", bottle: "b", leaf: "g", element: "p", vial: "o", lyo: "b", blister: "s" };
  function svg(parts) {
    var el = document.createElementNS(NS, "svg");
    el.setAttribute("viewBox", "0 0 24 24"); el.setAttribute("aria-hidden", "true"); el.setAttribute("class", "gly-s");
    parts.forEach(function (d) {
      var p = document.createElementNS(NS, "path"), fill = d.indexOf("f:") === 0;
      p.setAttribute("d", fill ? d.slice(2) : d);
      if (fill) p.setAttribute("class", "gf");
      el.appendChild(p);
    });
    return el;
  }
  /** kind: "food" | "supp" | "pharma"; key: besin anahtarı veya kalem adı; extra: { shape, code } */
  AVF.glyph = function (kind, key, opt) {
    opt = opt || {};
    var draw, tone, code;
    if (kind === "food") { var f = FOOD[key] || ["oats", "s"]; draw = f[0]; tone = f[1]; code = f[2]; }
    else { draw = opt.shape || "tablet"; tone = SHAPE_TONE[draw] || "s"; code = opt.code; }
    var span = document.createElement("span");
    span.className = "gly t-" + tone + (draw === "element" ? " el" : "");
    span.setAttribute("aria-hidden", "true");
    span.appendChild(svg(D[draw] || D.tablet));
    if (code) { var b = document.createElement("b"); b.className = "gly-c" + (code.length > 3 ? " sm" : ""); b.setAttribute("data-notr", ""); b.textContent = code; span.appendChild(b); }
    return span;
  };
  AVF.suppGlyph = function (cat, name) { var g = (cat.suppGlyph || {})[name] || ["tablet", ""]; return AVF.glyph("supp", name, { shape: g[0], code: g[1] }); };
  AVF.pharmaGlyph = function (cat, group, name) {
    var info = (cat.pharmaInfo || {})[name] || [""], shape = group === "inj" ? "vial" : group === "peptide" ? "lyo" : group === "protect" ? "blister" : "tablet";
    return AVF.glyph("pharma", name, { shape: shape, code: info[0] });
  };
})();
