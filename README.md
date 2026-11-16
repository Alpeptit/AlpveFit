# Alpvefit

Eğitim ve koçluk platformu (uzaktan ve yüz yüze). Üyeler yalnızca kendileri için, yetkili uzmanlar tarafından hazırlanıp yayınlanan beslenme, antrenman ve takviye/vitamin/mineral/farmakoloji planlarını görür. Fiziksel ürün satışı yoktur.

Alpeptit'ten tamamen bağımsızdır: ayrı veritabanı, ayrı anahtarlar, ayrı çerezler (`avf_session`, `avf_csrf`), ayrı Railway projesi. Alpeptit verisi veya gizli anahtarı bu projeye girmez.

## Kurulum
1. `cp .env.example .env` ve değerleri doldurun (`JWT_SECRET` ve `ENCRYPTION_KEY` en az 32 karakter, birbirinden farklı ve Alpeptit'tekilerden farklı olmalı).
2. `npm install`
3. `npm run db:setup` (şemayı kurar; sunucu açılışında da otomatik uygulanır)
4. `npm run admin:create` ile ilk yönetici hesabı.
5. `npm start`

## Roller
- `user`: kendi yayınlanmış planlarını görür.
- `coach` (uzman): yalnızca kendisine atanmış üyeler için ve yetkili olduğu plan türlerinde plan hazırlar/yayınlar.
- `admin`: roller, plan türü yetkileri, üye erişim izinleri ve uzman atamaları.
Uzman ve yönetici hesapları Authenticator (TOTP) olmadan panel API'sine erişemez. Uzman arayüzü `/uzman` adresinde yalnız bu rollere sunulur.

## Test
`npm test` (birim). Uçtan uca API testi: `tests/e2e/avfsim.mjs` (gerçek PostgreSQL üzerinde, bkz. dosya başı).
