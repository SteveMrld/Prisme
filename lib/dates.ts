/* Helpers de date partagés (formatage FR, comparaison de jour calendaire).
   La comparaison se fait au jour près, pas à l'horodatage, pour éviter
   les écarts SSR/client autour de minuit. */

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

export function formatFrDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const day = d.getDate()
  const month = MONTHS_FR[d.getMonth()]
  const year = d.getFullYear()
  const dayLabel = day === 1 ? '1er' : String(day)
  return `${dayLabel} ${month} ${year}`
}

/* True si la date ISO tombe strictement après la date du jour (jour
   calendaire local, pas l'horodatage). Sert au gating « à paraître ». */
export function isFutureDay(iso: string, now: Date = new Date()): boolean {
  if (!iso) return false
  const d = new Date(iso)
  if (isNaN(d.getTime())) return false
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const articleDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  return articleDay > today
}
