import assert from "node:assert/strict";
import test from "node:test";
import { syncSchema } from "./transaction";

const anonUserId = "11111111-1111-4111-8111-111111111111";
const clientId = "22222222-2222-4222-8222-222222222222";

test("aceita uma operação de sincronização válida", () => {
  const result = syncSchema.safeParse({
    anonUserId,
    operations: [{ operation: "upsert", transaction: {
      clientId, details: "Mercado", value: 42.5, type: "saida",
      category: "Alimentação", updatedAt: "2026-01-01T00:00:00.000Z",
    } }],
  });
  assert.equal(result.success, true);
});

test("rejeita identificador anônimo inválido", () => {
  const result = syncSchema.safeParse({ anonUserId: "inseguro", operations: [] });
  assert.equal(result.success, false);
});

test("rejeita lote maior que cem operações", () => {
  const operations = Array.from({ length: 101 }, () => ({
    operation: "delete", clientId, updatedAt: "2026-01-01T00:00:00.000Z",
  }));
  assert.equal(syncSchema.safeParse({ anonUserId, operations }).success, false);
});
