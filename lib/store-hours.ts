
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

export function getStoreClosedMessage(availableFrom: string, availableTo: string): string {
  return `Toko ini sedang tutup. Kembali lagi besok di jam ${availableFrom}–${availableTo} untuk menikmati makanan ini.`;
}
