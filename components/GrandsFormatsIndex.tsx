'use client'
import Link from 'next/link'
import Header from './Header'
import BottomNav from './BottomNav'
import styles from './GrandsFormatsIndex.module.css'

// ATTENTION : cette liste est écrite en dur et ne lit pas GRAND_FORMAT_SLUGS
// de lib/grands-formats.ts. Tout grand format ajouté au registre doit être
// répliqué ici, sinon il n'apparaît pas dans l'onglet. Manquent encore :
// pollinisation, climatisation, bases-militaires, climat, inegalites.
// cat = data-cat dérivé du premier mot du libellé visible (cf. audit Étape 0).
// image = cover réelle de l'article (issue d'articles.json), affichée telle quelle.
// Si image absent, .thumb / .openImg retombent sur un aplat catColor 12 %.
const FORMATS = [
  { slug:'le-verger-et-le-fruit', cat:'tech', title:"Le verger et le fruit",                             category:'Technologie · Géopolitique',  desc:"En 1998, Microsoft offrait à la Chine un laboratoire. Un quart de siècle plus tard, Pékin tend le même geste vers l'Afrique.", image:'/grands-formats/le-verger-et-le-fruit.jpg' },
  { slug:'palantir',              cat:'tech', title:"Palantir. L'ontologie de l'ennemi",                      category:'Tech · Puissance',            desc:"Comment une entreprise de data a vendu à l'État la capacité de penser la menace.",            image:'/grands-formats/palantir/palantir-reseau.jpg' },
  { slug:'chambre-ratification',  cat:'geo',  title:"La chambre de ratification",                              category:'Géopolitique · Pouvoir',      desc:"Comment se décide vraiment une guerre, pas dans les capitales, mais dans les pièces où personne ne regarde.", image:'/grands-formats/chambre-hero.jpg' },
  { slug:'skunkworks',            cat:'tech', title:"Skunk Works · L'usine à l'impossible",                    category:'Tech · Défense',              desc:"Comment Lockheed a inventé l'avion invisible dans un hangar secret en Californie.",            image:'/grands-formats/skunkworks/hangar-1943.jpg' },
  { slug:'terres-rares',          cat:'geo',  title:"Terres rares : la guerre invisible",                      category:'Géopolitique · Environnement',desc:"Du cobalt du Katanga au verrou chinois du raffinage, une nouvelle géographie de la dépendance.", image:'/articles/terres-rares.jpg' },
  { slug:'medias',                cat:'soc',  title:"Médias · Les prédateurs",                                 category:'Société · Pouvoir',           desc:"Qui possède l'information ? La carte mondiale de la concentration des médias.",                image:'/articles/img-medias.jpg' },
  { slug:'dette-souveraine',      cat:'eco',  title:"Dette souveraine",                                        category:'Économie · Géopolitique',     desc:"Quand la dette devient une arme géopolitique. Les États pris en otage par leurs créanciers.",  image:'/dette-souveraine-cover.jpg' },
  { slug:'architecture-desordre', cat:'geo',  title:"L'architecture du désordre",                              category:'Géopolitique · Droit',        desc:"Pourquoi le droit international ne fonctionne que quand les grandes puissances veulent bien.", image:'/grands-formats/architecture-desordre.jpg' },
]

// Aligné avec la home : GF_LEAD_SLUG de app/page.tsx
const LEAD_SLUG = 'chambre-ratification'

export default function GrandsFormatsIndex() {
  const lead = FORMATS.find(f => f.slug === LEAD_SLUG)
  const rest = FORMATS.filter(f => f.slug !== LEAD_SLUG)

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

        {lead && (
          <Link href={`/grands-formats/${lead.slug}`} className={styles.openLink} data-cat={lead.cat}>
            <article className={styles.open}>
              <div className={styles.openImg}>
                {lead.image && <img src={lead.image} alt={lead.title.replace(/<[^>]+>/g, '')} />}
              </div>
              <div className={styles.openBody}>
                <div className={styles.category}>{lead.category}</div>
                <h2 className={styles.openTitle} dangerouslySetInnerHTML={{ __html: lead.title }} />
                <p className={styles.openDesc}>{lead.desc}</p>
                <span className={styles.openCta}>Lire l'enquête →</span>
              </div>
            </article>
          </Link>
        )}

        <div className={styles.list}>
          {rest.map((f, i) => (
            <Link key={f.slug} href={`/grands-formats/${f.slug}`} className={styles.link} data-cat={f.cat}>
              <div className={styles.row}>
                <div className={styles.num}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.body}>
                  <div className={styles.category}>{f.category}</div>
                  <h2 className={styles.itemTitle} dangerouslySetInnerHTML={{ __html: f.title }} />
                  <p className={styles.desc}>{f.desc}</p>
                </div>
                <div className={styles.thumb}>
                  {f.image && <img src={f.image} alt={f.title.replace(/<[^>]+>/g, '')} />}
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
