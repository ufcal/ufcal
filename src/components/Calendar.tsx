import EventInfoModal from '@/components/event/EventInfoModal'
import config from '@/config/config.json'
import EventFetch from '@/fetch/event'
import useWatch from '@/lib/watchState'
import { isEventUpdated } from '@/store/event'
import { userStore } from '@/store/user'
import type { EventResponse } from '@/types/event'
import type { EventClickArg } from '@fullcalendar/core'
import jaLocale from '@fullcalendar/core/locales/ja'
import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import { useStore } from '@nanostores/react'
import React, { useRef, useState } from 'react'
import useSWR from 'swr'

interface DateRange {
  startStr: string
  endStr: string
}

const fetcher = (url: string): Promise<any> => fetch(url).then((res) => res.json())

const Calendar: React.FC = () => {
  const $userStore = useStore(userStore)
  const calendarRef = useRef<FullCalendar>(null)
  const $isEventUpdated = useStore(isEventUpdated) // イベント情報の更新を監視

  // カレンダーの日付範囲を初期化
  const [dateRange, setDateRange] = useState<DateRange>({ startStr: '', endStr: '' })
  const { data: events, mutate: mutateEvents } = useSWR(
    dateRange.startStr && dateRange.endStr
      ? `${config.api.rootUrl}/event?start=${dateRange.startStr}&end=${dateRange.endStr}`
      : null,
    fetcher
  )
  const { data: holidays } = useSWR(
    dateRange.startStr && dateRange.endStr
      ? `${config.api.rootUrl}/holiday?start=${dateRange.startStr}&end=${dateRange.endStr}`
      : null,
    fetcher
  )

  // イベント情報のモーダルを初期化
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [userAuth, setUserAuth] = useState<any>(null)

  /**
   * イベント情報の更新を監視
   */
  useWatch($isEventUpdated, () => {
    // イベント情報を再取得 => カレンダーの再描画
    mutateEvents()
  })

  /**
   * イベント情報を取得
   */
  const getCalendarInfo = async (dateInfo: DateRange): Promise<void> => {
    const startStr = dateInfo.startStr.split('T')[0]!
    const endStr = dateInfo.endStr.split('T')[0]!

    // カレンダーに表示する日付範囲を更新
    setDateRange({ startStr: startStr, endStr: endStr })
  }

  // 日付セルにカスタムコンテンツをレンダリングする関数
  const renderDayCellContent = (dayCellContent: any) => {
    // 祝日データがない場合は何もしない
    if (!holidays) {
      return null
    }

    // 月ビュー以外は何もしない
    if (dayCellContent.view.type !== 'dayGridMonth') return null

    const dateStr = dayCellContent.date.toLocaleDateString('sv-SE')
    const holidayName = holidays[dateStr]
    const isHoliday = Boolean(holidayName)

    return (
      <>
        <span className={isHoliday ? 'holiday-number' : ''}>{dayCellContent.date.getDate()}</span>
        {isHoliday ? <span className="holiday-label">{holidayName}</span> : null}
      </>
    )
  }

  /**
   * イベント情報を表示
   */
  const handleEventClick = async (clickInfo: EventClickArg) => {
    // イベント情報を取得
    try {
      const response = await EventFetch.getEvent(Number(clickInfo.event.id))
      if (!response.ok) {
        const errorData = await response.json()
        //setError(`データの取得に失敗しました: ${errorData.message}`)
        return
      }
      const eventData = await response.json()

      setUserAuth($userStore)
      setSelectedEvent(eventData)
      setIsModalOpen(true)
    } catch (e) {
      console.error(e)
    }
  }
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <div className="calendar-main mb-5">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        headerToolbar={{
          left: '',
          center: 'title'
        }}
        initialView="dayGridMonth"
        dayMaxEvents={true} // 日付枠内に表示できるイベント数を制限
        events={events?.map((event: EventResponse) => ({
          ...event,
          title: event.title
        }))}
        eventContent={(eventInfo) => {
          const event = eventInfo.event
          const extendedProps = event.extendedProps as EventResponse
          const commentCount = extendedProps?.commentCount || 0
          const isCommentsEnabled = config.site.comments.enabled

          return (
            <div className="fc-event-main-frame p-0.5">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center truncate">
                  {/* 時間（左寄せ、太字） */}
                  {!event.allDay && <div className="mr-1 font-bold">{eventInfo.timeText}</div>}

                  {/* タイトル（左寄せ、時間の後ろ） */}
                  <div className="truncate">{event.title}</div>
                </div>

                {/* コメント数バッジ（右寄せ） */}
                {isCommentsEnabled && commentCount > 0 && (
                  <span className="ml-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
                    {commentCount}
                  </span>
                )}
              </div>
            </div>
          )
        }}
        dayCellContent={renderDayCellContent}
        eventDisplay={'block'} // イベントをブロック要素として表示
        eventClick={handleEventClick}
        datesSet={getCalendarInfo} // カレンダーが切り替わるときに呼び出される
        locale={jaLocale} // 日本語化
        eventTimeFormat={{
          // 時刻フォーマット'14:30'
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        businessHours={true} // 土日をグレーアウト
        fixedWeekCount={false} // 週数を固定しない⇒月の週数が変わる
        height={'90vh'} // カレンダーの高さを制限
        eventClassNames="cursor-pointer" // イベントにカーソルポインターを適用
      />
      <EventInfoModal
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={closeModal}
        userAuth={userAuth}
      />
    </div>
  )
}

export default Calendar
