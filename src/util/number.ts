/**
 * 숫자를 천 단위 구분 쉼표가 있는 문자열로 변환합니다.
 * @param num 변환할 숫자
 * @returns 천 단위 구분 쉼표가 포함된 문자열
 * @example
 * formatNumber(1000) // "1,000"
 * formatNumber(1234567) // "1,234,567"
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
