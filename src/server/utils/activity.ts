import { ActivityDB } from '@/server/db'
import type { ActivityLog, ActivityType, CreateActivityData } from '@/types/activity'
import type { IUser } from '@/types/user'

export class Activity {
  public static async logActivity(data: CreateActivityData): Promise<boolean> {
    const log: ActivityLog = {
      type: data.type,
      description: data.description ?? '',
      userId: data.userId,
      metadata: data.metadata ?? {}
    }

    const result = await ActivityDB.createActivity(log)
    if (result) {
      return true
    } else {
      return false
    }
  }

  // 管理者用ヘルパーメソッド
  public static async logAdminEventCreate(
    admin: IUser,
    eventId: string,
    eventTitle: string
  ): Promise<boolean> {
    return Activity.logActivity({
      type: 'ADMIN_EVENT_CREATE',
      description: `イベント「${eventTitle}」を作成しました`,
      user: admin,
      metadata: {
        eventId,
        eventTitle
      }
    })
  }

  public static async logAdminUserUpdate(
    admin: IUser,
    userName: string,
    updatedFields: Record<string, unknown>
  ): Promise<boolean> {
    return Activity.logActivity({
      type: 'ADMIN_USER_UPDATE',
      description: `ユーザー「${userName}」の情報を更新しました`,
      user: admin,
      metadata: {
        updatedFields
      }
    })
  }

  // ユーザー用ヘルパーメソッド
  public static async logUserComment(
    user: IUser,
    commentId: string,
    eventId: string,
    commentContent: string
  ): Promise<boolean> {
    return Activity.logActivity({
      type: 'USER_COMMENT_CREATE',
      description: 'イベントにコメントを投稿しました',
      user,
      metadata: {
        commentId,
        eventId,
        commentContent
      }
    })
  }

  public static async logUserProfileUpdate(
    user: IUser,
    updatedFields: Record<string, unknown>
  ): Promise<boolean> {
    return Activity.logActivity({
      type: 'USER_PROFILE_UPDATE',
      description: 'プロフィール情報を更新しました',
      user,
      metadata: {
        updatedFields
      }
    })
  }

  public static async getRecentActivities(limit: number = 10): Promise<any[]> {
    return ActivityDB.getRecentActivities(limit)
  }

  public static async getActivitiesByType(type: ActivityType): Promise<any[]> {
    return ActivityDB.getActivitiesByType(type)
  }

  public static async getActivitiesByUser(userId: string): Promise<any[]> {
    return ActivityDB.getActivitiesByUser(userId)
  }

  public static async getAdminActivities(limit: number = 10): Promise<any[]> {
    return ActivityDB.getAdminActivities(limit)
  }

  public static async getUserActivities(limit: number = 10): Promise<any[]> {
    return ActivityDB.getUserActivities(limit)
  }
}
