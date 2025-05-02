import prismaClient from "../prisma";

interface ListCustomersProps {
  anonUserId: string;
}

class ListCustomersService {
  async execute({ anonUserId }: ListCustomersProps) {
    const customers = await prismaClient.customer.findMany({
      where: {
        anonUserId,
      },
      orderBy: {
        created_at: 'desc',
      }
    });

    return customers;
  }
}

export { ListCustomersService };
