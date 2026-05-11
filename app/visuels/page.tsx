import Header from '../../components/Header'
import styles from './visuels.module.css'
import Link from 'next/link'

export const metadata = {
  title: 'Atlas — Soara',
  description: 'Cartes interactives, animations, visualisations de données géopolitiques. Atlas Soara.',
}

type AtlasCard = {
  href: string
  external?: boolean
  tag: string
  tagColor: string
  title: string
  sub: string
  desc: string
  cta: string
  image: string
}

const HERO_CARD: AtlasCard = {
  href: '/visuels/uranium', external: false,
  tag: 'Géopolitique · Nucléaire',
  tagColor: '#C8A96E',
  title: 'Uranium : la cascade du monde',
  sub: 'Rosatom · Urenco · CNNC · Orano · Centrus — cinq paliers, de 0,7 % à 90 %',
  desc: "Du combustible civil à la qualité militaire. Une cartographie graphique des capacités mondiales d'enrichissement, des seuils qui font basculer dans le militaire, et de la dépendance structurelle de l'Occident à Rosatom.",
  cta: 'Explorer la cascade',
  image: '/articles/atlas/01_uranium-cascade-monde.jpg',
}

const ATLAS_CARDS: AtlasCard[] = [
  {
    href: '/grands-formats/bases-militaires', external: false,
    tag: 'Géopolitique · Carte', tagColor: '#EF9090',
    title: "L'Empire invisible",
    sub: '6 puissances · 17 sources vérifiées',
    desc: "750 bases américaines, 145 britanniques, 21 russes, 6 françaises. La carte interactive des empreintes militaires mondiales.",
    cta: 'Explorer la carte',
    image: '/articles/atlas/05_empire-invisible.jpg',
  },
  {
    href: '/visuels/medias-pouvoir', external: false,
    tag: 'Médias · Société', tagColor: 'var(--soc)',
    title: 'Médias occidentaux',
    sub: 'Reuters Institute 2025 · 48 pays · Concentration du capital',
    desc: "Désaffection du public, concentration médiatique entre les mains d'une poignée de milliardaires, émergence des newsfluenceurs.",
    cta: "Explorer l'analyse",
    image: '/articles/atlas/04_medias-occidentaux.jpg',
  },
  {
    href: '/grands-formats/climat', external: false,
    tag: 'Environnement · Dataviz', tagColor: 'var(--env)',
    title: 'La Terre a toujours changé de température.',
    sub: "Scotese 2021 · HadCRUT5 · NASA GISS",
    desc: "Deux courbes, même axe. La Terre a connu des variations de ±10°C sur des millions d'années. Notre +1,6°C est arrivé en 150 ans. Ce qui est sans précédent, c'est la vitesse.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/07_la-terre-a-toujours-change.jpg',
  },
  {
    href: '/visuels/terres-rares.html', external: true,
    tag: 'Géopolitique · Ressources', tagColor: 'var(--geo)',
    title: 'Terres rares : la guerre invisible',
    sub: 'Congo · Chili · Bolivie · Chine · Europe · États-Unis',
    desc: "Du cobalt du Katanga au raffinage de Guangdong, une visualisation animée des flux qui alimentent la transition verte — et la nouvelle géographie de la dépendance.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/08_terres-rares-guerre-invisible.jpg',
  },
  {
    href: '/visuels/naval.html', external: true,
    tag: 'Géopolitique · Carte animée', tagColor: 'var(--geo)',
    title: 'Les mers du pouvoir',
    sub: 'Routes commerciales · Détroits · Marines · Zones de tension',
    desc: "80% du commerce mondial circule sur l'eau. Qui contrôle les mers contrôle l'économie mondiale. Une carte animée en 5 chapitres.",
    cta: 'Explorer la carte',
    image: '/articles/atlas/09_les-mers-du-pouvoir.jpg',
  },
  {
    href: '/visuels/predateurs.html', external: true,
    tag: 'Géopolitique · Carte', tagColor: 'var(--geo)',
    title: 'Le Monde des Prédateurs',
    sub: "États-Unis · Russie · Chine — zones d'influence",
    desc: "Trois puissances, trois doctrines. Une carte choroplèthe mondiale cliquable qui révèle comment USA, Russie et Chine se partagent le monde.",
    cta: 'Explorer la carte',
    image: '/articles/atlas/10_le-monde-des-predateurs.jpg',
  },
  {
    href: '/visuels/eau.html', external: true,
    tag: 'Environnement · Carte', tagColor: 'var(--env)',
    title: "L'eau : la prochaine grande fracture",
    sub: "Glaciers · Barrages · Conflits hydrauliques",
    desc: "Des glaciers himalayens aux barrages africains. Comment la maîtrise de l'eau redessine les rapports de puissance — une carte animée en 5 chapitres.",
    cta: 'Explorer la carte',
    image: '/articles/atlas/11_leau-prochaine-grande-fracture.jpg',
  },
  {
    href: '/visuels/france_maritime.html', external: true,
    tag: 'Géopolitique · Carte animée', tagColor: 'var(--geo)',
    title: 'La France maritime',
    sub: 'ZEE · Pacifique · Atlantique · Océan Indien',
    desc: "La France possède la 2e zone économique exclusive mondiale — et presque personne ne le sait. Une révélation en 6 chapitres sur l'empire maritime invisible de la République.",
    cta: 'Explorer la carte',
    image: '/articles/atlas/12_la-france-maritime.jpg',
  },
  {
    href: '/visuels/cables.html', external: true,
    tag: 'Tech · Géopolitique', tagColor: 'var(--tech)',
    title: 'Câbles sous-marins',
    sub: 'Vue en coupe · Réseau de flux · Enjeux stratégiques',
    desc: "99% d'internet circule sous les océans. Qui contrôle ces câbles contrôle l'information mondiale. Vue en coupe animée et décryptage des enjeux.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/13_cables-sous-marins.jpg',
  },
  {
    href: '/visuels/techgeo.html', external: true,
    tag: 'Tech · Géopolitique', tagColor: 'var(--tech)',
    title: 'La bataille pour le sous-sol numérique',
    sub: 'Terres rares · Semi-conducteurs · Câbles',
    desc: "Des mines de Mongolie aux fabs de Taïwan — une guerre souterraine pour les matériaux qui font tourner l'économie numérique mondiale.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/14_bataille-sous-sol-numerique.jpg',
  },
]

