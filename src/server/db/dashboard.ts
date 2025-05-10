import type { UserStats } from '@/types/dashboard'
import BaseDB from './base.ts'

class DashboardDB extends BaseDB {
  async getUserStats(): Promise<UserStats> {
    try {
      const totalUsers = await BaseDB.prisma.user.count()

      const activeUsers = await BaseDB.prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30日前
          }
        }
      })

      const newRegistrations = await BaseDB.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)) // 今月の1日
          }
        }
      })

      const comments = await BaseDB.prisma.comment.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)) // 今月の1日
          }
        }
      })

      return {
        totalUsers,
        activeUsers,
        newRegistrations,
        comments
      }
    } catch (err) {
      console.error(err)
      return {
        totalUsers: 0,
        activeUsers: 0,
        newRegistrations: 0,
        comments: 0
      }
    }
  }
}

export default new DashboardDB()
