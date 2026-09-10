import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerService } from "../services/CreateCustomerService";
import { z } from 'zod';

const createCustomerSchema = z.object({
  details: z.string().trim().min(1).max(60),
  value: z.coerce.number().positive(),
  type: z.enum(["entrada", "saida"]),
  clientId: z.string().uuid().optional(),
  category: z.string().trim().min(1).max(30).default("Outros")
});

class CreateCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply){
    try {

      const { details, value, type, clientId, category } =
        createCustomerSchema.parse(request.body);

      const customerService = new CreateCustomerService();

      const customer = await customerService.execute({
        details,
        value,
        type,
        userId: request.authUser!.id,
        clientId,
        category
      });

      return reply.send(customer);

    } catch (error) {
      if(error instanceof z.ZodError){
        return reply.status(400).send(error);
      }

      return reply.status(500).send({ error: "Erro interno" });
    }
  }
}

export { CreateCustomerController };
