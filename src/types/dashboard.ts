export interface UserStats {
  totalUsers: number
  activeUsers: number
  newRegistrations: number
  comments: number
}

export interface DashboardResponse {
  userStats: UserStats
}
