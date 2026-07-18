export type DateRangeMode = "all" | "today" | "custom";

export type DateRangeValue = {
  mode: DateRangeMode;
  from: string; // yyyy-mm-dd, used when mode === "custom"
  to: string; // yyyy-mm-dd, used when mode === "custom"
};

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function defaultDateRange(): DateRangeValue {
  const t = todayIso();
  return { mode: "all", from: t, to: t };
}

export function inDateRange(dateIso: string, range: DateRangeValue): boolean {
  const d = dateIso.slice(0, 10);
  if (range.mode === "all") return true;
  if (range.mode === "today") return d === todayIso();
  if (range.from && d < range.from) return false;
  if (range.to && d > range.to) return false;
  return true;
}

export function dateRangeLabel(range: DateRangeValue): string {
  if (range.mode === "all") return "ทั้งหมด";
  if (range.mode === "today") return "วันนี้";
  if (range.from && range.to) return `${range.from} ถึง ${range.to}`;
  return "กำหนดเอง";
}
