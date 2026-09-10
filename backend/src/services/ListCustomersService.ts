import prismaClient from "../prisma";

interface ListCustomersProps { userId: string; }

class ListCustomersService {
  async execute({ userId }: ListCustomersProps) {
    const customers = await prismaClient.customer.findMany({
      where: {
        userId,
      },
      orderBy: {
        created_at: 'desc',
      }
    });

    return customers.map((customer) => ({
      ...customer,
      clientId: customer.clientId ?? customer.id,
      category: customer.category ?? "Outros",
    }));
  }
}

export { ListCustomersService };
