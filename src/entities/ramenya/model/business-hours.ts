import type { BusinessHour } from './types'
import { DAY_MAP, OpenStatus, WEEKDAYS_ORDER, type WeekdaysOrderType } from './constants'

export type BusinessStatus = {
  status: OpenStatus
  todayHours: {
    operatingTime: string | null
    breakTime: string | null
  } | null
}

export type BusinessStatusSpecial = {
  closeInformation: string | null
  daily: {
    allSame: boolean
    operatingTime: string | null
    breakTime: string | null
  }
}

const DAY_INDEX_TO_KEY = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

const normalizeTimeString = (time: string) => time.replace(/\s*[~-]\s*/g, ' - ')

const getCurrentDayKey = () => DAY_INDEX_TO_KEY[new Date().getDay()]

const createDateWithTime = (time: string) => {
  const [hour, minute] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hour, minute, 0, 0)
  return date
}

const hasValidOperatingTime = (businessHour: BusinessHour) => Boolean(businessHour.operatingTime?.includes(':'))

export const checkBusinessStatus = (businessHours: BusinessHour[]): BusinessStatus => {
  const currentDay = getCurrentDayKey()
  const currentTime = new Date()
  const todayHours = businessHours.find((hour) => hour.day === currentDay)

  if (!todayHours || !todayHours.isOpen || !hasValidOperatingTime(todayHours)) {
    return {
      status: OpenStatus.DAY_OFF,
      todayHours: null,
    }
  }

  const [openTime, closeTime] = normalizeTimeString(todayHours.operatingTime ?? '').split(' - ')
  const [breakStart, breakEnd] = todayHours.breakTime
    ? normalizeTimeString(todayHours.breakTime).split(' - ')
    : [null, null]

  if (!openTime || !closeTime) {
    return {
      status: OpenStatus.DAY_OFF,
      todayHours: null,
    }
  }

  const opening = createDateWithTime(openTime)
  const closing = createDateWithTime(closeTime)
  const todayHoursInfo = {
    operatingTime: todayHours.operatingTime ?? null,
    breakTime: todayHours.breakTime ?? null,
  }

  if (currentTime < opening) {
    return {
      status: OpenStatus.BEFORE_OPEN,
      todayHours: todayHoursInfo,
    }
  }

  if (currentTime >= opening && currentTime <= closing) {
    if (breakStart && breakEnd) {
      const breakStartTime = createDateWithTime(breakStart)
      const breakEndTime = createDateWithTime(breakEnd)

      if (currentTime >= breakStartTime && currentTime <= breakEndTime) {
        return {
          status: OpenStatus.BREAK,
          todayHours: todayHoursInfo,
        }
      }
    }

    return {
      status: OpenStatus.OPEN,
      todayHours: todayHoursInfo,
    }
  }

  return {
    status: OpenStatus.CLOSED,
    todayHours: todayHoursInfo,
  }
}

export const checkBusinessStatusSpecial = (businessHours: BusinessHour[]): BusinessStatusSpecial => {
  const sorted = [...businessHours].sort(
    (a, b) =>
      WEEKDAYS_ORDER.indexOf(a.day as WeekdaysOrderType) - WEEKDAYS_ORDER.indexOf(b.day as WeekdaysOrderType),
  )
  const closedDays = sorted.filter((businessHour) => !businessHour.isOpen)
  const openDays = sorted.filter((businessHour) => businessHour.isOpen)
  const firstOpenDay = openDays[0]
  const allSame = openDays.every((businessHour) => businessHour.operatingTime === firstOpenDay?.operatingTime)
  const closeInformation =
    closedDays.length > 0 ? `매주 ${closedDays.map((day) => DAY_MAP[day.day]).join(', ')}요일 휴무` : null

  return {
    closeInformation,
    daily: {
      allSame,
      operatingTime: firstOpenDay?.operatingTime ?? null,
      breakTime: firstOpenDay?.breakTime ?? null,
    },
  }
}

export const getTodayBusinessHour = (businessHours: BusinessHour[]) => {
  const today = getCurrentDayKey()
  return businessHours.find((hour) => hour.day.toLowerCase() === today)
}

export const sortBusinessHoursByCurrentDay = (businessHours: BusinessHour[]) => {
  const today = getCurrentDayKey()
  const todayIndex = WEEKDAYS_ORDER.indexOf(today as WeekdaysOrderType)
  const reorderedDays = [...WEEKDAYS_ORDER.slice(todayIndex), ...WEEKDAYS_ORDER.slice(0, todayIndex)]

  return [...businessHours].sort((a, b) => {
    const aIndex = reorderedDays.indexOf(a.day as WeekdaysOrderType)
    const bIndex = reorderedDays.indexOf(b.day as WeekdaysOrderType)
    return aIndex - bIndex
  })
}
