import { colors } from '@/config/master/category'
import { EventDB } from '@/server/db'
import type { EventDetailResponse } from '@/types/event'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = Number(params.id)
    if (isNaN(id)) {
      return new Response(JSON.stringify({ message: '有効なIDが指定されていません' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const event = await EventDB.getEventById(id)

    if (!event) {
      return new Response(JSON.stringify({ message: 'イベントが見つかりませんでした' }), {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const formatDate = (date: Date, isAllDay: boolean) => {
      const formatted = new Date(date).toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' })
      return isAllDay ? formatted.split(' ')[0]! : formatted.replace(' ', 'T')
    }

    const mappedEvent: EventDetailResponse = {
      id: event.id,
      title: event.title,
      allDay: event.isAllDay,
      start: formatDate(event.start, event.isAllDay),
      end: formatDate(event.end, event.isAllDay),
      description: event.description ?? '',
      url: event.url ?? '',
      color: colors.find((color) => color.value === event.categoryId)?.color ?? 'black'
    }

    return new Response(JSON.stringify(mappedEvent), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '予期せぬエラーが発生しました'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
