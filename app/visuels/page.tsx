import Header from '../../components/Header'
import styles from './visuels.module.css'
import Link from 'next/link'

export const metadata = {
  title: 'Explorations — Soara',
  description: 'Motions design, cartes animées, visualisations de données. Comprendre le monde autrement.',
}

export default function VisuelsPage() {
  return (
    <>
      <Header activeNav="concept" />

      {/* ═══ HERO ═══ */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLabel}>Explorations</div>
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
            <div className={styles.sectionTag} style={{color:'var(--geo)'}}>Grands formats</div>
            <h2 className={styles.sectionTitle}>Cartes &amp; Animations immersives</h2>
            <p className={styles.sectionDesc}>Des animations plein écran pensées pour les sujets qui demandent de l'espace — géopolitique, géographie, data.</p>
          </div>

          {/* Card — bases militaires américaines */}
          <a href="/grands-formats/bases-militaires" className={styles.featCard} style={{marginTop:'1px'}}>
            <div className={styles.featBg} style={{background:"linear-gradient(135deg,#1a0a0a 0%,#3d0e0e 50%,#1a2035 100%)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 25% 50%, rgba(127,29,29,0.5) 0%, transparent 50%), radial-gradient(circle at 75% 40%, rgba(29,78,216,0.3) 0%, transparent 45%)"}} />
            </div>
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

          {/* Card featured — navale */}
          <a href="/visuels/naval.html" target="_blank" rel="noopener noreferrer" className={styles.featCard}>
<div className={styles.featBg} style={{background:"linear-gradient(135deg,#0a0f1a 0%,#0d2035 50%,#1a0d25 100%)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 30% 60%, rgba(29,78,216,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 35%, rgba(100,29,127,0.3) 0%, transparent 45%)"}} />
            </div>
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
<div className={styles.featBg} style={{background:"linear-gradient(135deg,#120d02 0%,#2e1f04 50%,#1a1508 100%)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 25% 50%, rgba(180,120,20,0.45) 0%, transparent 50%), radial-gradient(circle at 72% 38%, rgba(216,160,29,0.2) 0%, transparent 45%)"}} />
            </div>
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
<div className={styles.featBg} style={{background:"linear-gradient(135deg,#060f08 0%,#0a2e12 50%,#0f1a10 100%)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 30% 55%, rgba(34,120,60,0.5) 0%, transparent 50%), radial-gradient(circle at 70% 40%, rgba(29,216,100,0.2) 0%, transparent 45%)"}} />
            </div>
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
<div className={styles.featBg} style={{background:"linear-gradient(135deg,#1a0a0a 0%,#3d0e0e 50%,#1a2035 100%)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 25% 50%, rgba(127,29,29,0.5) 0%, transparent 50%), radial-gradient(circle at 75% 40%, rgba(29,78,216,0.3) 0%, transparent 45%)"}} />
            </div>
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
<div className={styles.featBg} style={{background:"linear-gradient(135deg,#060d1a 0%,#0a1f3d 50%,#10152a 100%)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 20% 50%, rgba(29,100,216,0.45) 0%, transparent 50%), radial-gradient(circle at 75% 40%, rgba(100,200,255,0.2) 0%, transparent 45%)"}} />
            </div>
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
