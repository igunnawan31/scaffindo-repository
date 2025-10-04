// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Superadmin',
      email: 'superadmin@gmail.com',
      password: '$2a$12$Mw14MX1laIJzLcrZ6g5Azuog1.wfO1ZeEdtEeXVzCo6myECYbiECy', // In a real app, this should be a hash
      companyId: null,
      role: 'SUPERADMIN',
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
