import type { ActivityType } from './activity'

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newRegistrations: number
  totalComments: number
}

export interface AdminStats {
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

export interface RecentActivity {
  id: string
  type: ActivityType
  title: string
  description: string
  userId: number
  metadata?: Record<string, unknown>
  createdAt: Date
}

export interface DashboardResponse {
  userStats: UserStats
  adminStats: AdminStats
  recentActivities: {
    admin: RecentActivity[]
    user: RecentActivity[]
  }
  timestamp: string
}

export interface DashboardErrorResponse {
  error: string
  code:
    | 'DASHBOARD_DATA_NOT_FOUND'
    | 'UNAUTHORIZED'
    | 'RATE_LIMIT_EXCEEDED'
    | 'INTERNAL_SERVER_ERROR'
  details?: string
}
