// @ts-nocheck

export const C = {
  bg: '#0b0a08',
  surface: '#121110',
  text: '#efeae0',
  dim: '#8a837a',
  muted: '#5a544c',
  line: '#2a2620',
  lineSoft: '#1a1814',
  accent: '#b8922a',
  accentBright: '#d9ad3a',
  accentSoft: '#6a5318',
  red: '#8e3a2b',
  redBright: '#b84a36',
}

export const PROVIDERS = [
  { name: 'Rosatom', country: 'Russie', swu: 27, share: 43,
    plants: 'Novouralsk · Zelenogorsk · Angarsk · Seversk' },
  { name: 'Urenco', country: 'RU · PB · DE · USA', swu: 17, share: 27,
    plants: 'Capenhurst · Almelo · Gronau · Eunice' },
  { name: 'CNNC', country: 'Chine', swu: 11, share: 17,
    plants: 'Lanzhou · Hanzhong' },
  { name: 'Orano', country: 'France', swu: 7.5, share: 12,
    plants: 'Tricastin' },
  { name: 'Centrus', country: 'États-Unis', swu: 0.1, share: 0.1,
    plants: 'Piketon' },
]

export const PALIERS = [
  { value: '0,7', label: 'Uranium naturel',
    desc: "Le seuil d'origine. 99,3 % restent inertes.", military: false, pos: 0 },
  { value: '3 à 5', label: 'LEU · civil',
    desc: "Le seuil des 440 réacteurs à eau pressurisée dans le monde.", military: false, pos: 5 },
  { value: '20', label: 'HALEU · SMR',
    desc: "Les petits réacteurs modulaires. Rosatom y règne seul.", military: false, pos: 20 },
  { value: '60', label: 'Seuil iranien', flagged: true,
    desc: "Natanz, Fordo. Hors de l'accord de Vienne depuis 2021.", military: false, pos: 60 },
  { value: '≥ 90', label: 'HEU · militaire',
    desc: "Quelques dizaines de kilos suffisent à constituer une bombe.",
    military: true, pos: 90 },
]

export const INSTALLATIONS = [
  ['Novouralsk', 'Russie', 'civil'],
  ['Zelenogorsk', 'Russie', 'civil'],
  ['Angarsk', 'Russie', 'civil'],
  ['Seversk', 'Russie', 'civil'],
  ['Capenhurst', 'Royaume-Uni', 'civil'],
  ['Almelo', 'Pays-Bas', 'civil'],
  ['Gronau', 'Allemagne', 'civil'],
  ['Eunice', 'États-Unis', 'civil'],
  ['Tricastin', 'France', 'civil'],
  ['Lanzhou', 'Chine', 'civil'],
  ['Hanzhong', 'Chine', 'civil'],
  ['Piketon', 'États-Unis', 'HALEU'],
  ['Natanz', 'Iran', 'contesté'],
  ['Fordo', 'Iran', 'contesté'],
  ['Yongbyon', 'Corée du Nord', 'militaire'],
]

// helper pour hex + alpha
export function hex(color, alpha) {
  if (color.startsWith('#')) {
    const h = color.slice(1)
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  return color
}
