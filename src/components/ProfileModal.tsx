import Alert from '@/components/Alert'
import Button from '@/components/base/Button'
import config from '@/config/config.json'
import { MemberProfileFetch } from '@/fetch/member'
import { showProfileModal } from '@/store/profile'
import type { MemberProfileResponse } from '@/types/profile'
import { profileSchema } from '@/types/profile'
import { useStore } from '@nanostores/react'
import React, { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'

type ProfileFormData = z.infer<typeof profileSchema> & {
  avatarFile: File | null
}

interface ProfileModalProps {
  userid: number
}

const ProfileModal: React.FC<ProfileModalProps> = ({ userid }) => {
  const isOpen = useStore(showProfileModal)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    biography: '',
    avatar: '',
    avatarFile: null
  })

  const fetchProfile = useCallback(async () => {
    try {
      setSuccess('')
      setError('')
      const response = await MemberProfileFetch.getProfile(userid)
      if (!response || !response.ok) {
        throw new Error('プロフィールの取得に失敗しました')
      }
      const profileData: MemberProfileResponse = await response.json()
      setFormData({
        name: profileData.name,
        email: profileData.email,
        biography: profileData.biography || '',
        avatar: profileData.avatar || '',
        avatarFile: null
      })
    } catch (err) {
      setError('プロフィールの取得に失敗しました')
    }
  }, [userid])

  useEffect(() => {
    if (isOpen) {
      fetchProfile()
    }
  }, [isOpen, userid, fetchProfile])

  useEffect(() => {
    return () => {
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl)
      }
    }
  }, [tempImageUrl])

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

    // ファイルサイズの検証（500KB以下）
    if (file.size > 500 * 1024) {
      setError('ファイルサイズは500KB以下にしてください')
      return
    }

    // ファイル形式の検証
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('JPG、PNG、GIF、WebP形式のファイルのみアップロード可能です')
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
      if (tempImageUrl) {
        setTempImageUrl(null)
      }

      setError('画像の読み込みに失敗しました')
    }
  }

  const validateForm = (): boolean => {
    try {
      const { avatarFile, ...formDataWithoutFile } = formData
      profileSchema.parse(formDataWithoutFile)
      setValidationErrors({})
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { [key: string]: string } = {}
        err.errors.forEach((error) => {
          if (error.path[0]) {
            errors[error.path[0].toString()] = error.message
          }
        })
        setValidationErrors(errors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setValidationErrors({})

    if (!validateForm()) {
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('biography', formData.biography)
      if (formData.avatarFile) {
        formDataToSend.append('avatar', formData.avatarFile)
      }

      const response = await MemberProfileFetch.updateProfile(userid, formDataToSend)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          setValidationErrors(data.errors)
          return
        }
        throw new Error(data.message || 'プロフィールの更新に失敗しました')
      }

      // アップロード完了した画像の一時URLを解放
      if (tempImageUrl) {
        setTempImageUrl(null)
      }

      // プロフィール再取得でサーバー側の画像を即時反映
      await fetchProfile()
      setSuccess('プロフィールを更新しました')

      // 2秒後にページをリロードし、ナビゲーションバーのユーザ情報を更新
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロフィールの更新に失敗しました')
    }
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl">
        {/* ヘッダー */}
        <div className="relative px-6 pt-6">
          <div className="absolute top-6 right-6">
            <button
              onClick={handleClose}
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

          <h2 className="mb-3 text-3xl font-bold text-gray-900">プロフィール設定</h2>
        </div>

        {/* コンテンツ */}
        <div className="px-6 pt-0 pb-6">
          {success && <Alert message={success} type="success" />}
          {error && <Alert message={error} type="error" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* アバター設定 */}
            <div className="flex items-center space-x-4">
              <label className="group relative cursor-pointer">
                <img
                  src={
                    tempImageUrl ||
                    (formData.avatar
                      ? `${config.upload.avatar.url}/${formData.avatar}`
                      : 'https://api.dicebear.com/7.x/avataaars/svg?seed=default')
                  }
                  alt="プロフィール画像"
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200 transition-all group-hover:ring-blue-400"
                />
                <span className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700">
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
                </span>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              <div>
                <h3 className="text-lg font-medium text-gray-900">プロフィール画像</h3>
                <p className="text-sm text-gray-500">JPG, PNG, GIF, WebP (最大 500KB)</p>
              </div>
            </div>

            {/* 名前 */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">
                名前
                <span className="ml-1 text-sm text-gray-500">({formData.name.length}/10文字)</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`block w-full rounded-lg border ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                } bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500`}
                required
                maxLength={10}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`block w-full rounded-lg border ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                } bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500`}
                required
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            {/* 自己紹介 */}
            <div>
              <label htmlFor="biography" className="mb-2 block text-sm font-medium text-gray-900">
                自己紹介
                <span className="ml-1 text-sm text-gray-500">
                  ({formData.biography.length}/100文字)
                </span>
              </label>
              <textarea
                id="biography"
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                className={`block w-full rounded-lg border ${
                  validationErrors.biography ? 'border-red-500' : 'border-gray-300'
                } bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500`}
                rows={4}
                maxLength={100}
              />
              {validationErrors.biography && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.biography}</p>
              )}
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-3">
              <Button type="button" onClick={handleClose} variant="default" class="px-5">
                キャンセル
              </Button>
              <Button type="submit" variant="primary" class="px-5">
                保存
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
