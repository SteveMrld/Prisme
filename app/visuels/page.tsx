import Header from '../../components/Header'
import AdSlot from '../../components/AdSlot'
import styles from './visuels.module.css'
import Link from 'next/link'
import { Reveal } from './Reveal'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Atlas',
  description: 'Cartes interactives, animations, visualisations de données géopolitiques. Atlas Soara.',
  alternates: { canonical: 'https://soara.fr/visuels' },
}

type AtlasCard = {
  href: string
  external?: boolean
  tag: string
  tagColor: string
  format: string
  title: string
  sub: string
  desc: string
  cta: string
  image: string
  alt: string
}

const HERO_CARD: AtlasCard = {
  href: '/visuels/uranium', external: false,
  tag: 'Géopolitique · Nucléaire',
  tagColor: '#C8A96E',
  format: 'Dataviz',
  title: 'Uranium : la cascade du monde',
  sub: 'Rosatom · Urenco · CNNC · Orano · Centrus · cinq paliers, de 0,7 % à 90 %',
  desc: "Du combustible civil à la qualité militaire. Une cartographie graphique des capacités mondiales d'enrichissement, des seuils qui font basculer dans le militaire, et de la dépendance structurelle de l'Occident à Rosatom.",
  cta: 'Explorer la cascade',
  image: '/articles/atlas/01_uranium-cascade-monde.jpg',
  alt: "Centrifugeuses d'enrichissement d'uranium, couloir industriel",
}

