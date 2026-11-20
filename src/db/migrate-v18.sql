-- v18: Soru – Cevap kategorisi kaldırıldı (konuları Serbest Kürsü'ye taşınır, hiçbir konu silinmez);
--      ekip konuları (yönetici ya da resmî hesap): her zaman sabit ve yoruma kapalı.
DO $$
DECLARE src integer; dst integer;
BEGIN
  SELECT id INTO src FROM forum_categories WHERE slug = 'soru-cevap';
  SELECT id INTO dst FROM forum_categories WHERE slug = 'serbest-kursu';
  IF src IS NOT NULL AND dst IS NOT NULL THEN
    UPDATE forum_topics SET category_id = dst WHERE category_id = src;
    UPDATE forum_categories SET parent_id = NULL WHERE parent_id = src;
    DELETE FROM forum_categories WHERE id = src;
  END IF;
END $$;

UPDATE forum_topics t SET is_pinned = true, is_locked = true
  FROM users u LEFT JOIN forum_profiles f ON f.user_id = u.id
 WHERE u.id = t.author_id AND (u.role = 'admin' OR coalesce(f.is_official, false)) AND (NOT t.is_pinned OR NOT t.is_locked);

-- Konu simgesi (ekip rehberleri): emojinin yerine kategori renginde, net çizgili simge.
ALTER TABLE forum_topics ADD COLUMN IF NOT EXISTS icon text;
ALTER TABLE forum_topics DROP CONSTRAINT IF EXISTS forum_topics_icon_check;
ALTER TABLE forum_topics ADD CONSTRAINT forum_topics_icon_check CHECK (icon IS NULL OR icon ~ '^[a-z0-9]{2,20}$');
