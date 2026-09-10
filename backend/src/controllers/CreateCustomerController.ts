import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerService } from "../services/CreateCustomerService";
import { z } from 'zod';
import { anonUserIdSchema } from '../schemas/transaction';

const createCustomerSchema = z.object({
  details: z.string().trim().min(1).max(60),
  value: z.coerce.number().positive(),
  type: z.enum(["entrada", "saida"]),
  anonUserId: anonUserIdSchema,
  clientId: z.string().uuid().optional(),
  category: z.string().trim().min(1).max(30).default("Outros")
});

class CreateCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply){
    try {

      const { details, value, type, anonUserId, clientId, category } =
        createCustomerSchema.parse(request.body);

      const customerService = new CreateCustomerService();

      const customer = await customerService.execute({
        details,
        value,
        type,
        anonUserId,
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
