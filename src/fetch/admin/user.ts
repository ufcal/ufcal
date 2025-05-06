import config from '@/config/config.json'
import type { UserAdminRequest } from '@/types/user'

class AdminUserFetch {
  async getUsers(): Promise<any> {
    try {
      const response = await fetch(`${config.api.adminUrl}/user`)
      return response
    } catch (e) {
      return null
    }
  }
}

export default new AdminUserFetch()
