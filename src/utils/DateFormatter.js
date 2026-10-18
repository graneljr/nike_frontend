export const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC", // Keep UTC or remove to use local timezone
});

export function formatDate(value, fallback = "Date is not defined") {
  if (value === null || value === undefined || value === "") return fallback;

  try {
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return fallback;
    return formatter.format(date).replace(",", "");
  } catch {
    return fallback;
  }
}
