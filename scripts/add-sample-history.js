require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Adding sample history records...')

  // Get all invoices
  const invoices = await prisma.invoice.findMany()
  
  if (invoices.length === 0) {
    console.log('No invoices found. Please run seed script first.')
    return
  }

  // Create sample history for each invoice
  for (const invoice of invoices) {
    // Skip if history already exists
    const existingHistory = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM main.InvoiceHistory WHERE invoiceId = ${invoice.id}
    `
    
    if (existingHistory[0].count > 0) {
      console.log(`History already exists for invoice ${invoice.invoiceNumber}`)
      continue
    }

    console.log(`Creating history for invoice ${invoice.invoiceNumber}`)
    
    // Create some sample history records
    const historyRecords = [
      {
        invoiceId: invoice.id,
        field: 'status',
        oldValue: null,
        newValue: 'DRAFT',
        changedBy: invoice.createdBy?.name || 'System',
        changedAt: invoice.createdAt,
      },
      {
        invoiceId: invoice.id,
        field: 'position',
        oldValue: null,
        newValue: invoice.position,
        changedBy: invoice.createdBy?.name || 'System',
        changedAt: invoice.createdAt,
      }
    ]

    // Add status change if not DRAFT
    if (invoice.status !== 'DRAFT') {
      historyRecords.push({
        invoiceId: invoice.id,
        field: 'status',
        oldValue: 'DRAFT',
        newValue: invoice.status,
        changedBy: 'Super Administrator',
        changedAt: new Date(invoice.createdAt.getTime() + 24 * 60 * 60 * 1000), // 1 day later
      })
    }

    // Add position change if not MITRA
    if (invoice.position !== 'MITRA') {
      historyRecords.push({
        invoiceId: invoice.id,
        field: 'position',
        oldValue: 'MITRA',
        newValue: invoice.position,
        changedBy: 'Super Administrator',
        changedAt: new Date(invoice.createdAt.getTime() + 24 * 60 * 60 * 1000), // 1 day later
      })
    }

    // Insert history records using raw query (since Prisma client might not have the model yet)
    for (const record of historyRecords) {
      await prisma.$queryRaw`
        INSERT INTO main.InvoiceHistory (
          id, invoiceId, field, oldValue, newValue, changedBy, changedAt, notes
        ) VALUES (
          ${`cmgfzbzj${Math.random().toString(36).substring(2, 15)}`}, 
          ${record.invoiceId}, 
          ${record.field}, 
          ${record.oldValue}, 
          ${record.newValue}, 
          ${record.changedBy}, 
          ${record.changedAt}, 
          ${record.notes || null}
        )
      `
    }
  }

  console.log('Sample history records added successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })