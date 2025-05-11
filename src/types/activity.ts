/**
 * ユーザーアクティビティの種類を定義
 */
export enum UserActivityType {
  // 認証関連
  LOGIN = 'LOGIN', // ログイン
  LOGOUT = 'LOGOUT', // ログアウト
  PASSWORD_CHANGE = 'PASSWORD_CHANGE', // パスワード変更
  PROFILE_UPDATE = 'PROFILE_UPDATE', // プロフィール更新

  // イベント関連
  EVENT_CREATE = 'EVENT_CREATE', // イベント作成
  EVENT_UPDATE = 'EVENT_UPDATE', // イベント更新
  EVENT_DELETE = 'EVENT_DELETE', // イベント削除
  EVENT_VIEW = 'EVENT_VIEW', // イベント閲覧

  // コメント関連
  COMMENT_CREATE = 'COMMENT_CREATE', // コメント作成
  COMMENT_UPDATE = 'COMMENT_UPDATE', // コメント更新
  COMMENT_DELETE = 'COMMENT_DELETE', // コメント削除

  // 管理者関連
  USER_ENABLE = 'USER_ENABLE', // ユーザー有効化
  USER_DISABLE = 'USER_DISABLE', // ユーザー無効化
  USER_DELETE = 'USER_DELETE' // ユーザー削除
}

/**
 * アクティビティのメタデータの型定義
 */
export interface UserActivityMetadata {
  // イベント関連のメタデータ
  eventId?: number
  eventTitle?: string

  // コメント関連のメタデータ
  commentId?: number
  commentContent?: string

  // ユーザー関連のメタデータ
  targetUserId?: number
  targetUserName?: string

  // その他のメタデータ
  ipAddress?: string
  userAgent?: string
  [key: string]: any // その他の追加メタデータ
}

/**
 * アクティビティの詳細情報の型定義
 */
export interface UserActivityDetails {
  type: UserActivityType
  metadata?: UserActivityMetadata
  description?: string
}
