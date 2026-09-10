import { FastifyInstance } from 'fastify';
import { CreateCustomerController } from './controllers/CreateCustomerController';
import { ListCustomersController } from './controllers/ListCustomersController';
import { DeleteCustomerController } from './controllers/DeleteCustomerController';
import { SyncTransactionsController } from './controllers/SyncTransactionsController';
import { UpdateTransactionController } from './controllers/UpdateTransactionController';
import { AuthController } from './controllers/AuthController';
import { authenticate } from './auth/session';

export async function routes( fastify: FastifyInstance) {

    const authController = new AuthController();
    fastify.post("/auth/google", (request, reply) => authController.login(request, reply));
    fastify.get("/auth/me", (request, reply) => authController.me(request, reply));
    fastify.post("/auth/logout", (request, reply) => authController.logout(request, reply));
    fastify.delete("/auth/account", { preHandler: authenticate }, (request, reply) => authController.deleteAccount(request, reply));

    fastify.post("/customer", { preHandler: authenticate }, async (request, reply) => {
        return new CreateCustomerController().handle(request, reply) // criar um novo cliente
        
    })

    fastify.get("/listCustomers", { preHandler: authenticate }, async (request, reply) => {
        return new ListCustomersController().handle(request, reply) // listar todos os clientes
    })

    fastify.delete("/customer/:id", { preHandler: authenticate }, async (request, reply) => {
        return new DeleteCustomerController().handle(request, reply) // deletar um cliente
    })

    fastify.put("/customer/:id", { preHandler: authenticate }, async (request, reply) => {
        return new UpdateTransactionController().handle(request, reply)
    })

    fastify.post("/transactions/sync", { preHandler: authenticate }, async (request, reply) => {
        return new SyncTransactionsController().handle(request, reply)
    })
}
