export type TransactionType = "entrada" | "saida";
export type SyncStatus = "pending" | "syncing" | "synced" | "error";
export type PendingOperation = "upsert" | "delete" | null;

export interface Transaction {
  id?: string;
  clientId: string;
  details: string;
  value: number;
  type: TransactionType;
  category: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  pendingOperation: PendingOperation;
  deleted?: boolean;
}

export interface TransactionDraft {
  details: string;
  value: number;
  type: TransactionType;
  category: string;
}

export interface Filters {
  period: "month" | "30days" | "all" | "custom";
  type: "all" | TransactionType;
  category: string;
  startDate: string;
  endDate: string;
}
