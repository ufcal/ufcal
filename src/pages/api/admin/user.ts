import { UserDB } from '@/server/db'
import { hash } from '@/server/utils/password'
import type { UserAdminRequest } from '@/types/user'
import type { APIRoute } from 'astro'

// Event API
export const GET: APIRoute = async () => {
  const users = await UserDB.getUsers()

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { email, name, password, role } = body as UserAdminRequest

    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({
          message: '必要な情報が不足しています',
          errors: {
            name: '名前は必須です',
            email: 'メールアドレスは必須です',
            password: 'パスワードは必須です',
            role: '権限は必須です'
          }
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // メールアドレスの重複チェック
    const existingUser = await await UserDB.getUserByEmail(email)
    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: 'このメールアドレスは既に使用されています'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password)

    const user = await UserDB.addUser({
      email: email,
      name: name,
      password: hashedPassword,
      role: role
    })
    if (!user) {
      return new Response(JSON.stringify({ message: 'データ登録に失敗しました' }), {
        status: 400,
        statusText: 'Bad Request',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
