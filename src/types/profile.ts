import type { UserSessionData } from './user'

export interface MemberProfileResponse {
  id: number
  name: string
  email: string
  avatar: string
  biography: string
}

export interface MemberProfileRequest {
  name: string
  email: string
  avatar: string
  biography: string
}

// プロフィール情報
export interface UserProfile {
  id: number
  name: string
  email: string
  avatar: string
  biography: string
}

// ユーザ情報からプロフィール情報に変換(必要な情報だけ抽出)
export const convertToUserProfile = (user: any): UserProfile => {
  const userProfile: UserProfile = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    biography: user.biography
  }
  return userProfile
}
