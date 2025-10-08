const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🚀 Creating sample data for local database...');

    // Create users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const staffPassword = await bcrypt.hash('staff123', 10);
    const managerPassword = await bcrypt.hash('manager123', 10);

    // Create super admin
    const superAdmin = await prisma.user.upsert({
      where: { email: 'admin@monitoring.com' },
      update: {},
      create: {
        email: 'admin@monitoring.com',
        name: 'Super Administrator',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });

    // Create manager
    const manager = await prisma.user.upsert({
      where: { email: 'manager@monitoring.com' },
      update: {},
      create: {
        email: 'manager@monitoring.com',
        name: 'Manager',
        password: managerPassword,
        role: 'MANAGER',
      },
    });

    // Create staff
    const staff = await prisma.user.upsert({
      where: { email: 'staff@monitoring.com' },
      update: {},
      create: {
        email: 'staff@monitoring.com',
        name: 'Staff User',
        password: staffPassword,
        role: 'STAFF',
      },
    });

    console.log('✅ Users created successfully');

    // Create sample invoices
    const sampleInvoices = [
      {
        invoiceNumber: 'INV-2025-001',
        clientName: 'PT. Global Solution',
        issueDate: new Date('2025-01-15'),
        dueDate: new Date('2025-02-15'),
        totalAmount: 25000000,
        currency: 'IDR',
        description: 'Jasa konsultasi IT bulan Januari',
        status: 'SETTLED',
        position: 'MITRA',
        workRegion: 'BALIKPAPAN',
        settlementDate: new Date('2025-02-10'),
        settlementAmount: 25000000,
        paymentMethod: 'Transfer Bank',
        createdById: superAdmin.id,
      },
      {
        invoiceNumber: 'INV-2025-002',
        clientName: 'PT. Teknologi Indonesia',
        issueDate: new Date('2025-01-20'),
        dueDate: new Date('2025-02-20'),
        totalAmount: 15000000,
        currency: 'IDR',
        description: 'Pengembangan aplikasi mobile',
        status: 'AWAITING_PAYMENT',
        position: 'USER',
        workRegion: 'TARAKAN',
        createdById: manager.id,
      },
      {
        invoiceNumber: 'INV-2025-003',
        clientName: 'CV. Digital Nusantara',
        issueDate: new Date('2025-02-01'),
        dueDate: new Date('2025-03-01'),
        totalAmount: 30000000,
        currency: 'IDR',
        description: 'Website development package',
        status: 'SUBMITTED',
        position: 'AREA',
        workRegion: 'SAMARINDA',
        createdById: staff.id,
      },
      {
        invoiceNumber: 'INV-2025-004',
        clientName: 'PT. Edukasi Nusantara',
        issueDate: new Date('2025-02-10'),
        dueDate: new Date('2025-03-10'),
        totalAmount: 28000000,
        currency: 'IDR',
        description: 'Sistem pembelajaran online',
        status: 'INTERNAL_VALIDATION',
        position: 'REGIONAL',
        workRegion: 'BALIKPAPAN',
        createdById: superAdmin.id,
      },
      {
        invoiceNumber: 'INV-2025-005',
        clientName: 'PT. FinTech Solutions',
        issueDate: new Date('2025-02-15'),
        dueDate: new Date('2025-03-15'),
        totalAmount: 45000000,
        currency: 'IDR',
        description: 'Integrasi payment gateway',
        status: 'DRAFT',
        position: 'HEAD_OFFICE',
        workRegion: 'TARAKAN',
        createdById: manager.id,
      },
    ];

    for (const invoice of sampleInvoices) {
      await prisma.invoice.upsert({
        where: { invoiceNumber: invoice.invoiceNumber },
        update: {},
        create: invoice,
      });
    }

    console.log('✅ Sample invoices created successfully');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('👑 Super Admin: admin@monitoring.com / admin123');
    console.log('👔 Manager: manager@monitoring.com / manager123');
    console.log('👤 Staff: staff@monitoring.com / staff123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();