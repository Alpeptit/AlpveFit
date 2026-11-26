// v27: paket hunisi adımı doğrulama; teslim hatırlatması metni ve e-postası (üye adı e-postada yok); kaynak koruma denetimleri.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeEvent, FUNNEL_EVENTS } from "../src/utils/analyticsRules.js";
import { planDueMail } from "../src/utils/emailTemplates.js";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");

test("huni adımı: yalnız tanımlı adımlar ve geçerli oturum kimliği", () => {
  assert.deepEqual(FUNNEL_EVENTS, ["pkg_select", "order"]);
  assert.deepEqual(normalizeEvent({ sid: "a".repeat(32), event: "order" }), { sid: "a".repeat(32), event: "order" });
  for (const b of [null, "x", { sid: "a".repeat(32), event: "hack" }, { sid: "kısa", event: "order" }, { sid: "A".repeat(32), event: "order" }, { event: "pkg_select" }]) assert.equal(normalizeEvent(b), null);
});

test("teslim hatırlatma e-postası: sipariş no ve zaman var, gecikme işaretli; TR / EN", () => {
  const items = [{ orderNumber: "AVF-1", dueAt: "2026-11-26T10:00:00Z", overdue: false }, { orderNumber: "AVF-2", dueAt: "2026-11-25T10:00:00Z", overdue: true }];
  const tr = planDueMail("tr", { items }), en = planDueMail("en", { items: items.slice(0, 1) });
  assert.match(tr.subject, /Plan Teslimi Gecikti/);
  assert.match(tr.text, /AVF-1/); assert.match(tr.text, /AVF-2/); assert.match(tr.text, /Gecikti · /);
  assert.match(en.subject, /Plan Delivery Approaching/); assert.doesNotMatch(en.text, /Overdue/);
});

test("kaynak: hatırlatma bir kez işaretlenir (atomik), eski gecikmeler atlanır, e-postaya üye adı yazılmaz", () => {
  const s = read("src/services/deliveryReminder.js");
  assert.match(s, /FOR UPDATE SKIP LOCKED/);
  assert.match(s, /overdue_notified_at IS NULL/); assert.match(s, /due_soon_notified_at IS NULL/);
  assert.match(s, /make_interval\(days => \$\{STALE_DAYS\}\)/);
  assert.doesNotMatch(s.slice(s.indexOf("perUser.get(r.id).items.push"), s.indexOf("perUser.get(r.id).items.push") + 160), /member/i);
  assert.match(read("src/server.js"), /startDeliveryReminderJob\(\)/);
});

test("kaynak: gelişim paylaşımı yalnız izinle, yalnız kilo ve bel; uzman erişimi üye atamasıyla sınırlı ve denetlenir", () => {
  const j = read("src/routes/journal.js"), a = read("src/routes/admin.js");
  const fn = j.slice(j.indexOf("export async function sharedTrend"), j.indexOf("// Fotoğraf: PNG / JPG"));
  assert.match(fn, /if \(!u \|\| !u\.journal_share_coach\) return \{ shared: false \}/);
  assert.doesNotMatch(fn, /note|chest|hip|arm|thigh|photo/);
  const route = a.slice(a.indexOf('adminRouter.get("/clients/:id/journal"'), a.indexOf("// ---------- teslim bekleyen planlar"));
  assert.match(route, /canAccessMember\(req, req\.params\.id\)/);
  assert.match(route, /journal_trend_view/);
  assert.match(read("src/db/migrate-v27.sql"), /journal_share_coach boolean NOT NULL DEFAULT false/);
});
