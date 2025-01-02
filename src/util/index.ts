import { BusinessHour, BusinessStatus } from "../types";
import { OpenStatus } from "../constants";

export const checkBusinessStatus = (
  businessHours: BusinessHour[],
): BusinessStatus => {
  const currentDay = new Date()
    .toLocaleString("en-us", { weekday: "short" })
    .toLowerCase();
  const currentTime = new Date();

  // Find the business hours for the current day
  const todayHours = businessHours.find((hour) => hour.day === currentDay);

  // If no business hours are found or the business is closed
  if (!todayHours || !todayHours.isOpen) {
    return {
      status: OpenStatus.DAY_OFF, // It's a day off
      todayHours: null, // No hours available
    };
  }

  // Parse operating and break times
  const [openTime, closeTime] = todayHours.operatingTime.split(" - ");
  const [breakStart, breakEnd] = todayHours.breakTime
    ? todayHours.breakTime.split(" - ")
    : [null, null];

  // Convert string times into Date objects (same day as current day)
  const [openHour, openMinute] = openTime.split(":").map(Number);
  const [closeHour, closeMinute] = closeTime.split(":").map(Number);

  const opening = new Date();
  opening.setHours(openHour, openMinute, 0, 0);

  const closing = new Date();
  closing.setHours(closeHour, closeMinute, 0, 0);

  // Check if before opening
  if (currentTime < opening) {
    return {
      status: OpenStatus.BEFORE_OPEN,
      todayHours: {
        operatingTime: todayHours.operatingTime,
        breakTime: todayHours.breakTime || null,
      },
    };
  }

  // Check if within operating hours
  if (currentTime >= opening && currentTime <= closing) {
    // Check if within break time
    if (breakStart && breakEnd) {
      const [breakStartHour, breakStartMinute] = breakStart
        .split(":")
        .map(Number);
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

  // Check if after closing time
  return {
    status: OpenStatus.CLOSED,
    todayHours: {
      operatingTime: todayHours.operatingTime,
      breakTime: todayHours.breakTime || null,
    },
  };
};
