import BaseDB from './base'

interface AddCommentData {
  content: string
  eventId: number
  creatorId: number
}

interface Comment {
  id: number
  content: string
  eventId: number
  creatorId: number
  createdAt: Date
  updatedAt: Date
  creator: {
    id: number
    name: string
    avatar: string | null
  }
}

class CommentDB extends BaseDB {
  async getCommentById(id: number): Promise<Comment | null> {
    try {
      const comment = await BaseDB.prisma.comment.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })
      return comment
    } catch (err) {
      console.error('コメントの取得に失敗しました:', err)
      return null
    }
  }

  async getComments(eventId: number): Promise<Comment[]> {
    try {
      const comments = await BaseDB.prisma.comment.findMany({
        where: {
          eventId: eventId
        },
        orderBy: [
          {
            id: 'asc'
          }
        ],
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })
      return comments
    } catch (err) {
      console.error(err)
      return []
    }
  }

  async getCommentsByEventId(eventId: number): Promise<Comment[]> {
    try {
      const comments = await BaseDB.prisma.comment.findMany({
        where: {
          eventId: eventId
        },
        orderBy: {
          id: 'asc'
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })
      return comments
    } catch (err) {
      console.error('コメントの取得に失敗しました:', err)
      return []
    }
  }

  async addComment(data: AddCommentData): Promise<Comment | null> {
    try {
      const comment = await BaseDB.prisma.comment.create({
        data: {
          content: data.content,
          eventId: data.eventId,
          creatorId: data.creatorId
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })
      return comment
    } catch (err) {
      console.error('コメントの登録に失敗しました:', err)
      return null
    }
  }

  async deleteComment(id: number): Promise<Comment | null> {
    try {
      const comment = await BaseDB.prisma.comment.delete({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })
      return comment
    } catch (err) {
      console.error('コメントの削除に失敗しました:', err)
      return null
    }
  }
}

export default new CommentDB()
