import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerService } from "../services/CreateCustomerService";

class CreateCustomerController {
    async handle(request: FastifyRequest, reply: FastifyReply){
        const { details, value, type } = request.body as { details: string, value: number, type: string };
        console.log(details, value, type);
        
        const customerService = new CreateCustomerService();

        const customer = await customerService.execute( { details, value, type } );

        reply.send(customer);
    }
}

export { CreateCustomerController };	