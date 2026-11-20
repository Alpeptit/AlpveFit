-- v19: profil fotoğrafı çerçevesi (forumda avatarın çevresinde). NULL: varsayılan (üyede yok, ekipte kendi çerçevesi); 'yok': bilerek çerçevesiz.
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS frame text;
ALTER TABLE forum_profiles DROP CONSTRAINT IF EXISTS forum_profiles_frame_check;
ALTER TABLE forum_profiles ADD CONSTRAINT forum_profiles_frame_check CHECK (frame IS NULL OR frame ~ '^[a-z]{2,12}$');
