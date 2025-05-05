import { useState } from 'react'

type User = {
  id: number
  email: string
  name: string
  role: string
  createdAt: Date
  isGuest?: boolean
  status?: 'active' | 'inactive'
  biography?: string
  position?: string
}

type UserDeleteModalProps = {
  open: boolean
  user: User
  onClose: () => void
  onUserDeleted: (userId: number) => void
}

export function UserDeleteModal({ open, user, onClose, onUserDeleted }: UserDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: user.id })
      })

      if (!response.ok) {
        throw new Error('ユーザーの削除に失敗しました')
      }

      onUserDeleted(user.id)
    } catch (error) {
      console.error('Error deleting user:', error)
      // エラー処理を追加する場合はここに実装
    } finally {
      setIsDeleting(false)
    }
  }

  if (!open) return null

  return (
    <div className="h-modal bg-opacity-50 fixed top-4 right-0 left-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 sm:h-full md:inset-0">
      <div className="relative h-full w-full max-w-md px-4 md:h-auto">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="flex justify-end p-2">
            <button
              type="button"
              onClick={onClose}
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-6 pt-0 text-center">
            <svg
              className="mx-auto h-16 w-16 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="mt-5 mb-6 text-lg font-normal text-gray-500 dark:text-gray-400">
              ユーザー「{user.name}」を削除してもよろしいですか？
            </h3>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-base font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
            >
              {isDeleting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  削除中...
                </>
              ) : (
                '削除する'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="focus:ring-primary-300 inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
