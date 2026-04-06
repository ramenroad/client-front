import type { BusinessHour, BusinessStatus } from "@/entities/ramenya/model";
import { DAY_MAP, OpenStatus, WEEKDAYS_ORDER } from "@/entities/ramenya/model";

export const checkBusinessStatus = (businessHours: BusinessHour[]): BusinessStatus => {
  const currentDay = new Date().toLocaleString("en-us", { weekday: "short" }).toLowerCase();
  const currentTime = new Date();
  const todayHours = businessHours.find((hour) => hour.day === currentDay);

  if (!todayHours || !todayHours.isOpen) {
    return {
      status: OpenStatus.DAY_OFF,
      todayHours: null,
    };
  }

  const normalizeTimeString = (time: string) => time.replace(/\s*[~-]\s*/g, " - ");
  const [openTime, closeTime] = normalizeTimeString(todayHours.operatingTime).split(" - ");
  const [breakStart, breakEnd] = todayHours.breakTime
    ? normalizeTimeString(todayHours.breakTime).split(" - ")
    : [null, null];

  const [openHour, openMinute] = openTime.split(":").map(Number);
  const [closeHour, closeMinute] = closeTime.split(":").map(Number);

  const opening = new Date();
  opening.setHours(openHour, openMinute, 0, 0);

  const closing = new Date();
  closing.setHours(closeHour, closeMinute, 0, 0);

  if (currentTime < opening) {
    return {
      status: OpenStatus.BEFORE_OPEN,
      todayHours: {
        operatingTime: todayHours.operatingTime,
        breakTime: todayHours.breakTime || null,
      },
    };
  }

  if (currentTime >= opening && currentTime <= closing) {
    if (breakStart && breakEnd) {
      const [breakStartHour, breakStartMinute] = breakStart.split(":").map(Number);
      const [breakEndHour, breakEndMinute] = breakEnd.split(":").map(Number);

      const breakStartTime = new Date();
      breakStartTime.setHours(breakStartHour, breakStartMinute, 0, 0);

      const breakEndTime = new Date();
      breakEndTime.setHours(breakEndHour, breakEndMinute, 0, 0);

      if (currentTime >= breakStartTime && currentTime <= breakEndTime) {
        return {
          status: OpenStatus.BREAK,
          todayHours: {
            operatingTime: todayHours.operatingTime,
            breakTime: todayHours.breakTime || null,
          },
        };
      }
    }

    return {
      status: OpenStatus.OPEN,
      todayHours: {
        operatingTime: todayHours.operatingTime,
        breakTime: todayHours.breakTime || null,
      },
    };
  }

  return {
    status: OpenStatus.CLOSED,
    todayHours: {
      operatingTime: todayHours.operatingTime,
      breakTime: todayHours.breakTime || null,
    },
  };
};

export const checkBusinessStatusSpecial = (businessHours: BusinessHour[]) => {
  const sorted = [...businessHours].sort(
    (a, b) =>
      WEEKDAYS_ORDER.indexOf(a.day as (typeof WEEKDAYS_ORDER)[number]) -
      WEEKDAYS_ORDER.indexOf(b.day as (typeof WEEKDAYS_ORDER)[number]),
  );
  const closedDays = sorted.filter((businessHour) => !businessHour.isOpen);
  const firstOpenDay = sorted.filter((businessHour) => businessHour.isOpen)[0];
  const allSame = sorted
    .filter((businessHour) => businessHour.isOpen)
    .every((businessHour) => businessHour.operatingTime === firstOpenDay?.operatingTime);

  let closeInformation: string | null = null;

  if (closedDays.length > 0) {
    const closedDaysText = closedDays.map((day) => DAY_MAP[day.day]).join(", ");
    closeInformation = `매주 ${closedDaysText}요일 휴무`;
  }

  return {
    closeInformation,
    daily: {
      allSame,
      operatingTime: firstOpenDay?.operatingTime ?? null,
      breakTime: firstOpenDay?.breakTime ?? null,
    },
  };
};
