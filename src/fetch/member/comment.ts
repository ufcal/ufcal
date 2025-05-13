import config from '@/config/config.json'

interface CommentRequest {
  eventId: number
  content: string
}

class MemberCommentFetch {
  async addComment(params: CommentRequest): Promise<any> {
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
