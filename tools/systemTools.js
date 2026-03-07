export function getCurrentTime() {
  const now = new Date()
  return {
    time: now.toLocaleTimeString(),
    date: now.toLocaleDateString(),
    day: now.toLocaleDateString('en-US', { weekday: 'long' }),
    full: now.toString()
  }
}