import { EventDB, UserDB } from '@/server/db'
import type { EventAdminResponse } from '@/types/event'
import type { UserAdminRequest, UserAdminResponse } from '@/types/user'
import type { APIRoute } from 'astro'
import { id } from 'date-fns/locale'

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
    // リクエストパラメータ:
    // - title: イベントのタイトル (string)

    if (title.length === 0) {
      return new Response(JSON.stringify({ message: 'データ登録に失敗しました' }), {
        status: 400,
        statusText: 'Bad Request',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const event = await UserDB.updateUser(Number(id), {
      title: title,
      start: startDate,
      end: endDate,
      isAllDay: allDay,
      categoryId: category,
      description: description,
      url: url
    })

    return new Response(JSON.stringify(event), {
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

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params
    const event = await EventDB.getEventById(Number(id))

    if (!event) {
      return new Response(JSON.stringify({ message: 'イベントが見つかりませんでした' }), {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const mappedEvent = {} as EventAdminResponse
    mappedEvent.id = event.id
    mappedEvent.title = event.title
    mappedEvent.allDay = event.isAllDay
    if (event.isAllDay) {
      mappedEvent.start = new Date(event.start)
        .toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' })
        .split(' ')[0]!
      mappedEvent.end = new Date(event.end)
        .toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' })
        .split(' ')[0]!
    } else {
      mappedEvent.start = new Date(event.start)
        .toLocaleString('sv-SE', {
          timeZone: 'Asia/Tokyo'
        })
        .replace(' ', 'T')
      mappedEvent.end = new Date(event.end)
        .toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' })
        .replace(' ', 'T')
    }
    mappedEvent.categoryId = event.categoryId
    mappedEvent.description = event.description ?? ''
    mappedEvent.url = event.url ?? ''

    return new Response(JSON.stringify(mappedEvent), {
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
