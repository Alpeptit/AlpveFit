/* AlpveFit maskotu — siyah-beyaz, kaslı mantarlar. Ana sayfada iki mantar karşılıklı "most muscular" pozu verir;
   destek talebi yanıtlarındaki avatar aynı karakterin mutlu yüzlü başıdır.
   Çizim sabit, güvenilir bir SVG metnidir (kullanıcı verisi içermez); DOMParser ile ayrıştırılıp belgeye eklenir.
   Hareket CSS ile yapılır (avf.css → .msc2-*): kaslar sıkılır, gövde öne eğilir, kısa bir titreme ve göz kırpma;
   iki mantar yarım tur arayla kasılır. Hareket azaltma tercihinde sabit durur. */
(function () {
  "use strict";
  var AVF = window.AVF;
  var INK = "#111113", W = "#FFFFFF", STEM = "#F7F7F5", SH = "#E4E4E0", MID = "#BDBDB7", VEIN = "#9E9E98";

  function stroke(d, w, c) { return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  var CAP = '<ellipse cx="100" cy="117" rx="58" ry="7" fill="' + SH + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<path d="M38 106C38 62 66 32 100 32s62 30 62 74c0 8-7 12-17 12H55c-10 0-17-4-17-12z" fill="' + INK + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M52 92c2-24 18-42 40-48" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="5" stroke-linecap="round"/>' +
    '<g fill="#fff"><ellipse cx="74" cy="70" rx="9.5" ry="8"/><ellipse cx="108" cy="52" rx="10.5" ry="8"/><ellipse cx="138" cy="74" rx="9" ry="7.5"/>' +
    '<ellipse cx="54" cy="98" rx="5" ry="4.2"/><ellipse cx="150" cy="100" rx="5" ry="4.2"/><ellipse cx="100" cy="88" rx="6.5" ry="5.2"/><ellipse cx="124" cy="98" rx="4" ry="3.4"/></g>';

  // Tek mantar (sağa bakar). "Most muscular": kalın omuzlar, dışa taşan pazılar, önkollar öne kıvrılır,
  // yumruklar göbek önünde birleşir. Kollar dolgulu şekillerdir; gövdeden çizgiyle ayrılır.
  function one(cls) {
    var o = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"';
    var upL = "M66 118C50 112 30 122 27 146C25 160 30 170 40 172C50 172 56 164 59 154C61 146 63 140 66 136Z";
    var foL = "M30 160C30 178 50 194 80 197L84 181C66 179 54 172 50 158Z";
    var mirror = function (d) { return d.replace(/([MCLZ])?\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, function (m, c, x, y) { return (c || " ") + (200 - x) + " " + y; }); };
    var upR = mirror(upL), foR = mirror(foL);
    return '<g class="' + cls + '"><g class="msc2-body">' +
      // bacaklar
      '<rect x="82" y="200" width="15" height="22" rx="7" fill="' + STEM + '" ' + o + '/><rect x="103" y="200" width="15" height="22" rx="7" fill="' + SH + '" ' + o + '/>' +
      '<path d="M75 228c0-8 6-11 14-11s12 3 12 11zM99 228c0-8 6-11 12-11 8 0 14 3 14 11z" fill="' + INK + '"/>' +
      '<path d="M76 228h24M100 228h24" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' +
      // gövde: V biçimi, göğüs ve karın kasları
      '<path d="M64 116C58 146 66 178 80 204Q100 212 120 204C134 178 142 146 136 116Z" fill="' + STEM + '" ' + o + '/>' +
      '<path d="M74 160q13 9 26 1q13 8 26-1" fill="none" stroke="' + MID + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M100 162v14" fill="none" stroke="' + MID + '" stroke-width="2.4" stroke-linecap="round"/>' +
      // kollar
      '<g class="msc2-arms">' +
      '<path d="' + foL + '" fill="' + SH + '" ' + o + '/><path d="' + foR + '" fill="' + SH + '" ' + o + '/>' +
      '<path d="' + upL + '" fill="#fff" ' + o + '/><path d="' + upR + '" fill="#fff" ' + o + '/>' +
      '<path d="M36 140q6-10 18-8M164 140q-6-10-18-8" fill="none" stroke="' + MID + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M33 150q4 6 1 12M167 150q-4 6-1 12M46 180q12 8 26 9M154 180q-12 8-26 9" fill="none" stroke="' + VEIN + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="90" cy="190" r="10" fill="#fff" ' + o + '/><circle cx="110" cy="190" r="10" fill="#fff" ' + o + '/>' +
      '<path d="M86 186q4 2 8 0M106 186q4 2 8 0" fill="none" stroke="' + MID + '" stroke-width="2" stroke-linecap="round"/></g>' +
      // şapka (biraz küçük: omuzlar dışarı taşar)
      '<g transform="translate(100 117) scale(.84) translate(-100 -117)">' + CAP + '</g>' +
      // yüz: büyük gözler karşıya bakar, çatık kaşlar, sıkılmış dişler, alında damar
      '<g class="msc2-eyes"><ellipse cx="89" cy="135" rx="7" ry="7" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/><ellipse cx="113" cy="135" rx="7" ry="7" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle cx="92.5" cy="136" r="3.8" fill="' + INK + '"/><circle cx="116.5" cy="136" r="3.8" fill="' + INK + '"/></g>' +
      '<path d="M79 125l15 6M123 125l-15 6" stroke="' + INK + '" stroke-width="3.6" stroke-linecap="round"/>' +
      '<rect x="90" y="145" width="22" height="9" rx="3.6" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/><path d="M90.5 149.5h21M96 145.5v8M101 145.5v8M106 145.5v8" stroke="' + INK + '" stroke-width="1.3"/>' +
      '<path d="M127 123q3 3 0 6q-3 3 0 6" fill="none" stroke="' + VEIN + '" stroke-width="2" stroke-linecap="round"/>' +
      '</g></g>';
  }
  function scene() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 10 400 236" class="msc msc2" role="img" aria-label="AlpveFit maskotları: karşılıklı poz veren iki kaslı mantar">' +
      '<ellipse cx="96" cy="230" rx="62" ry="6" fill="' + INK + '" opacity=".08"/><ellipse cx="304" cy="230" rx="62" ry="6" fill="' + INK + '" opacity=".08"/>' +
      '<g transform="translate(0 0) rotate(4 100 228)">' + one("msc2-a") + '</g>' +
      '<g transform="translate(400 0) scale(-1 1) rotate(4 100 228)">' + one("msc2-b") + '</g></svg>';
  }
  // Destek talebi avatarı: mutlu yüzlü baş (siyah şapka, beyaz benekler).
  function mini() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="22 20 156 156" class="msc-mini" aria-hidden="true">' +
      '<path d="M58 116c-4 22-2 38 6 52h72c8-14 10-30 6-52z" fill="' + STEM + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      CAP.replace(/stroke-width="3"/g, 'stroke-width="4"') +
      '<ellipse cx="88" cy="134" rx="5" ry="6" fill="' + INK + '"/><ellipse cx="112" cy="134" rx="5" ry="6" fill="' + INK + '"/><circle cx="89.5" cy="132" r="1.6" fill="#fff"/><circle cx="113.5" cy="132" r="1.6" fill="#fff"/>' +
      '<path d="M92 146q8 7 16 0" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="80" cy="145" rx="5" ry="3" fill="' + MID + '" opacity=".6"/><ellipse cx="120" cy="145" rx="5" ry="3" fill="' + MID + '" opacity=".6"/></svg>';
  }
  function parse(str) { var doc = new DOMParser().parseFromString(str, "image/svg+xml"); return document.importNode(doc.documentElement, true); }
  AVF.mascot = function () { return parse(scene()); };
  AVF.mascotMini = function () { return parse(mini()); };
  AVF.mascotPlay = function () { /* hareket tamamen CSS ile */ };
})();
