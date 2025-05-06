import { UserDB } from '@/server/db'
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

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json()

    const event = await UserDB.addUser({
      title: title,
      start: startDate,
      end: endDate,
      isAllDay: allDay,
      categoryId: category,
      description: description,
      url: url,
      creatorId: locals.user.id
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
