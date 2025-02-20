import prismaClient from "../prisma";

class ListCustomersService{
    async execute() {
        
        const customers = await prismaClient.customer.findMany() // pegar todos os clientes cadastrados no banco de dados

        return customers;
    }
}

export { ListCustomersService };