const ATLAS_CARDS: AtlasCard[] = [
  {
    href: '/grands-formats/bases-militaires', external: false,
    tag: 'Géopolitique · Carte', tagColor: '#EF9090',
    format: 'Carte interactive',
    title: "L'Empire invisible",
    sub: '6 puissances · 17 sources vérifiées',
    desc: "750 bases américaines, 145 britanniques, 21 russes, 6 françaises. La carte interactive des empreintes militaires mondiales.",
    cta: 'Explorer la carte',
    image: '/articles/atlas/05_empire-invisible.jpg',
    alt: "Vue aérienne d'une base militaire, le Pentagone",
  },
  {
    href: '/visuels/medias-pouvoir', external: false,
    tag: 'Médias · Société', tagColor: 'var(--soc)',
    format: 'Dataviz',
    title: 'Médias occidentaux',
    sub: 'Reuters Institute 2025 · 48 pays · Concentration du capital',
    desc: "Désaffection du public, concentration médiatique entre les mains d'une poignée de milliardaires, émergence des newsfluenceurs.",
    cta: "Explorer l'analyse",
    image: '/articles/atlas/04_medias-occidentaux.jpg',
    alt: "Salle de contrôle multi-écrans, surveillance médiatique",
  },
  {
    href: '/grands-formats/climat', external: false,
    tag: 'Environnement · Dataviz', tagColor: 'var(--env)',
    format: 'Dataviz',
    title: 'La Terre a toujours changé de température.',
    sub: "Scotese 2021 · HadCRUT5 · NASA GISS",
    desc: "Deux courbes, même axe. La Terre a connu des variations de ±10°C sur des millions d'années. Notre +1,6°C est arrivé en 150 ans. Ce qui est sans précédent, c'est la vitesse.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/07_la-terre-a-toujours-change.jpg',
    alt: "Glacier et fumées industrielles, réchauffement climatique",
  },
  {
    href: '/visuels/terres-rares', external: false,
    tag: 'Géopolitique · Ressources', tagColor: 'var(--geo)',
    format: 'Carte animée',
    title: 'Terres rares : la guerre invisible',
    sub: 'Congo · Chili · Bolivie · Chine · Europe · États-Unis',
    desc: "Du cobalt du Katanga au raffinage de Guangdong, une visualisation animée des flux qui alimentent la transition verte, et la nouvelle géographie de la dépendance.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/08_terres-rares-guerre-invisible.jpg',
    alt: "Mine à ciel ouvert d'extraction de terres rares",
  },
  {
    href: '/visuels/naval', external: false,
    tag: 'Géopolitique · Carte animée', tagColor: 'var(--geo)',
    format: 'Carte animée',
    title: 'Les mers du pouvoir',
    sub: 'Routes commerciales · Détroits · Marines · Zones de tension',
    desc: "80% du commerce mondial circule sur l'eau. Qui contrôle les mers contrôle l'économie mondiale. Une carte animée en 5 chapitres.",
    cta: 'Explorer la carte',
    image: '/articles/atlas/09_les-mers-du-pouvoir.jpg',
    alt: "Porte-conteneurs au coucher du soleil, commerce maritime",
  },
  {
    href: '/visuels/predateurs', external: false,
    tag: 'Géopolitique · Carte interactive', tagColor: 'var(--geo)',
    format: 'Carte interactive',
    title: 'Le Monde des Prédateurs',
    sub: "États-Unis · Russie · Chine · zones d'influence",
    desc: "Trois empires, trois doctrines d'expansion. Le retour assumé des sphères d'influence.",
    cta: 'Explorer la carte',
    image: '/articles/img-predateurs.jpg',
    alt: "Oiseau de proie au-dessus de Manhattan, prédation géopolitique",
  },
  {
    href: '/visuels/eau', external: false,
    tag: 'Environnement · Carte', tagColor: 'var(--env)',
    format: 'Carte animée',
    title: "L'eau : la prochaine grande fracture",
    sub: "Glaciers · Barrages · Conflits hydrauliques",
    desc: "Des glaciers himalayens aux barrages africains. Comment la maîtrise de l'eau redessine les rapports de puissance. Une carte animée en 5 chapitres.",
    cta: 'Explorer la carte',
    image: '/articles/atlas/11_leau-prochaine-grande-fracture.jpg',
    alt: "Barrage hydraulique, ressources en eau",
  },
  {
    href: '/visuels/france_maritime', external: false,
    tag: 'Géopolitique · Carte animée', tagColor: 'var(--geo)',
    format: 'Carte animée',
    title: 'La France maritime',
    sub: 'ZEE · Pacifique · Atlantique · Océan Indien',
    desc: "La France possède la 2e zone économique exclusive mondiale, et presque personne ne le sait. Une révélation en 6 chapitres sur l'empire maritime invisible de la République.",
    cta: 'Explorer la carte',
    image: '/articles/atlas/12_la-france-maritime.jpg',
    alt: "Atoll tropical, territoires maritimes français",
  },
  {
    href: '/visuels/cables', external: false,
    tag: 'Tech · Géopolitique', tagColor: 'var(--tech)',
    format: 'Animation',
    title: 'Câbles sous-marins',
    sub: 'Vue en coupe · Réseau de flux · Enjeux stratégiques',
    desc: "99% d'internet circule sous les océans. Qui contrôle ces câbles contrôle l'information mondiale. Vue en coupe animée et décryptage des enjeux.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/13_cables-sous-marins.jpg',
    alt: "Câble fibre optique sous-marin",
  },
  {
    href: '/visuels/techgeo', external: false,
    tag: 'Tech · Géopolitique', tagColor: 'var(--tech)',
    format: 'Animation',
    title: 'La bataille pour le sous-sol numérique',
    sub: 'Terres rares · Semi-conducteurs · Câbles',
    desc: "Des mines de Mongolie aux fabs de Taïwan, une guerre souterraine pour les matériaux qui font tourner l'économie numérique mondiale.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/14_bataille-sous-sol-numerique.jpg',
    alt: "Excavatrice minière, extraction de matières premières",
  },
]

const DATAVIZ_CARDS: AtlasCard[] = [
  {
    href: '/visuels/pauvrete-france', external: false,
    tag: 'Société · Économie', tagColor: 'var(--soc)',
    format: 'Dataviz',
    title: 'En 1975, un Français sur cinq.',
    sub: 'INSEE · Séries longues 1975–2023',
    desc: "Cinquante ans de pauvreté monétaire en France. En 2023, 15,4%, son niveau le plus haut depuis 1996.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/02_en-1975-un-francais-sur-cinq.jpg',
    alt: "Homme de dos devant des immeubles soviétiques",
  },
  {
    href: '/visuels/science-race', external: false,
    tag: 'Sciences · Géopolitique', tagColor: '#a6291c',
    format: 'Dataviz',
    title: 'Où se produit le savoir',
    sub: 'National Science Board 2025',
    desc: "En 2002, les États-Unis et l'Europe publiaient deux tiers des articles scientifiques mondiaux. En 2023, ils n'en publient plus qu'un tiers.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/03_ou-se-produit-le-savoir.jpg',
    alt: "Scientifiques en laboratoire avec vue sur Tokyo",
  },
  {
    href: '/grands-formats/inegalites', external: false,
    tag: 'Économie · Dataviz', tagColor: 'var(--eco)',
    format: 'Dataviz',
    title: 'En 1980, ils étaient tous pareils.',
    sub: 'World Inequality Database · 4 pays · 1980–2022',
    desc: "États-Unis, France, Inde, Chine : en 1980, les quatre captaient la même part de richesse pour leur top 10%. Depuis, leurs trajectoires ont radicalement divergé.",
    cta: 'Explorer la visualisation',
    image: '/articles/atlas/06_en-1980-ils-etaient-tous-pareils.jpg',
    alt: "Skyline urbain et bidonvilles, contraste des inégalités",
  },
]

