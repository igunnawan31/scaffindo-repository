// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'; // For generating cuid-like strings if needed. Prisma can also generate them.

const prisma = new PrismaClient();

async function main() {
  // 1. Create a Company
  const company = await prisma.company.create({
    data: {
      id: 'cmp_' + uuidv4().substring(0, 8), // Mimicking cuid
      name: 'Acme Manufacturing Inc.',
    },
  });

  // 2. Create a User (Factory Role)
  const factoryUser = await prisma.user.create({
    data: {
      name: 'John Factory',
      email: 'john.factory@acme.com',
      password: 'hashed_password_123', // In a real app, this should be a hash
      companyId: company.id,
      role: 'FACTORY',
      subRole: 'ADMIN',
    },
  });

  const superadmin = await prisma.user.create({
    data: {
      name: 'Superadmin',
      email: 'superadmin@gmail.com',
      password: '$2a$10$iRM7e5bXmu7vzmDcHpdx4OeJD/23CeMgt00Pc1EAnkFFE3Z.Pv/bS', // In a real app, this should be a hash
      companyId: company.id,
      role: 'SUPERADMIN',
    },
  });

  // 3. Create a Product
  const product = await prisma.product.create({
    data: {
      name: 'Premium Widget',
      description: 'A high-quality widget for all your needs.',
      image: [
        {
          path: 'uploads/image/image-1758458687440-234224783.pdf',
          size: 14068,
          filename: 'gambar.png',
          mimetype: 'image/png',
        },
      ], // Example JSON structure
      price: 99900,
      companyId: company.id,
    },
  });

  // 4. Create a Label for the Product
  // For simplicity, we create a Penjualan (Sale) record first, as Label requires it.
  const penjualan = await prisma.penjualan.create({
    data: {
      id: 'sale_' + uuidv4().substring(0, 8),
      totalHarga: 99900,
      paymentMethod: 'QRIS',
    },
  });

  // 5. Create an Invoice
  const invoiceId = 'INVOICE-001';
  const invoice = await prisma.invoice.create({
    data: {
      id: invoiceId,
      qrCode: { data: 'INVOICE_QR_CODE_001' }, // Example JSON structure
      productId: product.id,
    },
  });

  const labelId = `LABEL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-BATCH-0001`;
  const label = await prisma.label.create({
    data: {
      id: labelId,
      qrCode: { data: 'QR_CODE_DATA_STRING_1' }, // Example JSON structure
      status: 'FACTORY_DONE',
      productId: product.id,
      penjualanId: penjualan.id,
      invoiceId: invoiceId,
    },
  });

  // 6. Link the Label to the Invoice (update the label)
  await prisma.label.update({
    where: { id: label.id },
    data: {
      invoiceId: invoice.id,
    },
  });

  // 7. Create an InvoicePIC to link User and Invoice
  await prisma.invoicePIC.create({
    data: {
      userId: factoryUser.id,
      invoiceId: invoice.id,
    },
  });

  // 8. Create a Tracking record for the Label
  const tracking = await prisma.tracking.create({
    data: {
      userId: factoryUser.id,
      role: 'FACTORY',
      title: 'Product Manufactured',
      description:
        'The Premium Widget has been successfully produced and labeled.',
      status: 'FACTORY_DONE',
      companyId: company.id,
      labelId: label.id, // Link to the label
    },
  });

  console.log('Database seeded successfully!');
  console.log(`Created Company: ${company.name}`);
  console.log(`Created User: ${factoryUser.name} (${factoryUser.role})`);
  console.log(`Created Product: ${product.name}`);
  console.log(`Created Label: ${label.id}`);
  console.log(`Created Invoice: ${invoice.id}`);
  console.log(`Created Tracking: ${tracking.title}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
