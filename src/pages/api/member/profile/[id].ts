import config from '@/config/config.json'
import { prisma } from '@/lib/prisma'
import { UserDB } from '@/server/db'
import Session from '@/server/utils/session'
import { type UserProfile, convertToUserProfile } from '@/types/profile'
import { type UserSessionData, convertToUserSessionData } from '@/types/user'
import type { APIRoute } from 'astro'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export const prerender = false

export const PUT: APIRoute = async (context) => {
  try {
    const { params, locals, request } = context
    const userId = Number(params.id)

    // アクセス権限をチェック
    // 自分のデータのみ編集可能
    const user = locals.user
    if (!user || user.id !== userId) {
      return new Response(JSON.stringify({ message: 'アクセス権限がありません' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // アップロードディレクトリの確認と作成
    const uploadDir = path.join(process.cwd(), config.upload.avatar.directory)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // FormDataの解析
    const formData = await request.formData()
    const name = formData.get('name')?.toString()
    const email = formData.get('email')?.toString()
    const biography = formData.get('biography')?.toString()
    const avatarFile = formData.get('avatar') as File | null

    if (!userId || !name || !email) {
      return new Response(JSON.stringify({ message: 'Required fields are missing' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // プロフィール更新データの準備
    const updateData: {
      name: string
      email: string
      biography: string | null
      avatar?: string
    } = {
      name,
      email,
      biography: biography || null
    }

    // アバター画像の処理
    if (avatarFile) {
      const fileBuffer = await avatarFile.arrayBuffer()
      const fileExt = 'webp' // WebPフォーマットに統一
      const timestamp = new Date().getTime()
      const fileName = `${userId}-${timestamp}.${fileExt}`
      const filePath = path.join(uploadDir, fileName)

      // 既存のアバター画像を削除
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true }
      })

      if (existingUser?.avatar) {
        const oldPath = path.join(uploadDir, existingUser.avatar)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      // 画像を正方形に加工してリサイズ
      const size = config.upload.avatar.size.width // 正方形なので width = height
      await sharp(Buffer.from(fileBuffer))
        .resize(size, size, {
          fit: 'cover', // アスペクト比を維持しながら指定サイズに収める
          position: 'center' // 中央を基準に切り取り
        })
        .webp({ quality: 80 }) // WebP形式で保存、品質は80%
        .toFile(filePath)

      updateData.avatar = fileName // ファイル名のみを保存
    }

    // データベースの更新
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData
      })

      // セッション(ユーザ情報)更新
      const sessionData: UserSessionData = convertToUserSessionData(updatedUser)
      await Session.updateUser(context, sessionData)

      return new Response(
        JSON.stringify({
          message: 'Profile updated successfully',
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            biography: updatedUser.biography
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (err) {
      console.error(err)
      return new Response(JSON.stringify({ message: 'Database update failed' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const userId = Number(params.id)

    // アクセス権限をチェック
    // 自分のデータのみ編集可能
    const user = locals.user
    if (!user || user.id !== userId) {
      return new Response(JSON.stringify({ message: 'アクセス権限がありません' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // ユーザ情報取得
    const userWithPassword = await UserDB.getUserById(userId)
    if (!userWithPassword) {
      return new Response(
        JSON.stringify({
          message: 'Bad credentials'
        }),
        {
          status: 401
        }
      )
    }

    // セッション(ユーザ情報)作成
    const userProfile: UserProfile = convertToUserProfile(userWithPassword)

    return new Response(JSON.stringify(userProfile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
