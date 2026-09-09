import { FastifyInstance } from 'fastify';
import { CreateCustomerController } from './controllers/CreateCustomerController';
import { ListCustomersController } from './controllers/ListCustomersController';
import { DeleteCustomerController } from './controllers/DeleteCustomerController';
import { SyncTransactionsController } from './controllers/SyncTransactionsController';
import { UpdateTransactionController } from './controllers/UpdateTransactionController';

export async function routes( fastify: FastifyInstance) {

    fastify.post("/customer", async (request, reply) => {
        return new CreateCustomerController().handle(request, reply) // criar um novo cliente
        
    })

    fastify.get("/listCustomers", async (request, reply) => {
        return new ListCustomersController().handle(request, reply) // listar todos os clientes
    })

    fastify.delete("/customer/:id", async (request, reply) => {
        return new DeleteCustomerController().handle(request, reply) // deletar um cliente
    })

    fastify.put("/customer/:id", async (request, reply) => {
        return new UpdateTransactionController().handle(request, reply)
    })

    fastify.post("/transactions/sync", async (request, reply) => {
        return new SyncTransactionsController().handle(request, reply)
    })
}
