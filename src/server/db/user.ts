import type { User } from '@prisma/client'
import BaseDB from './base'

class UserDB extends BaseDB {
  async getUsers(): Promise<User[]> {
    try {
      const users = await BaseDB.prisma.user.findMany({
        orderBy: [
          {
            id: 'desc'
          }
        ]
      })
      return users
    } catch (err) {
      console.error(err)
      return []
    }
  }
  async getUserById(id: number): Promise<User | null> {
    try {
      const event = await BaseDB.prisma.user.findUnique({
        where: { id }
      })
      return event
    } catch (err) {
      console.error(err)
      return null
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await BaseDB.prisma.user.findUnique({
        where: {
          email: email
        }
      })
      return user
    } catch (err) {
      console.error(err)
      return null
    }
  }
  async getUserByRememberMeToken(token: string): Promise<User | null> {
    try {
      const user = await BaseDB.prisma.user.findUnique({
        where: {
          rememberMeToken: token,
          rememberMeTokenExpiry: {
            gte: new Date()
          }
        }
      })
      return user
    } catch (err) {
      console.error(err)
      return null
    }
  }
  async updateRememberMe(
    id: number,
    token: string | null,
    tokenExpiry: Date | null
  ): Promise<User | null> {
    try {
      const user = await BaseDB.prisma.user.update({
        where: { id: id },
        data: {
          rememberMeToken: token,
          rememberMeTokenExpiry: tokenExpiry
        }
      })
      return user
    } catch (err) {
      console.error(err)
      return null
    }
  }

  // プロフィール更新用メソッド
  async updateUserProfile(
    id: number,
    data: { name: string; email: string; biography: string | null; avatar?: string }
  ): Promise<User | null> {
    try {
      const user = await BaseDB.prisma.user.update({
        where: { id },
        data
      })
      return user
    } catch (err) {
      console.error(err)
      return null
    }
  }

  // アバター名取得用メソッド
  async getUserAvatarById(id: number): Promise<string | null> {
    try {
      const user = await BaseDB.prisma.user.findUnique({
        where: { id },
        select: { avatar: true }
      })
      return user?.avatar || null
    } catch (err) {
      console.error(err)
      return null
    }
  }

  // パスワード更新用メソッド
  async updatePassword(id: number, hashedPassword: string): Promise<boolean> {
    try {
      await BaseDB.prisma.user.update({
        where: { id },
        data: { password: hashedPassword }
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  // ユーザー作成用メソッド
  async addUser(data: {
    name: string
    email: string
    password: string
    role: string
  }): Promise<User | null> {
    try {
      // ユーザーの作成
      const user = await BaseDB.prisma.user.create({
        data
      })

      return user
    } catch (err) {
      console.error('ユーザー作成エラー:', err)
      return null
    }
  }
}
export default new UserDB()
