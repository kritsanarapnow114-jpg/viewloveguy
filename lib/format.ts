const MONTHS_TH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const MONTHS_TH_FULL = [
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

export function monthYearLabel(d: Date) {
  return MONTHS_TH_FULL[d.getMonth()] + " " + (d.getFullYear() + 543);
}

export function fmtBaht(n: number) {
  return "฿" + Math.round(n).toLocaleString("en-US");
}

/** e.g. 12 ก.ค. 2569 (Buddhist era) */
export function thDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.getDate() + " " + MONTHS_TH[date.getMonth()] + " " + (date.getFullYear() + 543);
}

export function monthLabel(d: Date) {
  return MONTHS_TH[d.getMonth()];
}

export function monthKey(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.getFullYear() + "-" + date.getMonth();
}

/** yyyy-mm-dd for <input type="date"> values, in local time. */
export function toDateInputValue(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
