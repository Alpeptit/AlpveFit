// Resmî forum içeriği: ekip hesabıyla açılışta tohumlanır (src/forum/official.js). Sıra, sabitlenmiş konuların sırasıdır.
import { DUYURULAR } from "./duyurular.js";
import { BESLENME } from "./beslenme.js";
import { TAKVIYE } from "./takviye.js";
import { ANTRENMAN } from "./antrenman.js";

export const CONTENT = [...DUYURULAR, ...BESLENME, ...TAKVIYE, ...ANTRENMAN];
