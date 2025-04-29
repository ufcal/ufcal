import Button from '@/components/base/Button.tsx'
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
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all"
                        type="checkbox"
                        className="focus:ring-primary-300 h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-3"
                        checked={selectedUsers.length === users.length}
                        onChange={handleSelectAll}
                      />
                      <label htmlFor="checkbox-all" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="p-4 text-left font-medium text-gray-500">
                    名前
                  </th>
                  <th scope="col" className="p-4 text-left font-medium text-gray-500">
                    Biography
                  </th>
                  <th scope="col" className="p-4 text-left font-medium text-gray-500">
                    Position
                  </th>
                  <th scope="col" className="p-4 text-left font-medium text-gray-500">
                    Status
                  </th>
                  <th scope="col" className="p-4 text-left font-medium text-gray-500">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-${user.id}`}
                          type="checkbox"
                          className="focus:ring-primary-300 h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-3"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                        />
                        <label htmlFor={`checkbox-${user.id}`} className="sr-only">
                          checkbox
                        </label>
                      </div>
                    </td>
                    <td className="mr-12 flex items-center space-x-6 p-4 whitespace-nowrap">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`/images/users/default-avatar.png`}
                        alt={`${user.name} avatar`}
                      />
                      <div className="font-normal text-gray-500">
                        <div className="text-base font-semibold text-gray-900">{user.name}</div>
                        <div className="font-normal text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="max-w-sm truncate overflow-hidden p-4 text-base font-normal text-gray-500 xl:max-w-xs">
                      {user.biography || '-'}
                    </td>
                    <td className="p-4 text-base font-medium whitespace-nowrap text-gray-900">
                      {user.position || '-'}
                    </td>
                    <td className="p-4 text-base font-normal whitespace-nowrap text-gray-900">
                      <div className="flex items-center">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            user.status === 'active' ? 'bg-green-400' : 'bg-red-500'
                          } mr-2`}
                        />
                        <span>{user.status === 'active' ? 'アクティブ' : '非アクティブ'}</span>
                      </div>
                    </td>
                    <td className="space-x-2 p-4 whitespace-nowrap">
                      <Button
                        type="button"
                        onClick={() => onEdit(user)}
                        variant="primary"
                        icon="mdi:square-edit-outline"
                      >
                        編集
                      </Button>
                      <Button
                        type="button"
                        onClick={() => onDelete(user)}
                        variant="error"
                        icon="mdi:trash-can-outline"
                      >
                        削除
                      </Button>
                      {/*}
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 inline-flex items-center rounded-lg px-3 py-2 text-center font-medium text-white focus:ring-4"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                          <path
                            fillRule="evenodd"
                            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(user)}
                        className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-center font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300"
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
                          />
                        </svg>
                        削除
                      </button>
                      */}
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      ユーザーがいません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 sm:flex sm:justify-between">
          <div className="mb-4 flex items-center sm:mb-0">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
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
                  />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
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
                  />
                </svg>
              </button>
            </div>
            <span className="ml-4 font-normal text-gray-500">
              <span className="font-semibold text-gray-900">
                {startIndex + 1}-{Math.min(endIndex, users.length)}
              </span>{' '}
              / 全 <span className="font-semibold text-gray-900">{users.length}</span>件
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
