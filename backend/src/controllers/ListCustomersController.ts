import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomersService } from "../services/ListCustomersService";

interface CustomRequest extends FastifyRequest {
  cookies: {
    anonUserId?: string;
  };
}

class ListCustomersController {
  async handle(request: CustomRequest, reply: FastifyReply) {

    const { anonUserId } = request.cookies;

    // VALIDAÇÃO 
    if (!anonUserId) {
      return reply.status(401).send({ error: "Usuário não identificado" });
    }

    const listCustomersService = new ListCustomersService();

    const customers = await listCustomersService.execute({
      anonUserId
    });

    reply.send(customers);
  }
}

export { ListCustomersController };
