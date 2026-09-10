import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCustomerService } from "../services/DeleteCustomerService";

class DeleteCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    // id vem da rota
    const { id } = request.params as { id: string };

    const deleteCustomerService = new DeleteCustomerService();

    const customer = await deleteCustomerService.execute({
      id,
      userId: request.authUser!.id
    });

    return reply.send(customer);
  }
}

export { DeleteCustomerController };
