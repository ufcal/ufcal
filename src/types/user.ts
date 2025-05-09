import type { User } from '@prisma/client'

export type UserRole = 'ADMIN' | 'MODERATOR' | 'EDITOR' | 'MEMBER'

// クライアント側で使用するユーザ認証情報
export interface UserAuth {
  id: number
  email: string
  name: string
  avatar: string
  //role: string
  role: UserRole
}

// セッションに保存するユーザ情報
export interface UserSessionData {
  id: number
  email: string
  name: string
  avatar: string
  role: UserRole
}

// セッションデータからユーザ認証情報に変換(必要な情報だけ抽出)
export const convertToUserAuth = (user: UserSessionData): UserAuth => {
  const userAuth: UserAuth = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role
  }
  return userAuth
}

// Prisma APIからセッションに保存するデータに変換
export const convertToUserSessionData = (user: User): UserSessionData => {
  const { password, createdAt, ...exceptPassword } = user
  const userSessinData: UserSessionData = {
    id: exceptPassword.id,
    email: exceptPassword.email,
    name: exceptPassword.name,
    avatar: exceptPassword.avatar ?? '',
    role: exceptPassword.role as UserRole
  }
  return userSessinData
}

// 管理画面で表示するユーザー情報
export interface UserAdminResponse {
  id: number
  email: string
  name: string
  password: string
  role: UserRole
  avatar: string | null
  biography: string | null
  active: boolean
}

// 管理画面から登録するユーザ情報
export interface UserAdminRequest {
  email: string
  name: string
  password?: string | undefined
  role: UserRole
  isEnabled: boolean
}

// 管理機能用ユーザー情報
export interface IUser {
  id: number
  email: string
  name: string
  role: UserRole
  createdAt: Date
  isEnabled: boolean
  avatar?: string
  biography?: string
}
