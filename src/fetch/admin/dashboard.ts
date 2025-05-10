import config from '@/config/config.json'
import type { DashboardResponse } from '@/types/dashboard'

class AdminDashboardFetch {
  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const response = await fetch(`${config.api.adminUrl}/dashboard`)

      if (!response.ok) {
        throw new Error('ダッシュボードデータの取得に失敗しました')
      }

      return await response.json()
    } catch (error) {
      console.error('ダッシュボードデータの取得中にエラーが発生しました:', error)
      throw error
    }
  }
}

export default new AdminDashboardFetch()
