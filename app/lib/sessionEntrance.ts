// Tracks which entrance sequences have already played once in this browser
// tab. A plain `window` property (not sessionStorage) is the right tool here:
// it survives Next.js client-side navigation between pages (so revisiting a
// page via a Link click doesn't replay its intro), but a genuine hard reload
// gets a fresh `window` and correctly starts over. sessionStorage would
// survive a hard reload too, which is exactly what shouldn't happen here.
export function shouldAnimateEntrance(key: string): boolean {
  if (typeof window === 'undefined') return true

  const w = window as unknown as { __2ndPlayedEntrances?: Set<string> }
  if (!w.__2ndPlayedEntrances) w.__2ndPlayedEntrances = new Set()

  if (w.__2ndPlayedEntrances.has(key)) return false
  w.__2ndPlayedEntrances.add(key)
  return true
}
