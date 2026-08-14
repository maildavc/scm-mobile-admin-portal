/** Compact currency display: 900,000,000,000 → NGN900B */
export function formatCompactAmount(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "—";

  const raw = String(value).trim();
  const numeric = Number(raw.replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(numeric)) return raw;

  const sign = numeric < 0 ? "-" : "";
  const abs = Math.abs(numeric);
  const units = [
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" },
  ];

  for (const unit of units) {
    if (abs >= unit.value) {
      const compact = abs / unit.value;
      const formatted =
        compact >= 100 || Number.isInteger(compact)
          ? compact.toFixed(0)
          : compact.toFixed(1).replace(/\.0$/, "");
      return `${sign}NGN${formatted}${unit.suffix}`;
    }
  }

  return `${sign}NGN${abs}`;
}
