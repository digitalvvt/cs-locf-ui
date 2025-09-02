export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  // Format the date part: "July 16, 2025"
  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  // Extract hours/minutes and determine AM/PM
  let hours = date.getHours();
  const mins = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24h → 12h, with 0 → 12
  hours = hours % 12 || 12;

  // Pad minutes to two digits
  const minuteStr = mins.toString().padStart(2, "0");

  return `${datePart}, ${hours}:${minuteStr} ${ampm}`;
}
