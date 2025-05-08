import Alert from '@/components/Alert'
import Button from '@/components/base/Button'
import config from '@/config/config.json'
import { AdminUserFetch } from '@/fetch/admin'
import { type IUser, type UserRole } from '@/types/user'
import { useState } from 'react'

/*
type UserRole = 'ADMIN' | 'MODERATOR' | 'EDITOR' | 'MEMBER'

type User = {
  id: number
  email: string
  name: string
  role: UserRole
  createdAt: Date
  isEnabled?: boolean
  avatar?: string
  biography?: string
}*/

type UserEditModalProps = {
  open: boolean
  user: IUser
  onClose: () => void
  onUserUpdated: (user: IUser) => void
}

export function UserEditModal({ open, user, onClose, onUserUpdated }: UserEditModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'MEMBER' as UserRole,
    isEnabled: true
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  // 初期値の設定
  useState(() => {
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isEnabled: user.isEnabled ?? true
    })
  })

  if (!open) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value =
      e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const validate = () => {
    if (!form.name.trim()) return '氏名は必須です'
    if (!form.email.trim()) return 'メールアドレスは必須です'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'メールアドレスの形式が不正です'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    setError('')

    // 入力値をtrim
    const trimmedForm = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim()
    }
    setForm(trimmedForm)

    const v = validate()
    if (v) {
      setError(v)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await AdminUserFetch.updateUser(user.id, {
        name: trimmedForm.name,
        email: trimmedForm.email,
        role: trimmedForm.role,
        isEnabled: trimmedForm.isEnabled
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setSuccess('ユーザを更新しました')
        setCompleted(true)
        onUserUpdated(updatedUser)
      } else if (response.status === 422) {
        // バリデーションエラー
        const resBody = await response.json()
        if (resBody && resBody.message) {
          setError(resBody.message)
        } else {
          setError('入力データが無効です。再度確認してください。')
        }
      } else if (response.status === 401) {
        setError('アクセス権がありません。再度ログインしてください。')
      } else {
        const resBody = await response.json()
        if (resBody && resBody.message) {
          setError(resBody.message)
        } else {
          setError('サーバでエラーが発生しました')
        }
      }
    } catch (err: any) {
      setError('通信エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black/50">
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl">
        {/* ヘッダー */}
        <div className="relative px-6 pt-6">
          <div className="absolute top-6 right-6">
            <button
              type="button"
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
          <h2 className="mb-3 text-3xl font-bold text-gray-900">ユーザ編集</h2>
        </div>
        {/* コンテンツ */}
        <div className="px-6 pt-0 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && <Alert message={success} type="success" />}
            {error && <Alert message={error} type="error" />}

            <fieldset disabled={completed || isSubmitting}>
              <div className="grid grid-cols-4 gap-4">
                {/* 表示のみの情報 */}
                <div className="col-span-4">
                  <label className="mb-1 block font-medium text-gray-500">アバター</label>
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-16 w-16 rounded-full border border-gray-300 object-cover"
                      src={
                        user.avatar
                          ? `${config.upload.avatar.url}/${user.avatar}`
                          : `${config.upload.avatar.url}/${config.upload.avatar.default}`
                      }
                      alt={`${user.name} avatar`}
                    />
                  </div>
                </div>

                {user.biography && (
                  <div className="col-span-4">
                    <label className="mb-1 block font-medium text-gray-500">自己紹介</label>
                    <div className="text-gray-900">{user.biography}</div>
                  </div>
                )}

                {/* 編集可能な情報 */}
                <div className="col-span-4">
                  <label htmlFor="name" className="mb-1 block font-medium text-gray-900">
                    名前
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                    required
                  />
                </div>

                <div className="col-span-4">
                  <label htmlFor="email" className="mb-1 block font-medium text-gray-900">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                    required
                  />
                </div>

                <div className="col-span-4">
                  <label htmlFor="role" className="mb-1 block font-medium text-gray-900">
                    権限
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="focus:border-primary-500 focus:ring-primary-500 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                    required
                  >
                    <option value="MEMBER">一般メンバー</option>
                    <option value="EDITOR">編集者</option>
                    <option value="MODERATOR">モデレータ</option>
                    <option value="ADMIN">管理者</option>
                  </select>
                </div>

                <div className="col-span-4 pt-2">
                  <label className="inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name="isEnabled"
                      checked={form.isEnabled}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="peer peer-checked:bg-primary-600 peer-focus:ring-primary-300 relative h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-2 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                    <span className="ms-3 font-medium text-gray-900">アカウントを有効にする</span>
                  </label>
                </div>

                <div className="col-span-4">
                  <label className="mb-1 block font-medium text-gray-500">登録日</label>
                  <div className="text-gray-900">
                    {user.createdAt instanceof Date
                      ? user.createdAt.toLocaleDateString('ja-JP')
                      : new Date(user.createdAt).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </div>
            </fieldset>

            <div className="flex justify-end space-x-3 pt-4">
              {!completed && (
                <>
                  <Button type="button" variant="default" onClick={onClose}>
                    キャンセル
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    更新する
                  </Button>
                </>
              )}
              {completed && (
                <Button type="button" variant="default" onClick={onClose}>
                  閉じる
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
