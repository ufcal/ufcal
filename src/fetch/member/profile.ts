class MemberProfileFetch {
  async updateProfile(id: number, params: FormData): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.PUBLIC_MEMBER_API_URL}/profile/${id}`, {
        method: 'PUT',
        body: params
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