const MOTION_CARDS = [
  {
    slug: 'cygne-noir',
    cat: 'Concept', color: 'var(--concept)',
    format: 'Animation',
    title: 'Le Cygne Noir',
    sub: 'Les événements que personne ne voit venir',
    desc: 'Le concept de Nassim Taleb décrypté en 13 slides : imprévisibilité, biais cognitifs, Nvidia, résilience.',
    slides: 13,
    image: '/articles/img-cygne.png',
  },
  {
    slug: 'overton',
    cat: 'Concept', color: 'var(--concept)',
    format: 'Animation',
    title: "La Fenêtre d'Overton",
    sub: "Comment l'impensable devient politique",
    desc: 'Visualisation du spectre des idées politiquement acceptables et des mécanismes qui le font glisser.',
    slides: 9,
    image: '/articles/img-overton.png',
  },
  {
    slug: 'ia-langage',
    cat: 'Tech', color: 'var(--tech)',
    format: 'Animation',
    title: 'Ce que les machines appellent comprendre',
    sub: 'IA et le langage',
    desc: 'Tokenisation, espaces sémantiques, réseaux de neurones, comment les modèles de langage fonctionnent vraiment.',
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
    <Link href={card.href} className={styles.lead}>
      <div className={styles.leadImage}>
        <img src={card.image} alt={card.alt} loading="eager" />
      </div>
      <div className={styles.leadContent}>
        <div className={styles.leadMeta}>
          <span className={styles.leadEyebrow} style={{ color: card.tagColor }}>{card.tag}</span>
          <span className={`${styles.formatChip} ${styles.formatChipDark}`}>{card.format}</span>
        </div>
        <h3 className={styles.leadTitle}>{card.title}</h3>
        <p className={styles.leadSub}>{card.sub}</p>
        <p className={styles.leadDesc}>{card.desc}</p>
        <span className={styles.leadCta}>
          {card.cta}
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 5l7 7-7 7M5 12h14" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
        </span>
      </div>
    </Link>
  )
}

function AtlasGridCard({ card }: { card: AtlasCard }) {
  return (
    <Link href={card.href} className={styles.atlasCard}>
      <div className={styles.atlasImage}>
        <img src={card.image} alt={card.alt} loading="lazy" />
      </div>
      <div className={styles.atlasBody}>
        <div className={styles.atlasMeta}>
          <span className={styles.atlasEyebrow} style={{ color: card.tagColor }}>{card.tag}</span>
          <span className={styles.formatChip}>{card.format}</span>
        </div>
        <h3 className={styles.atlasTitle}>{card.title}</h3>
        <p className={styles.atlasSub}>{card.sub}</p>
        <p className={styles.atlasDesc}>{card.desc}</p>
        <span className={styles.atlasCta}>{card.cta} →</span>
      </div>
    </Link>
  )
}

function DatavizLeadCard({ card }: { card: AtlasCard }) {
  return (
    <Link href={card.href} className={styles.datavizLead}>
      <div className={styles.datavizLeadImage} style={{ backgroundImage: `url(${card.image})` }} aria-hidden="true" />
      <div className={styles.datavizLeadContent}>
        <div className={styles.datavizMeta}>
          <span className={styles.datavizEyebrow} style={{ color: card.tagColor }}>{card.tag}</span>
          <span className={styles.formatChip}>{card.format}</span>
        </div>
        <h3 className={styles.datavizLeadTitle}>{card.title}</h3>
        <p className={styles.datavizLeadDesc}>{card.desc}</p>
        <span className={styles.datavizLeadCta}>{card.cta} →</span>
      </div>
    </Link>
  )
}

