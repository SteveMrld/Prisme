import Header from '../../components/Header'
import styles from './visuels.module.css'
import Link from 'next/link'

export const metadata = {
  title: 'Atlas — Soara',
  description: 'Cartes interactives, animations, visualisations de données géopolitiques. Atlas Soara.',
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

          {/* Card — Uranium : la cascade du monde */}
          <a href="/visuels/uranium" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'#b8922a'}}>Géopolitique · Nucléaire · Visualisation</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>Uranium : la cascade du monde</h3>
              <p className={styles.featSub}>Rosatom · Urenco · CNNC · Orano · Centrus · Cinq paliers de 0,7 % à 90 %</p>
              <p className={styles.featDesc}>
                De 0,7 % à 90 %, du combustible civil à la qualité militaire.
                Une cartographie graphique des capacités mondiales d'enrichissement, des seuils qui font basculer dans le militaire, et de la dépendance structurelle de l'Occident à Rosatom.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la cascade</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* Card — Pauvreté en France */}
          <a href="/visuels/pauvrete-france.html" target="_blank" rel="noopener noreferrer" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--soc)'}}>Société · Économie · Dataviz interactive</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>En 1975, un Français sur cinq.</h3>
              <p className={styles.featSub}>INSEE · Séries longues 1975–2023 · Taux et chiffres absolus</p>
              <p className={styles.featDesc}>
                Cinquante ans de pauvreté monétaire en France. Une courbe qui descend, se stabilise, puis remonte.
                En 2023, 15,4% — son niveau le plus haut depuis 1996. Une visualisation en deux temps : taux et nombre de personnes concernées.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la visualisation</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* Card — Où se produit le savoir */}
          <a href="/visuels/science-race.html" target="_blank" rel="noopener noreferrer" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'#a6291c'}}>Sciences · Géopolitique · Dataviz interactive</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>Où se produit le savoir</h3>
              <p className={styles.featSub}>Chine · États-Unis · Europe · Inde · National Science Board 2025</p>
              <p className={styles.featDesc}>
                En 2002, les États-Unis et l'Europe publiaient deux tiers des articles scientifiques mondiaux.
                En 2023, ils n'en publient plus qu'un tiers. Comment, année après année, le centre de gravité de la science a basculé.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la visualisation</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* Card — Médias : chiffres, pouvoir et nouveaux acteurs */}
          <a href="/visuels/medias-pouvoir" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--soc)'}}>Médias · Société · Dataviz interactive</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>Médias occidentaux : chiffres, pouvoir et nouveaux acteurs</h3>
              <p className={styles.featSub}>Reuters Institute 2025 · 48 pays · Newsfluenceurs · Concentration du capital</p>
              <p className={styles.featDesc}>
                Désaffection du public, concentration du pouvoir médiatique entre les mains d'une poignée de milliardaires,
                émergence des newsfluenceurs. Une analyse en deux parties fondée sur les données les plus récentes disponibles.
              </p>
              <div className={styles.featCta}>
                <span>Explorer l'analyse</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* Card — bases militaires américaines */}
          <a href="/grands-formats/bases-militaires" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'#EF9090'}}>Géopolitique · Carte interactive</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>L'Empire invisible</h3>
              <p className={styles.featSub}>6 puissances · 17 sources vérifiées · Zoom & filtres</p>
              <p className={styles.featDesc}>
                750 bases américaines, 145 britanniques, 21 russes, 6 françaises.
                La carte interactive des empreintes militaires mondiales — avec les données les plus récentes disponibles.
              </p>
            </div>
          </a>

          {/* Card — Inégalités */}
          <a href="/grands-formats/inegalites" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--eco)'}}>Économie · Dataviz interactive</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>En 1980, ils étaient tous pareils.</h3>
              <p className={styles.featSub}>World Inequality Database · Chancel &amp; Piketty · 4 pays · 1980–2022</p>
              <p className={styles.featDesc}>
                États-Unis, France, Inde, Chine — en 1980, les quatre pays captaient la même part de richesse pour leur top 10%. Depuis, leurs trajectoires ont radicalement divergé. Une visualisation animée sur 40 ans d'inégalités mondiales.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la visualisation</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* Card — Climat */}
          <a href="/grands-formats/climat" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--env)'}}>Environnement · Dataviz interactive</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>La Terre a toujours changé de température.</h3>
              <p className={styles.featSub}>Scotese 2021 · HadCRUT5 · NASA GISS · 500 millions d'années de données</p>
              <p className={styles.featDesc}>
                Deux courbes, même axe. La Terre a connu des variations de ±10°C sur des millions d'années.
                Notre +1,6°C est arrivé en 150 ans. Ce qui est sans précédent, c'est la vitesse.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la visualisation</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* Card — terres rares */}
          <a href="/visuels/terres-rares.html" target="_blank" rel="noopener noreferrer" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--geo)'}}>Géopolitique · Ressources · Animation</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>Terres rares : la guerre invisible</h3>
              <p className={styles.featSub}>Congo · Chili · Bolivie · Chine · Europe · États-Unis</p>
              <p className={styles.featDesc}>
                Du cobalt du Katanga au raffinage de Guangdong, une visualisation animée des flux qui alimentent
                la transition verte — et la nouvelle géographie de la dépendance mondiale.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la visualisation</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* Card featured — navale */}
          <a href="/visuels/naval.html" target="_blank" rel="noopener noreferrer" className={styles.featCard}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--geo)'}}>Géopolitique · Carte animée</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>Les mers du pouvoir</h3>
              <p className={styles.featSub}>Routes commerciales · Détroits · Marines militaires · Zones de tension</p>
              <p className={styles.featDesc}>
                80% du commerce mondial circule sur l'eau. Qui contrôle les mers contrôle l'économie mondiale.
                Une carte animée en 5 chapitres qui révèle les enjeux invisibles du monde maritime.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la carte</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* Prédateurs — carte interactive */}
          <a href="/visuels/predateurs.html" target="_blank" rel="noopener noreferrer" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--geo)'}}>Géopolitique · Carte interactive</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>Le Monde des Prédateurs</h3>
              <p className={styles.featSub}>États-Unis · Russie · Chine — zones d&apos;influence mondiales</p>
              <p className={styles.featDesc}>
                Trois puissances, trois doctrines. Une carte choroplèthe mondiale cliquable et interactive qui révèle comment USA, Russie et Chine se partagent le monde — avec un focus sur l&apos;Arctique et les points de friction.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la carte</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* Grand format — L'eau */}
          <a href="/visuels/eau.html" target="_blank" rel="noopener noreferrer" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--env)'}}>Environnement · Géopolitique · Carte animée</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>L&apos;eau : la prochaine grande fracture</h3>
              <p className={styles.featSub}>Glaciers · Barrages · Conflits · Géopolitique de l&apos;eau</p>
              <p className={styles.featDesc}>
                Des glaciers himalayens aux barrages africains. Comment la maîtrise de l&apos;eau
                redessine les rapports de puissance — une carte animée en 5 chapitres.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la carte</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* France maritime */}
          <a href="/visuels/france_maritime.html" target="_blank" rel="noopener noreferrer" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--geo)'}}>Géopolitique · Carte animée</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>La France maritime</h3>
              <p className={styles.featSub}>ZEE · Pacifique · Atlantique · Océan Indien</p>
              <p className={styles.featDesc}>
                La France possède la 2e zone économique exclusive mondiale — et presque personne ne le sait.
                Une révélation en 6 chapitres sur l&apos;empire maritime invisible de la République.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la carte</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          {/* Câbles sous-marins */}
          <a href="/visuels/cables.html" target="_blank" rel="noopener noreferrer" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--tech)'}}>Tech · Géopolitique · Visualisation</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>Câbles sous-marins</h3>
              <p className={styles.featSub}>Vue en coupe · Réseau de flux · Enjeux stratégiques</p>
              <p className={styles.featDesc}>
                99% d&apos;internet circule sous les océans. Qui contrôle ces câbles contrôle l&apos;information mondiale.
                Vue en coupe animée, réseau de flux et décryptage des enjeux géopolitiques.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la visualisation</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>

          <a href="/visuels/techgeo.html" target="_blank" rel="noopener noreferrer" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBody}>
              <div className={styles.featEyebrow}>
                <span className={styles.featTag} style={{color:'var(--tech)'}}>Tech · Géopolitique · Visualisation</span>
                <span className={styles.featBadge}>Disponible</span>
              </div>
              <h3 className={styles.featTitle}>La bataille pour le sous-sol numérique</h3>
              <p className={styles.featSub}>Terres rares · Semi-conducteurs · Câbles sous-marins</p>
              <p className={styles.featDesc}>
                Des mines de Mongolie aux fabs de Taïwan — une guerre souterraine pour les matériaux
                qui font tourner l&apos;économie numérique mondiale.
              </p>
              <div className={styles.featCta}>
                <span>Explorer la visualisation</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
              </div>
            </div>
          </a>


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
              {slug:'dollar3',n:'III',title:'Le crépuscule\u00a0?',desc:'Dédollarisation, BRICS, yuan — la fin du monopole absolu est-elle en marche\u00a0?',slides:7},
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
            {[
              {
                slug:'cygne-noir',
                cat:'Concept',color:'var(--concept)',
                title:'Le Cygne Noir',
                sub:'Les événements que personne ne voit venir',
                desc:'Le concept de Nassim Taleb décrypté en 13 slides — imprévisibilité, biais cognitifs, Nvidia, résilience.',
                slides:13,
              },
              {
                slug:'overton',
                cat:'Concept',color:'var(--concept)',
                title:'La Fenêtre d\'Overton',
                sub:'Comment l\'impensable devient politique',
                desc:'Visualisation du spectre des idées politiquement acceptables et des mécanismes qui le font glisser.',
                slides:9,
              },
              {
                slug:'ia-langage',
                cat:'Tech',color:'var(--tech)',
                title:'Ce que les machines appellent comprendre',
                sub:'IA et le langage',
                desc:'Tokenisation, espaces sémantiques, réseaux de neurones — comment les modèles de langage fonctionnent vraiment.',
                slides:15,
              },
            ].map((item) => (
              <a key={item.slug} href={`/visuels/${item.slug}.html`} target="_blank" rel="noopener noreferrer" className={styles.motionCard}>
                <div className={styles.motionAccent} style={{background:item.color}}/>
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

        {/* ═══ À VENIR ═══ */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTag} style={{color:'var(--gris-m)'}}>En préparation</div>
            <h2 className={styles.sectionTitle} style={{color:'var(--gris-m)'}}>Prochains formats</h2>
          </div>
          <div className={styles.upcomingGrid}>
            {[
              {title:'L\'Afrique recomposée',sub:'La fin d\'un monde',cat:'Géopolitique'},
              {title:'Taïwan',sub:'Le détroit le plus dangereux',cat:'Géopolitique'},
              {title:'BlackRock',sub:'La concentration du capital',cat:'Économie'},
              {title:'Elon Musk',sub:'L\'homme qui défie son époque',cat:'Tech'},
              {title:'Semi-conducteurs',sub:'La bataille des puces',cat:'Tech'},
              {title:'L\'eau',sub:'La prochaine guerre mondiale',cat:'Environnement'},
              {title:'France Maritime',sub:'L\'empire ignoré',cat:'Géopolitique'},
            ].map((item,i) => (
              <div key={i} className={styles.upCard}>
                <span className={styles.upCat}>{item.cat}</span>
                <div className={styles.upTitle}>{item.title}</div>
                <div className={styles.upSub}>{item.sub}</div>
              </div>
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
