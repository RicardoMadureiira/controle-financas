import prismaClient from "../prisma";
import { SyncInput } from "../schemas/transaction";
import { randomUUID } from "crypto";

class SyncTransactionsService {
  async execute({ anonUserId, operations }: SyncInput) {
    const acknowledgements: Array<{ clientId: string; status: "applied" | "ignored" }> = [];

    for (const item of operations) {
      const clientId = item.operation === "upsert" ? item.transaction.clientId : item.clientId;
      const existing = await prismaClient.customer.findFirst({
        where: { anonUserId, clientId },
      });

      if (item.operation === "delete") {
        const deleteDate = new Date(item.updatedAt);
        if (existing?.updated_at && existing.updated_at > deleteDate) {
          acknowledgements.push({ clientId, status: "ignored" });
          continue;
        }
        if (existing) {
          await prismaClient.customer.deleteMany({ where: { anonUserId, clientId: item.clientId } });
        }
        acknowledgements.push({ clientId, status: "applied" });
        continue;
      }

      const incomingDate = new Date(item.transaction.updatedAt);
      if (existing && existing.updated_at && existing.updated_at > incomingDate) {
        acknowledgements.push({ clientId, status: "ignored" });
        continue;
      }

      const data = {
        details: item.transaction.details,
        value: item.transaction.value,
        type: item.transaction.type,
        category: item.transaction.category,
        clientId: item.transaction.clientId,
        anonUserId,
        updated_at: incomingDate,
      };

      if (existing) {
        await prismaClient.customer.update({ where: { id: existing.id }, data });
      } else {
        await prismaClient.customer.create({ data });
      }
      acknowledgements.push({ clientId, status: "applied" });
    }

    const legacyTransactions = await prismaClient.customer.findMany({
      where: { anonUserId, clientId: null },
    });
    for (const legacy of legacyTransactions) {
      await prismaClient.customer.update({
        where: { id: legacy.id },
        data: { clientId: randomUUID(), category: legacy.category ?? "Outros" },
      });
    }

    const transactions = await prismaClient.customer.findMany({
      where: { anonUserId },
      orderBy: { created_at: "desc" },
    });

    return {
      acknowledgements,
      transactions: transactions.map((transaction) => ({
        ...transaction,
        clientId: transaction.clientId ?? transaction.id,
        category: transaction.category ?? "Outros",
      })),
    };
  }
}

export { SyncTransactionsService };
