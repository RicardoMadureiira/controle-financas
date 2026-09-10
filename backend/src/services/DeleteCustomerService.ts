import prismaClient from "../prisma";

interface DeleteCustomerProps{
  id: string;
  userId: string;
}

class DeleteCustomerService{
  async execute({ id, userId }: DeleteCustomerProps) {

    if(!id){
      throw new Error("ID inválido!");
    }

    const customer = await prismaClient.customer.deleteMany({
      where: {
        id,
        userId
      }
    });

    if (customer.count === 0) {
      throw new Error("Movimentação não encontrada");
    }

    return { message: "Transação apagada com sucesso!" };
  }
}

export { DeleteCustomerService };
