'use client'
import Link from 'next/link'
import Header from './Header'
import BottomNav from './BottomNav'
import styles from './GrandsFormatsIndex.module.css'

const FORMATS = [
  { slug:'palantir',              title:"Palantir. L'ontologie de l'ennemi",                      category:'Tech · Puissance',            desc:"Comment une entreprise de data a vendu à l'État la capacité de penser la menace." },
  { slug:'chambre-ratification',  title:"La chambre de ratification",                              category:'Géopolitique · Pouvoir',      desc:"Comment se décide vraiment une guerre — pas dans les capitales, mais dans les pièces où personne ne regarde." },
  { slug:'skunkworks',            title:"Skunk Works — L'usine à l'impossible",                    category:'Tech · Défense',              desc:"Comment Lockheed a inventé l'avion invisible dans un hangar secret en Californie." },
  { slug:'terres-rares',          title:"Terres rares : la guerre invisible",                      category:'Géopolitique · Environnement',desc:"Du cobalt du Katanga au verrou chinois du raffinage, une nouvelle géographie de la dépendance." },
  { slug:'medias',                title:"Médias — Les prédateurs",                                 category:'Société · Pouvoir',           desc:"Qui possède l'information ? La carte mondiale de la concentration des médias." },
  { slug:'dette-souveraine',      title:"Dette souveraine",                                        category:'Économie · Géopolitique',     desc:"Quand la dette devient une arme géopolitique. Les États pris en otage par leurs créanciers." },
  { slug:'architecture-desordre', title:"L'architecture du désordre",                              category:'Géopolitique · Droit',        desc:"Pourquoi le droit international ne fonctionne que quand les grandes puissances veulent bien." },
]

export default function GrandsFormatsIndex() {
  return (
    <>
      <Header activeNav="concept" />
      <main className={styles.main}>
        <div className={styles.headerWrap}>
          <div className={styles.eyebrow}>Soara · Grands formats</div>
          <h1 className={styles.title}>
            Les enquêtes qui<br /><em>prennent le temps.</em>
          </h1>
          <p className={styles.lede}>
            Analyses de fond, visualisations interactives, décryptages en profondeur.
          </p>
        </div>

        <div className={styles.list}>
          {FORMATS.map((f, i) => (
            <Link key={f.slug} href={`/grands-formats/${f.slug}`} className={styles.link}>
              <div className={styles.row}>
                <div className={styles.num}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.body}>
                  <div className={styles.category}>{f.category}</div>
                  <h2 className={styles.itemTitle}>{f.title}</h2>
                  <p className={styles.desc}>{f.desc}</p>
                </div>
                <div className={styles.arrow}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
