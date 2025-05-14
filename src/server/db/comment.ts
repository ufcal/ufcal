import type { Comment } from '@prisma/client'
import BaseDB from './base'

interface AddCommentData {
  content: string
  eventId: number
  creatorId: number
}

class CommentDB extends BaseDB {
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
          creator: true
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
          createdAt: 'desc'
        },
        include: {
          creator: true
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
          creator: true
        }
      })
      return comment
    } catch (err) {
      console.error('コメントの登録に失敗しました:', err)
      return null
    }
  }
}

export default new CommentDB()
