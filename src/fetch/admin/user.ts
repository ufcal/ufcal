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
  async addUser(params: UserAdminRequest): Promise<any> {
    try {
      const response = await fetch(`${config.api.adminUrl}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      return response
    } catch (e) {
      return null
    }
  }
}

export default new AdminUserFetch()
