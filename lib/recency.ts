/* Calcul de la fenêtre "RÉCENT" pour la home Soara.
   Source unique : la date ISO de l'article. Pas de flag manuel.
   Fenêtre inclusive sur 0 (un article publié aujourd'hui est RÉCENT)
   et exclusive sur RECENT_WINDOW_DAYS (au 15e jour exact, le badge tombe).
   Les dates futures (article programmé) ne sont jamais RÉCENT. */

export const RECENT_WINDOW_DAYS = 15

export function isRecent(dateIso: string, nowTs: number): boolean {
  const now = new Date(nowTs)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const d = new Date(dateIso)
  const articleDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const ageDays = (today - articleDay) / 86400000
  return ageDays >= 0 && ageDays < RECENT_WINDOW_DAYS
}

/* Score de récence par paliers d'âge. Sert au tri des zones home
   (hero, sous-hero, etc.) : plus c'est récent, plus c'est haut. Le
   `featured` ne dépasse pas la fraîcheur, il la nuance.
     0-7j   : 4
     8-30j  : 3
     31-90j : 2
     > 90j  : 1
   Bonus +0.5 si featured. Un article futur (date > today) renvoie -1,
   les helpers de tri l'écartent par défaut. */
export function recencyScore(dateIso: string, featured: boolean, nowTs: number): number {
  const now = new Date(nowTs)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const d = new Date(dateIso)
  const articleDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const ageDays = (today - articleDay) / 86400000
  if (ageDays < 0) return -1
  let s: number
  if (ageDays <= 7) s = 4
  else if (ageDays <= 30) s = 3
  else if (ageDays <= 90) s = 2
  else s = 1
  if (featured) s += 0.5
  return s
}
