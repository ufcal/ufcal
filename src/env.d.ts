/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly APP_TITLE: string
  readonly PUBLIC_BASE_URL: string
  //readonly PUBLIC_API_URL: string
  //readonly PUBLIC_ADMIN_API_URL: string // 管理用APIのURL
  //readonly PUBLIC_MEMBER_API_URL: string // メンバー用APIのURL
}
declare namespace App {
  interface Locals {
    session: RedisSession
    user: UserSessionData
  }
}
