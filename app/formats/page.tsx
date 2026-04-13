'use client'
import Link from 'next/link'
import Header from '../../components/Header'
import BottomNav from '../../components/BottomNav'

const FORMATS = [
  { slug:'palantir',              title:"Palantir. L'ontologie de l'ennemi",                      category:'Tech · Puissance',            desc:"Comment une entreprise de data a vendu à l'État la capacité de penser la menace." },
  { slug:'chambre-ratification',  title:"La chambre de ratification",                              category:'Géopolitique · Pouvoir',      desc:"Comment se décide vraiment une guerre — pas dans les capitales, mais dans les pièces où personne ne regarde." },
  { slug:'skunkworks',            title:"Skunk Works — L'usine à l'impossible",                    category:'Tech · Défense',              desc:"Comment Lockheed a inventé l'avion invisible dans un hangar secret en Californie." },
  { slug:'terres-rares',          title:"Terres rares : la guerre invisible",                      category:'Géopolitique · Environnement',desc:"Du cobalt du Katanga au verrou chinois du raffinage, une nouvelle géographie de la dépendance." },
  { slug:'medias',                title:"Médias — Les prédateurs",                                 category:'Société · Pouvoir',           desc:"Qui possède l'information ? La carte mondiale de la concentration des médias." },
  { slug:'dette-souveraine',      title:"Dette souveraine",                                        category:'Économie · Géopolitique',     desc:"Quand la dette devient une arme géopolitique. Les États pris en otage par leurs créanciers." },
  { slug:'architecture-desordre', title:"L'architecture du désordre",                              category:'Géopolitique · Droit',        desc:"Pourquoi le droit international ne fonctionne que quand les grandes puissances veulent bien." },
]

export default function GrandsFormatsPage() {
  return (
    <>
      <Header activeNav="concept" />
      <main style={{ minHeight:'100vh', background:'#0a0908', paddingBottom:100 }}>

        <div style={{ padding:'80px 24px 40px', borderBottom:'1px solid rgba(255,255,255,0.08)', maxWidth:900, margin:'0 auto' }}>
          <div style={{ fontFamily:'DM Mono,monospace', fontSize:9, letterSpacing:4, textTransform:'uppercase', color:'#C8A96E', marginBottom:16 }}>
            Soara · Grands formats
          </div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(32px,5vw,56px)', fontWeight:300, color:'#ECE7DD', lineHeight:1.1, marginBottom:16 }}>
            Les enquêtes qui<br /><em style={{ fontWeight:600 }}>prennent le temps.</em>
          </h1>
          <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, fontStyle:'italic', color:'rgba(236,231,221,0.5)', lineHeight:1.6, maxWidth:600 }}>
            Analyses de fond, visualisations interactives, décryptages en profondeur.
          </p>
        </div>

        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 16px' }}>
          {FORMATS.map((f, i) => (
            <Link key={f.slug} href={`/grands-formats/${f.slug}`} style={{ textDecoration:'none', display:'block' }}>
              <div style={{ display:'flex', gap:0, borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'24px 0', cursor:'pointer' }}>
                <div style={{ width:48, flexShrink:0, fontFamily:'DM Mono,monospace', fontSize:10, color:'rgba(255,255,255,0.15)', letterSpacing:2, textAlign:'center', paddingTop:4 }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'DM Mono,monospace', fontSize:7, letterSpacing:3, textTransform:'uppercase', color:'#C8A96E', marginBottom:8 }}>
                    {f.category}
                  </div>
                  <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(18px,2.5vw,24px)', fontWeight:700, color:'#ECE7DD', lineHeight:1.2, marginBottom:8 }}>
                    {f.title}
                  </h2>
                  <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:15, fontStyle:'italic', color:'rgba(236,231,221,0.55)', lineHeight:1.6, margin:0 }}>
                    {f.desc}
                  </p>
                </div>
                <div style={{ width:40, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(200,169,110,0.4)', fontSize:18 }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