function MotionLeadCard({ item }: { item: typeof MOTION_CARDS[number] }) {
  return (
    <Link href={`/visuels/${item.slug}`} className={styles.motionLead}>
      <div className={styles.motionLeadAccent} style={{background: item.color}} />
      <div className={styles.motionLeadImage} style={{ backgroundImage: `url(${item.image})` }} aria-hidden="true" />
      <div className={styles.motionLeadContent}>
        <div className={styles.motionEyebrow}>
          <span className={styles.motionCat} style={{color: item.color}}>{item.cat}</span>
          <span className={styles.formatChip}>{item.format}</span>
          <span className={styles.motionSlides}>{item.slides} slides</span>
          <span className={styles.motionAvail}>Disponible</span>
        </div>
        <h3 className={styles.motionLeadTitle}>{item.title}</h3>
        <p className={styles.motionLeadSub}>{item.sub}</p>
        <p className={styles.motionLeadDesc}>{item.desc}</p>
        <span className={styles.motionLeadCta} style={{color: item.color}}>Voir le motion →</span>
      </div>
    </Link>
  )
}

function DatavizGridCard({ card }: { card: AtlasCard }) {
  return (
    <Link href={card.href} className={styles.datavizCard}>
      <div className={styles.datavizImage} style={{ backgroundImage: `url(${card.image})` }} aria-hidden="true" />
      <div className={styles.datavizBody}>
        <div className={styles.datavizMeta}>
          <span className={styles.datavizEyebrow} style={{ color: card.tagColor }}>{card.tag}</span>
          <span className={styles.formatChip}>{card.format}</span>
        </div>
        <h3 className={styles.datavizTitle}>{card.title}</h3>
        <p className={styles.datavizDesc}>{card.desc}</p>
        <span className={styles.datavizCta}>{card.cta} →</span>
      </div>
    </Link>
  )
}

