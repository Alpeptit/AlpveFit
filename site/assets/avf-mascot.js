/* AlpveFit maskotu — kaslı, kırmızı benekli mantar. Tek kaynak: ana sayfadaki dambıl curl animasyonu ve canlı destek avatarı.
   Çizim sabit, güvenilir bir SVG metnidir (kullanıcı verisi içermez); DOMParser ile ayrıştırılıp belgeye eklenir.
   Hareket CSS ile yapılır (avf.css → .msc-*): ön kol dirsek etrafında döner, pazı kası kasılır, gövde nefes alır.
   Tempo: ~1 sn kaldırma, kısa sıkıştırma, ~1,3 sn kontrollü indirme (nizami form). Hareket azaltma tercihinde sabit durur. */
(function () {
  "use strict";
  var AVF = window.AVF;
  var O = "#3A2A20", CREAM = "#F8ECDD", SHADE = "#EBD7BF", RED = "#E0352B", RED2 = "#B9261E", IRON = "#1C1C1F";

  var CAP = '<path d="M58 166C58 92 106 46 160 46s102 46 102 120c-30 14-174 14-204 0z" fill="' + RED + '" stroke="' + O + '" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<path d="M74 150c-4-50 30-86 70-92" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M70 162c40 9 140 9 180 0" fill="none" stroke="' + RED2 + '" stroke-width="5" stroke-linecap="round" opacity=".55"/>' +
    '<circle cx="112" cy="104" r="14" fill="#fff"/><circle cx="162" cy="76" r="16" fill="#fff"/><circle cx="212" cy="106" r="13" fill="#fff"/>' +
    '<circle cx="86" cy="142" r="8.5" fill="#fff"/><circle cx="236" cy="146" r="8" fill="#fff"/><circle cx="152" cy="128" r="9.5" fill="#fff"/><circle cx="192" cy="138" r="6.5" fill="#fff"/><circle cx="128" cy="62" r="5" fill="#fff"/>';
  var FACE = '<g class="msc-eyes"><ellipse cx="143" cy="203" rx="5.2" ry="6.6" fill="' + O + '"/><ellipse cx="177" cy="203" rx="5.2" ry="6.6" fill="' + O + '"/>' +
    '<circle cx="144.8" cy="200.6" r="1.7" fill="#fff"/><circle cx="178.8" cy="200.6" r="1.7" fill="#fff"/></g>' +
    '<path d="M132 189l16 5M188 189l-16 5" stroke="' + O + '" stroke-width="3.4" stroke-linecap="round"/>' +
    '<circle cx="131" cy="215" r="6.5" fill="#F29C93" opacity=".55"/><circle cx="189" cy="215" r="6.5" fill="#F29C93" opacity=".55"/>' +
    '<path d="M150 217q10 8 20 0" fill="none" stroke="' + O + '" stroke-width="3.2" stroke-linecap="round"/>';

  function full() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-24 26 368 322" class="msc" role="img" aria-label="AlpveFit maskotu: dambıl curl yapan kaslı mantar">' +
      '<ellipse class="msc-shadow" cx="160" cy="322" rx="78" ry="9" fill="#111113" opacity=".12"/>' +
      '<g class="msc-body">' +
      // bacaklar ve ayakkabılar
      '<rect x="127" y="270" width="22" height="44" rx="10" fill="' + CREAM + '" stroke="' + O + '" stroke-width="3.5"/>' +
      '<rect x="171" y="270" width="22" height="44" rx="10" fill="' + CREAM + '" stroke="' + O + '" stroke-width="3.5"/>' +
      '<path d="M120 318c0-9 8-13 18-13s19 4 19 13z" fill="' + IRON + '"/><path d="M163 318c0-9 9-13 19-13s18 4 18 13z" fill="' + IRON + '"/>' +
      '<path d="M122 318h33M165 318h33" stroke="#fff" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round"/>' +
      // sağ kol (izleyiciye göre sağ): yumruk belde
      '<path d="M214 186C236 194 254 206 258 226C254 238 236 246 218 252" fill="none" stroke="' + O + '" stroke-width="35" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M214 186C236 194 254 206 258 226C254 238 236 246 218 252" fill="none" stroke="' + CREAM + '" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M228 196c12 4 20 12 22 22" fill="none" stroke="' + SHADE + '" stroke-width="7" stroke-linecap="round"/>' +
      // sol üst kol: sabit, dirsek gövdeye yakın
      '<path d="M101 184C88 200 80 218 76 236" fill="none" stroke="' + O + '" stroke-width="37" stroke-linecap="round"/>' +
      '<path d="M101 184C88 200 80 218 76 236" fill="none" stroke="' + CREAM + '" stroke-width="30" stroke-linecap="round"/>' +
      // gövde (sap): omuzdan bele daralan kaslı form
      '<path d="M100 166C97 200 105 242 116 284Q160 300 204 284C215 242 223 200 220 166z" fill="' + CREAM + '" stroke="' + O + '" stroke-width="3.5" stroke-linejoin="round"/>' +
      '<path d="M206 176c4 34 0 70-10 104" fill="none" stroke="' + SHADE + '" stroke-width="9" stroke-linecap="round" opacity=".9"/>' +
      '<g stroke="#D9C2A6" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M160 232v42"/><path d="M146 238q6 3 12 0M162 238q6 3 12 0M147 252q5 3 11 0M162 252q5 3 11 0M148 266q5 2 10 0M162 266q5 2 10 0"/></g>' +
      // şapka altı (lameller)
      '<ellipse cx="160" cy="168" rx="100" ry="12" fill="#E9D3BA" stroke="' + O + '" stroke-width="3.5"/>' +
      CAP + FACE +
      // sol kol: pazı kası (üst kol gövdenin arkasından çıkar, yukarıda çizildi)
      '<ellipse class="msc-bicep" cx="81" cy="206" rx="12" ry="16" fill="' + SHADE + '" opacity=".95"/>' +
      // ön kol + dambıl: dirsek (76,236) etrafında döner
      '<g class="msc-fore">' +
      '<path d="M76 236L76 288" stroke="' + O + '" stroke-width="31" stroke-linecap="round"/><path d="M76 236L76 288" stroke="' + CREAM + '" stroke-width="24" stroke-linecap="round"/>' +
      '<circle cx="76" cy="292" r="14.5" fill="' + CREAM + '" stroke="' + O + '" stroke-width="3.5"/>' +
      '<rect x="46" y="288.5" width="60" height="7" rx="3.5" fill="#55555B"/>' +
      '<rect x="38" y="276" width="13" height="32" rx="4" fill="' + IRON + '"/><rect x="101" y="276" width="13" height="32" rx="4" fill="' + IRON + '"/>' +
      '<rect x="30" y="281" width="9" height="22" rx="3" fill="' + IRON + '"/><rect x="113" y="281" width="9" height="22" rx="3" fill="' + IRON + '"/>' +
      '<path d="M41 281v22M104 281v22" stroke="#fff" stroke-opacity=".22" stroke-width="2"/>' +
      '</g></g></svg>';
  }
  // Canlı destek avatarı: şapka + yüz (kollar yok), kare çerçeveye sığar.
  function mini() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="52 40 216 220" class="msc-mini" aria-hidden="true">' +
      '<path d="M104 166C102 196 108 228 116 252Q160 266 204 252C212 228 218 196 216 166z" fill="' + CREAM + '" stroke="' + O + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<ellipse cx="160" cy="168" rx="100" ry="12" fill="#E9D3BA" stroke="' + O + '" stroke-width="5"/>' + CAP.replace(/stroke-width="3.5"/g, 'stroke-width="5"') + FACE + '</svg>';
  }
  function parse(str) {
    var doc = new DOMParser().parseFromString(str, "image/svg+xml");
    return document.importNode(doc.documentElement, true);
  }
  AVF.mascot = function () { return parse(full()); };
  AVF.mascotMini = function () { return parse(mini()); };
})();
