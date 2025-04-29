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

type UserListProps = {
  users: User[]
  selectedUsers: number[]
  setSelectedUsers: (ids: number[]) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export default function UserList({
  users,
  selectedUsers,
  setSelectedUsers,
  onEdit,
  onDelete
}: UserListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(users.length / itemsPerPage)

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = users.slice(startIndex, endIndex)

  return (
    <div>
      <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-600">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  className="focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-3 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                  checked={selectedUsers.length === users.length}
                  onChange={handleSelectAll}
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th
              scope="col"
              className="p-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
            >
              ユーザー名
            </th>
            <th
              scope="col"
              className="p-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
            >
              権限
            </th>
            <th
              scope="col"
              className="p-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
            >
              役職
            </th>
            <th
              scope="col"
              className="p-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
            >
              ステータス
            </th>
            <th
              scope="col"
              className="p-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
            >
              作成日
            </th>
            <th
              scope="col"
              className="p-4 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
            >
              アクション
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {currentUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-${user.id}`}
                    type="checkbox"
                    className="focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-3 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                  <label htmlFor={`checkbox-${user.id}`} className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <td className="mr-12 flex items-center space-x-6 p-4 whitespace-nowrap">
                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </td>
              <td className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
                <span
                  className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                    user.role === 'ADMIN'
                      ? 'bg-red-100 text-red-800'
                      : user.isGuest
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {user.role === 'ADMIN' ? '管理者' : user.isGuest ? 'ゲスト' : '一般ユーザー'}
                </span>
              </td>
              <td className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
                {user.position || '-'}
              </td>
              <td className="p-4 text-base font-normal whitespace-nowrap text-gray-900 dark:text-white">
                <div className="flex items-center">
                  <div
                    className={`mr-2 h-2.5 w-2.5 rounded-full ${
                      user.status === 'active' ? 'bg-green-400' : 'bg-red-500'
                    }`}
                  ></div>
                  {user.status === 'active' ? 'アクティブ' : '非アクティブ'}
                </div>
              </td>
              <td className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="space-x-2 p-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onEdit(user)}
                  className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white focus:ring-4"
                >
                  <svg
                    className="mr-2 h-4 w-4"
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
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(user)}
                  disabled={user.role === 'ADMIN'}
                  className={`inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900 ${
                    user.role === 'ADMIN' ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  <svg
                    className="mr-2 h-4 w-4"
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
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                ユーザーがいません
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 sm:flex sm:justify-between dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center sm:mb-0">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="h-7 w-7"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="h-7 w-7"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">
                {startIndex + 1}-{Math.min(endIndex, users.length)}
              </span>{' '}
              / 全{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{users.length}</span>件
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
