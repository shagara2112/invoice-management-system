require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Adding jobTitle and workPeriod columns to Invoice table...')

  try {
    // Add the new columns using raw SQL
    await prisma.$queryRaw`
      ALTER TABLE "Invoice" ADD COLUMN "jobTitle" TEXT
    `
    
    await prisma.$queryRaw`
      ALTER TABLE "Invoice" ADD COLUMN "workPeriod" TEXT
    `
    
    console.log('Columns added successfully!')
  } catch (error) {
    console.error('Error adding columns:', error)
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