const DATAVIZ_CARDS: AtlasCard[] = [
  {
    href: '/visuels/pauvrete-france.html', external: true,
    tag: 'Société · Économie', tagColor: 'var(--soc)',
    title: 'En 1975, un Français sur cinq.',
    sub: 'INSEE · Séries longues 1975–2023',
    desc: "Cinquante ans de pauvreté monétaire en France. En 2023, 15,4% — son niveau le plus haut depuis 1996.",
    cta: 'Explorer la visualisation',
    image: '/articles/societe-du-consentement.png',
  },
  {
    href: '/visuels/science-race.html', external: true,
    tag: 'Sciences · Géopolitique', tagColor: '#a6291c',
    title: 'Où se produit le savoir',
    sub: 'National Science Board 2025',
    desc: "En 2002, les États-Unis et l'Europe publiaient deux tiers des articles scientifiques mondiaux. En 2023, ils n'en publient plus qu'un tiers.",
    cta: 'Explorer la visualisation',
    image: '/articles/img-chine.jpg',
  },
  {
    href: '/grands-formats/inegalites', external: false,
    tag: 'Économie · Dataviz', tagColor: 'var(--eco)',
    title: 'En 1980, ils étaient tous pareils.',
    sub: 'World Inequality Database · 4 pays · 1980–2022',
    desc: "États-Unis, France, Inde, Chine — en 1980, les quatre captaient la même part de richesse pour leur top 10%. Depuis, leurs trajectoires ont radicalement divergé.",
    cta: 'Explorer la visualisation',
    image: '/grands-formats/inegalites/05-inegalites-now.jpg',
  },
]

