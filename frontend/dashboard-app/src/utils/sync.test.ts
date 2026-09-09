import { describe, expect, it } from "vitest";
import type { Transaction } from "../types";
import { buildSyncOperations, mergeAfterSync } from "./sync";

const transaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  clientId: "11111111-1111-4111-8111-111111111111", details: "Teste", value: 10,
  type: "saida", category: "Outros", createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z", syncStatus: "pending", pendingOperation: "upsert",
  ...overrides,
});

describe("fila de sincronização", () => {
  it("serializa criações e exclusões pendentes", () => {
    const operations = buildSyncOperations([transaction(), transaction({ clientId: "22222222-2222-4222-8222-222222222222", pendingOperation: "delete", deleted: true })]);
    expect(operations.map((item) => item.operation)).toEqual(["upsert", "delete"]);
  });

  it("não envia itens já sincronizados", () => {
    expect(buildSyncOperations([transaction({ pendingOperation: null, syncStatus: "synced" })])).toEqual([]);
  });

  it("preserva uma edição feita enquanto a resposta antiga chegava", () => {
    const submitted = transaction();
    const edited = transaction({ details: "Mais novo", updatedAt: "2026-01-02T00:00:00.000Z" });
    const server = transaction({ details: "Antigo", pendingOperation: null, syncStatus: "synced" });
    expect(mergeAfterSync([submitted], [edited], [server])[0].details).toBe("Mais novo");
  });

  it("substitui a operação confirmada pela versão canônica", () => {
    const server = transaction({ id: "mongo-id", pendingOperation: null, syncStatus: "synced" });
    expect(mergeAfterSync([transaction()], [transaction()], [server])).toEqual([server]);
  });
});
