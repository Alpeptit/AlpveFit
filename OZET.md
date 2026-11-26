# OWASP ZAP özeti

## api-kimliksiz — Yüksek: 0, Orta: 0, Düşük: 1, Bilgi: 2
- [Düşük] Unexpected Content-Type was returned (pluginId 100001, 363 örnek) — http://localhost:3000/api/admin/assignments/ · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/ · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test/ · http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/
- [Bilgi] A Client Error response code was returned by the server (pluginId 100000, 634 örnek) — http://localhost:3000/api/admin/assignments · http://localhost:3000/api/admin/assignments/ · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001 · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/
- [Bilgi] Non-Storable Content (pluginId 10049, 5 örnek) — http://localhost:3000/api/account/confirm-name-change · http://localhost:3000/api/account/request-email-change · http://localhost:3000/api/account/request-name-change · http://localhost:3000/api/account/request-password-change

## api-uye — Yüksek: 0, Orta: 1, Düşük: 1, Bilgi: 2
- [Orta] CSP: style-src unsafe-inline (pluginId 10055, 5 örnek) — http://localhost:3000/api/account/confirm-email-change-old · http://localhost:3000/api/account/confirm-name-change · http://localhost:3000/api/account/request-name-change · http://localhost:3000/api/account/request-password-change
- [Düşük] Unexpected Content-Type was returned (pluginId 100001, 601 örnek) — http://localhost:3000/api/admin/assignments · http://localhost:3000/api/admin/assignments/ · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001 · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/
- [Bilgi] A Client Error response code was returned by the server (pluginId 100000, 599 örnek) — http://localhost:3000/api/admin/assignments · http://localhost:3000/api/admin/assignments/ · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001 · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/
- [Bilgi] Non-Storable Content (pluginId 10049, 5 örnek) — http://localhost:3000/api/account/confirm-email-change-old · http://localhost:3000/api/account/confirm-name-change · http://localhost:3000/api/account/request-name-change · http://localhost:3000/api/account/request-password-change

## api-yonetici — Yüksek: 0, Orta: 1, Düşük: 1, Bilgi: 2
- [Orta] CSP: style-src unsafe-inline (pluginId 10055, 5 örnek) — http://localhost:3000/api/account/confirm-name-change · http://localhost:3000/api/account/request-email-change · http://localhost:3000/api/account/request-name-change · http://localhost:3000/api/account/request-password-change
- [Düşük] Unexpected Content-Type was returned (pluginId 100001, 601 örnek) — http://localhost:3000/api/admin/assignments · http://localhost:3000/api/admin/assignments/ · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001 · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/
- [Bilgi] A Client Error response code was returned by the server (pluginId 100000, 599 örnek) — http://localhost:3000/api/admin/assignments · http://localhost:3000/api/admin/assignments/ · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001 · http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/
- [Bilgi] Non-Storable Content (pluginId 10049, 5 örnek) — http://localhost:3000/api/account/confirm-name-change · http://localhost:3000/api/account/request-email-change · http://localhost:3000/api/account/request-name-change · http://localhost:3000/api/account/request-password-change

## canli-pasif — Yüksek: 0, Orta: 1, Düşük: 2, Bilgi: 6
- [Orta] CSP: style-src unsafe-inline (pluginId 10055, 2 örnek) — https://www.alpvefit.com · https://www.alpvefit.com/sitemap.xml
- [Düşük] Cross-Origin-Embedder-Policy Header Missing or Invalid (pluginId 90004, 1 örnek) — https://www.alpvefit.com
- [Düşük] Permissions Policy Header Not Set (pluginId 10063, 5 örnek) — https://www.alpvefit.com/assets/avf-account.js?v=1e93f819e4 · https://www.alpvefit.com/assets/avf-dose.js?v=ffe029dc88 · https://www.alpvefit.com/assets/avf-fx.js?v=ec0832d1e8 · https://www.alpvefit.com/assets/avf-mascot.js?v=a03d55ba7d
- [Bilgi] Information Disclosure - Suspicious Comments (pluginId 10027, 5 örnek) — https://www.alpvefit.com/assets/avf-core.js?v=1e625e1000 · https://www.alpvefit.com/assets/avf-core.js?v=1e625e1000 · https://www.alpvefit.com/assets/avf-core.js?v=1e625e1000 · https://www.alpvefit.com/assets/avf-plans.js?v=0743951c43
- [Bilgi] Modern Web Application (pluginId 10109, 2 örnek) — https://www.alpvefit.com · https://www.alpvefit.com/sitemap.xml
- [Bilgi] Re-examine Cache-control Directives (pluginId 10015, 3 örnek) — https://www.alpvefit.com · https://www.alpvefit.com/manifest.webmanifest · https://www.alpvefit.com/robots.txt
- [Bilgi] Retrieved from Cache (pluginId 10050, 5 örnek) — https://www.alpvefit.com/assets/avf-i18n.js?v=69c1050e74 · https://www.alpvefit.com/assets/avf-legal.js?v=3312fd75fd · https://www.alpvefit.com/assets/avf-pwa.js?v=215d98fa2b · https://www.alpvefit.com/assets/avf-theme.js?v=2caa019dff
- [Bilgi] Storable and Cacheable Content (pluginId 10049, 5 örnek) — https://www.alpvefit.com/assets/avf-pwa.js?v=215d98fa2b · https://www.alpvefit.com/assets/avf-theme.js?v=2caa019dff · https://www.alpvefit.com/assets/favicon.svg · https://www.alpvefit.com/manifest.webmanifest
- [Bilgi] Storable but Non-Cacheable Content (pluginId 10049, 2 örnek) — https://www.alpvefit.com · https://www.alpvefit.com/sitemap.xml

