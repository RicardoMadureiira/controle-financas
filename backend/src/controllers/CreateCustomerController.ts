import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerService } from "../services/CreateCustomerService";
import { z } from 'zod';

// Aqui é criado um schema para validar os dados da requisição
const createCustomerSchema = z.object({
    details: z.string().max(20, { message: "O campo 'details' deve ter no máximo 20 caracteres"}),
    value: z.coerce.number().max(999999.99, "O valor máximo permitido é 999.999,99").positive("O valor deve ser positivo").refine((value) => {
        // verificar se o valor tem no máximo 2 casas decimais
        const decimalPlaces = (value.toString().split(".")[1] || '').length;
        return decimalPlaces <= 2;
    }, { message: "O valor deve ter no máximo 2 casas decimais" }),
    type: z.enum(["entrada", "saida"], { message: "O tipo deve ser 'entrada' ou 'saida'" }) 
});

class CreateCustomerController {
    async handle(request: FastifyRequest, reply: FastifyReply){
        try {
            // Pré-processar o corpo da requisição para lidar com valores em formato brasileiro
            const rawBody = request.body as { details: string; value: number | string; type: "entrada" | "saida" };

            // Converter o valor de string com vírgula para número com ponto
            if (typeof rawBody.value === 'string') {
                rawBody.value = parseFloat(rawBody.value.replace(',', '.'));
            }

            // Atualizar o corpo da requisição com o valor convertido
            request.body = rawBody;

            // Aqui esta sendo feita a validação dos dados da requisição
            const { details, value, type } = createCustomerSchema.parse(request.body);
            
            const customerService = new CreateCustomerService();
            
            const customer = await customerService.execute({ details, value, type });

            reply.send(customer);
        
        } catch (error) {
            if(error instanceof z.ZodError) {
                reply.status(400).send({
                    error: "Erro de validação",
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            } else {
                reply.status(500).send({ error: "Erro interno" });
            }
        }
    }
}

export { CreateCustomerController };