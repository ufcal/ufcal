import config from '@/config/config.json'
import type { EventAdminRequest } from '@/types/event'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

const AUTH_API_URL = `${import.meta.env.PUBLIC_BASE_URL}${config.api.rootUrl}/auth`
const EVENT_API_URL = `${import.meta.env.PUBLIC_BASE_URL}${config.api.adminUrl}/event`
const BEFORE_ALL_TIMEOUT = 30000 // 30 sec
const LOGIN_EMAIL = 'admin@example.com'
const LOGIN_PASSWORD = 'password2'

describe('API Routes', () => {
  let response: Response
  let body: Array<{ [key: string]: unknown }>
  let cookies: string = ''
  let createdEventId: string

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const testEvent: EventAdminRequest = {
    title: 'テストイベント',
    description: 'これはテストイベントです',
    start: formatDate(today),
    end: formatDate(tomorrow),
    allDay: true,
    category: '1',
    url: 'https://example.com'
  }

  /**
   *テスト環境のセットアップ
   */
  beforeAll(async () => {
    // 未ログイン状態でのアクセス状況を確認
    response = await fetch(EVENT_API_URL)

    // レスポンスチェック
    expect(response.status).toBe(403) // アクセス不可

    // ログイン
    response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: LOGIN_EMAIL,
        password: LOGIN_PASSWORD
      })
    })
    expect(response.status).toBe(200)

    // クッキーの保存
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      cookies = setCookieHeader
    }
  }, BEFORE_ALL_TIMEOUT)

  test('一覧を取得', async () => {
    // 再度初期データを取得
    response = await fetch(EVENT_API_URL, {
      method: 'GET',
      headers: {
        Cookie: cookies // 保存したクッキーを使用
      }
    })

    // レスポンスチェック
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/json')

    body = await response.json()
    expectTypeOf(body).toBeArray()
  })

  test('イベントを作成', async () => {
    response = await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify(testEvent)
    })

    expect(response.status).toBe(200)
    const createdEvent = await response.json()
    //expect(createdEvent).toMatchObject(testEvent)
    createdEventId = createdEvent.id
  })

  test('1か月前より前の日付でイベントを作成（バリデーションエラー）', async () => {
    const thirtyOneDaysAgo = new Date(today)
    const thirtyDaysAgo = new Date(today)
    thirtyOneDaysAgo.setDate(today.getDate() - 31)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const pastEvent = {
      ...testEvent,
      start: formatDate(thirtyOneDaysAgo), // 31日前
      end: formatDate(thirtyDaysAgo) // 30日前
    }

    response = await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify(pastEvent)
    })

    expect(response.status).toBe(422)
    const error = await response.json()
    expect(error.message).toBe('イベントの開始日時は1か月前から1年後までの範囲で設定してください')
  })

  test('1年後より後の日付でイベントを作成（バリデーションエラー）', async () => {
    const threeHundredSixtySixDaysLater = new Date(today)
    const threeHundredSixtySevenDaysLater = new Date(today)
    threeHundredSixtySixDaysLater.setDate(today.getDate() + 366)
    threeHundredSixtySevenDaysLater.setDate(today.getDate() + 367)

    const futureEvent = {
      ...testEvent,
      start: formatDate(threeHundredSixtySixDaysLater), // 366日後
      end: formatDate(threeHundredSixtySevenDaysLater) // 367日後
    }

    response = await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify(futureEvent)
    })

    expect(response.status).toBe(422)
    const error = await response.json()
    expect(error.message).toBe('イベントの開始日時は1か月前から1年後までの範囲で設定してください')
  })

  test('作成したイベントを取得', async () => {
    response = await fetch(`${EVENT_API_URL}/${createdEventId}`, {
      method: 'GET',
      headers: {
        Cookie: cookies
      }
    })

    expect(response.status).toBe(200)
    //const event = await response.json()
    //expect(event).toMatchObject(testEvent)
  })

  test('イベントを更新', async () => {
    const updatedEvent = {
      ...testEvent,
      title: '更新されたテストイベント',
      description: 'これは更新されたテストイベントです'
    }

    response = await fetch(`${EVENT_API_URL}/${createdEventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify(updatedEvent)
    })

    expect(response.status).toBe(200)
    const event = await response.json()
    //expect(event).toMatchObject(updatedEvent)
  })

  test('無効なデータでイベントを作成（バリデーションエラー）', async () => {
    const invalidEvent = {
      ...testEvent,
      title: '', // 空のタイトル
      start: 'invalid-date', // 無効な日付
      end: new Date().toISOString()
    }

    response = await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify(invalidEvent)
    })

    expect(response.status).toBe(400)
    const error = await response.json()
    expect(error).toHaveProperty('message')
  })

  test('存在しないイベントを取得（404エラー）', async () => {
    response = await fetch(`${EVENT_API_URL}/0`, {
      method: 'GET',
      headers: {
        Cookie: cookies
      }
    })

    expect(response.status).toBe(404)
  })

  test('イベントを削除', async () => {
    response = await fetch(`${EVENT_API_URL}/${createdEventId}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookies
      }
    })

    expect(response.status).toBe(200)

    // 削除されたイベントが取得できないことを確認
    response = await fetch(`${EVENT_API_URL}/${createdEventId}`, {
      method: 'GET',
      headers: {
        Cookie: cookies
      }
    })

    expect(response.status).toBe(404)
  })
})
