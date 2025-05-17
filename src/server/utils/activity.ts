import ActivityDB from '@/server/db/activity'
import type {
  ActivityLog,
  ActivityType,
  EventActivityData,
  //CreateActivityData,
  UserCommentActivityData
} from '@/types/activity'

export class Activity {
  //public static async logActivity(data: CreateActivityData): Promise<boolean> {
  public static async logActivity(data: ActivityLog): Promise<boolean> {
    if (!data.userId) {
      console.error('userId is required')
      return false
    }

    const log: ActivityLog = {
      type: data.type,
      title: data.title,
      description: data.description ?? '',
      metadata: data.metadata ?? {},
      userId: data.userId // アクティビティを実行したユーザ
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
    userId: number,
    eventId: number,
    eventTitle: string
  ): Promise<boolean> {
    return Activity.logActivity({
      type: 'ADMIN_EVENT_CREATE',
      title: 'イベント作成',
      description: `イベント「${eventTitle}」を作成しました`,
      userId,
      metadata: {
        eventId,
        eventTitle
      }
    })
  }

  public static async logAdminUserUpdate(
    userId: number,
    userName: string,
    updatedFields: Record<string, unknown>
  ): Promise<boolean> {
    return Activity.logActivity({
      type: 'ADMIN_USER_UPDATE',
      title: 'ユーザー情報更新',
      description: `ユーザー「${userName}」の情報を更新しました`,
      userId,
      metadata: {
        updatedFields
      }
    })
  }

  // ユーザー用ヘルパーメソッド
  public static async logUserComment(
    userId: number,
    data: UserCommentActivityData
  ): Promise<boolean> {
    return Activity.logActivity({
      type: 'USER_COMMENT_CREATE',
      title: 'コメント投稿',
      description: data.commentContent,
      metadata: {
        // コメントの情報
        creatorId: data.creatorId,
        creatorName: data.creatorName,
        commentId: data.commentId,
        eventId: data.eventId,
        eventTitle: data.eventTitle
      },
      userId: userId // アクティビティを実行したユーザ
    })
  }

  public static async logUserProfileUpdate(
    userId: number,
    updatedFields: Record<string, unknown>
  ): Promise<boolean> {
    return Activity.logActivity({
      type: 'USER_PROFILE_UPDATE',
      title: 'プロフィール更新',
      description: 'プロフィール情報を更新しました',
      userId,
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

  // イベント操作のログメソッド
  public static async logEventCreate(userId: number, data: EventActivityData): Promise<boolean> {
    return Activity.logActivity({
      type: 'ADMIN_EVENT_CREATE',
      title: 'イベント作成',
      description: `イベント「${data.eventTitle}」を作成しました`,
      userId,
      metadata: {
        eventId: data.eventId,
        eventTitle: data.eventTitle
      }
    })
  }

  public static async logEventUpdate(userId: number, data: EventActivityData): Promise<boolean> {
    return Activity.logActivity({
      type: 'ADMIN_EVENT_UPDATE',
      title: 'イベント更新',
      description: `イベント「${data.eventTitle}」を更新しました`,
      userId,
      metadata: {
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        updatedFields: data.updatedFields
      }
    })
  }

  public static async logEventDelete(userId: number, data: EventActivityData): Promise<boolean> {
    return Activity.logActivity({
      type: 'ADMIN_EVENT_DELETE',
      title: 'イベント削除',
      description: `イベント「${data.eventTitle}」を削除しました`,
      userId,
      metadata: {
        eventId: data.eventId,
        eventTitle: data.eventTitle
      }
    })
  }
}
