import axios from "axios";

/** Google'a token'ı gönderip gerçekten doğrulanmış mı diye sorar. */
export async function verifyRecaptcha(token) {
  if (!token) return false;
  try {
    const { data } = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
      params: { secret: process.env.RECAPTCHA_SECRET_KEY, response: token },
      timeout: 5000, // O15 (3. bağımsız denetim) düzeltmesi: Google yanıt vermezse istek sonsuza kadar asılı kalmasın
    });
    if (data.success !== true) return false;
    // v26: reCAPTCHA v3 puan kontrolü (v3 yanıtında "score" bulunur; v2'de yoktur). Varsayılan eşik 0.5.
    if (typeof data.score === "number") {
      const min = Number(process.env.RECAPTCHA_MIN_SCORE);
      if (data.score < (Number.isFinite(min) && min > 0 && min <= 1 ? min : 0.5)) return false;
    }
    return true;
  } catch (err) {
    console.error("[recaptcha] Doğrulama hatası:", err.message);
    return false;
  }
}
