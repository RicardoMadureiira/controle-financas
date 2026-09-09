import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomersService } from "../services/ListCustomersService";
import { anonUserIdSchema } from "../schemas/transaction";

class ListCustomersController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { anonUserId } = request.query as { anonUserId: string };

    if (!anonUserId || !anonUserIdSchema.safeParse(anonUserId).success) {
      return reply.status(401).send({ error: "Usuário não identificado" });
    }

    const listCustomersService = new ListCustomersService();

    const customers = await listCustomersService.execute({
      anonUserId
    });

    return reply.send(customers);
  }
}

export { ListCustomersController };
