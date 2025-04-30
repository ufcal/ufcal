import Alert from '@/components/Alert'
import { useStore } from '@nanostores/react'
import { atom } from 'nanostores'
import React, { useEffect, useState } from 'react'

export const showProfileModal = atom(false)

interface ProfileModalProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    biography?: string
  }
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user }) => {
  const isOpen = useStore(showProfileModal)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    biography: '',
    avatar: '',
    avatarFile: null as File | null
  })

  useEffect(() => {
    if (isOpen && user) {
      setSuccess('')
      setError('')
      setFormData({
        name: user.name,
        email: user.email,
        biography: user.biography || '',
        avatar: user.avatar || '',
        avatarFile: null
      })
      setTempImageUrl(null)
    }
  }, [isOpen, user])

  if (!isOpen) return null

  const handleClose = () => {
    showProfileModal.set(false)
    setTempImageUrl(null)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズの検証（2MB以下）
    if (file.size > 2 * 1024 * 1024) {
      setError('ファイルサイズは2MB以下にしてください')
      return
    }

    // ファイル形式の検証
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('JPG、PNG、GIF形式のファイルのみアップロード可能です')
      return
    }

    try {
      // 一時的なURLを作成して保存
      const tempUrl = URL.createObjectURL(file)
      setTempImageUrl(tempUrl)

      // フォームデータに画像ファイルを保存
      setFormData((prev) => ({
        ...prev,
        avatarFile: file
      }))
    } catch (err) {
      setError('画像の読み込みに失敗しました')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData = new FormData()
      submitData.append('userId', user.id)
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('biography', formData.biography)
      if (formData.avatarFile) {
        submitData.append('avatar', formData.avatarFile)
      }

      const response = await fetch('/api/admin/profile', {
        method: 'POST',
        body: submitData
      })

      if (!response.ok) {
        throw new Error('プロフィールの更新に失敗しました')
      }

      setSuccess('プロフィールを更新しました')
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      setError('プロフィールの更新に失敗しました')
    }
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl dark:from-gray-900 dark:to-gray-800">
        {/* ヘッダー */}
        <div className="relative px-6 pt-6">
          <div className="absolute top-6 right-6">
            <button
              onClick={handleClose}
              className="rounded-full bg-gray-500 p-2 text-white transition-all hover:bg-gray-600 dark:bg-gray-500 dark:hover:bg-gray-600"
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

          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
            プロフィール設定
          </h2>
        </div>

        {/* コンテンツ */}
        <div className="px-6 pt-0 pb-6">
          {success && <Alert message={success} type="success" />}
          {error && <Alert message={error} type="error" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* アバター設定 */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={
                    tempImageUrl ||
                    formData.avatar ||
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                  }
                  alt="プロフィール画像"
                  className="h-20 w-20 rounded-full object-cover"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute right-0 bottom-0 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  プロフィール画像
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG, GIF (最大 2MB)</p>
              </div>
            </div>

            {/* 名前 */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                名前
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
              />
            </div>

            {/* 自己紹介 */}
            <div>
              <label
                htmlFor="biography"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                自己紹介
              </label>
              <textarea
                id="biography"
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              />
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200 focus:outline-none dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
