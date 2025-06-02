import config from '@/config/config.json'
import type { EventAdminRequest } from '@/types/event'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

const AUTH_API_URL = `${import.meta.env.PUBLIC_BASE_URL}${config.api.rootUrl}/auth`
const EVENT_API_URL = `${import.meta.env.PUBLIC_BASE_URL}${config.api.adminUrl}/event`
const BEFORE_ALL_TIMEOUT = 30000 // 30 sec
const LOGIN_EMAIL = 'admin@example.com'
const LOGIN_PASSWORD = 'password'

// カスタムマッチャーの型定義
declare module 'vitest' {
  interface Assertion {
    toHaveStatus(expected: number, errorMessage?: string): void
  }
  interface AsymmetricMatchersContaining {
    toHaveStatus(expected: number, errorMessage?: string): void
  }
}

expect.extend({
  toHaveStatus(received, expected, errorMessage) {
    const { status } = received
    const pass = status === expected

    if (pass) {
      return {
        message: () => `期待通りステータスコード${expected}が返されました`,
        pass: true
      }
    } else {
      return {
        message: () =>
          `期待したステータスコード: ${expected}\n実際のステータスコード: ${status}\nエラーメッセージ: ${errorMessage}`,
        pass: false
      }
    }
  }
})

describe('API Routes', () => {
  let response: Response
  let body: Array<{ [key: string]: unknown }>
  let cookies: string = ''
  let createdEventId: string
  let createdEventId2: string
  let createdEventId3: string

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
    category: 'category1',
    url: 'https://example.com'
  }
  const testEvent2: EventAdminRequest = {
    title: 'テストイベント2',
    description: 'これはテストイベントです',
    start: formatDate(today) + 'T09:00',
    end: formatDate(today) + 'T09:00',
    allDay: false,
    category: 'category1',
    url: 'https://example.com'
  }
  const testEvent3: EventAdminRequest = {
    title: 'テストイベント3',
    description: 'これはテストイベントです',
    start: formatDate(today) + 'T09:12',
    end: formatDate(today) + 'T12:12',
    allDay: false,
    category: 'category1',
    url: 'https://example.com'
  }
  const errorEvent: EventAdminRequest = {
    title: 'テストイベント',
    description: 'これはテストイベントです',
    start: formatDate(today),
    end: formatDate(today), // エラー値
    allDay: true,
    category: 'category1',
    url: 'https://example.com'
  }
  const errorEvent2: EventAdminRequest = {
    title: 'テストイベント2',
    description: 'これはテストイベントです',
    start: formatDate(today),
    end: formatDate(tomorrow),
    allDay: false, // エラー値
    category: 'category1',
    url: 'https://example.com'
  }
  const errorEvent3: EventAdminRequest = {
    title: 'テストイベント3',
    description: 'これはテストイベントです',
    start: formatDate(today) + 'T12:00',
    end: formatDate(today) + 'T09:00',
    allDay: false,
    category: 'category1',
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

    // エラーが発生した場合はエラーメッセージを表示
    if (response.status !== 200) {
      const error = await response.json()
      expect(response).toHaveStatus(200, error.message)
    }

    expect(response.status).toBe(200)
    const createdEvent = await response.json()
    createdEventId = createdEvent.id
  })
  test('イベントを作成2', async () => {
    response = await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify(testEvent2)
    })

    // エラーが発生した場合はエラーメッセージを表示
    if (response.status !== 200) {
      const error = await response.json()
      expect(response).toHaveStatus(200, error.message)
    }

    expect(response.status).toBe(200)
    const createdEvent2 = await response.json()
    createdEventId2 = createdEvent2.id
  })
  test('イベントを作成3', async () => {
    response = await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify(testEvent3)
    })

    // エラーが発生した場合はエラーメッセージを表示
    if (response.status !== 200) {
      const error = await response.json()
      expect(response).toHaveStatus(200, error.message)
    }

    expect(response.status).toBe(200)
    const createdEvent3 = await response.json()
    createdEventId3 = createdEvent3.id
  })

  test('無効なデータでイベントを作成1（バリデーションエラー）', async () => {
    response = await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify(errorEvent)
    })

    expect(response.status).toBe(422)
  })
  test('無効なデータでイベントを作成2（バリデーションエラー）', async () => {
    response = await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify(errorEvent2)
    })

    expect(response.status).toBe(400)
  })
  test('無効なデータでイベントを作成3（バリデーションエラー）', async () => {
    response = await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      body: JSON.stringify(errorEvent3)
    })

    expect(response.status).toBe(422)
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
    const event = await response.json()
    expect(event).toEqual(expect.objectContaining(testEvent)) // ID以外を比較
  })

  test('作成したイベントを取得2', async () => {
    response = await fetch(`${EVENT_API_URL}/${createdEventId3}`, {
      method: 'GET',
      headers: {
        Cookie: cookies
      }
    })

    expect(response.status).toBe(200)
    const event = await response.json()
    expect(event).toEqual(expect.objectContaining(testEvent3)) // ID以外を比較
  })

  test('イベントを更新', async () => {
    const updatedEvent = {
      ...testEvent,
      title: '更新されたテストイベント',
      description: 'これは更新されたテストイベントです',
      category: 'category2'
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

    response = await fetch(`${EVENT_API_URL}/${createdEventId2}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookies
      }
    })
    expect(response.status).toBe(200)

    response = await fetch(`${EVENT_API_URL}/${createdEventId3}`, {
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
