import prismaClient from "../prisma";

interface CreateCustomerProps{
    details: string;
    value: number;
    type: string;

}

class CreateCustomerService{
    async execute( { details, value, type}: CreateCustomerProps) {
        
        if(!details || !value || !type){
            throw new Error("Preencha todos os campos");
        }

        const customer = await prismaClient.customer.create({
            data: {
                details,
                value,
                type
            }
        })

        return customer;
    }
}

export { CreateCustomerService };