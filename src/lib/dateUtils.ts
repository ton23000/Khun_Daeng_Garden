/**
 * Date Utility for Thai Buddhist Era (BE)
 */

export const formatThaiDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
) => {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "-";

    const day = d.getDate();
    const month = THAI_MONTHS[d.getMonth()];
    const yearBE = d.getFullYear() + 543;

    // Handle common option combinations manually for reliability
    if (options) {
      if (
        options.month === "long" &&
        options.year === "numeric" &&
        !options.day
      ) {
        return `${month} ${yearBE}`;
      }
      if (options.year === "numeric" && !options.month && !options.day) {
        return `${yearBE}`;
      }
    }

    return `${day} ${month} ${yearBE}`;
  } catch (e) {
    return "-";
  }
};

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

/**
 * Returns date in DD/MM/YYYY BE format
 */
export const formatThaiDateShort = (date: string | Date) => {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "-";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear() + 543;

    return `${day}/${month}/${year}`;
  } catch (e) {
    return "-";
  }
};

export const formatThaiDateTime = (date: string | Date) => {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "-";

    const day = d.getDate();
    const month = THAI_MONTHS[d.getMonth()];
    const yearBE = d.getFullYear() + 543;
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day} ${month} ${yearBE} ${hours}:${minutes}`;
  } catch (e) {
    return "-";
  }
};

/**
 * Returns the Buddhist Era year (BE)
 */
export const getBEYear = (date: string | Date = new Date()) => {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return new Date().getFullYear() + 543;
  return d.getFullYear() + 543;
};

/**
 * Converts BE year to CE year
 */
export const getCEYear = (beYear: number) => {
  return beYear - 543;
};

/**
 * Returns a label for the year in BE format
 */
export const getYearLabel = (date: string | Date = new Date()) => {
  return `พ.ศ. ${getBEYear(date)}`;
};