const MOTION_CARDS = [
  {
    slug: 'cygne-noir',
    cat: 'Concept', color: 'var(--concept)',
    title: 'Le Cygne Noir',
    sub: 'Les événements que personne ne voit venir',
    desc: 'Le concept de Nassim Taleb décrypté en 13 slides — imprévisibilité, biais cognitifs, Nvidia, résilience.',
    slides: 13,
    image: '/articles/img-cygne.png',
  },
  {
    slug: 'overton',
    cat: 'Concept', color: 'var(--concept)',
    title: "La Fenêtre d'Overton",
    sub: "Comment l'impensable devient politique",
    desc: 'Visualisation du spectre des idées politiquement acceptables et des mécanismes qui le font glisser.',
    slides: 9,
    image: '/articles/img-overton.png',
  },
  {
    slug: 'ia-langage',
    cat: 'Tech', color: 'var(--tech)',
    title: 'Ce que les machines appellent comprendre',
    sub: 'IA et le langage',
    desc: 'Tokenisation, espaces sémantiques, réseaux de neurones — comment les modèles de langage fonctionnent vraiment.',
    slides: 15,
    image: '/articles/img-ia-jamais.jpg',
  },
]

function linkPropsFor(card: AtlasCard) {
  return card.external
    ? { target: '_blank', rel: 'noopener noreferrer' as const }
    : {}
}

function LeadCard({ card }: { card: AtlasCard }) {
  return (
    <a href={card.href} {...linkPropsFor(card)} className={styles.lead}>
      <div className={styles.leadImage}>
        <img src={card.image} alt="" loading="eager" />
      </div>
      <div className={styles.leadContent}>
        <span className={styles.leadEyebrow} style={{ color: card.tagColor }}>{card.tag}</span>
        <h3 className={styles.leadTitle}>{card.title}</h3>
        <p className={styles.leadSub}>{card.sub}</p>
        <p className={styles.leadDesc}>{card.desc}</p>
        <span className={styles.leadCta}>
          {card.cta}
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 5l7 7-7 7M5 12h14" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
        </span>
      </div>
    </a>
  )
}

function AtlasGridCard({ card }: { card: AtlasCard }) {
  return (
    <a href={card.href} {...linkPropsFor(card)} className={styles.atlasCard}>
      <div className={styles.atlasImage}>
        <img src={card.image} alt="" loading="lazy" />
      </div>
      <div className={styles.atlasBody}>
        <span className={styles.atlasEyebrow} style={{ color: card.tagColor }}>{card.tag}</span>
        <h3 className={styles.atlasTitle}>{card.title}</h3>
        <p className={styles.atlasSub}>{card.sub}</p>
        <p className={styles.atlasDesc}>{card.desc}</p>
        <span className={styles.atlasCta}>{card.cta} →</span>
      </div>
    </a>
  )
}

function DatavizGridCard({ card }: { card: AtlasCard }) {
  return (
    <a href={card.href} {...linkPropsFor(card)} className={styles.datavizCard}>
      <div className={styles.datavizImage} style={{ backgroundImage: `url(${card.image})` }} aria-hidden="true" />
      <div className={styles.datavizBody}>
        <span className={styles.datavizEyebrow} style={{ color: card.tagColor }}>{card.tag}</span>
        <h3 className={styles.datavizTitle}>{card.title}</h3>
        <p className={styles.datavizDesc}>{card.desc}</p>
        <span className={styles.datavizCta}>{card.cta} →</span>
      </div>
    </a>
  )
}

