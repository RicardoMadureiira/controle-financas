import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCustomerService } from "../services/DeleteCustomerService";

class DeleteCustomerController{
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }; // aqui pegamos o id do cliente que queremos apagar
        
        const deleteCustomerService = new DeleteCustomerService();  // instanciar a classe de serviço

        const customer = await deleteCustomerService.execute( { id } ); // apagar um cliente do banco de dados

        return reply.send(customer); // retornar a resposta
    }
}

export { DeleteCustomerController };