/* AlpveFit maskotu — kaslı, kırmızı benekli mantar. Tek kaynak: ana sayfa sahnesi ve canlı destek avatarı.
   Çizim sabit, güvenilir bir SVG metnidir (kullanıcı verisi içermez); DOMParser ile ayrıştırılıp belgeye eklenir.
   Kollar "birleşik siluet" tekniğiyle çizilir: kolun dış çizgisi gövdeden ÖNCE, dolgusu SONRA çizilir; omuzda çizgi görünmez.
   Hareketler (avf.css → .msc.m-*): dambıl curl, çift pazı pozu, zıplama ve el sallama sırayla döner (AVF.mascotPlay).
   Her hareket dinlenme pozunda başlar ve biter; geçişlerde sıçrama olmaz. Hareket azaltma tercihinde maskot sabit durur. */
(function () {
  "use strict";
  var AVF = window.AVF;
  var O = "#3B2A22", CREAM = "#FCF1E4", SHADE = "#EFDCC6", IRON = "#1D1D20";

  var DEFS = '<defs><radialGradient id="mscCap" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#F25A4C"/><stop offset=".55" stop-color="#E2382D"/><stop offset="1" stop-color="#C42A21"/></radialGradient>' +
    '<linearGradient id="mscStem" x1="0" x2="1"><stop offset="0" stop-color="#FFF7EE"/><stop offset=".62" stop-color="' + CREAM + '"/><stop offset="1" stop-color="' + SHADE + '"/></linearGradient></defs>';
  var CAP = '<ellipse cx="160" cy="166" rx="84" ry="9" fill="#E8D2BA" stroke="' + O + '" stroke-width="3"/>' +
    '<path d="M60 150C60 86 104 42 160 42s100 44 100 108c0 12-10 18-24 18H84c-14 0-24-6-24-18z" fill="url(#mscCap)" stroke="' + O + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M78 128c2-36 28-64 62-72" fill="none" stroke="#fff" stroke-opacity=".32" stroke-width="7" stroke-linecap="round"/>' +
    '<g fill="#fff"><ellipse cx="114" cy="98" rx="15" ry="13"/><ellipse cx="166" cy="70" rx="17" ry="13"/><ellipse cx="213" cy="102" rx="14" ry="12"/>' +
    '<ellipse cx="88" cy="140" rx="8" ry="7"/><ellipse cx="234" cy="142" rx="8" ry="7"/><ellipse cx="156" cy="124" rx="10" ry="8.5"/><ellipse cx="194" cy="136" rx="6" ry="5"/></g>';
  var FACE = '<g class="msc-eyes"><ellipse cx="142" cy="202" rx="7.5" ry="8.5" fill="#fff" stroke="' + O + '" stroke-width="2.4"/><ellipse cx="178" cy="202" rx="7.5" ry="8.5" fill="#fff" stroke="' + O + '" stroke-width="2.4"/>' +
    '<circle cx="143.5" cy="204" r="4.4" fill="' + O + '"/><circle cx="176.5" cy="204" r="4.4" fill="' + O + '"/><circle cx="145" cy="202" r="1.5" fill="#fff"/><circle cx="178" cy="202" r="1.5" fill="#fff"/></g>' +
    '<path d="M133 188q8-4 15 0M172 188q7-4 15 0" fill="none" stroke="' + O + '" stroke-width="3" stroke-linecap="round"/>' +
    '<ellipse cx="130" cy="217" rx="6.5" ry="4" fill="#F59A8F" opacity=".6"/><ellipse cx="190" cy="217" rx="6.5" ry="4" fill="#F59A8F" opacity=".6"/>' +
    '<path d="M151 215q9 9 18 0z" fill="' + O + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/><path d="M155 218q5 3 10 0" fill="none" stroke="#F07D72" stroke-width="2.4" stroke-linecap="round"/>';

  // Ana sahne yüzü: kararlı ve "agresif" — çatık kaşlar, yarı kapalı göz kapakları, sıkılmış dişler, alında öfke damarı.
  var VEIN = "#B98A68";
  var FACE_MAD = '<g class="msc-eyes"><ellipse cx="142" cy="204" rx="7.5" ry="7.5" fill="#fff" stroke="' + O + '" stroke-width="2.4"/><ellipse cx="178" cy="204" rx="7.5" ry="7.5" fill="#fff" stroke="' + O + '" stroke-width="2.4"/>' +
    '<circle cx="144" cy="206" r="4" fill="' + O + '"/><circle cx="176" cy="206" r="4" fill="' + O + '"/><circle cx="145.2" cy="204.6" r="1.3" fill="#fff"/><circle cx="177.2" cy="204.6" r="1.3" fill="#fff"/>' +
    '<path d="M133 196.5q9 5 18 3.5V194h-18zM187 196.5q-9 5-18 3.5V194h18z" fill="' + CREAM + '"/><path d="M134 199q8 3 16 1.5M186 199q-8 3-16 1.5" fill="none" stroke="' + O + '" stroke-width="2.2" stroke-linecap="round"/></g>' +
    '<path d="M130 184l20 8M190 184l-20 8" fill="none" stroke="' + O + '" stroke-width="4.2" stroke-linecap="round"/>' +
    '<path d="M154 186q6 3 12 0" fill="none" stroke="' + SHADE + '" stroke-width="2" stroke-linecap="round"/>' +
    '<ellipse cx="129" cy="218" rx="6" ry="3.5" fill="#F59A8F" opacity=".45"/><ellipse cx="191" cy="218" rx="6" ry="3.5" fill="#F59A8F" opacity=".45"/>' +
    '<rect x="147" y="213" width="26" height="11" rx="4.5" fill="#fff" stroke="' + O + '" stroke-width="2.4"/><path d="M147.5 218.5h25M153.5 213.5v10M160 213.5v10M166.5 213.5v10" stroke="' + O + '" stroke-width="1.5"/>' +
    // öfke işareti (💢 benzeri) gövdenin sağ üstünde
    '<g class="msc-anger" fill="none" stroke="#E2382D" stroke-width="2.6" stroke-linecap="round"><path d="M198 180q4 2 4 6M206 180q-4 2-4 6M198 194q4-2 4-6M206 194q-4-2-4-6"/></g>';
  // damarlar: pazı ve ön kol üzerinde ince, hafif koyu çizgiler
  var VEINS_UP = '<g fill="none" stroke="' + VEIN + '" stroke-width="1.8" stroke-linecap="round" opacity=".85"><path d="M86 196q5 6 2 12q-3 5 1 10M94 200q3 4 0 8"/><path d="M234 196q-5 6-2 12q3 5-1 10M226 200q-3 4 0 8"/></g>';
  function veinFore(x) { return '<path d="M' + (x - 5) + ' 238q5 7 1 13q-4 6 1 12M' + (x + 4) + ' 244q-3 5 0 9" fill="none" stroke="' + VEIN + '" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>'; }

  // kol parçaları: dış çizgi (OUT) ve dolgu (IN) ayrı çizilir
  var UL = "M110 184Q92 198 84 230", UR = "M210 184Q228 198 236 230";
  function stroke(d, w, c) { return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'; }

  function full() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 22 300 300" class="msc" role="img" aria-label="AlpveFit maskotu">' + DEFS +
      '<ellipse class="msc-shadow" cx="160" cy="306" rx="70" ry="8" fill="#111113" opacity=".1"/>' +
      '<g class="msc-all">' +
      // bacaklar ve spor ayakkabılar
      '<rect x="131" y="262" width="22" height="34" rx="10" fill="' + CREAM + '" stroke="' + O + '" stroke-width="3"/><rect x="167" y="262" width="22" height="34" rx="10" fill="' + SHADE + '" stroke="' + O + '" stroke-width="3"/>' +
      '<path d="M124 304c0-10 7-14 17-14 9 0 16 4 16 14z" fill="' + IRON + '"/><path d="M163 304c0-10 7-14 16-14 10 0 17 4 17 14z" fill="' + IRON + '"/>' +
      '<path d="M125 304h31M164 304h31" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="141" cy="295" r="2" fill="#E2382D"/><circle cx="179" cy="295" r="2" fill="#E2382D"/>' +
      // üst kolların dış çizgisi (gövdenin arkasında)
      stroke(UL, 42, O) + stroke(UR, 42, O) +
      // gövde (sap)
      '<path d="M101 164c-7 34 1 72 15 104 3 9 85 9 88 0 14-32 22-70 15-104z" fill="url(#mscStem)" stroke="' + O + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M136 252q24 8 48 0" fill="none" stroke="' + SHADE + '" stroke-width="4" stroke-linecap="round"/>' +
      // üst kolların dolgusu (omuz çizgisini örter) ve pazılar
      stroke(UL, 36, CREAM) + stroke(UR, 36, CREAM) +
      '<ellipse class="msc-bl" cx="90" cy="206" rx="11" ry="14" fill="' + SHADE + '"/><ellipse class="msc-br" cx="230" cy="206" rx="11" ry="14" fill="' + SHADE + '"/>' +
      '<path d="M120 182q14 10 30 6M200 182q-14 10-30 6" fill="none" stroke="' + SHADE + '" stroke-width="3.5" stroke-linecap="round"/>' +
      VEINS_UP + CAP + FACE_MAD +
      // sağ ön kol (izleyiciye göre): dirsek (236,230) etrafında döner; dinlenmede yumruk belde
      '<g class="msc-fr">' + stroke("M236 230V266", 38, O) + stroke("M236 230V266", 32, CREAM) +
      '' + veinFore(236) + '<circle cx="236" cy="272" r="15" fill="' + CREAM + '" stroke="' + O + '" stroke-width="3"/><path d="M230 268q6 3 12 0" fill="none" stroke="' + SHADE + '" stroke-width="2.5" stroke-linecap="round"/></g>' +
      // sol ön kol + dambıl: dirsek (84,230) etrafında döner
      '<g class="msc-fl">' + stroke("M84 230V266", 38, O) + stroke("M84 230V266", 32, CREAM) + veinFore(84) +
      '<rect x="56" y="268.5" width="56" height="7" rx="3.5" fill="#5A5A61"/>' +
      '<rect x="48" y="256" width="12" height="32" rx="4" fill="' + IRON + '"/><rect x="108" y="256" width="12" height="32" rx="4" fill="' + IRON + '"/>' +
      '<rect x="41" y="261" width="8" height="22" rx="3" fill="' + IRON + '"/><rect x="119" y="261" width="8" height="22" rx="3" fill="' + IRON + '"/>' +
      '<path d="M51 260v24M111 260v24" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>' +
      '<circle cx="84" cy="272" r="15" fill="' + CREAM + '" stroke="' + O + '" stroke-width="3"/></g>' +
      '</g></svg>';
  }
  // Canlı destek avatarı: şapka + yüz.
  function mini() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="54 36 212 212" class="msc-mini" aria-hidden="true">' + DEFS +
      '<path d="M108 164c-4 30-3 56 4 80h96c7-24 8-50 4-80z" fill="url(#mscStem)" stroke="' + O + '" stroke-width="4" stroke-linejoin="round"/>' +
      CAP.replace(/stroke-width="3"/g, 'stroke-width="4"') + FACE + '</svg>';
  }
  var uid = 0;
  function parse(str) {
    // her örnekte degrade kimlikleri benzersiz olmalı (aynı sayfada birden çok maskot olabilir)
    var n = ++uid; str = str.replace(/mscCap/g, "mscCap" + n).replace(/mscStem/g, "mscStem" + n);
    var doc = new DOMParser().parseFromString(str, "image/svg+xml");
    return document.importNode(doc.documentElement, true);
  }
  AVF.mascot = function () { return parse(full()); };
  AVF.mascotMini = function () { return parse(mini()); };

  // Hareket sırası: 3 curl → çift pazı → 2 zıplama → el sallama → baştan. Süreler avf.css'teki animasyonlarla aynıdır.
  var SEQ = [["m-curl", 7800], ["m-flex", 2800], ["m-hop", 1700], ["m-wave", 2600]];
  AVF.mascotPlay = function (svg) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    var i = 0;
    (function next() {
      if (!document.body.contains(svg)) return;                       // sayfa değişti: dur
      SEQ.forEach(function (s) { svg.classList.remove(s[0]); });
      void svg.getBoundingClientRect();                                // animasyonu yeniden başlat
      svg.classList.add(SEQ[i][0]);
      setTimeout(next, SEQ[i][1]); i = (i + 1) % SEQ.length;
    })();
  };
})();
