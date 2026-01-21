"use client";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generate random uppercase base36 chars
 */
function randomBase36(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return result;
}

export function generateLicenseId(): string {
  // timestamp → base36 (uppercase)
  const timePart = Date.now().toString(36).toUpperCase();

  /**
   * Gabungkan:
   * - timestamp (unik per ms)
   * - random padding (hindari collision di ms yang sama)
   */
  const combined = (timePart + randomBase36(12)).slice(-12);

  return `LIC-${combined.slice(0, 4)}-${combined.slice(4, 8)}-${combined.slice(8, 12)}`;
}
