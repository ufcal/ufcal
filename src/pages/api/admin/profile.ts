import { prisma } from '@/lib/prisma'
import type { APIRoute } from 'astro'
import fs from 'fs'
import path from 'path'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    // セッション確認
    // TODO: Astroのセッション管理に変更する必要があります
    const session = request.headers.get('Authorization')
    if (!session) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // アップロードディレクトリの確認と作成
    const uploadDir = path.join(process.cwd(), 'public/uploads/avatars')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // FormDataの解析
    const formData = await request.formData()
    const userId = formData.get('userId')?.toString() || ''
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
      const fileExt = avatarFile.name.split('.').pop() || ''
      const timestamp = new Date().getTime()
      const fileName = `${userId}-${timestamp}.${fileExt}`
      const filePath = path.join(uploadDir, fileName)

      // 既存のアバター画像を削除
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true }
      })

      if (existingUser?.avatar) {
        const oldPath = path.join(process.cwd(), 'public', existingUser.avatar)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      // 新しいアバター画像を保存
      await fs.promises.writeFile(filePath, Buffer.from(fileBuffer))
      updateData.avatar = `/uploads/avatars/${fileName}`
    }

    // データベースの更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

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