export default function VisuelsPage() {
  return (
    <>
      <Header activeNav="concept" />

      {/* ═══ HERO ═══ */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLabel}>Atlas</div>
          <h1 className={styles.heroTitle}>
            Les idées qui se comprennent<br />
            <em>mieux en les voyant</em>
          </h1>
          <p className={styles.heroDesc}>
            Motions design, cartes animées, visualisations de données.
            Chaque format est conçu pour rendre visible ce que les mots seuls ne suffisent pas à expliquer.
          </p>
        </div>
        <div className={styles.heroMeta}>
          <div className={styles.heroStat}><span>11</span>cartes Atlas</div>
          <div className={styles.heroDivider}/>
          <div className={styles.heroStat}><span>20+</span>en préparation</div>
        </div>
      </div>

      <div className={styles.page}>

        {/* ═══ ATLAS ═══ */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTag} style={{color:'var(--geo)'}}>Atlas</div>
            <h2 className={styles.sectionTitle}>Cartes &amp; Animations immersives</h2>
            <p className={styles.sectionDesc}>Des animations plein écran pensées pour les sujets qui demandent de l'espace — géopolitique, géographie, data.</p>
          </div>

          <LeadCard card={HERO_CARD} />

          <div className={styles.atlasGrid}>
            {ATLAS_CARDS.map((card) => (
              <AtlasGridCard key={card.href} card={card} />
            ))}
          </div>
        </section>

        {/* ═══ VISUALISATIONS DATA ═══ */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTag} style={{color:'var(--eco)'}}>Visualisations</div>
            <h2 className={styles.sectionTitle}>Données &amp; séries longues</h2>
            <p className={styles.sectionDesc}>Quand le récit vit dans la courbe : visualisations interactives à partir de jeux de données vérifiés.</p>
          </div>
          <div className={styles.datavizGrid}>
            {DATAVIZ_CARDS.map((card) => (
              <DatavizGridCard key={card.href} card={card} />
            ))}
          </div>
        </section>

        {/* ═══ TRILOGIE DOLLAR ═══ */}
        <section className={styles.trilogie}>
          <div className={styles.trilogieBanner}>
            <img
              src="/articles/atlas/15_empire-du-dollar.jpg"
              alt=""
              className={styles.trilogieBannerImg}
              loading="lazy"
            />
            <div className={styles.trilogieBannerInner}>
              <div className={styles.trilogieEyebrow}>Trilogie · Économie</div>
              <h2 className={styles.trilogieTitle}>L&apos;Empire du dollar</h2>
              <p className={styles.trilogieSub}>Bretton Woods · Pétrodollar · Sanctions · BRICS</p>
              <p className={styles.trilogieDesc}>
                Comment une monnaie nationale est devenue l&apos;étalon de l&apos;économie mondiale —
                et pourquoi son règne pourrait finir.
              </p>
            </div>
          </div>
          <div className={styles.trilogieGrid}>
            {[
              {slug:'dollar1',n:'I',title:'La naissance d\'un empire',desc:'De Bretton Woods au pétrodollar — comment le dollar a pris le trône de la livre sterling.',slides:8},
              {slug:'dollar2',n:'II',title:'L\'arme financière',desc:'SWIFT, sanctions, gel d\'avoirs — le dollar comme instrument de puissance géopolitique.',slides:7},
              {slug:'dollar3',n:'III',title:'Le crépuscule ?',desc:'Dédollarisation, BRICS, yuan — la fin du monopole absolu est-elle en marche ?',slides:7},
            ].map((item) => (
              <a
                key={item.slug}
                href={`/visuels/${item.slug}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.acteCard}
              >
                <div className={styles.acteN}>{item.n}</div>
                <h3 className={styles.acteTitle}>{item.title}</h3>
                <p className={styles.acteDesc}>{item.desc}</p>
                <div className={styles.acteMeta}>
                  <span className={styles.acteSlides}>{item.slides} slides</span>
                  <span className={styles.acteCta}>Lire l&apos;acte →</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ═══ MOTIONS ═══ */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTag} style={{color:'var(--concept)'}}>Motions design</div>
            <h2 className={styles.sectionTitle}>Concepts &amp; Analyses</h2>
            <p className={styles.sectionDesc}>Des présentations animées pour décrypter les idées complexes — économie, géopolitique, technologie.</p>
          </div>
          <div className={styles.motionGrid}>
            {MOTION_CARDS.map((item) => (
              <a key={item.slug} href={`/visuels/${item.slug}.html`} target="_blank" rel="noopener noreferrer" className={styles.motionCard}>
                <div className={styles.motionAccent} style={{background:item.color}}/>
                <div className={styles.motionMedia} style={{backgroundImage: `url(${item.image})`}} aria-hidden="true" />
                <div className={styles.motionBody}>
                  <div className={styles.motionEyebrow}>
                    <span className={styles.motionCat} style={{color:item.color}}>{item.cat}</span>
                    <span className={styles.motionSlides}>{item.slides} slides</span>
                    <span className={styles.motionAvail}>Disponible</span>
                  </div>
                  <h3 className={styles.motionTitle}>{item.title}</h3>
                  <p className={styles.motionSub}>{item.sub}</p>
                  <p className={styles.motionDesc}>{item.desc}</p>
                  <span className={styles.motionCta} style={{color:item.color}}>Voir le motion →</span>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>So<em>ara</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Soara · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
