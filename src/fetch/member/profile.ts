import type { MemberProfileRequest } from '@/types/profile'

class MemberProfileFetch {
  async updateProfile(id: number, params: MemberProfileRequest): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.PUBLIC_MEMBER_API_URL}/profile/${id}`, {
        method: 'PUT',
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

  async getProfile(id: number): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.PUBLIC_MEMBER_API_URL}/profile/${id}`)
      return response
    } catch (e) {
      return null
    }
  }
}

export default new MemberProfileFetch()
