export interface UserStats {
  totalUsers: number
  activeUsers: number
  newRegistrations: number
  totalComments: number
}

export interface UserActivity {
  id: string
  content: string
  userName: string
  createdAt: Date
}

export interface DashboardResponse {
  userStats: UserStats
}
