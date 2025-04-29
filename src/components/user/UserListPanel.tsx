import Button from '@/components/base/Button.tsx'
import { useEffect, useState } from 'react'
import { UserAddModal } from './UserAddModal'
import { UserDeleteModal } from './UserDeleteModal'
import { UserEditModal } from './UserEditModal'
import UserList from './UserListMain'
///import UserList from './UserList'

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

export default function UserListPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users/list')

        if (!response.ok) {
          throw new Error(`エラー: ${response.status}`)
        }

        const data = await response.json()
        setUsers(data.users)
      } catch (err) {
        setError('ユーザー情報の取得に失敗しました')
        console.error('Users fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="py-10 text-center">ユーザー情報を読み込み中...</div>
  }

  if (error) {
    return <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
  }

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <div className="mb-5 flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 font-medium md:space-x-2">
                <li className="inline-flex items-center">
                  <a
                    href="#"
                    className="hover:text-primary-600 inline-flex items-center text-gray-700"
                  >
                    <svg
                      className="mr-2.5 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    ホーム
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-6 w-6 text-gray-400"
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
                    <a href="#" className="hover:text-primary-600 ml-1 text-gray-700 md:ml-2">
                      ユーザ管理
                    </a>
                  </div>
                </li>
              </ol>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">ユーザ一覧</h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3" action="#" method="GET">
                <label htmlFor="users-search" className="sr-only">
                  検索
                </label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <input
                    type="text"
                    name="search"
                    id="users-search"
                    placeholder="ユーザを検索"
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </form>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <Button
                type="button"
                onClick={() => setShowAddModal(true)}
                variant="primary"
                class="w-1/2 sm:w-auto"
                icon="mdi:plus-thick"
              >
                ユーザを追加
              </Button>
            </div>
          </div>
        </div>
      </div>

      <UserList
        users={filteredUsers}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        onEdit={(user) => {
          setSelectedUser(user)
          setShowEditModal(true)
        }}
        onDelete={(user) => {
          setSelectedUser(user)
          setShowDeleteModal(true)
        }}
      />

      {showAddModal && (
        <UserAddModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onUserAdded={(newUser) => {
            setUsers([...users, newUser])
            setShowAddModal(false)
          }}
        />
      )}

      {showEditModal && selectedUser && (
        <UserEditModal
          open={showEditModal}
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          onUserUpdated={(updatedUser) => {
            setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
            setShowEditModal(false)
            setSelectedUser(null)
          }}
        />
      )}

      {showDeleteModal && selectedUser && (
        <UserDeleteModal
          open={showDeleteModal}
          user={selectedUser}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedUser(null)
          }}
          onUserDeleted={(deletedUserId) => {
            setUsers(users.filter((u) => u.id !== deletedUserId))
            setShowDeleteModal(false)
            setSelectedUser(null)
          }}
        />
      )}
    </>
  )
}
