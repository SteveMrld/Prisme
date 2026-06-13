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
