import { DashboardDB } from '@/server/db'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  try {
    const userStats = await DashboardDB.getUserStats()
    console.log(userStats)

    return new Response(JSON.stringify({ userStats }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('ダッシュボードデータの取得中にエラーが発生しました:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
