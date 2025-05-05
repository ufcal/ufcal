import { useEffect, useState } from 'react'

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

type UserEditModalProps = {
  open: boolean
  user: User
  onClose: () => void
  onUserUpdated: (user: User) => void
}

export function UserEditModal({ open, user, onClose, onUserUpdated }: UserEditModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    newPassword: '',
    biography: '',
    role: '',
    status: ''
  })

  useEffect(() => {
    const [firstName = '', lastName = ''] = user.name.split(' ')
    setFormData({
      firstName,
      lastName,
      email: user.email,
      position: user.position || '',
      newPassword: '',
      biography: user.biography || '',
      role: user.role,
      status: user.status || 'active'
    })
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          ...(formData.newPassword && { password: formData.newPassword }),
          role: formData.role,
          position: formData.position,
          biography: formData.biography,
          status: formData.status
        })
      })

      if (!response.ok) {
        throw new Error('ユーザーの更新に失敗しました')
      }

      const updatedUser = await response.json()
      onUserUpdated(updatedUser)
    } catch (error) {
      console.error('Error updating user:', error)
      // エラー処理を追加する場合はここに実装
    }
  }

  if (!open) return null

  return (
    <div className="h-modal bg-opacity-50 fixed top-4 right-0 left-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 sm:h-full md:inset-0">
      <div className="relative h-full w-full max-w-2xl px-4 md:h-auto">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="flex items-start justify-between rounded-t border-b p-5 dark:border-gray-700">
            <h3 className="text-xl font-semibold dark:text-white">ユーザー編集</h3>
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    姓
                  </label>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    名
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="position"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    役職
                  </label>
                  <input
                    type="text"
                    name="position"
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    権限
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  >
                    <option value="USER">一般ユーザー</option>
                    <option value="ADMIN">管理者</option>
                    <option value="GUEST">ゲスト</option>
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ステータス
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                    }
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  >
                    <option value="active">アクティブ</option>
                    <option value="inactive">非アクティブ</option>
                  </select>
                </div>
                <div className="col-span-6">
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    新しいパスワード（変更する場合のみ）
                  </label>
                  <input
                    type="password"
                    name="new-password"
                    id="new-password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div className="col-span-6">
                  <label
                    htmlFor="biography"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    自己紹介
                  </label>
                  <textarea
                    id="biography"
                    name="biography"
                    rows={4}
                    value={formData.biography}
                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-700">
              <button
                type="submit"
                className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4"
              >
                保存
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
