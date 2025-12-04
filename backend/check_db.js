const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customers = await prisma.customer.count();
  const orders = await prisma.order.count();
  const products = await prisma.product.count();
  const tenants = await prisma.tenant.findMany();

  console.log('--- Database Stats ---');
  console.log(`Tenants: ${tenants.length}`);
  console.log(`Customers: ${customers}`);
  console.log(`Orders: ${orders}`);
  console.log(`Products: ${products}`);
  console.log('----------------------');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
