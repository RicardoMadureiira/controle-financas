import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CreateCustomerController } from './controllers/CreateCustomerController';
import { ListCustomersController } from './controllers/ListCustomersController';
import { DeleteCustomerController } from './controllers/DeleteCustomerController';

interface CustomRequest extends FastifyRequest {
    cookies: {
        anonUserId?: string;
    };
}

export async function routes( fastify: FastifyInstance) {

    fastify.post("/customer", async (request: CustomRequest, reply: FastifyReply) => {
        return new CreateCustomerController().handle(request, reply) // criar um novo cliente
        
    })

    fastify.get("/listCustomers", async (request: CustomRequest, reply: FastifyReply) => {
        return new ListCustomersController().handle(request, reply) // listar todos os clientes
    })

    fastify.delete("/customer/:id", async (request: CustomRequest, reply: FastifyReply) => {
        return new DeleteCustomerController().handle(request, reply) // deletar um cliente
    })
}