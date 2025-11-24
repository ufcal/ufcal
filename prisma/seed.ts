import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 初期データの挿入を開始します...')
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'admin@example.com',
        name: '管理者',
        password: '$2a$10$XLEGbbEKPN6WUHyV6Iv9zeT90nZTJl3uz4HPelKblOaQQgEicWijW',
        role: 'ADMIN'
      },
      {
        email: 'user@example.com',
        name: '一般ユーザ',
        password: '$2a$10$XLEGbbEKPN6WUHyV6Iv9zeT90nZTJl3uz4HPelKblOaQQgEicWijW',
        role: 'MEMBER'
      }
    ],
    skipDuplicates: true
  })
  console.log('✅ ユーザーを作成しました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
