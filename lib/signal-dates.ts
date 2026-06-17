// Parse les dates françaises des brèves Signal ("5 juin 2026") pour les
// regrouper et les trier par mois. Renvoie null si le format est inattendu.

const FR_MONTHS: Record<string, number> = {
  janvier: 1,
  fevrier: 2,
  février: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  aout: 8,
  août: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  decembre: 12,
  décembre: 12,
}

const MONTH_LABELS = [
  '',
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]

export type SignalDate = {
  key: string // "2026-06", triable
  label: string // "Juin 2026"
  sort: number // year*10000 + month*100 + day, triable
}

export function parseSignalDate(date: string | undefined | null): SignalDate | null {
  if (!date) return null
  const m = date.trim().toLowerCase().match(/(\d{1,2})\s+(\S+)\s+(\d{4})/)
  if (!m) return null
  const day = parseInt(m[1], 10)
  const month = FR_MONTHS[m[2]]
  const year = parseInt(m[3], 10)
  if (!month || !year) return null
  return {
    key: `${year}-${String(month).padStart(2, '0')}`,
    label: `${MONTH_LABELS[month]} ${year}`,
    sort: year * 10000 + month * 100 + day,
  }
}
