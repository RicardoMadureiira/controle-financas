import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomersService } from "../services/ListCustomersService";

class ListCustomersController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const listCustomersService = new ListCustomersService();

    const customers = await listCustomersService.execute({
      userId: request.authUser!.id
    });

    return reply.send(customers);
  }
}

export { ListCustomersController };
