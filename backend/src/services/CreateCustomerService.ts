import prismaClient from "../prisma";
import { randomUUID } from "crypto";
interface CreateCustomerProps{
    details: string;
    value: number;
    type: string;
    userId: string;
    clientId?: string;
    category?: string;
}

class CreateCustomerService{
    async execute( { details, value, type, userId, clientId = randomUUID(), category = "Outros"}: CreateCustomerProps) {
        
        if(!details || !value || !type){
            throw new Error("Preencha todos os campos");
        }

        const existing = await prismaClient.customer.findFirst({ where: { userId, clientId } });
        if (existing) return existing;

        const customer = await prismaClient.customer.create({
            data: {
                details,
                value,
                type,
                userId,
                clientId,
                category,
            }
        })

        return customer;
    }
}

export { CreateCustomerService };
