/* AlpveFit — DOZAJ HESAPLAYICI (Araçlar › Dozaj Hesaplayıcı)
   Alpeptit'teki hesaplayıcıyla aynı işleyiş ve aynı formül; AlpveFit tasarımına (siyah-beyaz) uyarlanmıştır.
   Giriş gerekmez; hiçbir bilgi istenmez, saklanmaz, gönderilmez — hesap tamamen tarayıcıda yapılır.
   Formül: Konsantrasyon = Şişedeki madde ÷ Eklenen BAC (mL) · Çekilen hacimdeki miktar = Konsantrasyon × Çekilen hacim (mL) · 1 mg = 1000 mcg.
   Bu bir çözelti aritmetiğidir; kullanım veya doz önerisi, tıbbi tavsiye DEĞİLDİR. */
(function () {
  'use strict';
  var AVF = window.AVF;
  if (!AVF || AVF.DoseCalc) return;
  var OPTIONS = [0.25, 0.5, 0.75, 1], MAX_SCN = 4;

  // Madde listesi: yaygın peptitler ve piyasadaki şişe içerikleri (yalnız hesap içindir; ürün satışı veya öneri değildir).
  // Listede olmayan madde için "Diğer (elle gir)" ile şişedeki miktar ve birim girilir.
  var CATALOG = [
    ["AOD-9604", ["2 mg", "5 mg"]], ["BPC-157", ["5 mg", "10 mg"]], ["BPC-157 + TB-500", ["BPC-157 5 mg + TB-500 5 mg", "BPC-157 10 mg + TB-500 10 mg"]],
    ["CJC-1295 (DAC'sız)", ["2 mg", "5 mg"]], ["CJC-1295 + Ipamorelin", ["CJC-1295 5 mg + Ipamorelin 5 mg"]], ["Epitalon", ["10 mg", "50 mg"]],
    ["GHK-Cu", ["50 mg", "100 mg"]], ["GHRP-6", ["5 mg", "10 mg"]], ["Hexarelin", ["2 mg", "5 mg"]], ["HGH (Somatropin)", ["10 IU", "15 IU", "24 IU"]],
    ["Ipamorelin", ["5 mg", "10 mg"]], ["KPV", ["5 mg", "10 mg"]], ["Melanotan II", ["10 mg"]], ["MOTS-c", ["10 mg", "40 mg"]], ["NAD+", ["100 mg", "500 mg"]],
    ["PT-141", ["10 mg"]], ["Retatrutide", ["5 mg", "10 mg", "20 mg"]], ["Selank", ["5 mg", "10 mg"]], ["Semaglutide", ["2 mg", "5 mg", "10 mg"]],
    ["Semax", ["5 mg", "10 mg"]], ["Sermorelin", ["2 mg", "5 mg"]], ["SS-31", ["10 mg", "50 mg"]], ["TB-500", ["5 mg", "10 mg"]], ["Tesamorelin", ["2 mg", "5 mg", "10 mg"]],
    ["Thymosin Alpha-1", ["5 mg", "10 mg"]], ["Tirzepatide", ["5 mg", "10 mg", "15 mg", "20 mg", "30 mg"]]
  ];

  var CSS = [
    '.clc{--ck:#111113;--con:#fff;--cs:#fff;--cs2:#f4f4f2;--cs3:#fafaf9;--cm:#71717a;--cm2:#52525b;--cm3:#3f3f46;--cm4:#a1a1aa;--cl:#e4e4e7;--cl2:#d4d4d8;--liq1:#67E8F9;--liq2:#06B6D4;--liq3:#0E7490;display:flex;flex-direction:column;gap:20px;color:var(--ck);container-type:inline-size}',
    '.clc [hidden]{display:none!important}',
    '.clc-sr{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}',
    // uyarı kutusu (hesaplamadan önce)
    '.clc-risk{display:flex;gap:14px;align-items:flex-start;margin:0;padding:16px 18px;border-radius:18px;background:var(--cs2);border:1px solid var(--cl);color:var(--ck)}',
    '.clc-risk>svg{flex:none;margin-top:2px;color:var(--ck)}',
    '.clc-risk h2{margin:0 0 6px;font-size:16px;font-weight:800;letter-spacing:-.01em;color:var(--ck)}',
    '.clc-risk ul{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:5px;font-size:14px;line-height:1.55}',
    '.clc-risk b{color:var(--ck)}',
    '.clc-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:20px;align-items:start}',
    '@container (min-width:840px){.clc-grid{grid-template-columns:minmax(0,370px) minmax(0,1fr)}}',
    '.clc-form,.clc-box{background:var(--cs);border:1px solid var(--cl);border-radius:22px;padding:20px;box-shadow:0 1px 2px rgba(15,23,42,.04),0 10px 30px -18px rgba(15,23,42,.18)}',
    '.clc-form{display:flex;flex-direction:column;gap:20px}',
    '.clc-f{display:flex;flex-direction:column;gap:9px;min-width:0;border:0;margin:0;padding:0}',
    '.clc-l{display:flex;align-items:center;gap:9px;font-size:15px;font-weight:800;color:var(--ck);padding:0}',
    '.clc-n{flex:none;display:grid;place-items:center;width:23px;height:23px;border-radius:999px;background:var(--ck);color:var(--con);font-size:12px;font-weight:800}',
    '.clc-in{width:100%;min-height:48px;box-sizing:border-box;padding:0 14px;border-radius:13px;border:1.5px solid var(--cl2);background:var(--cs);color:var(--ck);font:inherit;font-size:16px;font-weight:600}',
    '.clc-in:focus{outline:none;border-color:var(--ck);box-shadow:0 0 0 4px rgba(17,17,19,.12)}',
    '.clc-in[aria-invalid="true"]{border-color:#dc2626;box-shadow:0 0 0 4px rgba(220,38,38,.12)}',
    '.clc-combo{position:relative}',
    '.clc-combo .clc-in{padding-left:42px;padding-right:46px}',
    '.clc-combo>svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--cm);pointer-events:none}',
    '.clc-x{position:absolute;right:7px;top:50%;transform:translateY(-50%);width:36px;height:36px;border:0;border-radius:10px;background:transparent;color:var(--cm);cursor:pointer;display:grid;place-items:center}',
    '.clc-x:hover{background:var(--cs2);color:var(--ck)}',
    '.clc-lb{position:absolute;z-index:30;left:0;right:0;top:calc(100% + 6px);margin:0;padding:6px;list-style:none;max-height:288px;overflow:auto;overscroll-behavior:contain;background:var(--cs);border:1px solid var(--cl);border-radius:15px;box-shadow:0 20px 44px -14px rgba(15,23,42,.3)}',
    '.clc-op{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border-radius:10px;cursor:pointer;font-size:15px;font-weight:600;color:var(--ck)}',
    '.clc-op small{flex:none;font-size:12px;font-weight:700;color:var(--cm)}',
    '.clc-op[aria-selected="true"],.clc-op:hover{background:var(--cs2);color:var(--ck)}',
    '.clc-op.none{cursor:default;color:var(--cm);font-weight:500}',
    '.clc-op.none:hover{background:transparent;color:var(--cm)}',
    '.clc-chips{display:flex;flex-wrap:wrap;gap:8px}',
    '.clc-opts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}',
    '.clc-chip{min-height:44px;padding:0 14px;border-radius:999px;border:1.5px solid var(--cl);background:var(--cs);color:var(--cm3);font:inherit;font-size:14.5px;font-weight:700;cursor:pointer;transition:border-color .15s ease,background-color .15s ease,color .15s ease}',
    '.clc-opts .clc-chip{padding:0 6px;border-radius:14px;min-height:50px;font-variant-numeric:tabular-nums;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;line-height:1.1}',
    '.clc-opts .clc-chip small{font-size:11.5px;font-weight:700;color:var(--cm)}',
    '.clc-chip:hover{border-color:var(--cm);color:var(--ck)}',
    '.clc-chip[aria-checked="true"]{border-color:var(--ck);background:var(--cs2);color:var(--ck);box-shadow:inset 0 0 0 1px var(--ck)}',
    '.clc-chip[aria-checked="true"] small{color:var(--ck)}',
    '.clc-chip[aria-disabled="true"]{border-style:dashed;color:var(--cm4);background:var(--cs3);cursor:not-allowed;box-shadow:none}',
    '.clc-chip[aria-disabled="true"][aria-checked="true"]{border-color:#dc2626;color:#b91c1c;background:#fef2f2;border-style:solid}',
    '.clc-chip.na{border-style:dashed;color:var(--cm4)}',
    '.clc-vial{display:flex;flex-wrap:wrap;gap:6px 10px;margin:0;font-size:14px;color:var(--cm2)}',
    '.clc-vial b{color:var(--ck)}',
    '.clc-warn{display:flex;gap:9px;align-items:flex-start;margin:0;padding:11px 13px;border-radius:13px;background:#fefce8;border:1px solid #fde68a;color:#854d0e;font-size:14px;line-height:1.5;font-weight:600}',
    '.clc-hint{margin:0;font-size:13px;color:var(--cm);line-height:1.45}',
    '.clc-err{display:flex;gap:7px;align-items:flex-start;margin:0;font-size:13.5px;font-weight:700;color:#b91c1c;line-height:1.45}',
    '.clc-go{min-height:52px;border-radius:15px;border:1px solid var(--ck);background:var(--ck);color:var(--con);font:inherit;font-size:16px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 12px 26px -12px rgba(17,17,19,.45);transition:transform .15s ease,box-shadow .15s ease}',
    '.clc-go[aria-disabled="true"]{opacity:.62;cursor:not-allowed}',
    '.clc-go[aria-busy="true"]{cursor:progress}',
    '.clc-chip:focus-visible,.clc-go:focus-visible,.clc-x:focus-visible,.clc-btn:focus-visible,.clc-src a:focus-visible,.clc-cell:focus-visible,.clc-sc .rm:focus-visible{outline:3px solid var(--ck);outline-offset:2px}',
    '.clc-out{display:flex;flex-direction:column;gap:18px;min-width:0;overflow-anchor:none}',
    '.clc-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:240px;padding:26px;border:1.5px dashed var(--cl2);border-radius:22px;background:var(--cs3);color:var(--cm);text-align:center;font-size:14.5px;line-height:1.55}',
    '.clc-h3{margin:0;font-size:18px;font-weight:800;letter-spacing:-.01em}',
    '.clc-sub{margin:3px 0 0;font-size:13.5px;color:var(--cm);font-weight:600}',
    '.clc-rhead{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:14px}',
    '.clc-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:12px}',
    '.clc-card{border:1px solid var(--cl);border-radius:18px;padding:15px;background:var(--cs3);display:flex;flex-direction:column;gap:10px}',
    '.clc-card h4{margin:0;font-size:14.5px;font-weight:800;color:var(--ck)}',
    '.clc-dl{margin:0;display:grid;grid-template-columns:1fr 1fr;gap:10px 12px}',
    '.clc-dl>div{display:flex;flex-direction:column;gap:2px;min-width:0}',
    '.clc-dl dt{font-size:12.5px;font-weight:700;color:var(--cm)}',
    '.clc-dl dd{margin:0;font-size:16px;font-weight:800;color:var(--ck);font-variant-numeric:tabular-nums;overflow-wrap:anywhere}',
    '.clc-dl dd small{display:block;font-size:12.5px;font-weight:700;color:var(--cm)}',
    '.clc-dl .main{grid-column:1/-1;padding-top:10px;border-top:1px dashed var(--cl)}',
    '.clc-dl .main dd{font-size:28px;color:var(--ck);letter-spacing:-.01em}',
    '.clc-dl .main dd small{font-size:14px}',
    '.clc-note{display:flex;gap:9px;align-items:flex-start;margin:14px 0 0;padding:11px 13px;border-radius:13px;background:var(--cs3);border:1px solid var(--cl);color:var(--cm2);font-size:13.5px;line-height:1.5;font-weight:600}',
    '.clc-note svg{flex:none;margin-top:1px;color:var(--ck)}',
    '.clc-btn{display:inline-flex;align-items:center;gap:7px;min-height:42px;padding:0 15px;border-radius:12px;border:1.5px solid var(--cl);background:var(--cs);color:var(--ck);font:inherit;font-size:14px;font-weight:800;cursor:pointer}',
    '.clc-btn:hover{border-color:var(--cm);color:var(--ck)}',
    '.clc-btn[disabled]{opacity:.55;cursor:not-allowed}',
    '.clc-tw{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 -4px;padding:0 4px}',
    '.clc-tw+.clc-tw{margin-top:16px}',
    '.clc-t{width:100%;border-collapse:separate;border-spacing:4px;font-size:14px;font-variant-numeric:tabular-nums;table-layout:fixed;min-width:330px}',
    '.clc-t caption{text-align:left;font-size:13.5px;font-weight:800;color:var(--ck);padding:0 4px 4px}',
    '.clc-t thead th{font-size:12px;font-weight:800;color:var(--cm);padding:4px 2px 6px;text-align:center}',
    '.clc-t thead th:first-child{text-align:left}',
    '.clc-t tbody th{text-align:left;font-size:13px;font-weight:800;padding:6px 4px;white-space:nowrap}',
    '.clc-t tbody th small{display:block;font-size:11.5px;font-weight:700;color:var(--cm)}',
    '.clc-t td{padding:0}',
    '.clc-cell{width:100%;min-height:48px;border-radius:12px;border:1.5px solid var(--cl);background:var(--cs);color:var(--ck);font:inherit;font-size:14px;font-weight:800;cursor:pointer;padding:4px 2px;transition:border-color .15s ease,background-color .15s ease}',
    '.clc-cell:hover{border-color:var(--cm);background:var(--cs2)}',
    '.clc-cell[aria-pressed="true"]{border-color:var(--ck);background:var(--ck);color:var(--con)}',
    '.clc-cell.na{border-style:dashed;background:var(--cs3);color:var(--cm4);cursor:default}',
    '.clc-legend{display:flex;flex-wrap:wrap;gap:6px 14px;margin:10px 0 0;font-size:12.5px;color:var(--cm);font-weight:600}',
    '.clc-legend span{display:inline-flex;align-items:center;gap:6px}',
    '.clc-legend i{width:12px;height:12px;border-radius:4px;display:inline-block}',
    '.clc-scn{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:10px;margin:0;padding:0;list-style:none}',
    '.clc-sc{position:relative;border:1px solid var(--cl);border-radius:16px;padding:13px 13px 13px 15px;background:var(--cs);display:flex;flex-direction:column;gap:6px}',
    '.clc-sc h4{margin:0;padding-right:36px;font-size:14px;font-weight:800;line-height:1.35}',
    '.clc-sc .k{display:flex;justify-content:space-between;gap:8px;font-size:13px;color:var(--cm);font-weight:600}',
    '.clc-sc .k b{color:var(--ck);font-weight:800;text-align:right;font-variant-numeric:tabular-nums}',
    '.clc-sc .r{margin-top:2px;padding-top:8px;border-top:1px dashed var(--cl);font-size:13px;font-weight:700;color:var(--cm3)}',
    '.clc-sc .r b{display:block;font-size:18px;font-weight:800;color:var(--ck);font-variant-numeric:tabular-nums}',
    '.clc-sc .rm{position:absolute;top:8px;right:8px;width:34px;height:34px;border:0;border-radius:10px;background:transparent;color:var(--cm);cursor:pointer;display:grid;place-items:center}',
    '.clc-sc .rm:hover{background:#fef2f2;color:#b91c1c}',
    '.clc-src{margin:0;font-size:13px;line-height:1.6;color:var(--cm)}',
    '.clc-src a{color:var(--ck);font-weight:800}',
    '@media (max-width:560px){.clc-form,.clc-box{padding:16px;border-radius:19px}.clc-dl .main dd{font-size:25px}.clc-risk{padding:14px}.clc-t{font-size:13px}.clc-cell{min-height:46px;font-size:13px}' +
      '.clc-tw{margin:0 -6px;padding:0 2px}.clc-t{min-width:296px;border-spacing:3px}.clc-t thead th:first-child{width:25%}.clc-t thead th{font-size:11.5px;padding:4px 0 6px}' +
      '.clc-t tbody th{white-space:normal;font-size:12.5px;padding:5px 2px;line-height:1.2}.clc-t tbody th small{font-size:10.5px;overflow-wrap:anywhere}.clc-cell{font-size:12.5px;padding:3px 1px;border-radius:10px}}',
    // şırınga / şişe görseli
    '.clc-viz{display:grid;grid-template-columns:76px minmax(0,1fr);gap:12px 16px;align-items:center;margin:0 0 14px;padding:14px 16px 10px;border-radius:18px;background:linear-gradient(135deg,var(--cs2) 0%,var(--cs) 60%);border:1px solid var(--cl)}',
    '.clc-viz figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0}',
    '.clc-viz figcaption{font-size:12.5px;font-weight:700;color:var(--cm);text-align:center;line-height:1.35}',
    '.clc-viz figcaption b{display:block;color:var(--ck);font-size:14px;font-variant-numeric:tabular-nums}',
    '.clc-vial-svg{width:64px;height:auto;display:block}',
    '.clc-syr{width:100%;height:auto;display:block;overflow:visible}',
    '.clc-syr-lbl text{font-size:17px;font-weight:700;fill:var(--cm);font-family:inherit}',
    '.clc-syr-v{font-size:16px;font-weight:800;font-family:inherit}',
    '.clc-syr-liq,.clc-vial-liq{transform-box:fill-box}',
    '.clc-syr-liq{transform-origin:0 50%}',
    '.clc-vial-liq{transform-origin:50% 100%}',
    '.clc-syr-drop{opacity:0}',
    '.clc-viz .clc-syr-liq,.clc-viz .clc-syr-pl,.clc-viz .clc-syr-mark,.clc-viz .clc-vial-liq{transition:transform .75s cubic-bezier(.22,.8,.3,1)}',
    '.clc-viz-note{grid-column:1/-1;margin:0;font-size:12px;color:var(--cm4);font-weight:600;text-align:right}',
    '.clc-empty .clc-syr{max-width:300px}',
    '.clc-cards.mix{grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr))}',
    '.clc-cards.mix .clc-dl .main dd{font-size:24px}',
    '.clc-syr-idle .clc-syr-mark{display:none}',
    '.clc-mix-k{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}',
    '.clc-mix-k span{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:999px;background:var(--cs2);font-size:13px;font-weight:700;color:var(--cm2)}',
    '.clc-mix-k b{color:var(--ck);font-variant-numeric:tabular-nums}',
    '.clc-mixsel{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}',
    '.clc-mixsel .clc-chip{min-height:40px;font-size:13.5px}',
    '.clc-mixsel .clc-chip[aria-pressed="true"]{border-color:var(--ck);background:var(--cs2);color:var(--ck);box-shadow:inset 0 0 0 1px var(--ck)}',
    '.clc-sc .k b span{display:block}',
    '@media (max-width:560px){.clc-viz{grid-template-columns:minmax(0,1fr);gap:8px;padding:12px 12px 8px}' +
      '.clc-viz figure:first-child{flex-direction:row;justify-content:flex-start;gap:12px}.clc-viz figure:first-child figcaption{text-align:left}' +
      '.clc-vial-svg{width:44px}.clc-syr-lbl text{font-size:28px}.clc-syr-lbl text.q{display:none}.clc-syr-v{font-size:22px}.clc-syr-pill{transform:scale(1.15);transform-box:fill-box;transform-origin:50% 0}' +
      '.clc-viz figcaption{font-size:12px}.clc-viz-note{text-align:left}' +
      '.clc-cards.mix{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.clc-cards.mix .clc-card{padding:12px;gap:8px}.clc-cards.mix .clc-dl{grid-template-columns:1fr;gap:8px}' +
      '.clc-cards.mix .clc-dl dd{font-size:15px}.clc-cards.mix .clc-dl .main{padding-top:8px}.clc-cards.mix .clc-dl .main dd{font-size:21px}}',
    '@media (prefers-reduced-motion:no-preference){.clc-res{animation:clcIn .22s ease-out}@keyframes clcIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}' +
      // boş durumda kısa bir "çekme" gösterimi (2 tur, sonra durur): şırınga boşalır → çözelti çekilir → yarıda bekler
      '.clc-syr-idle .clc-syr-pl{animation:clcPl 3.8s cubic-bezier(.45,0,.3,1) .5s 2}.clc-syr-idle .clc-syr-liq{animation:clcLq 3.8s cubic-bezier(.45,0,.3,1) .5s 2}' +
      '.clc-syr-idle .clc-syr-drop{animation:clcDr 3.8s ease-out .5s 2}' +
      '@keyframes clcPl{0%,100%{transform:translateX(150px)}30%,38%{transform:translateX(0)}78%{transform:translateX(210px)}}' +
      '@keyframes clcLq{0%,100%{transform:scaleX(.5)}30%,38%{transform:scaleX(0)}78%{transform:scaleX(.7)}}' +
      '@keyframes clcDr{0%,22%{opacity:0;transform:translateX(0)}30%{opacity:1}42%{opacity:0;transform:translateX(-6px)}100%{opacity:0}}' +
      '.clc-viz .clc-syr-drop{animation:clcDr2 .75s ease-out}@keyframes clcDr2{0%{opacity:0}30%{opacity:.9}100%{opacity:0}}}',
    '@media (prefers-reduced-motion:reduce){.clc *,.clc *::before,.clc *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}',
    // v-son: renk ve hareket — çözelti renkli, uyarı kutusu sarı vurgulu, kartlar sırayla belirir, sonuç sayıları sayarak gelir
    '.clc-risk{background:#FFFBEB;border:1px solid #FCD34D;border-left:5px solid #F59E0B;color:#78350F}.clc-risk>svg{color:#D97706;animation:clcWarn 2.4s ease-in-out 3}.clc-risk h2,.clc-risk b{color:#92400E}',
    '@keyframes clcWarn{0%,100%{transform:none}10%{transform:rotate(-8deg) scale(1.08)}20%{transform:rotate(6deg)}30%{transform:none}}',
    '.clc-warn{border-left:4px solid #F59E0B}',
    '.clc-n{background:linear-gradient(135deg,var(--liq2),var(--liq3));color:#fff}',
    '.clc-go{position:relative;overflow:hidden;transition:transform .15s ease,box-shadow .2s}.clc-go:hover{transform:translateY(-1px);box-shadow:0 10px 24px -10px var(--liq3)}.clc-go:active{transform:scale(.98)}',
    '.clc-go::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.28) 50%,transparent 70%);transform:translateX(-100%);animation:clcShine 3.2s ease-in-out 1s infinite}',
    '@keyframes clcShine{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}',
    '.clc-chip{transition:border-color .15s,background .15s,transform .15s cubic-bezier(.22,1,.36,1),box-shadow .15s}.clc-chip:hover{transform:translateY(-1px)}',
    '.clc-chip[aria-checked="true"]{border-color:var(--liq3);background:color-mix(in srgb,var(--liq1) 18%,var(--cs));box-shadow:inset 0 0 0 1px var(--liq3)}',
    '.clc-cell[aria-pressed="true"]{border-color:var(--liq3);background:var(--liq3);color:#fff}',
    '.clc-viz{background:linear-gradient(135deg,color-mix(in srgb,var(--liq1) 14%,var(--cs)) 0%,var(--cs) 65%);border-color:color-mix(in srgb,var(--liq2) 30%,var(--cl))}',
    '.clc-syr-bub circle{fill:#fff;opacity:0}.clc-syr-mark{stroke:var(--liq3)}',
    '.clc-dl .main dd{background:linear-gradient(90deg,var(--liq3),var(--ck));-webkit-background-clip:text;background-clip:text;color:transparent}',
    '@media (prefers-reduced-motion:no-preference){' +
      '.clc-risk,.clc-form,.clc-box{animation:clcUp .5s cubic-bezier(.22,1,.36,1) both}.clc-form{animation-delay:.08s}.clc-box{animation-delay:.16s}' +
      '@keyframes clcUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}' +
      '.clc-res .clc-card,.clc-res .clc-sc{animation:clcUp .45s cubic-bezier(.22,1,.36,1) both}.clc-res .clc-card:nth-child(2),.clc-res .clc-sc:nth-child(2){animation-delay:.07s}.clc-res .clc-card:nth-child(3),.clc-res .clc-sc:nth-child(3){animation-delay:.14s}' +
      '.clc-viz .clc-syr-bub circle{animation:clcBub 2.6s ease-in-out .8s infinite}.clc-viz .clc-syr-bub circle:nth-child(2){animation-delay:1.4s}.clc-viz .clc-syr-bub circle:nth-child(3){animation-delay:2s}.clc-viz .clc-syr-bub circle:nth-child(4){animation-delay:1s}' +
      '@keyframes clcBub{0%{opacity:0;transform:translateY(0)}30%{opacity:.75}100%{opacity:0;transform:translateY(-22px)}}' +
      '.clc-viz .clc-syr-shine{animation:clcGl 3s ease-in-out infinite}@keyframes clcGl{0%,100%{opacity:.55}50%{opacity:.9}}' +
      '.clc-viz .clc-vial-liq{animation:clcVial 3s ease-in-out infinite}@keyframes clcVial{0%,100%{opacity:.8}50%{opacity:1}}' +
    '}',
    ':root[data-theme="dark"] .clc{--ck:#F4F4F5;--con:#0B0B0D;--cs:#121215;--cs2:#1B1B1F;--cs3:#16161A;--cm:#A1A1AA;--cm2:#B4B4BB;--cm3:#D4D4D8;--cm4:#71717A;--cl:#26262B;--cl2:#3A3A41;--liq1:#22D3EE;--liq2:#0891B2;--liq3:#67E8F9}',
    ':root[data-theme="dark"] .clc-risk{background:#2A2311;border-color:#4A3C14;border-left-color:#F59E0B;color:#FDE68A}:root[data-theme="dark"] .clc-risk h2,:root[data-theme="dark"] .clc-risk b{color:#FCD34D}',
    ':root[data-theme="dark"] .clc-warn{background:#2A2311;border-color:#4A3C14;color:#FDE68A}:root[data-theme="dark"] .clc-err{color:#FCA5A5}',
    ':root[data-theme="dark"] .clc-cell[aria-pressed="true"]{color:#0B0B0D}'
  ].join('\n');

  var I = function (w, body, extra) { return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + body + '</svg>'; };
  var IC = {
    calc: I(19, '<rect x="4" y="2" width="16" height="20" rx="2"></rect><path d="M8 6h8"></path><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h4"></path>'),
    search: I(17, '<circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path>'),
    x: I(16, '<path d="M18 6L6 18M6 6l12 12"></path>'),
    err: I(15, '<circle cx="12" cy="12" r="9"></circle><path d="M12 8v5M12 16h.01"></path>', ' style="flex:none;margin-top:1px"'),
    warn: I(20, '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><path d="M12 9v4M12 17h.01"></path>'),
    warnS: I(17, '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><path d="M12 9v4M12 17h.01"></path>', ' style="flex:none;margin-top:1px"'),
    info: I(17, '<circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01M11 12h1v4h1"></path>'),
    plus: I(15, '<path d="M12 5v14M5 12h14"></path>')
  };

  // ------------------------------------------------------------------ yardımcılar
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var lang = (AVF.lang === 'en') ? 'en' : 'tr';
  var num = function (x, d) {
    if (x == null || !isFinite(x)) return '—';
    try { return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'tr-TR', { maximumFractionDigits: d == null ? 4 : d, useGrouping: false }).format(x); } catch (e) { return String(x); }
  };
  var ml = function (v) { return num(v) + ' mL'; };
  var parseDose = function (dose) {   // yalnız gösterim için (şişedeki miktar); hesap sunucuda
    if (dose == null || !String(dose).trim()) return null;
    var out = [], ok = String(dose).split('+').every(function (part) {
      var m = /^\s*(?:(.*?)\s+)?(\d{1,6}(?:[.,]\d{1,4})?)\s*(mg|mcg|µg|ug|iu)\s*$/i.exec(part);
      if (!m) return false;
      var u = m[3].toLowerCase();
      out.push({ name: (m[1] || '').trim() || null, amount: Number(m[2].replace(',', '.')), unit: u === 'mg' ? 'mg' : u === 'iu' ? 'IU' : 'mcg' });
      return true;
    });
    return ok && out.length ? out : null;
  };
  var NO_DOSE = 'Şişedeki miktarı girin.';
  var BAD_UNIT = 'Şişedeki miktar mg, mcg veya IU olarak girilmelidir.';
  var doseProblem = function (p) { return !p ? '' : parseDose(p.dose) ? '' : (p.dose && String(p.dose).trim() ? BAD_UNIT : NO_DOSE); };
  var familyName = function (p) { return String(p.name || '').replace(/\s+Kit$/i, '').replace(/\s+\d+(?:[.,]\d+)?\s*(?:mg|mcg|IU)$/i, '').trim(); };
  var fold = function (s) { return String(s || '').toLocaleLowerCase('tr-TR').replace(/ı/g, 'i').replace(/[^a-z0-9ğüşöç+]/g, ''); };
  var doseLabel = function (p) {
    var parts = parseDose(p.dose);
    if (!parts) return p.dose && String(p.dose).trim() ? String(p.dose) : 'İçerik tanımsız';
    var same = parts.every(function (x) { return x.unit === parts[0].unit; });
    if (parts.length > 1 && same) return parts.map(function (x) { return num(x.amount); }).join(' + ') + ' ' + parts[0].unit;   // karışım: 50 + 10 + 10 mg
    return parts.map(function (x) { return num(x.amount) + ' ' + x.unit; }).join(' + ');
  };
  /** Şişe etiketi için kısa içerik: tek madde "30 mg"; aynı birimli karışım toplamı "70 mg"; farklı birimler "Karışım". */
  var vialTag = function (dose) {
    var parts = parseDose(dose); if (!parts) return '';
    if (parts.length === 1) return num(parts[0].amount) + ' ' + parts[0].unit;
    var same = parts.every(function (x) { return x.unit === parts[0].unit; });
    return same ? num(parts.reduce(function (a, x) { return a + x.amount; }, 0)) + ' ' + parts[0].unit : '∑';
  };

  // ------------------------------------------------------------------ şırınga ve şişe çizimi (yalnız görsel; değerler sunucunun sonucundan)
  // Ölçek: 1 mL şırınga, 0,05 mL ara çizgi. Hareket CSS geçişiyle (transform) yapılır; "hareketi azalt" tercihinde geçiş yoktur.
  var SYR_L = 300, SYR_X = 82;   // 1 mL = 300 birim
  var uid = 0;
  /** Sonuçtaki ana değerler sıfırdan sayarak gelir (yalnız ilk metin düğümündeki sayı; birim ve biçim korunur). */
  var countUp = function (root) {
    if (!window.requestAnimationFrame || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    Array.prototype.forEach.call(root.querySelectorAll('.clc-dl .main dd'), function (dd) {
      var tn = dd.firstChild; if (!tn || tn.nodeType !== 3) return;
      var txt = tn.nodeValue, m = /^([^0-9]*)([0-9][0-9.,]*)(.*)$/.exec(txt); if (!m) return;
      var raw = m[2], dec = raw.indexOf(',') >= 0 ? ',' : raw.indexOf('.') >= 0 && !/^\d{1,3}(\.\d{3})+$/.test(raw) ? '.' : '';
      var digits = dec ? (raw.split(dec)[1] || '').length : 0;
      var target = parseFloat(dec === ',' ? raw.replace(/\./g, '').replace(',', '.') : raw.replace(/,/g, '')); if (!isFinite(target) || target <= 0) return;
      var t0 = null, D = 700;
      var step = function (t) {
        if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3), v = target * e;
        var str = v.toFixed(digits); if (dec === ',') str = str.replace('.', ',');
        tn.nodeValue = k < 1 ? m[1] + str + m[3] : txt;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  var syringeSvg = function (cls) {
    var id = 'clcg' + (++uid), ticks = '', labels = '';
    for (var i = 0; i <= 20; i++) {
      var x = SYR_X + i * SYR_L / 20, major = i % 5 === 0;
      ticks += '<line x1="' + x + '" y1="47" x2="' + x + '" y2="' + (major ? 63 : 56) + '"/>';
      if (major) labels += '<text x="' + x + '" y="35" text-anchor="middle"' + (i % 10 ? ' class="q"' : '') + '>' + num(i / 20) + (i === 20 ? ' mL' : '') + '</text>';
    }
    return '<svg class="clc-syr ' + (cls || '') + '" viewBox="0 0 730 140" aria-hidden="true" focusable="false" data-notr>' +
      '<defs><linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f4f4f5"/><stop offset="1" stop-color="#e4e4e7"/></linearGradient>' +
      '<linearGradient id="' + id + 'l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--liq1)"/><stop offset=".5" style="stop-color:var(--liq2)"/><stop offset="1" style="stop-color:var(--liq3)"/></linearGradient></defs>' +
      '<circle class="clc-syr-drop" cx="7" cy="70" r="4.5" style="fill:var(--liq2)"/>' +
      '<path d="M8 70H58" stroke="#a1a1aa" stroke-width="3" stroke-linecap="round"/><path d="M8 70l6-3" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="56" y="61" width="18" height="18" rx="3" fill="#d4d4d8"/><rect x="72" y="64" width="12" height="12" rx="2" fill="#e4e4e7" stroke="#d4d4d8"/>' +
      '<rect x="' + SYR_X + '" y="46" width="' + SYR_L + '" height="48" rx="9" fill="url(#' + id + 'g)" stroke="#a1a1aa" stroke-width="2"/>' +
      '<rect class="clc-syr-liq" x="' + (SYR_X + 2) + '" y="49" width="' + (SYR_L - 4) + '" height="42" rx="7" fill="url(#' + id + 'l)" opacity=".9"/>' +
      '<g class="clc-syr-bub" aria-hidden="true"><circle cx="' + (SYR_X + 40) + '" cy="80" r="3"/><circle cx="' + (SYR_X + 120) + '" cy="72" r="2.2"/><circle cx="' + (SYR_X + 210) + '" cy="83" r="2.6"/><circle cx="' + (SYR_X + 300) + '" cy="76" r="1.8"/></g>' +
      '<rect class="clc-syr-shine" x="' + (SYR_X + 8) + '" y="51" width="' + (SYR_L - 16) + '" height="5" rx="2.5" fill="#fff" opacity=".7"/>' +
      '<g class="clc-syr-ticks" stroke="#71717a" stroke-width="1.6">' + ticks + '</g><g class="clc-syr-lbl">' + labels + '</g>' +
      '<rect x="' + (SYR_X + SYR_L - 2) + '" y="28" width="11" height="84" rx="4" fill="#d4d4d8" stroke="#a1a1aa" stroke-width="1.5"/>' +
      '<g class="clc-syr-pl"><rect x="' + SYR_X + '" y="48" width="15" height="44" rx="4" fill="#3f3f46"/><rect x="' + (SYR_X + 4) + '" y="48" width="3" height="44" fill="#52525b"/>' +
        '<rect x="' + (SYR_X + 15) + '" y="63" width="' + (SYR_L + 12) + '" height="14" rx="3" fill="#e4e4e7" stroke="#a1a1aa" stroke-width="1.5"/>' +
        '<rect x="' + (SYR_X + SYR_L + 25) + '" y="36" width="12" height="68" rx="5" fill="#a1a1aa"/></g>' +
      '<g class="clc-syr-mark"><line x1="' + SYR_X + '" y1="40" x2="' + SYR_X + '" y2="100" stroke="#111113" stroke-width="2.5" stroke-dasharray="5 4"/>' +
        '<rect class="clc-syr-pill" x="' + (SYR_X - 52) + '" y="104" width="104" height="32" rx="16" fill="#111113"/><text class="clc-syr-v" x="' + SYR_X + '" y="126" text-anchor="middle" fill="#fff"></text></g>' +
      '</svg>';
  };
  var vialSvg = function (tag) {
    var id = 'clcv' + (++uid);
    return '<svg class="clc-vial-svg" viewBox="0 0 90 150" aria-hidden="true" focusable="false" data-notr>' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e4e4e7"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#e4e4e7"/></linearGradient></defs>' +
      '<rect x="24" y="3" width="42" height="15" rx="4" fill="#111113"/><rect x="21" y="16" width="48" height="11" rx="3" fill="#d4d4d8"/><rect x="29" y="27" width="32" height="10" fill="#e4e4e7"/>' +
      '<rect x="12" y="36" width="66" height="108" rx="13" fill="url(#' + id + ')" stroke="#a1a1aa" stroke-width="2"/>' +
      '<rect class="clc-vial-liq" x="15" y="58" width="60" height="83" rx="10" style="fill:var(--liq1)" opacity=".85"/>' +
      '<rect x="12" y="76" width="66" height="30" fill="#fff" stroke="#e4e4e7"/><text x="45" y="96" text-anchor="middle" font-size="15" font-weight="800" fill="#111113">' + esc(tag) + '</text>' +
      '</svg>';
  };
  var rnd = function (x, d) { var f = Math.pow(10, d == null ? 4 : d); return Math.round((x + Number.EPSILON) * f) / f; };
  /** Bir çözücü + hacim çifti için madde satırları (Alpeptit sunucusundaki utils/reconstitution.js ile aynı hesap). */
  var rowsFor = function (parts, bacMl, volumeMl) {
    return parts.map(function (p) {
      var conc = p.amount / bacMl, amt = conc * volumeMl;
      var row = { name: p.name, vialAmount: p.amount, unit: p.unit, concentration: rnd(conc), concentrationUnit: p.unit + '/mL', volumeMl: volumeMl, amount: rnd(amt), amountUnit: p.unit };
      if (p.unit === 'mg') { row.concentrationMcg = rnd(conc * 1000, 2); row.amountMcg = rnd(amt * 1000, 2); }
      return row;
    });
  };
  var amountTxt = function (r) { return num(r.amount) + ' ' + r.amountUnit + (r.amountMcg != null ? ' (' + num(r.amountMcg, 2) + ' mcg)' : ''); };

  // ------------------------------------------------------------------ bileşen
  function Calc(root) {
    this.root = root; this.fams = []; this.fam = null; this.prod = null; this.bac = null; this.vol = null;
    this.res = null; this.auto = false; this.scn = []; this.busy = false; this.seq = 0; this.active = -1; this.matches = []; this.refocus = null; this.last = null; this.mixIx = 0; this.vizPrev = null;
    this.build();
  }
  Calc.prototype.$ = function (sel) { return this.root.querySelector(sel); };
  var optBtns = function (name) {
    return OPTIONS.map(function (v) {
      return '<button type="button" role="radio" class="clc-chip" data-' + name + '="' + v + '" aria-checked="false" tabindex="-1"><span data-notr>' + esc(num(v)) + '</span><small>mL</small></button>';
    }).join('');
  };
  Calc.prototype.build = function () {
    var r = this.root;
    if (!document.getElementById('avf-calc-css')) { var st = document.createElement('style'); st.id = 'avf-calc-css'; st.textContent = CSS; document.head.appendChild(st); }
    r.innerHTML =
      '<section class="clc" aria-label="Dozaj Hesaplayıcısı">' +
        '<div class="clc-risk" role="note" aria-labelledby="clc-risk-h">' + IC.warn + '<div><h2 id="clc-risk-h">Hesaplamadan önce okuyun</h2><ul>' +
          '<li><span>Bu araç yalnızca çözelti konsantrasyonu ve hacim hesabı yapar;</span> <b>doz önerisi veya tıbbi tavsiye değildir.</b></li>' +
          '<li><span>Listedeki maddeler yalnızca hesap için verilmiştir; AlpveFit bu maddelerin kullanımını önermez.</span></li>' +
          '<li><span>Sonuç, şişede etikette yazan miktarın bulunduğu, tozun tamamen çözündüğü ve hacmin doğru ölçüldüğü varsayımına dayanır. Gerçek içerik, ölçüm ve yuvarlama farkları sonucu değiştirebilir.</span></li>' +
          '<li><span>Sağlığınızı ilgilendiren her karar için bir hekime veya eczacıya danışın.</span></li>' +
        '</ul></div></div>' +
        '<div class="clc-grid">' +
          '<form class="clc-form" novalidate aria-label="Hesaplama değerleri">' +
            // 1 — ürün
            '<div class="clc-f">' +
              '<label class="clc-l" for="clc-q"><span class="clc-n" aria-hidden="true">1</span><span>Madde</span></label>' +
              '<div class="clc-combo">' + IC.search +
                '<input id="clc-q" class="clc-in" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="clc-lb" autocomplete="off" spellcheck="false" enterkeyhint="search" placeholder="Madde ara (ör. BPC-157)" aria-describedby="clc-w-product clc-e-product">' +
                '<button type="button" class="clc-x" aria-label="Aramayı temizle" hidden>' + IC.x + '</button>' +
                '<ul id="clc-lb" class="clc-lb" role="listbox" aria-label="Maddeler" hidden></ul>' +
              '</div>' +
              '<div class="clc-chips clc-doses" role="radiogroup" aria-label="mg seçeneği" hidden></div>' +
              '<div class="clc-custom" hidden><input class="clc-in clc-camt" type="text" inputmode="decimal" autocomplete="off" maxlength="9" placeholder="Şişedeki miktar (ör. 10)" aria-label="Şişedeki miktar">' +
                '<div class="clc-chips clc-cunit" role="radiogroup" aria-label="Birim"><button type="button" role="radio" class="clc-chip" data-u="mg" aria-checked="true">mg</button><button type="button" role="radio" class="clc-chip" data-u="mcg" aria-checked="false">mcg</button><button type="button" role="radio" class="clc-chip" data-u="IU" aria-checked="false">IU</button></div></div>' +
              '<p class="clc-vial" hidden><span>Şişedeki miktar</span><b class="clc-vial-v" data-notr></b></p>' +
              '<p class="clc-warn" id="clc-w-product" role="note" hidden>' + IC.warnS + '<span class="clc-w-t"></span></p>' +
              '<p class="clc-err" id="clc-e-product" hidden></p>' +
            '</div>' +
            // 2 — BAC
            '<div class="clc-f">' +
              '<span class="clc-l" id="clc-l-bac"><span class="clc-n" aria-hidden="true">2</span><span>BAC miktarı</span></span>' +
              '<p class="clc-hint" id="clc-h-bac">Şişeye eklenecek bakteriyostatik su (mL)</p>' +
              '<div class="clc-opts clc-bac" role="radiogroup" aria-labelledby="clc-l-bac" aria-describedby="clc-h-bac clc-e-bac">' + optBtns('bac') + '</div>' +
              '<p class="clc-err" id="clc-e-bac" hidden></p>' +
            '</div>' +
            // 3 — çekilecek hacim
            '<div class="clc-f">' +
              '<span class="clc-l" id="clc-l-vol"><span class="clc-n" aria-hidden="true">3</span><span>Çekilecek hacim</span></span>' +
              '<p class="clc-hint" id="clc-h-vol">Şırıngaya çekilecek çözelti (mL); eklenen BAC miktarından fazla olamaz.</p>' +
              '<div class="clc-opts clc-vol" role="radiogroup" aria-labelledby="clc-l-vol" aria-describedby="clc-h-vol clc-e-vol">' + optBtns('vol') + '</div>' +
              '<p class="clc-err" id="clc-e-vol" hidden></p>' +
            '</div>' +
            '<button type="submit" class="clc-go" aria-describedby="clc-e-all">' + IC.calc + '<span>Hesapla</span></button>' +
            '<p class="clc-err" id="clc-e-all" role="alert" hidden></p>' +
          '</form>' +
          '<div class="clc-out" aria-live="polite"></div>' +
        '</div>' +
        '<p class="clc-src"><span>Formül: Konsantrasyon = Şişedeki madde ÷ Eklenen BAC · Çekilen hacimdeki miktar = Konsantrasyon × Çekilen hacim · 1 mg = 1000 mcg.</span></p>' +
      '</section>';
    this.bind(); this.syncOpts(); this.renderOut();
    this.setProducts();
  };

  // ------------------------------------------------------------------ ürün seçimi (aranabilir liste + mg seçenekleri)
  Calc.prototype.setProducts = function () {
    var fams = CATALOG.map(function (c, i) {
      return { key: 'k' + i, name: c[0], items: c[1].map(function (d, j) { return { id: 'k' + i + '-' + j, name: c[0], dose: d }; }) };
    });
    fams.forEach(function (f) { f.fold = fold(f.name); });
    fams.sort(function (a, b) { return a.name.localeCompare(b.name, 'tr', { numeric: true, sensitivity: 'base' }); });
    fams.push({ key: 'custom', name: 'Diğer (elle gir)', custom: true, items: [{ id: 'custom', name: 'Diğer', dose: '' }], fold: fold('diğer elle gir manuel other custom') });
    this.fams = fams;
  };
  Calc.prototype.openList = function (show) {
    var q = this.$('#clc-q'), lb = this.$('#clc-lb'), term = fold(q.value), self = this;
    this.matches = this.fams.filter(function (f) { return !term || f.fold.indexOf(term) >= 0; });
    if (!show) { lb.hidden = true; q.setAttribute('aria-expanded', 'false'); q.removeAttribute('aria-activedescendant'); this.active = -1; return; }
    if (this.active >= this.matches.length) this.active = this.matches.length - 1;
    lb.innerHTML = this.matches.length ? this.matches.map(function (f, i) {
      return '<li id="clc-o' + i + '" class="clc-op" role="option" aria-selected="' + (i === self.active) + '" data-i="' + i + '"><span>' + esc(f.name) + '</span><small data-notr>' + esc(f.items.map(doseLabel).join(' · ')) + '</small></li>';
    }).join('') : '<li class="clc-op none" role="option" aria-disabled="true" aria-selected="false"><span>' + 'Eşleşen madde yok' + '</span></li>';
    lb.hidden = false; q.setAttribute('aria-expanded', 'true');
    if (this.active >= 0) { q.setAttribute('aria-activedescendant', 'clc-o' + this.active); var el = lb.querySelector('#clc-o' + this.active); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' }); }
    else q.removeAttribute('aria-activedescendant');
  };
  Calc.prototype.pickFam = function (f) {
    this.fam = f; this.$('#clc-q').value = f.name; this.$('.clc-x').hidden = false; this.openList(false);
    this.pickProd(f.items[0]); this.clearErr('product');
    if (f.custom) { var ca = this.$('.clc-camt'); setTimeout(function () { ca.focus(); }, 0); }
  };
  Calc.prototype.renderDoses = function () {
    var box = this.$('.clc-doses'), f = this.fam, self = this;
    this.$('.clc-custom').hidden = !(f && f.custom);
    if (!f || f.custom) { box.hidden = true; box.innerHTML = ''; return; }
    box.hidden = false;
    box.innerHTML = f.items.map(function (p) {
      var on = self.prod && self.prod.id === p.id;
      return '<button type="button" role="radio" class="clc-chip' + (doseProblem(p) ? ' na' : '') + '" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-id="' + esc(p.id) + '"><span data-notr>' + esc(doseLabel(p)) + '</span></button>';
    }).join('');
  };
  Calc.prototype.customDose = function () {
    var v = String(this.$('.clc-camt').value || '').replace(',', '.'), u = (this.$('.clc-cunit [aria-checked="true"]') || {}).getAttribute ? this.$('.clc-cunit [aria-checked="true"]').getAttribute('data-u') : 'mg';
    var n = Number(v); return v && isFinite(n) && n > 0 && n <= 100000 ? num(n).replace(',', '.') + ' ' + u : '';
  };
  Calc.prototype.pickProd = function (p) {
    if (!p || !this.prod || p.id !== this.prod.id) this.mixIx = 0;
    if (p && p.id === 'custom') p = { id: 'custom', name: 'Diğer', dose: this.customDose() };
    this.prod = p || null;
    var parts = parseDose(p && p.dose), prob = doseProblem(p);
    this.$('.clc-vial').hidden = !parts;
    if (parts) this.$('.clc-vial-v').textContent = parts.map(function (x) { return (x.name ? x.name + ' ' : '') + num(x.amount) + ' ' + x.unit; }).join(' + ');
    var cust = p && p.id === 'custom';
    var w = this.$('#clc-w-product'); w.hidden = !prob || cust; this.$('.clc-w-t').textContent = prob;
    this.renderDoses(); this.syncGo(); this.changed();
  };
  Calc.prototype.clearProduct = function () {
    this.fam = null; this.prod = null; this.renderDoses();
    this.$('.clc-vial').hidden = true; this.$('#clc-w-product').hidden = true; this.syncGo(); this.changed();
  };

  // ------------------------------------------------------------------ BAC ve çekilecek hacim (yalnız 4 seçenek)
  Calc.prototype.syncOpts = function () {
    var self = this;
    var mark = function (sel, cur, dis) {
      var btns = Array.prototype.slice.call(self.root.querySelectorAll(sel)), focusable = null;
      btns.forEach(function (b) {
        var v = Number(b.getAttribute(sel.indexOf('bac') >= 0 ? 'data-bac' : 'data-vol')), on = cur != null && Math.abs(v - cur) < 1e-9, off = dis && dis(v);
        b.setAttribute('aria-checked', String(on));
        if (off) { b.setAttribute('aria-disabled', 'true'); b.title = 'Eklenen BAC miktarından fazla olamaz'; } else { b.removeAttribute('aria-disabled'); b.removeAttribute('title'); }
        if (on) focusable = b;
      });
      btns.forEach(function (b) { b.tabIndex = (focusable ? b === focusable : b === btns[0]) ? 0 : -1; });
    };
    mark('[data-bac]', this.bac, null);
    mark('[data-vol]', this.vol, function (v) { return self.bac != null && v > self.bac + 1e-9; });
  };
  Calc.prototype.setBac = function (v) { this.bac = v; this.clearErr('bac'); if (this.vol == null || this.vol <= v + 1e-9) this.clearErr('vol'); this.syncOpts(); this.changed(); };
  Calc.prototype.setVol = function (v) { this.vol = v; this.clearErr('vol'); this.syncOpts(); this.changed(); };
  Calc.prototype.syncGo = function () { this.$('.clc-go').setAttribute('aria-disabled', String(!!(this.prod && doseProblem(this.prod)))); };

  /** İstemci tarafı denetim — iletiler sunucudakiyle aynı (src/utils/reconstitution.js, src/routes/tools.js). Hata yoksa null. */
  Calc.prototype.check = function () {
    var e = {};
    if (!this.prod) e.product = 'Listeden bir madde seçin.';
    else if (this.prod.id === 'custom' && doseProblem(this.prod)) e.product = 'Şişedeki miktarı sıfırdan büyük bir sayı olarak girin.';
    else if (doseProblem(this.prod)) e.nodose = true;   // uyarı kutusu zaten görünür (alanın açıklaması); aynı ileti tekrarlanmaz
    if (this.bac == null) e.bac = 'BAC miktarı seçin.';
    if (this.vol == null) e.vol = 'Çekilecek hacim seçin.';
    else if (this.bac != null && this.vol > this.bac + 1e-9) e.vol = 'Çekilecek hacim, eklenen BAC miktarından (' + ml(this.bac) + ') fazla olamaz.';
    return Object.keys(e).length ? e : null;
  };
  var FIELD = { product: '#clc-q', bac: '.clc-bac .clc-chip', vol: '.clc-vol .clc-chip', bacMl: '.clc-bac .clc-chip', volumeMl: '.clc-vol .clc-chip' };
  var BOX = { product: '#clc-e-product', bac: '#clc-e-bac', vol: '#clc-e-vol', bacMl: '#clc-e-bac', volumeMl: '#clc-e-vol' };
  Calc.prototype.err = function (k, msg) {
    var box = this.$(BOX[k] || '#clc-e-all');
    box.innerHTML = IC.err + '<span>' + esc(msg) + '</span>'; box.hidden = false;
    if (k === 'product') this.$('#clc-q').setAttribute('aria-invalid', 'true');
  };
  Calc.prototype.clearErr = function (k) {
    var self = this;
    (k ? [k] : ['product', 'bac', 'vol', 'all']).forEach(function (x) { var b = self.$(BOX[x] || '#clc-e-all'); if (b) { b.hidden = true; b.innerHTML = ''; } });
    if (!k || k === 'product') this.$('#clc-q').removeAttribute('aria-invalid');
  };
  Calc.prototype.focusField = function (k) {
    var el = k === 'bac' || k === 'vol' || k === 'bacMl' || k === 'volumeMl'
      ? (this.$((k === 'bac' || k === 'bacMl' ? '.clc-bac' : '.clc-vol') + ' .clc-chip[tabindex="0"]')) : this.$(FIELD[k] || '#clc-q');
    if (el) el.focus();
  };
  /** Bir değer değişti: ilk hesaptan sonra kendiliğinden yeniden hesaplanır; geçersiz seçimde önceki sonuç ASLA gösterilmez. */
  Calc.prototype.changed = function () {
    if (!this.auto) return;
    var e = this.check();
    if (e) { this.res = null; this.renderOut(); if (e.vol && this.vol != null) this.err('vol', e.vol); return; }
    if (!this.fromMatrix()) this.submit(true);
  };
  /** Aynı madde için BAC / hacim değişince sonuç, son hesaplanan senaryo tablosundan (4 × 4) alınır;
   *  yeniden hesap gerekmez. Madde veya mg değiştiyse ya da tablo yoksa false → yeniden hesaplanır. */
  Calc.prototype.fromMatrix = function () {
    var d = this.last, self = this;
    if (!d || !this.prod || d.product.id !== this.prod.id || d.product.dose !== this.prod.dose || this.bac == null || this.vol == null) return false;
    var row = d.matrix.filter(function (r) { return Math.abs(r.bacMl - self.bac) < 1e-9; })[0];
    var cell = row && row.cells.filter(function (c) { return Math.abs(c.volumeMl - self.vol) < 1e-9; })[0];
    if (!cell || !cell.available || !cell.rows || !cell.rows.length) return false;
    this.seq++; this.busy = false; this.$('.clc-go').removeAttribute('aria-busy');   // bekleyen eski yanıt artık gösterilmez
    var matrix = d.matrix.map(function (r) { return Object.assign({}, r, { cells: r.cells.map(function (c) { return Object.assign({}, c, { selected: r === row && c === cell }); }) }); });
    this.clearErr();
    this.res = Object.assign({}, d, { bacMl: row.bacMl, volumeMl: cell.volumeMl, rows: cell.rows, matrix: matrix, label: d.product.name });
    this.renderOut();
    return true;
  };

  // ------------------------------------------------------------------ hesapla (sunucu)
  Calc.prototype.submit = function (quiet) {
    this.clearErr();
    var e = this.check(), self = this;
    if (e) {
      this.res = null; this.renderOut();
      Object.keys(e).forEach(function (k) { if (k !== 'nodose') self.err(k, e[k]); });
      if (!quiet) { var first = ['product', 'nodose', 'bac', 'vol'].filter(function (k) { return e[k]; })[0]; this.focusField(first === 'nodose' ? 'product' : first); }
      return;
    }
    var parts = parseDose(this.prod.dose);
    if (!parts) { this.res = null; this.renderOut(); this.err('product', doseProblem(this.prod) || BAD_UNIT); return; }
    this.seq++;
    var bac = this.bac, vol = this.vol;
    var matrix = OPTIONS.map(function (b) {
      return { bacMl: b, concentration: parts.map(function (p) { return { name: p.name, value: rnd(p.amount / b), unit: p.unit + '/mL' }; }),
        cells: OPTIONS.map(function (v) { return { volumeMl: v, available: v <= b + 1e-9, selected: b === bac && v === vol, rows: v <= b + 1e-9 ? rowsFor(parts, b, v) : [] }; }) };
    });
    var d = { product: { id: this.prod.id, name: this.prod.name, dose: this.prod.dose }, bacMl: bac, volumeMl: vol, unit: 'mL', rows: rowsFor(parts, bac, vol), matrix: matrix };
    this.auto = true; this.last = d;
    this.res = Object.assign({}, d, { label: d.product.name });
    this.renderOut();
  };

  // ------------------------------------------------------------------ sonuç, senaryo tablosu (BAC × çekilen hacim), sabitlenen senaryolar
  Calc.prototype.renderOut = function () {
    var out = this.root.querySelector('.clc-out'), d = this.res;
    if (!d) {
      out.innerHTML = '<div class="clc-empty">' + syringeSvg('clc-syr-idle') + '<p>Maddeyi, BAC miktarını ve çekilecek hacmi seçip “Hesapla”ya basın. Sonuç ve senaryo karşılaştırması burada görünür.</p></div>' + this.scnHtml();
      this.bindOut(); this.syncViz(true); return;
    }
    var mix = d.rows.length > 1, self = this;
    if (!mix) this.mixIx = 0; else if (!(this.mixIx < d.rows.length)) this.mixIx = 0;
    var cards = d.rows.map(function (r) {
      return '<article class="clc-card">' + (mix ? '<h4 data-notr>' + esc(r.name) + '</h4>' : '') + '<dl class="clc-dl">' +
        '<div><dt>Şişedeki miktar</dt><dd data-notr>' + esc(num(r.vialAmount) + ' ' + r.unit) + '</dd></div>' +
        (mix ? '' : '<div><dt>Eklenen BAC</dt><dd data-notr>' + esc(ml(d.bacMl)) + '</dd></div>') +
        '<div><dt>Konsantrasyon</dt><dd data-notr>' + esc(num(r.concentration) + ' ' + r.concentrationUnit) + (r.concentrationMcg != null ? ' <small>' + esc(num(r.concentrationMcg, 2)) + ' mcg/mL</small>' : '') + '</dd></div>' +
        (mix ? '' : '<div><dt>Çekilen hacim</dt><dd data-notr>' + esc(ml(r.volumeMl)) + '</dd></div>') +
        '<div class="main"><dt>Bu hacimdeki miktar</dt><dd data-notr>' + esc(num(r.amount) + ' ' + r.amountUnit) + (r.amountMcg != null ? ' <small>' + esc(num(r.amountMcg, 2)) + ' mcg</small>' : '') + '</dd></div>' +
        '</dl></article>';
    }).join('');
    var mixSel = mix ? '<div class="clc-mixsel" role="group" aria-label="Tablodaki madde">' + d.rows.map(function (r, i) {
      return '<button type="button" class="clc-chip" data-mix="' + i + '" aria-pressed="' + (i === self.mixIx) + '"><span data-notr>' + esc(r.name) + '</span></button>';
    }).join('') + '</div>' : '';
    var tables = d.rows.map(function (r0, ix) {
      if (mix && ix !== self.mixIx) return '';
      return '<div class="clc-tw"><table class="clc-t">' + (mix ? '<caption data-notr>' + esc(r0.name) + '</caption>' : '<caption class="clc-sr">BAC miktarına ve çekilen hacme göre miktar</caption>') +
        '<thead><tr><th scope="col"><span>BAC</span> <span aria-hidden="true">↓</span> <span class="clc-sr">/</span> <span>Hacim</span> <span aria-hidden="true">→</span></th>' +
        OPTIONS.map(function (v) { return '<th scope="col" data-notr>' + esc(ml(v)) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        d.matrix.map(function (row) {
          var c0 = row.concentration[ix];
          return '<tr><th scope="row"><span data-notr>' + esc(ml(row.bacMl)) + '</span><small data-notr>' + esc(num(c0.value) + ' ' + c0.unit) + '</small></th>' +
            row.cells.map(function (c) {
              if (!c.available) return '<td><button type="button" class="clc-cell na" disabled aria-label="Bu senaryo geçersiz: çekilen hacim eklenen BAC miktarından fazla"><span aria-hidden="true">—</span></button></td>';
              var rr = c.rows[ix];
              return '<td><button type="button" class="clc-cell" data-b="' + row.bacMl + '" data-v="' + c.volumeMl + '" aria-pressed="' + c.selected + '" aria-label="' + esc(ml(row.bacMl) + ' BAC · ' + ml(c.volumeMl) + ' · ' + num(rr.amount) + ' ' + rr.amountUnit) + '" data-notr>' + esc(num(rr.amount) + ' ' + rr.amountUnit) + '</button></td>';
            }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
    }).join('');
    out.innerHTML =
      '<div class="clc-box clc-res"><div class="clc-rhead"><div><h3 class="clc-h3">Sonuç</h3><p class="clc-sub" data-notr>' + esc(AVF.t ? AVF.t(d.label) : d.label) + ' · ' + esc(doseLabel(d.product)) + ' · ' + esc(ml(d.bacMl)) + ' BAC</p></div>' +
        '<button type="button" class="clc-btn clc-pin"' + (this.scn.length >= MAX_SCN ? ' disabled' : '') + '>' + IC.plus + '<span>Karşılaştırmaya ekle</span></button></div>' +
        this.vizHtml(d) +
        (mix ? '<p class="clc-mix-k"><span><span>Eklenen BAC</span> <b data-notr>' + esc(ml(d.bacMl)) + '</b></span><span><span>Çekilen hacim</span> <b data-notr>' + esc(ml(d.volumeMl)) + '</b></span></p>' : '') +
        '<div class="clc-cards' + (mix ? ' mix' : '') + '">' + cards + '</div>' +
        '<p class="clc-note" role="note">' + IC.info + '<span>Bu sonuç yalnızca çözelti konsantrasyonu ve hacim hesabıdır; doz önerisi veya tıbbi tavsiye değildir. Kullanım kararı için bir hekime veya eczacıya danışın.</span></p></div>' +
      '<div class="clc-box"><div class="clc-rhead"><div><h3 class="clc-h3">Senaryo karşılaştırması</h3><p class="clc-sub">Her BAC miktarı ve çekilen hacim için şırıngadaki miktar · bir hücreye dokunarak o senaryoyu seçin</p></div></div>' + mixSel + tables +
        '<p class="clc-legend"><span><i style="background:#111113"></i><span>Seçili senaryo</span></span><span><i style="border:1.5px dashed #a1a1aa;background:#fafaf9"></i><span>— Çekilen hacim eklenen BAC miktarından fazla (geçersiz)</span></span></p></div>' +
      this.scnHtml();
    this.bindOut(); this.syncViz(false);
    if (this.refocus) { var rf = this.root.querySelector(this.refocus); this.refocus = null; if (rf) rf.focus({ preventScroll: true }); }
  };
  /** Şişe (eklenen BAC) + şırınga (çekilen hacim) görseli. Değerler sunucunun sonucundan; yalnız görsel (ekran okuyucudan gizli). */
  Calc.prototype.vizHtml = function (d) {
    var one = d.rows.length === 1 ? d.rows[0] : null;
    return '<div class="clc-viz">' +
      '<figure>' + vialSvg(vialTag(d.product.dose)) + '<figcaption><span>Şişe</span><b data-notr>' + esc(ml(d.bacMl)) + ' BAC</b></figcaption></figure>' +
      '<figure>' + syringeSvg('') + '<figcaption><span>Şırıngaya çekilen</span><b data-notr>' + esc(ml(d.volumeMl)) + (one ? ' → ' + esc(num(one.amount) + ' ' + one.amountUnit) : '') + '</b></figcaption></figure>' +
      '<p class="clc-viz-note">Temsili görsel · 1 mL ölçek</p></div>';
  };
  /** Şırınga pistonu, sıvı ve şişedeki çözelti önceki değerden yenisine kayar (ilk sonuçta boştan). */
  Calc.prototype.syncViz = function (idle) {
    var self = this, root = this.root, d = this.res;
    var setSyr = function (svg, v) {
      var pl = svg.querySelector('.clc-syr-pl'), lq = svg.querySelector('.clc-syr-liq'), mk = svg.querySelector('.clc-syr-mark');
      if (pl) pl.style.transform = 'translateX(' + (v * SYR_L) + 'px)';
      if (lq) lq.style.transform = 'scaleX(' + v + ')';
      if (mk) mk.style.transform = 'translateX(' + (v * SYR_L) + 'px)';
      // kabarcıklar yalnız çekilen çözeltinin içinde görünür
      Array.prototype.forEach.call(svg.querySelectorAll('.clc-syr-bub circle'), function (c, i) { c.setAttribute('cx', SYR_X + 6 + [0.18, 0.42, 0.66, 0.86][i] * Math.max(0, v * SYR_L - 12)); c.style.display = v > 0.04 ? '' : 'none'; });
    };
    if (idle || !d) {
      Array.prototype.forEach.call(root.querySelectorAll('.clc-syr-idle'), function (svg) { setSyr(svg, 0.5); });
      return;
    }
    var syr = root.querySelector('.clc-viz .clc-syr'), vl = root.querySelector('.clc-viz .clc-vial-liq'), lbl = root.querySelector('.clc-viz .clc-syr-v');
    if (!syr) return;
    if (lbl) lbl.textContent = ml(d.volumeMl);
    var from = this.vizPrev || { v: 0, b: 0 };
    setSyr(syr, from.v); if (vl) vl.style.transform = 'scaleY(' + from.b + ')';
    syr.getBoundingClientRect();   // başlangıç konumu çizilsin, ardından geçiş başlar
    var go = function () { setSyr(syr, d.volumeMl); if (vl) vl.style.transform = 'scaleY(' + d.bacMl + ')'; };
    if (window.requestAnimationFrame) requestAnimationFrame(function () { requestAnimationFrame(go); }); else go();
    this.vizPrev = { v: d.volumeMl, b: d.bacMl };
    countUp(root);
  };
  Calc.prototype.scnHtml = function () {
    if (!this.scn.length) return '<div class="clc-box"><h3 class="clc-h3">Kaydedilen senaryolar</h3><p class="clc-sub">“Karşılaştırmaya ekle” ile farklı madde, mg, BAC ve hacim seçimlerini (en fazla 4) yan yana görebilirsiniz.</p></div>';
    return '<div class="clc-box"><div class="clc-rhead"><div><h3 class="clc-h3">Kaydedilen senaryolar</h3><p class="clc-sub">En fazla 4 senaryo · yalnız bu sayfada tutulur</p></div>' +
      '<button type="button" class="clc-btn clc-clr">Senaryoları temizle</button></div><ul class="clc-scn">' +
      this.scn.map(function (s, i) {
        var conc = s.rows.map(function (r) { return (s.rows.length > 1 ? r.name + ': ' : '') + num(r.concentration) + ' ' + r.concentrationUnit; });
        var res = s.rows.map(function (r) { return '<b data-notr>' + (s.rows.length > 1 ? esc(r.name) + ': ' : '') + esc(amountTxt(r)) + '</b>'; }).join('');
        return '<li class="clc-sc"><h4 data-notr>' + esc(s.label) + ' · ' + esc(doseLabel({ dose: s.dose })) + '</h4>' +
          '<button type="button" class="rm" data-rm="' + i + '" aria-label="Senaryoyu kaldır">' + IC.x + '</button>' +
          '<div class="k"><span>BAC</span><b data-notr>' + esc(ml(s.bacMl)) + '</b></div>' +
          '<div class="k"><span>Konsantrasyon</span><b data-notr>' + conc.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</b></div>' +
          '<div class="k"><span>Çekilen hacim</span><b data-notr>' + esc(ml(s.volumeMl)) + '</b></div>' +
          '<div class="r"><span>Bu hacimdeki miktar</span>' + res + '</div></li>';
      }).join('') + '</ul></div>';
  };
  /** Sonuç alanı yeniden çizilirken sayfa yerinde kalır: tıklanan öğenin (ya da son kutunun) ekrandaki konumu korunur.
   *  Böylece içerik kısalsa / değişse de sayfa kendiliğinden alta (alt bilgiye) kaymaz. */
  Calc.prototype.stay = function (el, sel, fn) {
    var anchor = function (self) { return sel === 'last' ? (function () { var l = self.root.querySelectorAll('.clc-box'); return l[l.length - 1]; })() : (sel ? self.root.querySelector(sel) : null); };
    var y0 = window.pageYOffset, self0 = this, e0 = sel === 'last' ? anchor(self0) : el, t0 = e0 && e0.getBoundingClientRect ? e0.getBoundingClientRect().top : null;
    fn();
    var n = anchor(this), self = this;
    var fix = function () {
      var n2 = anchor(self), dy = (n2 && t0 != null) ? n2.getBoundingClientRect().top - t0 : window.pageYOffset - y0;
      if (Math.abs(dy) > 1) { try { window.scrollTo({ top: Math.max(0, window.pageYOffset + (n2 && t0 != null ? dy : y0 - window.pageYOffset)), left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, Math.max(0, window.pageYOffset + dy)); } }
    };
    fix();
    if (window.requestAnimationFrame) requestAnimationFrame(function () { requestAnimationFrame(fix); });   // yerleşim oturduktan sonra bir kez daha
  };
  Calc.prototype.bindOut = function () {
    var self = this, out = this.root.querySelector('.clc-out');
    var pin = out.querySelector('.clc-pin');
    if (pin) pin.onclick = function () {
      if (!self.res || self.scn.length >= MAX_SCN) return;
      var d = self.res;
      self.scn.push({ label: d.label, dose: d.product.dose, bacMl: d.bacMl, volumeMl: d.volumeMl, rows: d.rows });
      self.stay(pin, '.clc-pin', function () { self.renderOut(); var b = self.root.querySelector('.clc-pin'); if (b) b.focus({ preventScroll: true }); });
    };
    var clr = out.querySelector('.clc-clr');
    if (clr) clr.onclick = function () { self.scn = []; self.stay(clr, 'last', function () { self.renderOut(); var b = self.root.querySelector('.clc-pin') || self.$('.clc-go'); if (b) b.focus({ preventScroll: true }); }); };
    Array.prototype.forEach.call(out.querySelectorAll('[data-rm]'), function (b) {
      b.onclick = function () { self.scn.splice(Number(b.getAttribute('data-rm')), 1); self.stay(b, 'last', function () { self.renderOut(); var n = self.root.querySelector('[data-rm]') || self.root.querySelector('.clc-pin') || self.$('.clc-go'); if (n) n.focus({ preventScroll: true }); }); };
    });
    Array.prototype.forEach.call(out.querySelectorAll('[data-mix]'), function (b) {
      b.onclick = function () { var i = Number(b.getAttribute('data-mix')); if (i === self.mixIx) return; self.mixIx = i; self.refocus = '[data-mix="' + i + '"]'; self.vizPrev = self.res ? { v: self.res.volumeMl, b: self.res.bacMl } : null; self.stay(b, '[data-mix="' + i + '"]', function () { self.renderOut(); }); };
    });
    Array.prototype.forEach.call(out.querySelectorAll('.clc-cell[data-b]'), function (b) {
      b.onclick = function () {
        var bv = Number(b.getAttribute('data-b')), vv = Number(b.getAttribute('data-v'));
        self.bac = bv; self.vol = vv; self.clearErr('bac'); self.clearErr('vol'); self.syncOpts();
        self.refocus = '.clc-cell[data-b="' + bv + '"][data-v="' + vv + '"]';   // sonuç yeniden çizilince odak aynı hücreye döner
        self.stay(b, self.refocus, function () { if (!self.fromMatrix()) self.submit(true); });
      };
    });
  };

  // ------------------------------------------------------------------ olaylar (klavye dahil)
  Calc.prototype.bind = function () {
    var self = this, q = this.$('#clc-q'), lb = this.$('#clc-lb'), form = this.root.querySelector('form');
    form.addEventListener('submit', function (e) { e.preventDefault(); self.submit(false); });
    q.addEventListener('input', function () {
      self.active = -1; self.$('.clc-x').hidden = !q.value;
      if (self.fam && q.value !== self.fam.name) self.clearProduct();
      self.openList(true);
    });
    q.addEventListener('focus', function () { if (!self.fam) self.openList(true); });
    q.addEventListener('blur', function () { setTimeout(function () { self.openList(false); }, 120); });
    q.addEventListener('keydown', function (e) {
      var open = !lb.hidden, n = self.matches.length;
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) self.openList(true); self.active = n ? (self.active + 1) % n : -1; self.openList(true); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (!open) self.openList(true); self.active = n ? (self.active <= 0 ? n - 1 : self.active - 1) : -1; self.openList(true); }
      else if (e.key === 'Enter' && open) { e.preventDefault(); var f = self.matches[self.active >= 0 ? self.active : 0]; if (f) self.pickFam(f); }
      else if (e.key === 'Escape' && open) { e.preventDefault(); self.openList(false); }
    });
    lb.addEventListener('mousedown', function (e) { e.preventDefault(); });   // seçimde odak alanda kalsın
    lb.addEventListener('click', function (e) { var li = e.target.closest('[data-i]'); if (li) self.pickFam(self.matches[Number(li.getAttribute('data-i'))]); });
    this.$('.clc-x').addEventListener('click', function () { q.value = ''; this.hidden = true; self.clearProduct(); q.focus(); self.openList(true); });
    var camt = this.$('.clc-camt'), cunit = this.$('.clc-cunit');
    camt.addEventListener('input', function () {
      var c = camt.value.replace(/[^0-9.,]/g, ''); if (c !== camt.value) camt.value = c;
      if (self.fam && self.fam.custom) { self.pickProd(self.fam.items[0]); self.clearErr('product'); }
    });
    cunit.addEventListener('click', function (e) {
      var b = e.target.closest('[data-u]'); if (!b) return;
      Array.prototype.forEach.call(cunit.querySelectorAll('[data-u]'), function (x) { x.setAttribute('aria-checked', String(x === b)); });
      if (self.fam && self.fam.custom) self.pickProd(self.fam.items[0]);
    });
    var doses = this.$('.clc-doses');
    var pickById = function (id) { self.pickProd(self.fam.items.filter(function (p) { return p.id === id; })[0]); self.clearErr('product'); var nb = doses.querySelector('[aria-checked="true"]'); if (nb) nb.focus(); };
    doses.addEventListener('click', function (e) { var b = e.target.closest('[data-id]'); if (b) pickById(b.getAttribute('data-id')); });
    // radyo grupları: ok tuşları / Home / End (devre dışı seçenekler atlanır), boşluk / Enter seçer
    var roving = function (box, sel, pick) {
      box.addEventListener('keydown', function (e) {
        if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].indexOf(e.key) < 0) return;
        var all = Array.prototype.slice.call(box.querySelectorAll(sel)).filter(function (b) { return b.getAttribute('aria-disabled') !== 'true'; });
        var i = all.indexOf(document.activeElement); if (!all.length) return;
        e.preventDefault();
        var j = e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : ((i < 0 ? 0 : i) + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length;
        pick(all[j]); var f = box.querySelector(sel + '[aria-checked="true"]'); if (f) f.focus();
      });
    };
    roving(doses, '.clc-chip', function (b) { pickById(b.getAttribute('data-id')); });
    var bacBox = this.$('.clc-bac'), volBox = this.$('.clc-vol');
    bacBox.addEventListener('click', function (e) { var b = e.target.closest('[data-bac]'); if (b) self.setBac(Number(b.getAttribute('data-bac'))); });
    volBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-vol]'); if (!b) return;
      if (b.getAttribute('aria-disabled') === 'true') { self.err('vol', 'Çekilecek hacim, eklenen BAC miktarından (' + ml(self.bac) + ') fazla olamaz.'); return; }
      self.setVol(Number(b.getAttribute('data-vol')));
    });
    roving(bacBox, '.clc-chip', function (b) { self.setBac(Number(b.getAttribute('data-bac'))); });
    roving(volBox, '.clc-chip', function (b) { self.setVol(Number(b.getAttribute('data-vol'))); });
  };
  /** Dil değişince sayılar yeniden biçimlenir (metinleri sitenin çeviri katmanı değiştirir). */
  Calc.prototype.setLang = function (L) {
    L = L === 'en' ? 'en' : 'tr'; if (L === lang) return;
    lang = L;
    this.root.querySelectorAll('[data-bac] > span, [data-vol] > span').forEach(function (s) { var b = s.parentNode; s.textContent = num(Number(b.getAttribute('data-bac') || b.getAttribute('data-vol'))); });
    if (this.prod) { this.renderDoses(); var parts = parseDose(this.prod.dose); if (parts) this.$('.clc-vial-v').textContent = parts.map(function (x) { return (x.name ? x.name + ' ' : '') + num(x.amount) + ' ' + x.unit; }).join(' + '); }
    this.renderOut();
  };

  AVF.DoseCalc = {
    mount: function (el, opt) {
      if (!el || el.__avfCalc) return el && el.__avfCalc;
      lang = opt && opt.lang === 'en' ? 'en' : 'tr';
      el.__avfCalc = new Calc(el);
      return el.__avfCalc;
    },
    setLang: function (el, L) { if (el && el.__avfCalc) el.__avfCalc.setLang(L); }
  };
})();
