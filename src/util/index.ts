import { BusinessHour, BusinessStatus } from "../types";
import { DAY_MAP, OpenStatus, WEEKDAYS_ORDER } from "../constants";
import { disassemble } from "es-hangul";

export const checkBusinessStatus = (businessHours: BusinessHour[]): BusinessStatus => {
  const currentDay = new Date().toLocaleString("en-us", { weekday: "short" }).toLowerCase();
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
  const normalizeTimeString = (timeStr: string) => timeStr.replace(/\s*[~-]\s*/g, " - "); // 공백을 포함한 ~ 또는 - 를 " - "로 정규화

  const [openTime, closeTime] = normalizeTimeString(todayHours.operatingTime).split(" - ");
  const [breakStart, breakEnd] = todayHours.breakTime
    ? normalizeTimeString(todayHours.breakTime).split(" - ")
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

  // Check if after closing time
  return {
    status: OpenStatus.CLOSED,
    todayHours: {
      operatingTime: todayHours.operatingTime,
      breakTime: todayHours.breakTime || null,
    },
  };
};

// 특이사항 없이 매일 같음 → 연중무휴 추가
// 운영시간 매일 같음, 매주 휴무일도 동일하다 → 연중무휴가 아닌 매주 N요일 휴무로 표출

/**
 * Description
 * @param {BusinessHour[]} businessHours
 * @returns {null | "연중무휴" | "매주 N요일 휴무"}
 */

export function checkBusinessStatusSpecial(businessHours: BusinessHour[]): {
  closeInformation: string | null;
  daily: {
    allSame: boolean;
    operatingTime: string;
    breakTime: string | null;
  };
} {
  // if (businessHours.length !== 7)
  //   return { closeInformation: null, daily: { allSame: false, operatingTime: "", breakTime: null } };

  // 정렬 보정 (월~일)
  const sorted = [...businessHours].sort(
    (a, b) =>
      WEEKDAYS_ORDER.indexOf(a.day as (typeof WEEKDAYS_ORDER)[number]) -
      WEEKDAYS_ORDER.indexOf(b.day as (typeof WEEKDAYS_ORDER)[number]),
  );

  const closedDays = sorted.filter((bh) => !bh.isOpen);

  // 휴무일 제외하고 모두 똑같은 운영시간인지 체크
  const first = sorted.filter((bh) => bh.isOpen)[0];

  const allSame = sorted
    .filter((bh) => bh.isOpen) // 휴무일 제외
    .every((bh) => bh.operatingTime === first.operatingTime);

  // 열려 있는 날들의 운영시간, 휴게시간이 모두 동일하고
  // 닫힌 요일들이 동일하게 존재하면 → 매주 특정 요일 휴무
  let closeInformation: string | null = null;

  if (closedDays.length > 0) {
    const closedDaysStr = closedDays.map((d) => DAY_MAP[d.day]).join(", ");
    closeInformation = `매주 ${closedDaysStr}요일 휴무`;
  }

  return {
    closeInformation,
    daily: {
      allSame,
      operatingTime: first?.operatingTime ?? null,
      breakTime: first?.breakTime ?? null,
    },
  };
}

export const getTextMatch = ({
  query,
  target,
}: {
  query: string;
  target: string;
}): {
  matchedText: string;
  unMatchedText: string;
} => {
  // 한글 자모 분해
  const queryDisassembled = disassemble(query);
  const targetDisassembled = disassemble(target);

  // 대소문자 구분 없이 비교하기 위해 소문자로 변환
  const queryLower = query.toLowerCase();
  const targetLower = target.toLowerCase();

  // 1. 완전한 한글 매칭 (자모 분해 후 비교)
  if (targetDisassembled.startsWith(queryDisassembled)) {
    const matchedText = target.substring(0, query.length);
    const unMatchedText = target.substring(query.length);

    return {
      matchedText,
      unMatchedText,
    };
  }

  // 2. 일반 문자열 매칭 (대소문자 구분 없음)
  if (targetLower.startsWith(queryLower)) {
    const matchedText = target.substring(0, query.length);
    const unMatchedText = target.substring(query.length);

    return {
      matchedText,
      unMatchedText,
    };
  }

  // 3. 부분 매칭 (자모 분해 기준)
  const index = targetDisassembled.indexOf(queryDisassembled);
  if (index !== -1) {
    // 자모 분해된 인덱스를 원본 문자열 인덱스로 변환
    let originalIndex = 0;
    let disassembledIndex = 0;

    for (let i = 0; i < target.length; i++) {
      if (disassembledIndex >= index) break;
      disassembledIndex += disassemble(target[i]).length;
      originalIndex = i + 1;
    }

    const matchedText = target.substring(originalIndex, originalIndex + query.length);
    const unMatchedText = target.substring(0, originalIndex) + target.substring(originalIndex + query.length);

    return {
      matchedText,
      unMatchedText,
    };
  }

  // 4. 일반 부분 매칭
  const normalIndex = targetLower.indexOf(queryLower);
  if (normalIndex !== -1) {
    const matchedText = target.substring(normalIndex, normalIndex + query.length);
    const unMatchedText = target.substring(0, normalIndex) + target.substring(normalIndex + query.length);

    return {
      matchedText,
      unMatchedText,
    };
  }

  // 매칭되는 부분이 없는 경우
  return {
    matchedText: "",
    unMatchedText: target,
  };
};
