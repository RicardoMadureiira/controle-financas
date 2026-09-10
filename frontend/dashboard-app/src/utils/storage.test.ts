import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Transaction } from "../types";
import { clearUserCache, loadTransactions, migrateAnonymousCache, saveTransactions } from "./storage";

const memory = new Map<string, string>();
const localStorageMock = { getItem: vi.fn((key: string) => memory.get(key) ?? null), setItem: vi.fn((key: string, value: string) => memory.set(key, value)), removeItem: vi.fn((key: string) => memory.delete(key)), clear: vi.fn(() => memory.clear()), key: vi.fn(), length: 0 };
vi.stubGlobal("localStorage", localStorageMock);

const item: Transaction = { clientId: "1", details: "Salário", value: 100, type: "entrada", category: "Salário", createdAt: "2026-01-01", updatedAt: "2026-01-01", syncStatus: "pending", pendingOperation: "upsert" };

describe("cache por usuário", () => {
  beforeEach(() => memory.clear());
  it("não mistura movimentações entre contas", () => { saveTransactions("user-a", [item]); expect(loadTransactions("user-a")).toEqual([item]); expect(loadTransactions("user-b")).toEqual([]); });
  it("migra o cache anônimo no primeiro login", () => { memory.set("finance.transactions.v2", JSON.stringify([item])); migrateAnonymousCache("user-a"); expect(loadTransactions("user-a")).toEqual([item]); expect(memory.has("finance.transactions.v2")).toBe(false); });
  it("combina cache anônimo e cache existente sem duplicar clientId", () => { saveTransactions("user-a", [{ ...item, details: "Antigo" }]); memory.set("finance.transactions.v2", JSON.stringify([item])); migrateAnonymousCache("user-a"); expect(loadTransactions("user-a")).toEqual([item]); });
  it("limpa somente o cache da conta informada", () => { saveTransactions("user-a", [item]); saveTransactions("user-b", [item]); clearUserCache("user-a"); expect(loadTransactions("user-a")).toEqual([]); expect(loadTransactions("user-b")).toEqual([item]); });
});
