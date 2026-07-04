// Catalogue Soara TV. Liste hardcodée, clos à 6 épisodes aujourd'hui.
// Source partagée entre la home, la page /tv et la colonne droite des
// pages catégorie. Plus récent en queue (id croissant).

export type TVEpisode = {
  id: string
  title: string
  duration: string
  href: string
  thumb: string
}

export const TV_EPISODES: TVEpisode[] = [
  { id: '01', title: "L'Inde, le siècle qui vient",              duration: '1 min 19', href: '/tv?ep=01', thumb: '/tv/ep01.jpg' },
  { id: '02', title: "L'Afrique : ce qu'on ne vous a pas appris", duration: '2 min 02', href: '/tv?ep=02', thumb: '/tv/ep02.jpg' },
  { id: '03', title: "La biologie devient un logiciel",           duration: '2 min 07', href: '/tv?ep=03', thumb: '/tv/ep03.jpg' },
  { id: '04', title: "L'arme qui a failli nous tuer",             duration: '2 min 25', href: '/tv?ep=04', thumb: '/tv/ep04.jpg' },
  { id: '05', title: "8 hommes. 3,5 milliards.",                  duration: '2 min 07', href: '/tv?ep=05', thumb: '/tv/ep05.jpg' },
  { id: '06', title: "Nous sommes l'astéroïde",                   duration: '1 min 49', href: '/tv?ep=06', thumb: '/tv/ep06.jpg' },
]

// Épisode mis en avant : le plus récent par convention (dernier du tableau).
export function getLatestTVEpisode(): TVEpisode {
  return TV_EPISODES[TV_EPISODES.length - 1]
}
