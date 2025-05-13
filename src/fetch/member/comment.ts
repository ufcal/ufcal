import config from '@/config/config.json'

class MemberCommentFetch {
  async addComment(params: FormData): Promise<any> {
    try {
      const response = await fetch(`${config.api.memberUrl}/comment`, {
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

export default new MemberCommentFetch()
