// Douze mois de 2025, source partagée entre /retrospective et la colonne
// droite des pages catégorie. Chaque entrée : marqueur de mois, slug court,
// catégorie canonique, libellé catégorie affiché, slug d'article associé,
// titre, accroche, statistique en chiffre + unité + label, et le couple
// chartType/chartData qui pilote la mini-dataviz côté client.
//
// chartData est polymorphique (selon chartType), on garde un type souple.

export type RetroChartType =
  | 'bar' | 'donut' | 'line' | 'horizbar' | 'dotgrid'
  | 'area' | 'thermo' | 'gauge' | 'bubble' | 'radial'

export type RetroMonth = {
  m: string
  slug: string
  cat: 'geo' | 'eco' | 'tech' | 'env' | 'soc' | 'culture'
  catLabel: string
  article: string
  titre: string
  desc: string
  stat: { num: string; unit: string; label: string }
  chartType: RetroChartType
  chartData: any
  chartLabel: string
}

export const MOIS: RetroMonth[] = [
  {
    m: 'Janvier', slug: 'jan', cat: 'tech', catLabel: 'Technologie', article: 'semico',
    titre: 'DeepSeek efface 593 Mds de Nvidia en une séance',
    desc: 'Un modèle chinois entraîné sous contraintes surpasse GPT-4 à une fraction du coût. Le mythe de la suprématie américaine en IA prend un coup historique. Les marchés paniquent, Wall Street réévalue tout. La géopolitique technologique ne sera plus jamais la même.',
    stat: { num: '593', unit: 'Mds $', label: 'de capitalisation Nvidia effacés en une séance' },
    chartType: 'bar',
    chartData: [
      { label: 'Jan', value: 3200 },
      { label: 'Crash', value: 1800 },
      { label: 'Fév', value: 2100 },
      { label: 'Mars', value: 2400 },
    ],
    chartLabel: 'Capitalisation Nvidia (Mds $)'
  },
  {
    m: 'Février', slug: 'fev', cat: 'geo', catLabel: 'Géopolitique', article: 'semico',
    titre: 'Les semi-conducteurs deviennent une arme d\'État',
    desc: 'Washington resserre les contrôles à l\'export sur les puces avancées. TSMC reste seul au centre du monde numérique.',
    stat: { num: '90', unit: '%', label: 'des puces avancées mondiales dans une seule île' },
    chartType: 'donut',
    chartData: { pct: 90, label: 'TSMC' },
    chartLabel: 'Part TSMC dans les puces avancées'
  },
  {
    m: 'Mars', slug: 'mars', cat: 'env', catLabel: 'Environnement', article: 'arctique',
    titre: 'L\'Arctique s\'ouvre, les tensions montent',
    desc: 'Fonte record de la banquise. De nouvelles routes commerciales s\'ouvrent. Russie, Canada et États-Unis repositionnent leurs forces.',
    stat: { num: '4', unit: '×', label: 'plus vite que la moyenne mondiale : la fonte en Arctique' },
    chartType: 'line',
    chartData: [100, 94, 87, 79, 72, 68, 61, 57, 53, 48, 44, 40],
    chartLabel: 'Surface banquise Arctique 2014–2025 (base 100)'
  },
  {
    m: 'Avril', slug: 'avr', cat: 'geo', catLabel: 'Géopolitique', article: 'techgeo',
    titre: 'La bataille pour les terres rares s\'intensifie',
    desc: 'La Chine contrôle 90% du raffinage mondial. L\'Afrique devient le nouveau terrain de jeu géopolitique.',
    stat: { num: '60', unit: '%', label: 'de l\'extraction mondiale de terres rares par Pékin' },
    chartType: 'horizbar',
    chartData: [
      { label: 'Chine', value: 60 },
      { label: 'USA', value: 12 },
      { label: 'Australie', value: 10 },
      { label: 'Autres', value: 18 },
    ],
    chartLabel: 'Production terres rares (%)'
  },
  {
    m: 'Mai', slug: 'mai', cat: 'env', catLabel: 'Environnement', article: 'eau',
    titre: 'L\'eau : première crise géopolitique de l\'été',
    desc: 'Les négociations sur le barrage éthiopien s\'enlisent. L\'Égypte pose ses lignes rouges. Le Nil, première zone de friction hydrique.',
    stat: { num: '4', unit: 'Mds', label: 'de personnes en pénurie d\'eau au moins un mois par an' },
    chartType: 'dotgrid',
    chartData: { total: 8, highlighted: 4 },
    chartLabel: '4 Mds / 8 Mds d\'humains en stress hydrique'
  },
  {
    m: 'Juin', slug: 'juin', cat: 'geo', catLabel: 'Géopolitique', article: 'afrique',
    titre: 'Le Sahel tourne définitivement le dos à la France',
    desc: 'Mali, Burkina, Niger consolident leur rupture avec Paris. La présence russe et chinoise s\'installe durablement.',
    stat: { num: '30', unit: '%', label: 'des réserves minérales mondiales en Afrique' },
    chartType: 'area',
    chartData: [1, 2, 3, 5, 6, 7, 8, 8, 9, 9, 9, 10],
    chartLabel: 'Intensité rupture France-Sahel 2013–2025'
  },
  {
    m: 'Juillet', slug: 'juil', cat: 'env', catLabel: 'Environnement', article: 'eau',
    titre: 'Canicule record en Europe du Sud',
    desc: "47°C en Sicile. 45°C à Séville. Troisième été consécutif de sécheresse extrême. Les réserves hydriques espagnoles et italiennes tombent sous 30% de capacité. Des centaines de milliers d'hectares agricoles brûlés. La PAC, pensée pour l'Europe d'avant le réchauffement, est fondamentalement inadaptée.",
    stat: { num: '47', unit: '°C', label: 'record de température en Sicile en juillet 2025' },
    chartType: 'thermo',
    chartData: { value: 47, max: 55 },
    chartLabel: 'Record de chaleur · Sicile'
  },
  {
    m: 'Août', slug: 'aout', cat: 'geo', catLabel: 'Géopolitique', article: 'taiwan',
    titre: 'Taïwan : les exercices militaires chinois franchissent un seuil',
    desc: "Pour la première fois depuis 1996, Pékin franchit la ligne médiane du détroit lors de manœuvres d'une ampleur inédite. Washington envoie le porte-avions Reagan. Taipei active son niveau d'alerte maximal. Un conflit dans le détroit paralyserait 40% du commerce mondial et 90% des puces avancées. Le monde retient son souffle.",
    stat: { num: '10 600', unit: 'Mds $', label: 'coût d\'un conflit dans le détroit la 1ère année' },
    chartType: 'gauge',
    chartData: 9,
    chartLabel: 'Niveau de tension · Détroit de Taïwan'
  },
  {
    m: 'Septembre', slug: 'sep', cat: 'eco', catLabel: 'Économie', article: 'blackrock',
    titre: 'BlackRock dépasse les 11 000 Mds sous gestion',
    desc: "BlackRock, Vanguard, State Street : trois fonds américains gèrent collectivement 28 000 milliards de dollars, plus que le PIB de la Chine. Ils sont actionnaires de presque toutes les grandes entreprises mondiales simultanément. Cette concentration du capital n'a aucun précédent dans l'histoire du capitalisme. Qui contrôle ces fonds contrôle l'économie mondiale.",
    stat: { num: '28 000', unit: 'Mds $', label: 'gérés par BlackRock, Vanguard et State Street réunis' },
    chartType: 'bubble',
    chartData: [
      { label: 'BlackRock', value: 11 },
      { label: 'Vanguard', value: 9 },
      { label: 'St.Street', value: 4.5 },
      { label: 'Fidelity', value: 4.2 },
    ],
    chartLabel: 'AUM comparé (milliers Mds $)'
  },
  {
    m: 'Octobre', slug: 'oct', cat: 'culture', catLabel: 'Culture', article: 'ia_ecriture',
    titre: 'L\'IA générative s\'installe dans les rédactions',
    desc: 'Licenciements massifs dans la presse. Ce que la technologie fait à l\'écriture humaine et à la vérité.',
    stat: { num: '40', unit: '%', label: 'des emplois mondiaux exposés à l\'IA générative (FMI)' },
    chartType: 'line',
    chartData: [2, 5, 9, 18, 30, 45, 62, 78, 89, 95, 110, 130],
    chartLabel: 'Croissance usage IA rédactions (base 100 = jan 2023)'
  },
  {
    m: 'Novembre', slug: 'nov', cat: 'soc', catLabel: 'Société', article: 'musk',
    titre: 'Elon Musk entre à la Maison-Blanche',
    desc: 'DOGE, coupes budgétaires massives, restructuration de l\'État fédéral. Un entrepreneur devient acteur politique mondial.',
    stat: { num: '6', unit: '', label: 'entreprises majeures dirigées simultanément par Elon Musk' },
    chartType: 'radial',
    chartData: [
      { label: 'Tesla', value: 780 },
      { label: 'SpaceX', value: 350 },
      { label: 'xAI', value: 50 },
      { label: 'X / Neuralink', value: 30 },
    ],
    chartLabel: 'Empire Musk · 6 entités'
  },
  {
    m: 'Décembre', slug: 'dec', cat: 'geo', catLabel: 'Géopolitique', article: 'venezuela',
    titre: 'L\'opération Venezuela, retour de la doctrine Monroe',
    desc: 'Les États-Unis capturent Maduro sans mandat international. Le droit international recule. L\'ordre mondial post-1945 s\'effondre.',
    stat: { num: '90', unit: '%', label: 'de la cocaïne US transite par le Mexique, pas le Venezuela' },
    chartType: 'line',
    chartData: [2, 2, 3, 3, 4, 5, 5, 6, 7, 8, 9, 10],
    chartLabel: 'Érosion droit international 2014–2025'
  },
]

// Mois mis en avant : dernier du tableau (Décembre).
export function getLatestMonth(): RetroMonth { return MOIS[MOIS.length - 1] }
