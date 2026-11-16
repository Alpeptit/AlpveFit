// L-13 (4. bağımsız denetim, v4): standart hata yanıtı.
//
// ÖNCEDEN genel hata yakalayıcı HER hatayı 500 "sunucu hatası" olarak
// döndürüyordu — istemcinin gönderdiği BOZUK bir JSON gövdesi (express.json
// → SyntaxError, status 400) veya 100kb sınırını aşan bir gövde (413) bile
// sunucu hatası gibi görünüyordu. Bu hem yanlış (istemci hatası) hem de
// izleme/alarm açısından gürültüydü (her bozuk istek "500" alarmı üretir).
//
// Kural: sadece body-parser gibi güvenilir kütüphanelerin "expose" olarak
// işaretlediği 4xx hatalarında SABİT, bizim yazdığımız Türkçe mesaj döner.
// Hiçbir durumda err.message / err.stack istemciye gönderilmez.
const CLIENT_ERROR_MESSAGES = {
  400: "İstek biçimi geçersiz.",
  413: "İstek gövdesi çok büyük.",
  415: "Desteklenmeyen içerik türü.",
};

export function toErrorResponse(err) {
  // v27: adres satırındaki kimlik UUID değilse PostgreSQL 22P02 (invalid_text_representation) atar —
  // bu bir istemci hatasıdır; 500 alarmı üretmesin. (Ham hata mesajı yine istemciye gitmez.)
  if (err?.code === "22P02") return { status: 400, body: { error: CLIENT_ERROR_MESSAGES[400] } };
  const status = Number(err?.status || err?.statusCode);
  if (err?.expose === true && status >= 400 && status < 500) {
    return { status, body: { error: CLIENT_ERROR_MESSAGES[status] || "İstek işlenemedi." } };
  }
  return { status: 500, body: { error: "Sunucu tarafında bir hata oluştu." } };
}
