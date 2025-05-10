import AdminDashboardFetch from '@/fetch/admin/dashboard'
import type { UserStats } from '@/types/dashboard'
import { useEffect, useState } from 'react'

interface AdminStats {
  eventManagement: {
    count: number
    trend: string
  }
  userManagement: {
    count: number
    trend: string
  }
  systemSettings: {
    count: number
    trend: string
  }
}

interface AdminActivity {
  id: string
  type: 'event_management' | 'user_management' | 'system_settings'
  title: string
  adminName: string
  createdAt: Date
}

interface UserActivity {
  id: string
  content: string
  userName: string
  createdAt: Date
}

export default function Dashboard() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [adminStats, setAdminStats] = useState<AdminStats>({
    eventManagement: {
      count: 15,
      trend: '+5'
    },
    userManagement: {
      count: 23,
      trend: '+8'
    },
    systemSettings: {
      count: 3,
      trend: '+1'
    }
  })
  const [recentAdminActivities, setRecentAdminActivities] = useState<AdminActivity[]>([
    {
      id: '1',
      type: 'event_management',
      title: '2024年度新入生歓迎会の作成',
      adminName: '山田太郎',
      createdAt: new Date('2024-03-15T14:30:00')
    },
    {
      id: '2',
      type: 'user_management',
      title: 'ユーザ権限の更新',
      adminName: '佐藤花子',
      createdAt: new Date('2024-03-15T13:15:00')
    },
    {
      id: '3',
      type: 'system_settings',
      title: 'メール通知設定の更新',
      adminName: '山田太郎',
      createdAt: new Date('2024-03-15T10:00:00')
    }
  ])
  const [recentUserActivities, setRecentUserActivities] = useState<UserActivity[]>([
    {
      id: '1',
      content: '新入生歓迎会の詳細について質問があります',
      userName: '鈴木一郎',
      createdAt: new Date('2024-03-15T15:45:00')
    },
    {
      id: '2',
      content: '部活動説明会の日程を確認しました',
      userName: '田中誠',
      createdAt: new Date('2024-03-15T15:30:00')
    },
    {
      id: '3',
      content: '新入生歓迎会に参加します！',
      userName: '佐々木美咲',
      createdAt: new Date('2024-03-15T15:00:00')
    }
  ])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await AdminDashboardFetch.getDashboardData()
        if (!response) {
          throw new Error('ダッシュボードデータの取得に失敗しました')
        }
        const data = await response.json()
        setUserStats(data.userStats)
      } catch (error) {
        console.error('ダッシュボードデータの取得に失敗しました:', error)
      }
    }

    fetchDashboardData()
  }, [])

  if (!userStats) {
    return <div className="p-4">データを読み込み中...</div>
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
      </div>

      {/* ユーザ活動セクション */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">ユーザ活動</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center">
              <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">総ユーザ数</h3>
                <p className="text-2xl font-bold text-blue-600">{userStats.totalUsers}</p>
                <p className="text-sm text-gray-500">前月比 +12%</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center">
              <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">アクティブユーザ</h3>
                <p className="text-2xl font-bold text-green-600">{userStats.activeUsers}</p>
                <p className="text-sm text-gray-500">直近30日間</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center">
              <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-500">
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">新規登録</h3>
                <p className="text-2xl font-bold text-purple-600">{userStats.newRegistrations}</p>
                <p className="text-sm text-gray-500">今月</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center">
              <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">コメント数</h3>
                <p className="text-2xl font-bold text-orange-600">{userStats.comments}</p>
                <p className="text-sm text-gray-500">今月</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 管理者活動セクション */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">管理者活動</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center">
              <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">イベント管理</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {adminStats.eventManagement.count}
                </p>
                <p className="text-sm text-gray-500">前月比 {adminStats.eventManagement.trend}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center">
              <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">ユーザ管理</h3>
                <p className="text-2xl font-bold text-green-600">
                  {adminStats.userManagement.count}
                </p>
                <p className="text-sm text-gray-500">前月比 {adminStats.userManagement.trend}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center">
              <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-500">
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">システム設定</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {adminStats.systemSettings.count}
                </p>
                <p className="text-sm text-gray-500">前月比 {adminStats.systemSettings.trend}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 最近の活動セクション */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">最近の活動</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 管理者の最近の活動 */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">管理者の最近の活動</h3>
            <div className="space-y-4">
              {recentAdminActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        {activity.adminName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {activity.adminName} • {activity.createdAt.toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ユーザの最近の活動 */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">ユーザの最近の活動</h3>
            <div className="space-y-4">
              {recentUserActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        {activity.userName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.content}</p>
                    <p className="text-xs text-gray-500">
                      {activity.userName} • {activity.createdAt.toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
