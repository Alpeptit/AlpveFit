-- Forum v17: alt kategoriler, kategori renkleri, etiketler, çevrimiçi durumunu gizleme, resmî ekip hesabı ve sabit ekip içerikleri.

-- Alt kategori (tek seviye): üst kategorinin sayfasında sekme olarak görünür; üst kategori kendi konularıyla birlikte alt kategorilerinkini de listeler.
ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS parent_id integer REFERENCES forum_categories(id);
ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS color text NOT NULL DEFAULT 'slate';
ALTER TABLE forum_categories DROP CONSTRAINT IF EXISTS forum_categories_color_check;
ALTER TABLE forum_categories ADD CONSTRAINT forum_categories_color_check CHECK (color IN ('slate', 'lime', 'orange', 'blue', 'violet', 'red', 'green', 'amber', 'pink', 'teal'));
CREATE INDEX IF NOT EXISTS idx_fcats_parent ON forum_categories (parent_id);

UPDATE forum_categories SET color = 'amber'  WHERE slug = 'duyurular';
UPDATE forum_categories SET color = 'green'  WHERE slug = 'beslenme';
UPDATE forum_categories SET color = 'blue'   WHERE slug = 'antrenman';
UPDATE forum_categories SET color = 'violet' WHERE slug = 'takviye';
UPDATE forum_categories SET color = 'red'    WHERE slug = 'farmakoloji';
UPDATE forum_categories SET color = 'teal'   WHERE slug = 'gelisim-gunlukleri';
UPDATE forum_categories SET color = 'orange' WHERE slug = 'soru-cevap';
UPDATE forum_categories SET color = 'pink'   WHERE slug = 'serbest-kursu';

INSERT INTO forum_categories (slug, name, description, icon, sort, kind, color, parent_id, notice)
SELECT v.slug, v.name, v.description, v.icon, v.sort, 'normal', v.color, p.id, v.notice
  FROM (VALUES
    ('supplement', 'Supplement', 'Protein tozu, kreatin, kafein, beta-alanin ve diğer sporcu takviyeleri.', 'pill', 41, 'violet', 'takviye', ''),
    ('vitamin', 'Vitamin', 'D vitamini, B12, C vitamini ve diğerleri: ne zaman gerekir, ne zaman boşa gider?', 'sun', 42, 'violet', 'takviye', ''),
    ('mineral', 'Mineral', 'Magnezyum, çinko, demir, kalsiyum ve elektrolitler.', 'drop', 43, 'violet', 'takviye', ''),
    ('enjeksiyon-steroid', 'Enjeksiyon Steroid', 'Etkiler, yan etkiler, riskler ve kontroller — bilimsel kaynaklarla.', 'flask', 51, 'red', 'farmakoloji', 'Bilgi amaçlıdır, tıbbi tavsiye değildir. Doz, kür, kaynak ve satış paylaşımı yasaktır.'),
    ('oral-steroid', 'Oral Steroid', 'Karaciğer, lipidler ve kalp: oral kullanımın bilinen riskleri.', 'pill', 52, 'red', 'farmakoloji', 'Bilgi amaçlıdır, tıbbi tavsiye değildir. Doz, kür, kaynak ve satış paylaşımı yasaktır.'),
    ('sarms', 'SARMs', 'Seçici androjen reseptör modülatörleri: vaatler ve kanıtlar.', 'target', 53, 'red', 'farmakoloji', 'Bilgi amaçlıdır, tıbbi tavsiye değildir. Doz, kür, kaynak ve satış paylaşımı yasaktır.'),
    ('peptit', 'Peptit', 'Büyüme hormonu salgılatıcılar, BPC-157 ve diğerleri: araştırma ne diyor?', 'spark', 54, 'red', 'farmakoloji', 'Bilgi amaçlıdır, tıbbi tavsiye değildir. Doz, kür, kaynak ve satış paylaşımı yasaktır.')
  ) AS v(slug, name, description, icon, sort, color, parent, notice)
  JOIN forum_categories p ON p.slug = v.parent
