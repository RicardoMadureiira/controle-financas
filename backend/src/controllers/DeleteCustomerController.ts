import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCustomerService } from "../services/DeleteCustomerService";

class DeleteCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    // id vem da rota
    const { id } = request.params as { id: string };

    // anonUserId vem da query (igual no list)
    const { anonUserId } = request.query as { anonUserId: string };

    if (!anonUserId) {
      return reply.status(401).send({ error: "Usuário não identificado" });
    }

    const deleteCustomerService = new DeleteCustomerService();

    const customer = await deleteCustomerService.execute({
      id,
      anonUserId
    });

    return reply.send(customer);
  }
}

export { DeleteCustomerController };
