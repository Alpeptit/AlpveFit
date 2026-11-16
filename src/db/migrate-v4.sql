-- v4 — para birimi TRY (yeni siparişler); mevcut siparişlerin kendi para birimi korunur
ALTER TABLE orders ALTER COLUMN currency SET DEFAULT 'TRY';
