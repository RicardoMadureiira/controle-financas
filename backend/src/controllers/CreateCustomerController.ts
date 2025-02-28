import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerService } from "../services/CreateCustomerService";

class CreateCustomerController {
    async handle(request: FastifyRequest, reply: FastifyReply){
        const { details, value, type } = request.body as { details: string, value: number, type: string }; // aqui estamos pegando os dados do corpo da requisição
        
        const customerService = new CreateCustomerService(); // aqui estamos instanciando a classe CreateCustomerService

        const customer = await customerService.execute( { details, value, type } ); // aqui estamos chamando o método execute da classe CreateCustomerService

        reply.send(customer);
    }
}

export { CreateCustomerController };	