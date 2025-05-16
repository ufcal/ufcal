import type { UserActivity, UserActivity, UserStats } from '@/types/dashboard'
import BaseDB from './base'

class DashboardDB extends BaseDB {
  async getRecentUserActivities(limit: number = 10): Promise<UserActivity[]> {
    try {
      const activities = await BaseDB.prisma.activity.findMany({
        where: {
          type: {
            startsWith: 'USER_COMMENT_'
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      })

      return activities.map((activity) => ({
        id: activity.id.toString(),
        content: activity.description || '',
        userName: activity.user.name,
        createdAt: activity.createdAt
      }))
    } catch (err) {
      console.error('ユーザ活動の取得に失敗しました:', err)
      return []
    }
  }

  async getDashboardStats() {
    try {
      const [totalUsers, activeUsers, newRegistrations, totalComments] = await Promise.all([
        BaseDB.prisma.user.count(),
        BaseDB.prisma.user.count({
          where: {
            lastLoginAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30日前
            }
          }
        }),
        BaseDB.prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // 今月の1日
            }
          }
        }),
        BaseDB.prisma.comment.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // 今月の1日
            }
          }
        })
      ])

      return {
        totalUsers,
        activeUsers,
        newRegistrations,
        totalComments
      }
    } catch (err) {
      console.error('ダッシュボード統計の取得に失敗しました:', err)
      return null
    }
  }
}

export default new DashboardDB()