ON CONFLICT (slug) DO NOTHING;

-- Etiketler: ekibin tanımladığı liste; üye konusuna en fazla 5 etiket seçer (serbest etiket yok: spam ve uygunsuz etiket önlenir).
CREATE TABLE IF NOT EXISTS forum_tags (
  id          serial PRIMARY KEY,
  slug        text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{2,40}$'),
  name        text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 40),
  icon        text NOT NULL DEFAULT 'tag' CHECK (icon ~ '^[a-z0-9]{2,20}$'),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS forum_topic_tags (
  topic_id  uuid NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  tag_id    integer NOT NULL REFERENCES forum_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (topic_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_ftopic_tags_tag ON forum_topic_tags (tag_id);

INSERT INTO forum_tags (slug, name, icon) VALUES
  ('protein', 'Protein', 'egg'), ('karbonhidrat', 'Karbonhidrat', 'wheat'), ('yag', 'Yağ', 'drop'), ('lif', 'Lif', 'leaf'),
  ('makro', 'Makro', 'chart'), ('kalori', 'Kalori', 'flame'), ('tdee', 'TDEE', 'bolt'), ('yag-yakimi', 'Yağ yakımı', 'flame'),
  ('kas-kazanimi', 'Kas kazanımı', 'muscle'), ('guc', 'Güç', 'bolt'), ('hipertrofi', 'Hipertrofi', 'dumb'), ('kardiyo', 'Kardiyo', 'pulse'),
  ('program', 'Program', 'calendar'), ('teknik', 'Teknik', 'target'), ('toparlanma', 'Toparlanma', 'moon'), ('uyku', 'Uyku', 'moon'),
  ('kreatin', 'Kreatin', 'spark'), ('aminoasit', 'Aminoasit', 'layers'), ('kafein', 'Kafein', 'coffee'), ('vitamin', 'Vitamin', 'sun'),
  ('mineral', 'Mineral', 'drop'), ('saglik', 'Sağlık', 'heart'), ('kan-tahlili', 'Kan tahlili', 'drop'), ('kalp', 'Kalp', 'heart'),
  ('karaciger', 'Karaciğer', 'shield'), ('hormon', 'Hormon', 'pulse'), ('yan-etki', 'Yan etki', 'alert'), ('zarar-azaltma', 'Zarar azaltma', 'shield'),
  ('efsane', 'Gerçek mi?', 'help'), ('arastirma', 'Araştırma', 'book'), ('baslangic', 'Başlangıç', 'spark'), ('motivasyon', 'Motivasyon', 'flame'),
  ('tarif', 'Tarif', 'apple'), ('kadin', 'Kadın', 'female'), ('yarisma', 'Yarışma', 'award'), ('duyuru', 'Duyuru', 'bell')
ON CONFLICT (slug) DO NOTHING;

-- Çevrimiçi durumunu gizleme (Pump Avcısı ve üstü) ve resmî ekip hesabı işareti
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS hide_online boolean NOT NULL DEFAULT false;
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS is_official boolean NOT NULL DEFAULT false;

-- Ekip içerikleri: yeniden başlatmada aynı içerik iki kez eklenmesin diye kalıcı anahtar; sürüm değişince güncellenir.
ALTER TABLE forum_topics ADD COLUMN IF NOT EXISTS official_key text;
ALTER TABLE forum_topics ADD COLUMN IF NOT EXISTS official_rev integer;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ftopics_official ON forum_topics (official_key) WHERE official_key IS NOT NULL;

-- Ekip makaleleri uzun olabilir: veritabanı sınırı 40.000 karaktere çıkar (üyeler için uygulama sınırı 10.000 olarak kalır).
ALTER TABLE forum_posts DROP CONSTRAINT IF EXISTS forum_posts_body_check;
ALTER TABLE forum_posts ADD CONSTRAINT forum_posts_body_check CHECK (char_length(body) BETWEEN 1 AND 40000);
