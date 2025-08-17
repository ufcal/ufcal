// 共通のAPIレスポンス型
export interface ApiResponse<T> {
  message?: string
  errors?: { [k: string]: string } // バリデーションエラーなど
  data?: T
}