export default async function VisuelsPage() {
  return (
    <>
      <Header activeNav="concept" />

      <div className={styles.atlasIntro}>
        <div className={styles.atlasIntroEyebrow}>Atlas Soara</div>
        <h1 className={styles.atlasIntroTitle}>L&apos;index visuel</h1>
        <p className={styles.atlasIntroChapeau}>
          Toutes les visualisations de Soara rassemblées en un seul lieu.
          Cartes interactives, motion designs, trilogies narratives, séries de données : l&apos;index complet de l&apos;analyse Soara.
        </p>
        <div className={styles.atlasIntroStats}>11 visualisations publiées · 20+ en préparation</div>
      </div>

      <div className={styles.page}>

        {/* ═══ ATLAS ═══ */}
        <section className={styles.section}>
          <Reveal>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTag} style={{color:'var(--geo)'}}>Atlas</div>
              <h2 className={styles.sectionTitle}>
                <svg className={styles.sectionPicto} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Cartes &amp; Animations immersives
              </h2>
              <p className={styles.sectionDesc}>Des cartes interactives et des animations plein écran. Pour explorer les sujets qui demandent de l'espace, du temps, et un regard qui se déplace.</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <LeadCard card={HERO_CARD} />
          </Reveal>

          <div className={styles.atlasGrid}>
            {ATLAS_CARDS.map((card, i) => (
              <Reveal key={card.href} delay={(i % 3) * 80} className={styles.atlasGridItem}>
                <AtlasGridCard card={card} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ VISUALISATIONS DATA ═══ */}
        <section className={styles.section}>
          <Reveal>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTag} style={{color:'var(--eco)'}}>Visualisations</div>
              <h2 className={styles.sectionTitle}>
                <svg className={styles.sectionPicto} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 3v18h18"/>
                  <path d="M8 17v-5"/>
                  <path d="M13 17V8"/>
                  <path d="M18 17v-3"/>
                </svg>
                Données &amp; séries longues
              </h2>
              <p className={styles.sectionDesc}>Des chiffres mis en récit. Visualisations construites à partir de jeux de données vérifiés et publiquement disponibles.</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <DatavizLeadCard card={DATAVIZ_CARDS[0]} />
          </Reveal>
          <div className={styles.datavizGrid}>
            {DATAVIZ_CARDS.slice(1).map((card, i) => (
              <Reveal key={card.href} delay={(i % 2) * 100} className={styles.datavizGridItem}>
                <DatavizGridCard card={card} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ TRILOGIE DOLLAR ═══ */}
        <section className={styles.trilogie}>
          <Reveal>
            <div className={styles.trilogiePreamble}>
              <svg className={styles.sectionPicto} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              <p>Une histoire en trois actes. Lue chapitre par chapitre, comme un livre éditorial sérialisé.</p>
            </div>
          </Reveal>
          <Reveal>
            <Link href="/visuels/dollar1" className={styles.trilogieBanner} aria-label="Lancer l'animation de l'Acte I, La naissance d'un empire">
              <img
                src="/articles/atlas/15_empire-du-dollar.jpg"
                alt="Billet de dollar et graphiques financiers"
                className={styles.trilogieBannerImg}
                loading="lazy"
              />
              <div className={styles.trilogieBannerInner}>
                <div className={styles.trilogieEyebrow}>Trilogie · Économie</div>
                <h2 className={styles.trilogieTitle}>L&apos;Empire du dollar</h2>
                <p className={styles.trilogieSub}>Bretton Woods · Pétrodollar · Sanctions · BRICS</p>
                <p className={styles.trilogieDesc}>
                  Comment une monnaie nationale est devenue l&apos;étalon de l&apos;économie mondiale.
                  Et pourquoi son règne pourrait finir.
                </p>
                <span className={styles.trilogieBannerCta}>Lancer l&apos;animation →</span>
              </div>
            </Link>
          </Reveal>
          <div className={styles.trilogieGrid}>
            {[
              {slug:'dollar1',n:'I',title:'La naissance d\'un empire',desc:'De Bretton Woods au pétrodollar, comment le dollar a pris le trône de la livre sterling.',slides:8},
              {slug:'dollar2',n:'II',title:'L\'arme financière',desc:'SWIFT, sanctions, gel d\'avoirs : le dollar comme instrument de puissance géopolitique.',slides:7},
              {slug:'dollar3',n:'III',title:'Le crépuscule ?',desc:'Dédollarisation, BRICS, yuan : la fin du monopole absolu est-elle en marche ?',slides:7},
            ].map((item, i) => (
              <Reveal key={item.slug} delay={i * 120} className={styles.acteRevealWrap}>
                <Link
                  href={`/visuels/${item.slug}`}
                  className={styles.acteCard}
                >
                  <span className={`${styles.formatChip} ${styles.formatChipTrilogie} ${styles.acteChip}`}>Trilogie {item.n}</span>
                  <div className={styles.acteN}>{item.n}</div>
                  <h3 className={styles.acteTitle}>{item.title}</h3>
                  <p className={styles.acteDesc}>{item.desc}</p>
                  <div className={styles.acteMeta}>
                    <span className={styles.acteSlides}>{item.slides} slides</span>
                    <span className={styles.acteCta}>Lancer l&apos;animation →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ MOTIONS ═══ */}
        <section className={styles.section}>
          <Reveal>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTag} style={{color:'var(--concept)'}}>Motions design</div>
              <h2 className={styles.sectionTitle}>
                <svg className={styles.sectionPicto} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5a6 6 0 0 0-12 0c0 1.3.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
                  <path d="M9 18h6"/>
                  <path d="M10 22h4"/>
                </svg>
                Concepts &amp; Analyses
              </h2>
              <p className={styles.sectionDesc}>Des présentations animées en motion design. Pour décrypter les idées qui demandent une mise en scène plutôt qu'un paragraphe.</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <MotionLeadCard item={MOTION_CARDS[0]} />
          </Reveal>
          <div className={styles.motionGrid}>
            {MOTION_CARDS.slice(1).map((item, i) => (
              <Reveal key={item.slug} delay={(i % 2) * 100} className={styles.motionRevealWrap}>
                <Link href={`/visuels/${item.slug}`} className={styles.motionCard}>
                  <div className={styles.motionAccent} style={{background:item.color}}/>
                  <div className={styles.motionMedia} style={{backgroundImage: `url(${item.image})`}} aria-hidden="true" />
                  <div className={styles.motionBody}>
                    <div className={styles.motionEyebrow}>
                      <span className={styles.motionCat} style={{color:item.color}}>{item.cat}</span>
                      <span className={styles.formatChip}>{item.format}</span>
                      <span className={styles.motionSlides}>{item.slides} slides</span>
                      <span className={styles.motionAvail}>Disponible</span>
                    </div>
                    <h3 className={styles.motionTitle}>{item.title}</h3>
                    <p className={styles.motionSub}>{item.sub}</p>
                    <p className={styles.motionDesc}>{item.desc}</p>
                    <span className={styles.motionCta} style={{color:item.color}}>Voir le motion →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ AD SLOT ATLAS · bandeau paysage fin de page ═══ */}
        <AdSlot slotId="atlas" variant="banner" />

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
