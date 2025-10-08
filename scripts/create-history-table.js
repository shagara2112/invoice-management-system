require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Creating InvoiceHistory table...')

  try {
    // Create the InvoiceHistory table using raw SQL
    await prisma.$queryRaw`
      CREATE TABLE IF NOT EXISTS "InvoiceHistory" (
        id TEXT PRIMARY KEY,
        invoiceId TEXT NOT NULL,
        field TEXT NOT NULL,
        oldValue TEXT,
        newValue TEXT NOT NULL,
        changedBy TEXT NOT NULL,
        changedAt DATETIME NOT NULL,
        notes TEXT,
        FOREIGN KEY (invoiceId) REFERENCES "Invoice"(id) ON DELETE CASCADE
      )
    `
    
    console.log('InvoiceHistory table created successfully!')
  } catch (error) {
    console.error('Error creating InvoiceHistory table:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })