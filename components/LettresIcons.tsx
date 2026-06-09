import { SVGProps } from 'react'

// Trois pictos dessinés sur mesure pour la section /lettres.
// Trait fin (1.4 px), monochrome currentColor, viewBox 24 carré.
// Conçus pour être lisibles entre 14 et 28 px.

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

// 1. Fleuron typographique : feuille amande avec nervure centrale.
//    Ornement des beaux livres, abstrait et littéraire.
export function FleuronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 4 C7 7, 5 12, 8 18 C10 19, 14 19, 16 18 C19 12, 17 7, 12 4 Z" />
      <path d="M12 5 L12 18" />
    </svg>
  )
}

// 2. Cachet de cire : cercle à liseré fin avec un S stylisé au centre,
//    clin d'oeil à Soara et à la tradition épistolaire.
export function CachetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M14.6 9.6 C14 8.6, 13.1 8.1, 12 8.1 C10.6 8.1, 9.6 8.9, 9.6 10 C9.6 11, 10.4 11.5, 12 12 C13.6 12.5, 14.4 13.1, 14.4 14.1 C14.4 15.2, 13.4 15.9, 12 15.9 C10.9 15.9, 10 15.4, 9.5 14.4" />
    </svg>
  )
}

// 3. Bec de plume : pointe de plume avec fente centrale et trou d'évent.
//    Référence directe à l'écriture, sobre et identifiable.
export function PlumeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M8 5 L8 14 L12 20 L16 14 L16 5 Z" />
      <path d="M12 11 L12 20" />
      <circle cx="12" cy="9" r="1" />
    </svg>
  )
}
