import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { syncSchema } from "../schemas/transaction";
import { SyncTransactionsService } from "../services/SyncTransactionsService";

class SyncTransactionsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const input = syncSchema.parse(request.body);
      const result = await new SyncTransactionsService().execute(input);
      return reply.send(result);
    } catch (error) {
      if (error instanceof z.ZodError) return reply.status(400).send(error.flatten());
      request.log.error(error);
      return reply.status(500).send({ error: "Erro ao sincronizar movimentações" });
    }
  }
}

export { SyncTransactionsController };
