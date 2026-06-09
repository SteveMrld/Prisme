// Palette « toile reliée » de la Bibliothèque, ordonnée du clair au sombre :
// [fond, texte, filet or]. Les livres y sont répartis en dégradé selon leur
// position, quel que soit leur nombre : l'étagère reste harmonieuse à mesure
// qu'elle se remplit. Partagé entre la page /bibliotheque et le bloc home.

export type Tone = string[]

export const PALETTE: Tone[] = [
  ['#E9E0CD', '#2A2620', '#8C6F2E'],
  ['#D9C7A3', '#3A3220', '#8C6F2E'],
  ['#C4B59A', '#2E2A22', '#6F5A26'],
  ['#C29A4E', '#2C2410', '#6E5418'],
  ['#B97C5C', '#FBF2E8', '#EAC98E'],
  ['#8E4A46', '#F4E4DC', '#E1B074'],
  ['#6E4A5C', '#F2E2EC', '#C8A96E'],
  ['#8A9A82', '#23271F', '#5E5A26'],
  ['#5E807C', '#ECF1EE', '#C8A96E'],
  ['#54657E', '#E9EEF4', '#C8A96E'],
  ['#23232A', '#ECE6D6', '#C8A96E'],
]

export function toneFor(index: number, total: number): Tone {
  if (total <= 1) return PALETTE[PALETTE.length - 1]
  const slot = Math.round((index / (total - 1)) * (PALETTE.length - 1))
  return PALETTE[slot]
}
