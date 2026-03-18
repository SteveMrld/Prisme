import Header from '../../components/Header'
import Link from 'next/link'
import styles from './retrospective.module.css'

export const metadata = {
  title: 'Rétrospective 2025 — Prisme',
  description: 'Les douze mois qui ont changé le monde. Retour analytique sur 2025.',
}

const mois = [
  {
    m: 'Janvier', slug: 'jan',
    titre: 'DeepSeek efface 593 Mds de Nvidia en une séance',
    desc: 'Un modèle chinois entraîné sous contraintes surpasse GPT-4. Le mythe de la suprématie américaine en IA prend un coup historique. Les marchés paniquent. La géopolitique technologique bascule.',
    cat: 'tech', catLabel: 'Technologie',
    article: 'semico',
    stat: { num: '593', unit: 'Mds $', label: 'de capitalisation Nvidia effacés en une séance' },
  },
  {
    m: 'Février', slug: 'fev',
    titre: 'Les semi-conducteurs deviennent une arme d\'État',
    desc: 'Washington resserre les contrôles à l\'export sur les puces avancées. Pékin accélère son plan d\'autonomie. TSMC reste seul au centre du monde numérique.',
    cat: 'geo', catLabel: 'Géopolitique',
    article: 'semico',
    stat: { num: '90%', unit: '', label: 'des puces avancées mondiales fabriquées dans une seule île' },
  },
  {
    m: 'Mars', slug: 'mars',
    titre: 'L\'Arctique s\'ouvre, les tensions montent',
    desc: 'Fonte record de la banquise. De nouvelles routes commerciales s\'ouvrent. Russie, Canada et États-Unis repositionnent leurs forces militaires dans la région.',
    cat: 'env', catLabel: 'Environnement',
    article: 'arctique',
    stat: { num: '4×', unit: '', label: 'plus vite que la moyenne mondiale : la fonte en Arctique' },
  },
  {
    m: 'Avril', slug: 'avr',
    titre: 'La bataille pour les terres rares s\'intensifie',
    desc: 'La Chine contrôle 90% du raffinage des terres rares mondiales. Washington cherche des alternatives. L\'Afrique devient le nouveau terrain de jeu géopolitique.',
    cat: 'geo', catLabel: 'Géopolitique',
    article: 'techgeo',
    stat: { num: '60%', unit: '', label: 'de l\'extraction mondiale de terres rares contrôlée par Pékin' },
  },
  {
    m: 'Mai', slug: 'mai',
    titre: 'L\'eau : première crise géopolitique de l\'été',
    desc: 'Les négociations sur le barrage de la Renaissance éthiopienne s\'enlisent. L\'Égypte pose ses lignes rouges. Le bassin du Nil, première zone de friction hydrique mondiale.',
    cat: 'env', catLabel: 'Environnement',
    article: 'eau',
    stat: { num: '4 Mds', unit: '', label: 'de personnes subissent une pénurie d\'eau au moins un mois par an' },
  },
  {
    m: 'Juin', slug: 'juin',
    titre: 'Le Sahel tourne définitivement le dos à la France',
    desc: 'Mali, Burkina, Niger consolident leur rupture avec Paris. Les troupes françaises achèvent leur retrait. La présence russe et chinoise s\'installe durablement.',
    cat: 'geo', catLabel: 'Géopolitique',
    article: 'afrique',
    stat: { num: '30%', unit: '', label: 'des réserves minérales mondiales sur le continent africain' },
  },
  {
    m: 'Juillet', slug: 'juil',
    titre: 'Canicule record en Europe du Sud',
    desc: 'Troisième année consécutive de sécheresse extrême. Les réserves hydriques espagnoles et italiennes tombent sous 30% de capacité. La PAC agricole est remise en question.',
    cat: 'env', catLabel: 'Environnement',
    article: 'eau',
    stat: { num: '47°C', unit: '', label: 'record de température enregistré en Sicile en juillet 2025' },
  },
  {
    m: 'Août', slug: 'aout',
    titre: 'Taïwan : les exercices militaires chinois atteignent un nouveau seuil',
    desc: 'Pékin franchit la ligne médiane du détroit lors de manœuvres d\'une ampleur inédite. Washington envoie un groupe aéronaval. Le monde retient son souffle.',
    cat: 'geo', catLabel: 'Géopolitique',
    article: 'taiwan',
    stat: { num: '10 600', unit: 'Mds $', label: 'coût estimé d\'un conflit dans le détroit de Taïwan la 1ère année' },
  },
  {
    m: 'Septembre', slug: 'sep',
    titre: 'BlackRock dépasse les 11 000 Mds sous gestion',
    desc: 'La concentration du capital atteint un niveau sans précédent dans l\'histoire du capitalisme. Trois fonds gèrent plus que le PIB de la Chine.',
    cat: 'eco', catLabel: 'Économie',
    article: 'blackrock',
    stat: { num: '28 000', unit: 'Mds $', label: 'gérés par BlackRock, Vanguard et State Street réunis' },
  },
  {
    m: 'Octobre', slug: 'oct',
    titre: 'L\'IA générative s\'installe dans les rédactions',
    desc: 'Licenciements massifs dans la presse. Débat sur l\'authenticité journalistique. Ce que la technologie fait à l\'écriture humaine et à la vérité.',
    cat: 'culture', catLabel: 'Culture',
    article: 'ia_ecriture',
    stat: { num: '40%', unit: '', label: 'des emplois mondiaux exposés à l\'IA générative selon le FMI' },
  },
  {
    m: 'Novembre', slug: 'nov',
    titre: 'Elon Musk entre à la Maison-Blanche',
    desc: 'DOGE, coupes budgétaires massives, restructuration de l\'État fédéral. La trajectoire d\'un entrepreneur devenu acteur politique mondial atteint son apogée.',
    cat: 'soc', catLabel: 'Société',
    article: 'musk',
    stat: { num: '6', unit: '', label: 'entreprises majeures dirigées simultanément par Elon Musk en 2025' },
  },
  {
    m: 'Décembre', slug: 'dec',
    titre: 'L\'opération Venezuela — retour de la doctrine Monroe',
    desc: 'Les États-Unis capturent Maduro sans mandat international, sans vote du Congrès. Le droit international recule. L\'ordre mondial post-1945 s\'effondre un peu plus.',
    cat: 'geo', catLabel: 'Géopolitique',
    article: 'venezuela',
    stat: { num: '90%', unit: '', label: 'de la cocaïne US transite par le Mexique — pas le Venezuela' },
  },
]

