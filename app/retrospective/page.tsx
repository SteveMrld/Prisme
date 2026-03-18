import Header from '../../components/Header'
import Link from 'next/link'
import articlesData from '../../lib/articles.json'
import styles from './retrospective.module.css'

export const metadata = {
  title: 'Rétrospective 2025 — Prisme',
  description: 'Les analyses qui ont compté. Retour sur une année de bouleversements géopolitiques, technologiques et économiques.',
}

const temps = [
  {
    mois: 'Janvier 2025',
    titre: 'DeepSeek efface 593 Mds de Nvidia',
    desc: 'Un modèle chinois entraîné avec des contraintes matérielles sévères surpasse GPT-4. Le mythe de la suprématie américaine en IA prend un coup.',
    slug: 'semico',
    cat: 'tech',
  },
  {
    mois: 'Février 2025',
    titre: 'Les semi-conducteurs deviennent une arme d\'État',
    desc: 'Washington resserre les contrôles à l\'export. Pékin accélère. TSMC reste seul au centre du monde.',
    slug: 'semico',
    cat: 'geo',
  },
  {
    mois: 'Mars 2025',
    titre: 'L\'Arctique s\'ouvre, les tensions montent',
    desc: 'La fonte record ouvre de nouvelles routes commerciales et militaires. Russie, Canada, États-Unis repositionnent leurs forces.',
    slug: 'arctique',
    cat: 'env',
  },
  {
    mois: 'Juin 2025',
    titre: 'Le Sahel tourne le dos à la France',
    desc: 'Mali, Burkina, Niger consolident leur rupture avec Paris. La présence russe et chinoise s\'installe.',
    slug: 'afrique',
    cat: 'geo',
  },
  {
    mois: 'Septembre 2025',
    titre: 'BlackRock dépasse les 11 000 Mds sous gestion',
    desc: 'La concentration du capital atteint un niveau sans précédent. Trois fonds gèrent plus que le PIB de la Chine.',
    slug: 'blackrock',
    cat: 'eco',
  },
  {
    mois: 'Novembre 2025',
    titre: 'La crise de l\'eau au Maghreb devient structurelle',
    desc: 'Quatrième année consécutive de sécheresse. Les gouvernements commencent à parler de migration climatique forcée.',
    slug: 'eau',
    cat: 'env',
  },
  {
    mois: 'Décembre 2025',
    titre: 'L\'IA générative s\'installe dans les rédactions',
    desc: 'Licenciements, restructurations, débats sur l\'authenticité. Ce que la technologie fait à l\'écriture humaine.',
    slug: 'ia_ecriture',
    cat: 'culture',
  },
]

const catColors: Record<string, string> = {
  geo: 'var(--geo)', eco: 'var(--eco)', tech: 'var(--tech)',
  env: 'var(--env)', soc: 'var(--soc)', culture: 'var(--culture)',
}

const catLabels: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
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
            Les analyses qui ont compté. Retour sur une année de bouleversements
            géopolitiques, technologiques et économiques.
          </p>
        </div>
        <div className={styles.heroYear}>2025</div>
      </div>

      <div className={styles.timeline}>
        {temps.map((item, i) => (
          <Link key={i} href={`/articles/${item.slug}`} className={styles.item}>
            <div className={styles.itemLeft}>
              <div className={styles.itemMois}>{item.mois}</div>
              <div className={styles.itemLine}>
                <div className={styles.itemDot} style={{ background: catColors[item.cat] }} />
              </div>
            </div>
            <div className={styles.itemRight}>
              <div className={styles.itemCat} style={{ color: catColors[item.cat] }}>
                {catLabels[item.cat]}
              </div>
              <h2 className={styles.itemTitre}>{item.titre}</h2>
              <p className={styles.itemDesc}>{item.desc}</p>
              <span className={styles.itemCta}>Lire l'analyse →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.articles}>
        <div className={styles.articlesLabel}>Toutes les analyses de 2025</div>
        <div className={styles.articlesGrid}>
          {(articlesData as any[]).slice(0, 12).map(a => (
            <Link key={a.slug} href={`/articles/${a.slug}`} className={styles.card}>
              {a.image && (
                <div className={styles.cardImg}>
                  <img src={a.image} alt={a.title} />
                </div>
              )}
              <div className={styles.cardBody}>
                <span className={styles.cardCat} style={{ color: catColors[a.category] }}>
                  {catLabels[a.category] || a.category}
                </span>
                <div className={styles.cardTitle}
                  dangerouslySetInnerHTML={{ __html: a.title.replace(/\n/g, ' ') }}
                />
                <span className={styles.cardTime}>{a.readTime} min →</span>
              </div>
            </Link>
          ))}
        </div>
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
