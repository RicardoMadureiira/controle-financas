import prismaClient from "../prisma";

interface DeleteCustomerProps{
    id: string;
}

class DeleteCustomerService{
    async execute({ id }: DeleteCustomerProps) {
        // deletar o cliente com ID passado
        if(!id){
            throw new Error("ID inválido!"); // se o ID não for passado, retornar erro
        }

        const findCustomer = await prismaClient.customer.findFirst({
            where: {
                id: id // id igual ao id passado
            }
        })

        if(!findCustomer) {
            throw new Error("Transação não existe!"); // se o id não for encontrado no banco de dados, retornar erro
        }

        await prismaClient.customer.delete({
            where: {
                id: findCustomer.id // deletar o cliente com o id encontrado
            }
        })

        return { message : "Transação apagada com sucesso!" };
    }
}

export { DeleteCustomerService };