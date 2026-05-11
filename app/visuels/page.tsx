import Header from '../../components/Header'
import styles from './visuels.module.css'
import Link from 'next/link'

export const metadata = {
  title: 'Atlas — Soara',
  description: 'Cartes interactives, animations, visualisations de données géopolitiques. Atlas Soara.',
}

type FeatCard = {
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

const FEAT_CARDS: FeatCard[] = [
  {
    href: '/visuels/uranium', external: false,
    tag: 'Géopolitique · Nucléaire · Visualisation', tagColor: '#b8922a',
    title: 'Uranium : la cascade du monde',
    sub: 'Rosatom · Urenco · CNNC · Orano · Centrus · Cinq paliers de 0,7 % à 90 %',
    desc: "De 0,7 % à 90 %, du combustible civil à la qualité militaire. Une cartographie graphique des capacités mondiales d'enrichissement, des seuils qui font basculer dans le militaire, et de la dépendance structurelle de l'Occident à Rosatom.",
    cta: 'Explorer la cascade',
    image: '/articles/img-fiscalite.jpg',
  },
  {
    href: '/visuels/pauvrete-france.html', external: true,
    tag: 'Société · Économie · Dataviz interactive', tagColor: 'var(--soc)',
    title: 'En 1975, un Français sur cinq.',
    sub: 'INSEE · Séries longues 1975–2023 · Taux et chiffres absolus',
    desc: "Cinquante ans de pauvreté monétaire en France. Une courbe qui descend, se stabilise, puis remonte. En 2023, 15,4% — son niveau le plus haut depuis 1996. Une visualisation en deux temps : taux et nombre de personnes concernées.",
    cta: 'Explorer la visualisation',
    image: '/articles/societe-du-consentement.png',
  },
  {
    href: '/visuels/science-race.html', external: true,
    tag: 'Sciences · Géopolitique · Dataviz interactive', tagColor: '#a6291c',
    title: 'Où se produit le savoir',
    sub: 'Chine · États-Unis · Europe · Inde · National Science Board 2025',
    desc: "En 2002, les États-Unis et l'Europe publiaient deux tiers des articles scientifiques mondiaux. En 2023, ils n'en publient plus qu'un tiers. Comment, année après année, le centre de gravité de la science a basculé.",
    cta: 'Explorer la visualisation',
    image: '/articles/img-chine.jpg',
  },
  {
    href: '/visuels/medias-pouvoir', external: false,
    tag: 'Médias · Société · Dataviz interactive', tagColor: 'var(--soc)',
    title: 'Médias occidentaux : chiffres, pouvoir et nouveaux acteurs',
    sub: 'Reuters Institute 2025 · 48 pays · Newsfluenceurs · Concentration du capital',
    desc: "Désaffection du public, concentration du pouvoir médiatique entre les mains d'une poignée de milliardaires, émergence des newsfluenceurs. Une analyse en deux parties fondée sur les données les plus récentes disponibles.",
    cta: "Explorer l'analyse",
    image: '/articles/img-medias.jpg',
  },
  {
    href: '/grands-formats/bases-militaires', external: false,
    tag: 'Géopolitique · Carte interactive', tagColor: '#EF9090',
    title: "L'Empire invisible",
    sub: '6 puissances · 17 sources vérifiées · Zoom & filtres',
    desc: "750 bases américaines, 145 britanniques, 21 russes, 6 françaises. La carte interactive des empreintes militaires mondiales — avec les données les plus récentes disponibles.",
    cta: 'Explorer la carte',
    image: '/articles/img-empires.jpg',
  },
  {
    href: '/grands-formats/inegalites', external: false,
    tag: 'Économie · Dataviz interactive', tagColor: 'var(--eco)',
    title: 'En 1980, ils étaient tous pareils.',
    sub: 'World Inequality Database · Chancel & Piketty · 4 pays · 1980–2022',
    desc: "États-Unis, France, Inde, Chine — en 1980, les quatre pays captaient la même part de richesse pour leur top 10%. Depuis, leurs trajectoires ont radicalement divergé. Une visualisation animée sur 40 ans d'inégalités mondiales.",
    cta: 'Explorer la visualisation',
    image: '/grands-formats/inegalites/05-inegalites-now.jpg',
  },
  {
    href: '/grands-formats/climat', external: false,
    tag: 'Environnement · Dataviz interactive', tagColor: 'var(--env)',
    title: 'La Terre a toujours changé de température.',
    sub: "Scotese 2021 · HadCRUT5 · NASA GISS · 500 millions d'années de données",
    desc: "Deux courbes, même axe. La Terre a connu des variations de ±10°C sur des millions d'années. Notre +1,6°C est arrivé en 150 ans. Ce qui est sans précédent, c'est la vitesse.",
    cta: 'Explorer la visualisation',
    image: '/grands-formats/climat/05-glace-glaciaire.jpg',
  },
  {
    href: '/visuels/terres-rares.html', external: true,
    tag: 'Géopolitique · Ressources · Animation', tagColor: 'var(--geo)',
    title: 'Terres rares : la guerre invisible',
    sub: 'Congo · Chili · Bolivie · Chine · Europe · États-Unis',
    desc: "Du cobalt du Katanga au raffinage de Guangdong, une visualisation animée des flux qui alimentent la transition verte — et la nouvelle géographie de la dépendance mondiale.",
    cta: 'Explorer la visualisation',
    image: '/articles/terres-rares.jpg',
  },
  {
    href: '/visuels/naval.html', external: true,
    tag: 'Géopolitique · Carte animée', tagColor: 'var(--geo)',
    title: 'Les mers du pouvoir',
    sub: 'Routes commerciales · Détroits · Marines militaires · Zones de tension',
    desc: "80% du commerce mondial circule sur l'eau. Qui contrôle les mers contrôle l'économie mondiale. Une carte animée en 5 chapitres qui révèle les enjeux invisibles du monde maritime.",
    cta: 'Explorer la carte',
    image: '/articles/img-arctique.jpg',
  },
  {
    href: '/visuels/predateurs.html', external: true,
    tag: 'Géopolitique · Carte interactive', tagColor: 'var(--geo)',
    title: 'Le Monde des Prédateurs',
    sub: "États-Unis · Russie · Chine — zones d'influence mondiales",
    desc: "Trois puissances, trois doctrines. Une carte choroplèthe mondiale cliquable et interactive qui révèle comment USA, Russie et Chine se partagent le monde — avec un focus sur l'Arctique et les points de friction.",
    cta: 'Explorer la carte',
    image: '/articles/img-predateurs.jpg',
  },
  {
    href: '/visuels/eau.html', external: true,
    tag: 'Environnement · Géopolitique · Carte animée', tagColor: 'var(--env)',
    title: "L'eau : la prochaine grande fracture",
    sub: "Glaciers · Barrages · Conflits · Géopolitique de l'eau",
    desc: "Des glaciers himalayens aux barrages africains. Comment la maîtrise de l'eau redessine les rapports de puissance — une carte animée en 5 chapitres.",
    cta: 'Explorer la carte',
    image: '/articles/img-eau.png',
  },
  {
    href: '/visuels/france_maritime.html', external: true,
    tag: 'Géopolitique · Carte animée', tagColor: 'var(--geo)',
    title: 'La France maritime',
    sub: 'ZEE · Pacifique · Atlantique · Océan Indien',
    desc: "La France possède la 2e zone économique exclusive mondiale — et presque personne ne le sait. Une révélation en 6 chapitres sur l'empire maritime invisible de la République.",
    cta: 'Explorer la carte',
    image: '/articles/img-france-maritime.jpg',
  },
  {
    href: '/visuels/cables.html', external: true,
    tag: 'Tech · Géopolitique · Visualisation', tagColor: 'var(--tech)',
    title: 'Câbles sous-marins',
    sub: 'Vue en coupe · Réseau de flux · Enjeux stratégiques',
    desc: "99% d'internet circule sous les océans. Qui contrôle ces câbles contrôle l'information mondiale. Vue en coupe animée, réseau de flux et décryptage des enjeux géopolitiques.",
    cta: 'Explorer la visualisation',
    image: '/articles/img-reseaux.png',
  },
  {
    href: '/visuels/techgeo.html', external: true,
    tag: 'Tech · Géopolitique · Visualisation', tagColor: 'var(--tech)',
    title: 'La bataille pour le sous-sol numérique',
    sub: 'Terres rares · Semi-conducteurs · Câbles sous-marins',
    desc: "Des mines de Mongolie aux fabs de Taïwan — une guerre souterraine pour les matériaux qui font tourner l'économie numérique mondiale.",
    cta: 'Explorer la visualisation',
    image: '/articles/img-techgeo.jpg',
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

function FeatCard({ card }: { card: FeatCard }) {
  const linkProps = card.external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <a href={card.href} {...linkProps} className={styles.featCard} style={{marginTop:'1px'}}>
      <div className={styles.featMedia} style={{backgroundImage: `url(${card.image})`}} aria-hidden="true" />
      <div className={styles.featBody}>
        <div className={styles.featEyebrow}>
          <span className={styles.featTag} style={{color: card.tagColor}}>{card.tag}</span>
          <span className={styles.featBadge}>Disponible</span>
        </div>
        <h3 className={styles.featTitle}>{card.title}</h3>
        <p className={styles.featSub}>{card.sub}</p>
        <p className={styles.featDesc}>{card.desc}</p>
        <div className={styles.featCta}>
          <span>{card.cta}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
        </div>
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
          <div className={styles.heroStat}><span>10</span>formats disponibles</div>
          <div className={styles.heroDivider}/>
          <div className={styles.heroStat}><span>20+</span>en préparation</div>
        </div>
      </div>

      <div className={styles.page}>

        {/* ═══ GRANDS FORMATS ═══ */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTag} style={{color:'var(--geo)'}}>Atlas</div>
            <h2 className={styles.sectionTitle}>Cartes &amp; Animations immersives</h2>
            <p className={styles.sectionDesc}>Des animations plein écran pensées pour les sujets qui demandent de l'espace — géopolitique, géographie, data.</p>
          </div>

          {FEAT_CARDS.map((card) => (
            <FeatCard key={card.href} card={card} />
          ))}

        </section>

        {/* ═══ TRILOGIE DOLLAR ═══ */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTag} style={{color:'var(--eco)'}}>Économie · Série en 3 parties</div>
            <h2 className={styles.sectionTitle}>Trilogie du Dollar</h2>
            <p className={styles.sectionDesc}>Comment une monnaie nationale est devenue l'étalon de l'économie mondiale — et pourquoi son règne pourrait finir.</p>
          </div>
          <div className={styles.trioGrid}>
            {[
              {slug:'dollar1',n:'I',title:'La naissance d\'un empire',desc:'De Bretton Woods au pétrodollar — comment le dollar a pris le trône de la livre sterling.',slides:8},
              {slug:'dollar2',n:'II',title:'L\'arme financière',desc:'SWIFT, sanctions, gel d\'avoirs — le dollar comme instrument de puissance géopolitique.',slides:7},
              {slug:'dollar3',n:'III',title:'Le crépuscule ?',desc:'Dédollarisation, BRICS, yuan — la fin du monopole absolu est-elle en marche ?',slides:7},
            ].map((item) => (
              <a key={item.slug} href={`/visuels/${item.slug}.html`} target="_blank" rel="noopener noreferrer" className={styles.trioCard}>
                <div className={styles.trioAccent}/>
                <div className={styles.trioBody}>
                  <div className={styles.trioN}>{item.n}</div>
                  <h3 className={styles.trioTitle}>{item.title}</h3>
                  <p className={styles.trioDesc}>{item.desc}</p>
                  <div className={styles.trioMeta}>
                    <span className={styles.trioSlides}>{item.slides} slides</span>
                    <span className={styles.trioCta}>Voir →</span>
                  </div>
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
