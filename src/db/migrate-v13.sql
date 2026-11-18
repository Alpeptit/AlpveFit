-- v13 — Plan oluşturucular: planın yapılandırılmış verisi (beslenme öğünleri, antrenman günleri, supplement / farmakoloji kalemleri, notlar).
ALTER TABLE plans ADD COLUMN IF NOT EXISTS data jsonb;
