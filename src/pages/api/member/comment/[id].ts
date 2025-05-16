import { CommentDB } from '@/server/db'
import type { APIRoute } from 'astro'

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const commentId = params.id

    if (!commentId) {
      return new Response(JSON.stringify({ message: 'コメントIDは必須です' }), {
        status: 400,
        statusText: 'Bad Request',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // コメントの存在確認と権限チェック
    const comment = await CommentDB.getCommentById(Number(commentId))
    if (!comment) {
      return new Response(JSON.stringify({ message: 'コメントが見つかりません' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // コメントの作成者または管理者のみが削除可能
    if (comment.creatorId !== locals.user.id && locals.user.role !== 'ADMIN') {
      return new Response(JSON.stringify({ message: 'このコメントを削除する権限がありません' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const deletedComment = await CommentDB.deleteComment(locals.user.id, Number(commentId))
    if (!deletedComment) {
      return new Response(JSON.stringify({ message: 'コメントの削除に失敗しました' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    return new Response(JSON.stringify(deletedComment), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
