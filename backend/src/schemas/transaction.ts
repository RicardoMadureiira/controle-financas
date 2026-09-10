import { z } from "zod";

export const anonUserIdSchema = z.string().uuid();

export const transactionInputSchema = z.object({
  clientId: z.string().uuid(),
  details: z.string().trim().min(1).max(60),
  value: z.coerce.number().positive().finite(),
  type: z.enum(["entrada", "saida"]),
  category: z.string().trim().min(1).max(30).default("Outros"),
  updatedAt: z.string().datetime(),
});

export const syncSchema = z.object({
  anonUserId: anonUserIdSchema.optional(),
  operations: z.array(z.discriminatedUnion("operation", [
    z.object({
      operation: z.literal("upsert"),
      transaction: transactionInputSchema,
    }),
    z.object({
      operation: z.literal("delete"),
      clientId: z.string().uuid(),
      updatedAt: z.string().datetime(),
    }),
  ])).max(100),
});

export type SyncInput = z.infer<typeof syncSchema>;
