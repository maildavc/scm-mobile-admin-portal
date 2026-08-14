export const formatDateTimeDdMmYyyy = (dateString?: string | Date | null): string => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "—";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatDateToMMMdyyyy = (dateString: string | Date): string => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return formatter.format(d);
};

export const formatTimeTohmma = (dateString: string | Date): string => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  // Output might be "1:32 PM", remove the space to match "1:32PM" if needed
  return formatter.format(d).replace(/\s/g, "");
};
