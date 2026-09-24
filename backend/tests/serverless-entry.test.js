const assert = require("node:assert/strict");
const { test } = require("node:test");

test("Vercel entry point exports a request handler", () => {
  const handler = require("../api");

  assert.equal(typeof handler, "function");
});
