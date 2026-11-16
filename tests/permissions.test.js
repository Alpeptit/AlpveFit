import test from "node:test";
import assert from "node:assert/strict";
import { canAuthorKind, normalizeKinds, isPanelRole, permissionsOf } from "../src/utils/permissions.js";

test("uzman yalnız yetkili olduğu türde plan yazabilir", () => {
  assert.equal(canAuthorKind("coach", ["nutrition"], "nutrition"), true);
  assert.equal(canAuthorKind("coach", ["nutrition"], "pharmacology"), false);
  assert.equal(canAuthorKind("user", ["nutrition"], "nutrition"), false);
  assert.equal(canAuthorKind("admin", [], "pharmacology"), true);
});
test("plan türleri normalleştirilir", () => {
  assert.deepEqual(normalizeKinds(["nutrition", "x", "nutrition", "training"]), ["nutrition", "training"]);
});
test("panel rolleri", () => {
  assert.equal(isPanelRole("coach"), true);
  assert.equal(isPanelRole("admin"), true);
  assert.equal(isPanelRole("user"), false);
  assert.ok(permissionsOf("user"));
});
