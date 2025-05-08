import Alert from '@/components/Alert'
import Button from '@/components/base/Button'
import config from '@/config/config.json'
import { AdminEventFetch } from '@/fetch/admin'
import { modalEventId, notifyEventUpdate, showEventModal } from '@/store/event'
import React, { useEffect, useState } from 'react'

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  avatar?: string
}

interface EventInfoModalProps {
  isOpen: boolean
  event: any
  onClose: () => void
  userAuth: any
}

// 開催日時の文字列を生成する関数
const formatEventDateTime = (event: { start: string; end: string; allDay: boolean }) => {
  if (event.allDay) {
    const startDate = new Date(event.start)
    const adjustedEnd = new Date(event.end)
    adjustedEnd.setDate(adjustedEnd.getDate() - 1)

    const formattedStart = new Intl.DateTimeFormat('ja-JP', {
      dateStyle: 'long'
    }).format(startDate)
    const formattedEnd = new Intl.DateTimeFormat('ja-JP', {
      dateStyle: 'long'
    }).format(adjustedEnd)

    if (startDate.toDateString() === adjustedEnd.toDateString()) {
      return formattedStart
    } else {
      const startYear = startDate.getFullYear()
      const endYear = adjustedEnd.getFullYear()

      if (startYear === endYear) {
        const formattedEndDate = new Intl.DateTimeFormat('ja-JP', {
          month: 'long',
          day: 'numeric'
        }).format(adjustedEnd)
        return `${formattedStart} 〜 ${formattedEndDate}`
      } else {
        return `${formattedStart} 〜 ${formattedEnd}`
      }
    }
  } else {
    const startDate = new Date(event.start)
    const endDate = new Date(event.end)

    const formattedStartDate = new Intl.DateTimeFormat('ja-JP', {
      dateStyle: 'long'
    }).format(startDate)
    const formattedStartTime = new Intl.DateTimeFormat('ja-JP', {
      timeStyle: 'short'
    }).format(startDate)
    const formattedEndDate = new Intl.DateTimeFormat('ja-JP', {
      dateStyle: 'long'
    }).format(endDate)
    const formattedEndTime = new Intl.DateTimeFormat('ja-JP', {
      timeStyle: 'short'
    }).format(endDate)

    if (formattedStartDate === formattedEndDate) {
      if (formattedStartTime === formattedEndTime) {
        return `${formattedStartDate} ${formattedStartTime}`
      } else {
        return `${formattedStartDate} ${formattedStartTime}〜${formattedEndTime}`
      }
    } else {
      const startYear = startDate.getFullYear()
      const endYear = endDate.getFullYear()

      if (startYear === endYear) {
        const formattedEndDate = new Intl.DateTimeFormat('ja-JP', {
          month: 'long',
          day: 'numeric'
        }).format(endDate)
        return `${formattedStartDate} ${formattedStartTime} 〜 ${formattedEndDate} ${formattedEndTime}`
      } else {
        return `${formattedStartDate} ${formattedStartTime} 〜 ${formattedEndDate} ${formattedEndTime}`
      }
    }
  }
}

const EventInfoModal: React.FC<EventInfoModalProps> = ({ isOpen, event, onClose, userAuth }) => {
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)
  const [newComment, setNewComment] = useState('')
  const commentsEnabled = config.site.comments.enabled
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      author: '山田太郎',
      content: 'とても興味深いイベントですね！参加が楽しみです。',
      createdAt: '2024-03-20 10:30',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
    },
    {
      id: '2',
      author: '佐藤花子',
      content: '前回のイベントも素晴らしかったです。今回も期待しています！',
      createdAt: '2024-03-20 11:15',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
    }
  ])

  useEffect(() => {
    if (isOpen && event) {
      setSuccess('')
      setError('')
      setCompleted(false)
    }
  }, [isOpen, event])

  if (!isOpen || !event) return null

  const handleEditEvent = async () => {
    modalEventId.set(event.id)
    showEventModal.set(true)
    onClose()
  }

  const handleDeleteEvent = async () => {
    setSuccess('')
    setError('')

    if (confirm('このイベントを削除しますか？')) {
      try {
        const response = await AdminEventFetch.removeEvent(event.id)
        if (response.ok) {
          setSuccess('イベントを削除しました。')
          setCompleted(true)
          notifyEventUpdate()
        } else {
          const errorData = await response.json()
          setError(`削除に失敗しました: ${errorData.message}`)
        }
      } catch (error) {
        setError('通信エラーが発生しました')
      }
    }
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    // ここでコメントの送信処理を実装
    setNewComment('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black/50">
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl">
        {/* ヘッダー */}
        <div className="relative px-6 pt-6">
          <div className="absolute top-6 right-6">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full bg-gray-500 p-2 text-white transition-all hover:bg-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="mb-3 text-3xl font-bold text-gray-900">{event.title}</h2>
        </div>

        {/* コンテンツ */}
        <div className="px-6 pt-0 pb-4">
          {success && <Alert message={success} type="success" />}
          {error && <Alert message={error} type="error" />}

          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">開催日時</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">{formatEventDateTime(event)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* イベント内容セクション */}
          {(event.description || event.url) && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 p-2">
                  <svg
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-900">イベント内容</h3>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                {event.description && (
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-line text-gray-600">{event.description}</div>
                  </div>
                )}
                {event.url && (
                  <div className={event.description ? 'mt-4' : 'mt-0'}>
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      詳細ページで確認する
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* コメントセクション */}
          {commentsEnabled && (
            <div className="mt-10 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">コメント</h3>

              {/* コメント一覧 */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-start space-x-3">
                      {comment.avatar && (
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{comment.author}</h4>
                          <span className="text-xs text-gray-500">{comment.createdAt}</span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* コメント入力フォーム */}
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="コメントを入力..."
                    className="w-full resize-none rounded-lg border border-gray-200 bg-transparent p-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      コメントを投稿
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* 管理者用ボタン */}
          {userAuth && userAuth.role === 'ADMIN' && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {!completed && (
                  <Button type="button" variant="primary" onClick={handleEditEvent}>
                    <svg
                      aria-hidden="true"
                      className="mr-1 -ml-1 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                      <path
                        fillRule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    編集
                  </Button>
                )}
                {completed && (
                  <Button type="button" variant="default" onClick={onClose}>
                    閉じる
                  </Button>
                )}
              </div>
              {!completed && (
                <Button type="button" variant="error" onClick={handleDeleteEvent}>
                  <svg
                    aria-hidden="true"
                    className="mr-1.5 -ml-1 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  削除
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventInfoModal
