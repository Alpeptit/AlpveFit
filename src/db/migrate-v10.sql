-- v10 — Çalışma saati ayrıntısı: vardiyalı / esnek / çalışmıyorum seçildiğinde isteğe bağlı gün gün saat ve kısa not.
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS work_schedule JSONB;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS work_note TEXT;
ALTER TABLE member_profiles DROP CONSTRAINT IF EXISTS member_profiles_work_note_check;
ALTER TABLE member_profiles ADD CONSTRAINT member_profiles_work_note_check CHECK (work_note IS NULL OR char_length(work_note) <= 300);
ALTER TABLE member_profiles DROP CONSTRAINT IF EXISTS member_profiles_work_schedule_check;
ALTER TABLE member_profiles ADD CONSTRAINT member_profiles_work_schedule_check CHECK (work_schedule IS NULL OR jsonb_typeof(work_schedule) = 'object');
