export function timestampToLocaleString(timestamp: string | undefined): string | null {
  if (timestamp == null) return null
  return new Date(parseFloat(timestamp.toString())).toLocaleString()
}
