import assert from "node:assert/strict";
import test from "node:test";
import { hashToken } from "./session";

test("o token de sessão é armazenado como hash determinístico", () => {
  const hash = hashToken("segredo-da-sessao");
  assert.equal(hash, hashToken("segredo-da-sessao"));
  assert.notEqual(hash, "segredo-da-sessao");
  assert.equal(hash.length, 64);
});