const catColors: Record<string, string> = {
  geo: 'var(--geo)', eco: 'var(--eco)', tech: 'var(--tech)',
  env: 'var(--env)', soc: 'var(--soc)', culture: 'var(--culture)',
}

export default function RetrospectivePage() {
  return (
    <>
      <Header />

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Rétrospective</span>
          <h1 className={styles.title}>2025 — L'année <em>des ruptures</em></h1>
          <p className={styles.subtitle}>
            Douze mois. Douze moments qui ont reconfiguré le monde.
            Retour analytique sur une année de basculements.
          </p>
        </div>
        <div className={styles.heroYear}>2025</div>
      </div>

      <div className={styles.timeline}>
        {mois.map((item, i) => (
          <div key={item.slug} className={styles.item}>
            <div className={styles.itemMeta}>
              <div className={styles.itemNum}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className={styles.itemMois}>{item.m}</div>
              <div className={styles.itemAccent} style={{ background: catColors[item.cat] }} />
            </div>

            <div className={styles.itemBody}>
              <div className={styles.itemCat} style={{ color: catColors[item.cat] }}>
                {item.catLabel}
              </div>
              <h2 className={styles.itemTitre}>{item.titre}</h2>
              <p className={styles.itemDesc}>{item.desc}</p>

              <div className={styles.itemStat}>
                <span className={styles.statNum}>{item.stat.num}</span>
                {item.stat.unit && <span className={styles.statUnit}>{item.stat.unit}</span>}
                <span className={styles.statLabel}>{item.stat.label}</span>
              </div>
            </div>

            <div className={styles.itemAction}>
              <Link href={`/articles/${item.article}`} className={styles.itemCta}>
                Lire l'analyse →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Pris<em>me</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Prisme · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
