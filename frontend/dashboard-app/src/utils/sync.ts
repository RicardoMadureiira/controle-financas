import type { Transaction } from "../types";

export function buildSyncOperations(items: Transaction[]) {
  return items.filter((item) => item.pendingOperation).map((item) => item.pendingOperation === "delete"
    ? { operation: "delete" as const, clientId: item.clientId, updatedAt: item.updatedAt }
    : { operation: "upsert" as const, transaction: {
        clientId: item.clientId, details: item.details, value: item.value,
        type: item.type, category: item.category, updatedAt: item.updatedAt,
      } });
}

export function mergeAfterSync(submitted: Transaction[], latest: Transaction[], canonical: Transaction[]) {
  const submittedVersions = new Map(submitted.map((item) => [item.clientId, item.updatedAt]));
  const newer = latest.filter((item) => item.pendingOperation && submittedVersions.get(item.clientId) !== item.updatedAt);
  const newerIds = new Set(newer.map((item) => item.clientId));
  return [...newer, ...canonical.filter((item) => !newerIds.has(item.clientId))];
}
