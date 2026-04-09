import Header from '../../components/Header'
import { AnimatedItem, AnimatedStat, HeroAnimated, ScrollProgress, MonthChart } from './RetroClient'
import Link from 'next/link'
import styles from './retrospective.module.css'

export const metadata = {
  title: 'Rétrospective 2025 — Soara',
  description: 'Les douze mois qui ont changé le monde. Retour analytique sur 2025.',
}

const catColors: Record<string, string> = {
  geo: 'var(--geo)', eco: 'var(--eco)', tech: 'var(--tech)',
  env: 'var(--env)', soc: 'var(--soc)', culture: 'var(--culture)',
}

const mois = [
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
    chartLabel: 'Record de chaleur — Sicile'
  },
  {
    m: 'Août', slug: 'aout', cat: 'geo', catLabel: 'Géopolitique', article: 'taiwan',
    titre: 'Taïwan : les exercices militaires chinois franchissent un seuil',
    desc: "Pour la première fois depuis 1996, Pékin franchit la ligne médiane du détroit lors de manœuvres d'une ampleur inédite. Washington envoie le porte-avions Reagan. Taipei active son niveau d'alerte maximal. Un conflit dans le détroit paralyserait 40% du commerce mondial et 90% des puces avancées. Le monde retient son souffle.",
    stat: { num: '10 600', unit: 'Mds $', label: 'coût d\'un conflit dans le détroit la 1ère année' },
    chartType: 'gauge',
    chartData: 9,
    chartLabel: 'Niveau de tension — Détroit de Taïwan'
  },
  {
    m: 'Septembre', slug: 'sep', cat: 'eco', catLabel: 'Économie', article: 'blackrock',
    titre: 'BlackRock dépasse les 11 000 Mds sous gestion',
    desc: "BlackRock, Vanguard, State Street : trois fonds américains gèrent collectivement 28 000 milliards de dollars — plus que le PIB de la Chine. Ils sont actionnaires de presque toutes les grandes entreprises mondiales simultanément. Cette concentration du capital n'a aucun précédent dans l'histoire du capitalisme. Qui contrôle ces fonds contrôle l'économie mondiale.",
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
    chartLabel: 'Empire Musk — 6 entités'
  },
  {
    m: 'Décembre', slug: 'dec', cat: 'geo', catLabel: 'Géopolitique', article: 'venezuela',
    titre: 'L\'opération Venezuela — retour de la doctrine Monroe',
    desc: 'Les États-Unis capturent Maduro sans mandat international. Le droit international recule. L\'ordre mondial post-1945 s\'effondre.',
    stat: { num: '90', unit: '%', label: 'de la cocaïne US transite par le Mexique, pas le Venezuela' },
    chartType: 'line',
    chartData: [2, 2, 3, 3, 4, 5, 5, 6, 7, 8, 9, 10],
    chartLabel: 'Érosion droit international 2014–2025'
  },
]

export default function RetrospectivePage() {
  return (
    <>
      <ScrollProgress />
      <Header />

      <HeroAnimated>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>Rétrospective</span>
            <h1 className={styles.title}>2025 — L'année <em>des ruptures</em></h1>
            <p className={styles.subtitle}>
              Douze mois. Douze moments qui ont reconfiguré le monde.
              Retour analytique sur une année de basculements.
            </p>
          </div>
          <div className={styles.heroStats}>
            {[
              { n: '12', l: 'ruptures majeures' },
              { n: '5', l: 'continents touchés' },
              { n: '3', l: 'crises simultanées' },
            ].map((s, i) => (
              <div key={i} className={styles.heroStatItem}>
                <span className={styles.heroStatNum}>{s.n}</span>
                <span className={styles.heroStatLabel}>{s.l}</span>
              </div>
            ))}
          </div>
          <div className={styles.heroYear}>2025</div>
        </div>
      </HeroAnimated>

      {/* BANDE CATÉGORIES */}
      <div className={styles.catBand}>
        {[
          { cat:'geo', label:'Géopolitique', n: mois.filter(m=>m.cat==='geo').length },
          { cat:'env', label:'Environnement', n: mois.filter(m=>m.cat==='env').length },
          { cat:'tech', label:'Tech', n: mois.filter(m=>m.cat==='tech').length },
          { cat:'eco', label:'Économie', n: mois.filter(m=>m.cat==='eco').length },
          { cat:'soc', label:'Société', n: mois.filter(m=>m.cat==='soc').length },
          { cat:'culture', label:'Culture', n: mois.filter(m=>m.cat==='culture').length },
        ].map(({ cat, label, n }) => (
          <div key={cat} className={styles.catPill} style={{ borderColor: catColors[cat] }}>
            <span style={{ color: catColors[cat], fontWeight: 700 }}>{n}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.timeline}>
        {mois.map((item, i) => (
          <AnimatedItem key={item.slug} index={i}>
            <div className={styles.item}>
              {/* BARRE COULEUR GAUCHE */}
              <div className={styles.itemBar} style={{ background: catColors[item.cat] }} />

              {/* MÉTA */}
              <div className={styles.itemMeta}>
                <div className={styles.itemNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.itemMois}>{item.m}</div>
                <div className={styles.itemCat} style={{ color: catColors[item.cat] }}>{item.catLabel}</div>
              </div>

              {/* CORPS */}
              <div className={styles.itemBody}>
                <h2 className={styles.itemTitre}>{item.titre}</h2>
                <p className={styles.itemDesc}>{item.desc}</p>
                <div className={styles.itemStat}>
                  <span className={styles.statNum}>
                    <AnimatedStat num={item.stat.num} label={item.stat.label} />
                    {item.stat.unit && <span className={styles.statUnit}> {item.stat.unit}</span>}
                  </span>
                  <span className={styles.statLabel}>{item.stat.label}</span>
                </div>
                <Link href={`/articles/${item.article}`} className={styles.itemCta}>
                  Lire l'analyse →
                </Link>
              </div>

              {/* VISUALISATION */}
              <div className={styles.itemViz}>
                <div className={styles.vizLabel}>{item.chartLabel}</div>
                <MonthChart
                  cat={item.cat}
                  chartType={item.chartType}
                  chartData={item.chartData}
                  color={catColors[item.cat].replace('var(--geo)', '#1A3E6B')
                    .replace('var(--eco)', '#B86A1A')
                    .replace('var(--tech)', '#4A2080')
                    .replace('var(--env)', '#2D6B4A')
                    .replace('var(--soc)', '#7A2D2D')
                    .replace('var(--culture)', '#6B1A3A')}
                />
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>So<em>ara</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Soara · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
