import type user from '@/fetch/admin/user'
import { UserDB } from '@/server/db'
import type { UserAdminRequest, UserAdminResponse } from '@/types/user'
import type { APIRoute } from 'astro'

export const DELETE: APIRoute = async ({ locals, params }) => {
  try {
    const id = Number(params.id)

    // 自分のデータは削除不可
    const user = locals.user
    if (user && user.id === id) {
      return new Response(JSON.stringify({ message: '自分自身は削除できません' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const result = await UserDB.deleteUser(id)
    if (result) {
      return new Response(JSON.stringify({ message: 'データを削除しました' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } else {
      return new Response(JSON.stringify({ message: 'データを削除できませんでした' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const id = Number(params.id)
    const body = (await request.json()) as UserAdminRequest

    // 必須フィールドのバリデーション
    if (!body.name || !body.email || !body.role) {
      return new Response(JSON.stringify({ message: '必須項目が入力されていません' }), {
        status: 400,
        statusText: 'Bad Request',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const user = await UserDB.updateUser(id, {
      name: body.name,
      email: body.email,
      role: body.role,
      isEnabled: body.isEnabled
    })

    if (!user) {
      return new Response(JSON.stringify({ message: 'ユーザの更新に失敗しました' }), {
        status: 400,
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '予期せぬエラーが発生しました'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params
    const user = await UserDB.getUserById(Number(id))

    if (!user) {
      return new Response(JSON.stringify({ message: 'ユーザが見つかりませんでした' }), {
        status: 404,
        statusText: 'Not Found',
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
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
