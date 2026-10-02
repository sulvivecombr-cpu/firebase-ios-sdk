import test from "node:test";
import assert from "node:assert/strict";
import {
  decodeFruits,
  readFruits,
  addRandomFruit,
  deleteFruit,
} from "./firestore.js";

const doc = (id, fields) => ({
  name: `projects/demo/databases/(default)/documents/fruits/${id}`,
  fields,
});

test("decodes Firestore fruit fields", () => {
  assert.deepEqual(
    decodeFruits([
      doc("apple", {
        name: { stringValue: "Apple" },
        isFavourite: { booleanValue: true },
      }),
    ]),
    {
      fruits: [{ id: "apple", name: "Apple", isFavourite: true }],
      errors: [],
    },
  );
});

test("mapping failure preserves valid documents and reports invalid ones", () => {
  const result = decodeFruits(
    [
      doc("valid", { name: { stringValue: "Apple" } }),
      doc("invalid", { name: { integerValue: "42" } }),
    ],
    false,
  );
  assert.equal(result.fruits.length, 1);
  assert.match(result.errors[0], /name/);
});

test("normal collection requires a boolean favourite", () => {
  assert.equal(
    decodeFruits([doc("invalid", { name: { stringValue: "Apple" } })]).errors
      .length,
    1,
  );
});

test("filter queries Firestore, and add/delete use real document endpoints", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      json: async () => (url.endsWith(":runQuery") ? [] : {}),
    };
  });
  await readFruits("fruits", true);
  assert.equal(
    JSON.parse(calls[0].options.body).structuredQuery.where.fieldFilter.value
      .booleanValue,
    true,
  );
  await readFruits("fruits", false);
  assert.equal(
    JSON.parse(calls[1].options.body).structuredQuery.where,
    undefined,
  );
  await addRandomFruit();
  assert.equal(calls[2].options.method, "POST");
  assert.equal(
    JSON.parse(calls[2].options.body).fields.isFavourite.booleanValue,
    true,
  );
  await deleteFruit("test/id");
  assert.equal(calls[3].options.method, "DELETE");
  assert.ok(calls[3].url.endsWith("/test%2Fid"));
});
