export const formatDateToMMMdyyyy = (dateString: string | Date): string => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return formatter.format(d);
};

export const formatTimeTohmma = (dateString: string | Date): string => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
  // Output might be "1:32 PM", remove the space to match "1:32PM" if needed
  return formatter.format(d).replace(/\s/g, "");
};
