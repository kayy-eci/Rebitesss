/**
 * Check if a store is currently open based on availableFrom and availableTo times.
 * Time format is expected to be "HH:MM" (24-hour format).
 */
export function isStoreOpen(availableFrom: string, availableTo: string): boolean {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  const [fromHours, fromMinutes] = availableFrom.split(":").map(Number);
  const [toHours, toMinutes] = availableTo.split(":").map(Number);

  const fromTimeInMinutes = fromHours * 60 + fromMinutes;
  const toTimeInMinutes = toHours * 60 + toMinutes;

  return currentTimeInMinutes >= fromTimeInMinutes && currentTimeInMinutes <= toTimeInMinutes;
}

/**
 * Get a formatted message about when the store will be open.
 */
export function getStoreClosedMessage(availableFrom: string, availableTo: string): string {
  return `Toko ini sedang tutup. Kembali lagi besok di jam ${availableFrom}–${availableTo} untuk menikmati makanan ini.`;
}
