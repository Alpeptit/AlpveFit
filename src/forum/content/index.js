// Resmî forum içeriği: ekip hesabıyla açılışta tohumlanır (src/forum/official.js). Sıra, sabitlenmiş konuların sırasıdır.
// Ekip konularının tümü sabit ve yoruma kapalıdır (locked: true).
import { DUYURULAR } from "./duyurular.js";
import { BESLENME } from "./beslenme.js";
import { TAKVIYE } from "./takviye.js";
import { ANTRENMAN } from "./antrenman.js";
import { TOPLULUK } from "./topluluk.js";
import { SAGLIK } from "./saglik.js";
import { REHBERLER } from "./rehberler.js";

export const CONTENT = [...DUYURULAR, ...BESLENME, ...TAKVIYE, ...ANTRENMAN, ...TOPLULUK, ...SAGLIK, ...REHBERLER];
