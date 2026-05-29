// Catalogue normalisé des items Atlas, dérivé de app/visuels/page.tsx.
// Consommé par ArticleLinkPreview pour le hover tooltip et, à terme, par
// d'autres consumers (search, home, RSS, etc.) sans dupliquer la donnée.
//
// Si tu modifies une carte dans visuels/page.tsx, mets aussi à jour ici la
// ligne correspondante (même href).

export type Visuel = {
  href: string
  title: string
  image: string
  eyebrow: string
  description: string
  format: string
}

const visuels: Visuel[] = [
  // Hero Atlas
  {
    href: '/visuels/uranium',
    title: 'Uranium : la cascade du monde',
    image: '/articles/atlas/01_uranium-cascade-monde.jpg',
    eyebrow: 'Géopolitique · Nucléaire',
    description: "Du combustible civil à la qualité militaire. Cartographie graphique des capacités mondiales d'enrichissement.",
    format: 'Dataviz',
  },
  // Cartes & Animations immersives
  {
    href: '/grands-formats/bases-militaires',
    title: "L'Empire invisible",
    image: '/articles/atlas/05_empire-invisible.jpg',
    eyebrow: 'Géopolitique · Carte interactive',
    description: '750 bases américaines, 145 britanniques, 21 russes, 6 françaises. La carte interactive des empreintes militaires mondiales.',
    format: 'Carte interactive',
  },
  {
    href: '/visuels/medias-pouvoir',
    title: 'Médias occidentaux',
    image: '/articles/atlas/04_medias-occidentaux.jpg',
    eyebrow: 'Médias · Société',
    description: "Désaffection du public, concentration médiatique entre les mains d'une poignée de milliardaires, émergence des newsfluenceurs.",
    format: 'Dataviz',
  },
  {
    href: '/grands-formats/climat',
    title: 'La Terre a toujours changé de température.',
    image: '/articles/atlas/07_la-terre-a-toujours-change.jpg',
    eyebrow: 'Environnement · Dataviz',
    description: "Deux courbes, même axe. La Terre a connu des variations de ±10°C sur des millions d'années. Notre +1,6°C est arrivé en 150 ans.",
    format: 'Dataviz',
  },
  {
    href: '/visuels/terres-rares',
    title: 'Terres rares : la guerre invisible',
    image: '/articles/atlas/08_terres-rares-guerre-invisible.jpg',
    eyebrow: 'Géopolitique · Ressources',
    description: 'Du cobalt du Katanga au raffinage de Guangdong, une visualisation animée des flux qui alimentent la transition verte.',
    format: 'Carte animée',
  },
  {
    href: '/visuels/naval',
    title: 'Les mers du pouvoir',
    image: '/articles/atlas/09_les-mers-du-pouvoir.jpg',
    eyebrow: 'Géopolitique · Carte animée',
    description: "80% du commerce mondial circule sur l'eau. Qui contrôle les mers contrôle l'économie mondiale. Carte animée en 5 chapitres.",
    format: 'Carte animée',
  },
  {
    href: '/visuels/predateurs',
    title: 'Le Monde des Prédateurs',
    image: '/articles/img-predateurs.jpg',
    eyebrow: 'Géopolitique · Carte interactive',
    description: "Trois empires, trois doctrines d'expansion. Le retour assumé des sphères d'influence.",
    format: 'Carte interactive',
  },
  {
    href: '/visuels/eau',
    title: "L'eau : la prochaine grande fracture",
    image: '/articles/atlas/11_leau-prochaine-grande-fracture.jpg',
    eyebrow: 'Environnement · Carte',
    description: "Des glaciers himalayens aux barrages africains. Comment la maîtrise de l'eau redessine les rapports de puissance.",
    format: 'Carte animée',
  },
  {
    href: '/visuels/france_maritime',
    title: 'La France maritime',
    image: '/articles/atlas/12_la-france-maritime.jpg',
    eyebrow: 'Géopolitique · Carte animée',
    description: 'La France possède la 2e zone économique exclusive mondiale, et presque personne ne le sait.',
    format: 'Carte animée',
  },
  {
    href: '/visuels/cables',
    title: 'Câbles sous-marins',
    image: '/articles/atlas/13_cables-sous-marins.jpg',
    eyebrow: 'Tech · Géopolitique',
    description: "99% d'internet circule sous les océans. Qui contrôle ces câbles contrôle l'information mondiale.",
    format: 'Animation',
  },
  {
    href: '/visuels/techgeo',
    title: 'La bataille pour le sous-sol numérique',
    image: '/articles/atlas/14_bataille-sous-sol-numerique.jpg',
    eyebrow: 'Tech · Géopolitique',
    description: "Des mines de Mongolie aux fabs de Taïwan, une guerre souterraine pour les matériaux qui font tourner l'économie numérique mondiale.",
    format: 'Animation',
  },
  // Données & séries longues
  {
    href: '/visuels/pauvrete-france',
    title: 'En 1975, un Français sur cinq.',
    image: '/articles/atlas/02_en-1975-un-francais-sur-cinq.jpg',
    eyebrow: 'Société · Économie',
    description: 'Cinquante ans de pauvreté monétaire en France. En 2023, 15,4%, son niveau le plus haut depuis 1996.',
    format: 'Dataviz',
  },
  {
    href: '/visuels/science-race',
    title: 'Où se produit le savoir',
    image: '/articles/atlas/03_ou-se-produit-le-savoir.jpg',
    eyebrow: 'Sciences · Géopolitique',
    description: "En 2002, les États-Unis et l'Europe publiaient deux tiers des articles scientifiques mondiaux. En 2023, un tiers seulement.",
    format: 'Dataviz',
  },
  {
    href: '/grands-formats/inegalites',
    title: 'En 1980, ils étaient tous pareils.',
    image: '/articles/atlas/06_en-1980-ils-etaient-tous-pareils.jpg',
    eyebrow: 'Économie · Dataviz',
    description: 'États-Unis, France, Inde, Chine : en 1980, les quatre captaient la même part de richesse pour leur top 10%.',
    format: 'Dataviz',
  },
  // Motions design
  {
    href: '/visuels/cygne-noir',
    title: 'Le Cygne Noir',
    image: '/articles/img-cygne.png',
    eyebrow: 'Concept · Motion design',
    description: 'Le concept de Nassim Taleb décrypté en 13 slides : imprévisibilité, biais cognitifs, Nvidia, résilience.',
    format: 'Animation',
  },
  {
    href: '/visuels/overton',
    title: "La Fenêtre d'Overton",
    image: '/articles/img-overton.png',
    eyebrow: 'Concept · Motion design',
    description: "Visualisation du spectre des idées politiquement acceptables et des mécanismes qui le font glisser.",
    format: 'Animation',
  },
  {
    href: '/visuels/ia-langage',
    title: 'Ce que les machines appellent comprendre',
    image: '/articles/img-ia-jamais.jpg',
    eyebrow: 'Tech · Motion design',
    description: 'Tokenisation, espaces sémantiques, réseaux de neurones, comment les modèles de langage fonctionnent vraiment.',
    format: 'Animation',
  },
  // Trilogie dollar
  {
    href: '/visuels/dollar1',
    title: "La naissance d'un empire",
    image: '/articles/atlas/15_empire-du-dollar.jpg',
    eyebrow: 'Économie · Trilogie',
    description: 'De Bretton Woods au pétrodollar, comment le dollar a pris le trône de la livre sterling.',
    format: 'Trilogie I',
  },
  {
    href: '/visuels/dollar2',
    title: "L'arme financière",
    image: '/articles/atlas/15_empire-du-dollar.jpg',
    eyebrow: 'Économie · Trilogie',
    description: "SWIFT, sanctions, gel d'avoirs : le dollar comme instrument de puissance géopolitique.",
    format: 'Trilogie II',
  },
  {
    href: '/visuels/dollar3',
    title: 'Le crépuscule ?',
    image: '/articles/atlas/15_empire-du-dollar.jpg',
    eyebrow: 'Économie · Trilogie',
    description: 'Dédollarisation, BRICS, yuan : la fin du monopole absolu est-elle en marche ?',
    format: 'Trilogie III',
  },
]

export default visuels
