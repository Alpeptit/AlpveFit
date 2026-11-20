-- v24: Ekip paylaşımları ve üye paylaşımları için kalıcı kural.
--   • Ekip konuları (yönetici ya da resmî hesap): sabit ve yoruma kapalı.
--   • Ekip paylaşımlarında beğenmeme ve şikâyet yok: mevcut beğenmemeler kaldırılır, açık şikâyetler kapatılır.
--   • Üye konuları her zaman yoruma açık: daha önce kilitlenmiş üye konuları açılır.
-- Sunucu aynı kuralları her istekte ayrıca uygular; bu dosya yalnız bugüne kadarki içeriği kurala uydurur.

CREATE TEMP TABLE staff_ids ON COMMIT DROP AS
  SELECT u.id FROM users u LEFT JOIN forum_profiles f ON f.user_id = u.id WHERE u.role = 'admin' OR coalesce(f.is_official, false);

UPDATE forum_topics SET is_pinned = true, is_locked = true
 WHERE author_id IN (SELECT id FROM staff_ids) AND (NOT is_pinned OR NOT is_locked);

UPDATE forum_topics SET is_locked = false
 WHERE is_locked AND (author_id IS NULL OR author_id NOT IN (SELECT id FROM staff_ids));

DELETE FROM forum_reactions r USING forum_posts p
 WHERE r.post_id = p.id AND r.value = -1 AND p.author_id IN (SELECT id FROM staff_ids);
UPDATE forum_posts SET dislike_count = 0 WHERE author_id IN (SELECT id FROM staff_ids) AND dislike_count <> 0;
UPDATE forum_profiles SET dislikes = 0 WHERE user_id IN (SELECT id FROM staff_ids) AND dislikes <> 0;

UPDATE forum_reports r SET status = 'dismissed', handled_at = now()
  FROM forum_posts p WHERE r.post_id = p.id AND r.status = 'open' AND p.author_id IN (SELECT id FROM staff_ids);
