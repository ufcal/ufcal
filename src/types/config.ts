export interface SiteConfig {
  site: {
    title: string
    logo: string
  }
  features: {
    comments: {
      enabled: boolean
      defaultDisplay: boolean
    }
  }
}

// 設定値を取得するためのユーティリティ関数
export const getConfig = async (): Promise<SiteConfig> => {
  const config = await import('../config/config.json')
  return config.default
}

// コメント機能の設定を取得するためのヘルパー関数
export const getCommentConfig = async () => {
  const config = await getConfig()
  return config.features.comments
}
