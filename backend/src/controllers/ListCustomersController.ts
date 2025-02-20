import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomersService } from "../services/ListCustomersService";

class ListCustomersController{
    async handle(request: FastifyRequest, reply: FastifyReply){
        const listCustomersService = new ListCustomersService();

        const customers = await listCustomersService.execute(); // Pegar todos os clientes cadastrados no banco de dados

        reply.send(customers);
    }

}

export { ListCustomersController };