## yerel-etkin — Yüksek: 0, Orta: 1, Düşük: 1, Bilgi: 6
- [Orta] CSP: style-src unsafe-inline (pluginId 10055, 4 örnek) — http://localhost:3000 · http://localhost:3000/ · http://localhost:3000/robots.txt · http://localhost:3000/sitemap.xml
- [Düşük] Cross-Origin-Embedder-Policy Header Missing or Invalid (pluginId 90004, 2 örnek) — http://localhost:3000 · http://localhost:3000/
- [Bilgi] CORS Header (pluginId 40040, 5 örnek) — http://localhost:3000 · http://localhost:3000/ · http://localhost:3000/assets · http://localhost:3000/assets/avf-account.js?v=1e93f819e4
- [Bilgi] Information Disclosure - Suspicious Comments (pluginId 10027, 5 örnek) — http://localhost:3000/assets/avf-core.js?v=1e625e1000 · http://localhost:3000/assets/avf-core.js?v=1e625e1000 · http://localhost:3000/assets/avf-core.js?v=1e625e1000 · http://localhost:3000/assets/avf-plans.js?v=0743951c43
- [Bilgi] Modern Web Application (pluginId 10109, 4 örnek) — http://localhost:3000 · http://localhost:3000/ · http://localhost:3000/robots.txt · http://localhost:3000/sitemap.xml
- [Bilgi] Storable and Cacheable Content (pluginId 10049, 5 örnek) — http://localhost:3000/assets/favicon.svg · http://localhost:3000/assets/fonts/Inter-Regular.woff · http://localhost:3000/assets/fonts/InterDisplay-Bold.woff · http://localhost:3000/assets/icons/apple-touch-icon.png
- [Bilgi] Storable but Non-Cacheable Content (pluginId 10049, 4 örnek) — http://localhost:3000 · http://localhost:3000/ · http://localhost:3000/robots.txt · http://localhost:3000/sitemap.xml
- [Bilgi] User Agent Fuzzer (pluginId 10104, 5 örnek) — http://localhost:3000/assets · http://localhost:3000/assets · http://localhost:3000/assets · http://localhost:3000/assets

## yerel-pasif — Yüksek: 0, Orta: 1, Düşük: 1, Bilgi: 6
- [Orta] CSP: style-src unsafe-inline (pluginId 10055, 5 örnek) — http://localhost:3000 · http://localhost:3000/ · http://localhost:3000/robots.txt · http://localhost:3000/sitemap.xml
- [Düşük] Cross-Origin-Embedder-Policy Header Missing or Invalid (pluginId 90004, 5 örnek) — http://localhost:3000 · http://localhost:3000/ · http://localhost:3000/forum · http://localhost:3000/hakkimizda
- [Bilgi] Information Disclosure - Information in Browser localStorage (pluginId 120000, 4 örnek) — http://localhost:3000/araclar · http://localhost:3000/forum · http://localhost:3000/hakkimizda · http://localhost:3000/sss
- [Bilgi] Information Disclosure - Information in Browser sessionStorage (pluginId 120000, 4 örnek) — http://localhost:3000/ · http://localhost:3000/forum · http://localhost:3000/forum · http://localhost:3000/sss
- [Bilgi] Information Disclosure - Suspicious Comments (pluginId 10027, 5 örnek) — http://localhost:3000/assets/avf-core.js?v=1e625e1000 · http://localhost:3000/assets/avf-core.js?v=1e625e1000 · http://localhost:3000/assets/avf-core.js?v=1e625e1000 · http://localhost:3000/assets/avf-plans.js?v=0743951c43
- [Bilgi] Modern Web Application (pluginId 10109, 5 örnek) — http://localhost:3000 · http://localhost:3000/ · http://localhost:3000/robots.txt · http://localhost:3000/sitemap.xml
- [Bilgi] Storable and Cacheable Content (pluginId 10049, 5 örnek) — http://localhost:3000/assets/favicon.svg · http://localhost:3000/assets/fonts/Inter-Regular.woff · http://localhost:3000/assets/fonts/InterDisplay-Bold.woff · http://localhost:3000/assets/icons/apple-touch-icon.png
- [Bilgi] Storable but Non-Cacheable Content (pluginId 10049, 3 örnek) — http://localhost:3000 · http://localhost:3000/robots.txt · http://localhost:3000/sitemap.xml

## npm audit (üretim bağımlılıkları) — info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0
