require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Adding sample job data to existing invoices...')

  try {
    // Get all invoices
    const invoices = await prisma.invoice.findMany()
    
    // Sample job titles and work periods
    const jobTitles = [
      'Pengembangan Web Application',
      'Konsultasi IT Infrastructure',
      'Implementasi Sistem ERP',
      'Maintenance Jaringan',
      'Pengembangan Mobile App',
      'Audit Sistem Keamanan',
      'Training Karyawan IT',
      'Pengembangan API Integration'
    ]
    
    const workPeriods = [
      'Januari 2025 - Maret 2025',
      'Februari 2025 - April 2025',
      'Maret 2025 - Mei 2025',
      'April 2025 - Juni 2025',
      'Mei 2025 - Juli 2025',
      'Juni 2025 - Agustus 2025',
      'Juli 2025 - September 2025',
      'Agustus 2025 - Oktober 2025'
    ]
    
    // Update each invoice with random job title and work period
    for (const invoice of invoices) {
      const randomJobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)]
      const randomWorkPeriod = workPeriods[Math.floor(Math.random() * workPeriods.length)]
      
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          jobTitle: randomJobTitle,
          workPeriod: randomWorkPeriod
        }
      })
      
      console.log(`Updated invoice ${invoice.invoiceNumber} with job title and work period`)
    }
    
    console.log('Sample job data added successfully!')
  } catch (error) {
    console.error('Error adding sample job data:', error)
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