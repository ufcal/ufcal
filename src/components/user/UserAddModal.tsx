import Alert from '@/components/Alert'
import Button from '@/components/base/Button'
import { useState } from 'react'

export type UserRole = 'ADMIN' | 'MODERATOR' | 'EDITOR' | 'MEMBER'

interface UserAddModalProps {
  open: boolean
  onClose: () => void
  onUserAdded: (user: any) => void
}

export default function UserAddModal({ open, onClose, onUserAdded }: UserAddModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER' as UserRole
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  if (!open) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!form.name.trim()) return '氏名は必須です'
    if (!form.email.trim()) return 'メールアドレスは必須です'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'メールアドレスの形式が不正です'
    if (!form.password || form.password.length < 8) return 'パスワードは8文字以上で入力してください'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    setError('')
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!response.ok) {
        const res = await response.json().catch(() => ({}))
        throw new Error(res.message || 'ユーザの作成に失敗しました')
      }
      const newUser = await response.json()
      setSuccess('ユーザを追加しました')
      setCompleted(true)
      onUserAdded(newUser)
    } catch (err: any) {
      setError(err.message || 'ユーザの作成に失敗しました')
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
              className="rounded-full bg-gray-500 p-2 text-white transition-all hover:bg-gray-600"
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
          <h2 className="mb-3 text-3xl font-bold text-gray-900">ユーザ追加</h2>
        </div>
        {/* コンテンツ */}
        <div className="px-6 pt-0 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && <Alert message={success} type="success" />}
            {error && <Alert message={error} type="error" />}
            <fieldset disabled={completed || isSubmitting}>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <label htmlFor="name" className="mb-1 block font-medium text-gray-900">
                    氏名
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
                  <label htmlFor="password" className="mb-1 block font-medium text-gray-900">
                    パスワード
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                    required
                    minLength={8}
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
                    className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
                    required
                  >
                    <option value="MEMBER">一般メンバー</option>
                    <option value="EDITOR">編集者</option>
                    <option value="MODERATOR">モデレータ</option>
                    <option value="ADMIN">管理者</option>
                  </select>
                </div>
              </div>
            </fieldset>
            <div className="flex justify-end space-x-3 pt-4">
              {!completed && (
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  追加する
                </Button>
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
