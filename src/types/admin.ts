export type AdminActivity = {
  id: string
  type: 'event_management' | 'user_management' | 'system_settings'
  title: string
  adminName: string
  createdAt: Date
}

export type UserActivity = {
  id: string
  content: string
  userName: string
  createdAt: Date
}

export type AdminStats = {
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

export type UserStats = {
  totalUsers: number
  activeUsers: number
  newRegistrations: number
  comments: number
}
