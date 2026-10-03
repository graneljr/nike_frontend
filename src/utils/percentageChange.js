export function percentageChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : "new";
  return ((current - previous) / previous) * 100;
}
