import prismaClient from "../prisma";
interface CreateCustomerProps{
    details: string;
    value: number;
    type: string;
    anonUserId: string;
}

class CreateCustomerService{
    async execute( { details, value, type, anonUserId}: CreateCustomerProps) {
        
        if(!details || !value || !type){
            throw new Error("Preencha todos os campos");
        }

        const customer = await prismaClient.customer.create({
            data: {
                details,
                value,
                type,
                anonUserId,
            }
        })

        return customer;
    }
}

export { CreateCustomerService };