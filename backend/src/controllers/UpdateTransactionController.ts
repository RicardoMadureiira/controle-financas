import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import prismaClient from "../prisma";
import { anonUserIdSchema, transactionInputSchema } from "../schemas/transaction";

const updateSchema = transactionInputSchema.omit({ clientId: true, updatedAt: true }).extend({
  anonUserId: anonUserIdSchema,
});

class UpdateTransactionController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const input = updateSchema.parse(request.body);
      const existing = await prismaClient.customer.findFirst({ where: { id, anonUserId: input.anonUserId } });
      if (!existing) return reply.status(404).send({ error: "Movimentação não encontrada" });
      const transaction = await prismaClient.customer.update({
        where: { id },
        data: { details: input.details, value: input.value, type: input.type, category: input.category },
      });
      return reply.send(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) return reply.status(400).send(error.flatten());
      request.log.error(error);
      return reply.status(500).send({ error: "Erro ao atualizar movimentação" });
    }
  }
}

export { UpdateTransactionController };
