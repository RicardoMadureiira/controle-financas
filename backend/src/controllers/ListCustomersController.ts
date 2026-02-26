import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomersService } from "../services/ListCustomersService";

class ListCustomersController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { anonUserId } = request.query as { anonUserId: string };

    if (!anonUserId) {
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
