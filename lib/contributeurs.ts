// Source unique des contributeurs de Soara. Utilisée par la page d'index
// (app/contributeurs/page.tsx) et par les pages individuelles
// (app/contributeurs/[slug]/page.tsx). Le champ `name` doit correspondre
// exactement au champ `author` de articles.json (accents compris) pour que
// la liste des textes de chaque contributeur se constitue sans mismatch.

export type Contributeur = {
  slug: string
  name: string
  role: string
  bio: string
  domaines: string[]
  portrait: string | null
  linkedin: string | null
}

export const CONTRIBUTEURS: Contributeur[] = [
  {
    slug: 'cage',
    name: 'Agathe Cagé',
    role: 'Contributrice · Science politique & Démocratie',
    bio: 'Docteure en science politique (Paris I), diplômée de l\'ENA. Directrice d\'études à l\'École normale supérieure, autrice de "Respect !" (Éditions des Équateurs). Ses travaux portent sur les inégalités, la mobilité sociale et les recompositions démocratiques.',
    domaines: ['Politique', 'Société', 'Démocratie'],
    portrait: '/portraits/cage.jpg',
    linkedin: 'https://www.linkedin.com/in/cag%C3%A9-agathe-2b1bb344/',
  },
  {
    slug: 'desroses',
    name: 'Jade Desroses',
    role: 'Contributrice · Culture & Société',
    bio: 'Professeure de lettres et essayiste. Elle explore les liens entre littérature, mémoire et politique, avec une attention particulière aux voix longtemps marginalisées du canon occidental.',
    domaines: ['Culture', 'Société', 'Portraits'],
    portrait: '/portraits/desroses.jpg',
    linkedin: 'https://www.linkedin.com/in/jade-desroses-0670b1336/',
  },
  {
    slug: 'jailani',
    name: 'Fatemeh Jailani',
    role: 'Contributrice · Europe & Politiques publiques',
    bio: 'Née en Californie de parents afghans, diplômée de Sciences Po. Ses analyses portent sur les politiques européennes, les migrations et les recompositions identitaires dans les démocraties libérales.',
    domaines: ['Europe', 'Politique', 'Société'],
    portrait: '/portraits/jailani.jpg',
    linkedin: 'https://www.linkedin.com/in/fatemeh-jailani-37814127/',
  },
  {
    slug: 'moreno',
    name: 'Élisabeth Moreno',
    role: 'Contributrice · Leadership & Égalité',
    bio: 'Née au Cap-Vert, ancienne PDG de Lenovo France et DG Afrique de Hewlett-Packard, Ministre déléguée à l\'Égalité femmes-hommes (2020–2022). Fondatrice de LEIA Partners et présidente de Ring Capital.',
    domaines: ['Leadership', 'Égalité', 'Technologie', 'Afrique'],
    portrait: '/portraits/moreno.jpg',
    linkedin: 'https://www.linkedin.com/in/elisabeth-moreno-745362248/',
  },
  {
    slug: 'ouzounian',
    name: 'Éric Ouzounian',
    role: 'Contributeur · Médias & Culture',
    bio: 'Journaliste, auteur, réalisateur et enseignant à l\'ISCPA, Eric Ouzounian est spécialiste des questions culturelles, d\'énergie, de géopolitique et de Défense.',
    domaines: ['Culture', 'Médias', 'Technologie'],
    portrait: '/portraits/ouzounian.jpg',
    linkedin: null,
  },
  {
    slug: 'vincent',
    name: 'Majda Vincent',
    role: 'Contributrice · Management & Organisations',
    bio: 'Diplômée de l\'IAE Paris Sorbonne, ancienne DRH de Sodexo France, elle est aujourd\'hui DRH monde du groupe Adecco. Elle analyse les transformations du travail et les enjeux humains des grandes organisations.',
    domaines: ['Économie', 'Société', 'Management'],
    portrait: '/portraits/vincent.jpg',
    linkedin: 'https://www.linkedin.com/in/majda-vincent-59641442/',
  },
]

export function contributeurBySlug(slug: string): Contributeur | undefined {
  return CONTRIBUTEURS.find((c) => c.slug === slug)
}
