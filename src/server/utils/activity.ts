import type { ActivityLog, ActivityType, CreateActivityData } from '@/types/activity'
import type { IUser } from '@/types/user'
import ActivityDB from '../db/activity'

export class Activity {
  private static instance: Activity
  private activityDB: ActivityDB

  private constructor() {
    this.activityDB = new ActivityDB()
  }

  public static getInstance(): Activity {
    if (!Activity.instance) {
      Activity.instance = new Activity()
    }
    return Activity.instance
  }

  public async logActivity(data: CreateActivityData): Promise<ActivityLog> {
    const log: ActivityLog = {
      id: crypto.randomUUID().toString(),
      type: data.type,
      title: data.title,
      description: data.description ?? '',
      userId: data.user.id.toString(),
      userName: data.user.name,
      createdAt: new Date(),
      metadata: data.metadata ?? {}
    }

    await this.activityDB.createActivity(log)
    return log
  }

  // 管理者用ヘルパーメソッド
  public async logAdminEventCreate(
    admin: IUser,
    eventId: string,
    eventTitle: string
  ): Promise<ActivityLog> {
    return this.logActivity({
      type: 'ADMIN_EVENT_CREATE',
      title: 'イベント作成',
      description: `イベント「${eventTitle}」を作成しました`,
      user: admin,
      metadata: {
        eventId,
        eventTitle
      }
    })
  }

  public async logAdminUserUpdate(
    admin: IUser,
    targetUserId: string,
    updatedFields: Record<string, unknown>
  ): Promise<ActivityLog> {
    return this.logActivity({
      type: 'ADMIN_USER_UPDATE',
      title: 'ユーザー情報更新',
      description: 'ユーザー情報を更新しました',
      user: admin,
      metadata: {
        targetUserId,
        updatedFields
      }
    })
  }

  // ユーザー用ヘルパーメソッド
  public async logUserComment(
    user: IUser,
    commentId: string,
    eventId: string,
    commentContent: string
  ): Promise<ActivityLog> {
    return this.logActivity({
      type: 'USER_COMMENT_CREATE',
      title: 'コメント投稿',
      description: 'イベントにコメントを投稿しました',
      user,
      metadata: {
        commentId,
        eventId,
        commentContent
      }
    })
  }

  public async logUserProfileUpdate(
    user: IUser,
    updatedFields: Record<string, unknown>
  ): Promise<ActivityLog> {
    return this.logActivity({
      type: 'USER_PROFILE_UPDATE',
      title: 'プロフィール更新',
      description: 'プロフィール情報を更新しました',
      user,
      metadata: {
        updatedFields
      }
    })
  }

  public async getRecentActivities(limit: number = 10): Promise<ActivityLog[]> {
    return this.activityDB.getRecentActivities(limit)
  }

  public async getActivitiesByType(type: ActivityType): Promise<ActivityLog[]> {
    return this.activityDB.getActivitiesByType(type)
  }

  public async getActivitiesByUser(userId: string): Promise<ActivityLog[]> {
    return this.activityDB.getActivitiesByUser(userId)
  }

  public async getAdminActivities(limit: number = 10): Promise<ActivityLog[]> {
    return this.activityDB.getAdminActivities(limit)
  }

  public async getUserActivities(limit: number = 10): Promise<ActivityLog[]> {
    return this.activityDB.getUserActivities(limit)
  }

  public async createActivity(data: CreateActivityData): Promise<ActivityLog> {
    const activityData: ActivityLog = {
      id: crypto.randomUUID(),
      type: data.type,
      title: data.title,
      description: data.description ?? '',
      userId: data.user.id,
      userName: data.user.name,
      createdAt: new Date(),
      metadata: data.metadata ?? {}
    }

    await this.activityDB.create(activityData)
    return activityData
  }
}
