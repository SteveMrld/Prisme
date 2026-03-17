import Header from '../../components/Header'
import Link from 'next/link'
import styles from './signal.module.css'

const signals = [
  {
    date: '17 mars 2026',
    cat: 'Géopolitique',
    catColor: 'var(--geo)',
    headline: 'Israël frappe Téhéran et Beyrouth',
    body: 'Dix-huitième jour de l\'opération. Les frappes visent les infrastructures de commandement du Hezbollah et deux sites supposés du programme nucléaire iranien. La Russie convoque le Conseil de sécurité. Washington maintient son soutien tout en appelant à la désescalade.',
  },
  {
    date: '17 mars 2026',
    cat: 'Économie',
    catColor: 'var(--eco)',
    headline: 'La Fed se réunit — stagflation en ligne de mire',
    body: 'Le pétrole à 103$ complique la décision de Jerome Powell. Une hausse des taux aggraverait le ralentissement ; un statu quo valide l\'inflation. Les marchés anticipent une pause assortie d\'un discours hawkish. Le dollar s\'apprécie face à l\'euro et au yen.',
  },
  {
    date: '17 mars 2026',
    cat: 'Technologie',
    catColor: 'var(--tech)',
    headline: 'Nvidia H200 : rupture de stock mondiale',
    body: 'TSMC a confirmé ne pas pouvoir satisfaire la demande au-delà du troisième trimestre. Les hyperscalers (Microsoft, Google, Amazon) ont absorbé l\'essentiel de l\'allocation 2026. Les startups européennes d\'IA signalent des délais de livraison allant jusqu\'à 18 mois.',
  },
  {
    date: '16 mars 2026',
    cat: 'Géopolitique',
    catColor: 'var(--geo)',
    headline: 'Trump face au mur — alliés absents',
    body: 'Le sommet de l\'OTAN s\'est conclu sans communiqué commun pour la deuxième fois consécutive. Les délégations européennes ont refusé d\'entériner la formulation américaine sur Taïwan. Le secrétaire général a évoqué une \"période de recalibrage stratégique\".',
  },
  {
    date: '16 mars 2026',
    cat: 'Environnement',
    catColor: 'var(--env)',
    headline: 'Sécheresse record en Europe du Sud — 4e année consécutive',
    body: 'L\'Espagne, le Portugal et l\'Italie du Sud affichent des réserves hydriques à 34% de leur capacité moyenne pour mars. L\'Union européenne a activé le mécanisme de solidarité hydrique pour la troisième fois depuis sa création. Les négociations agricoles sur la PAC sont suspendues.',
  },
  {
    date: '15 mars 2026',
    cat: 'Société',
    catColor: 'var(--soc)',
    headline: 'France — mobilisation nationale jeudi',
    body: 'Les syndicats appellent à une journée interprofessionnelle contre la réforme des retraites portée à 67 ans. La CFDT, habituellement réformiste, a rejoint le front commun. Le gouvernement refuse toute négociation avant le vote en commission, prévu le 24 mars.',
  },
  {
    date: '15 mars 2026',
    cat: 'Économie',
    catColor: 'var(--eco)',
    headline: 'Bitcoin dépasse 94 000$ — institutionnels en retrait',
    body: 'Le mouvement est porté par des flux de retail asiatique et des ETF spot lancés à Singapour et à Dubaï. BlackRock et Fidelity ont réduit leurs expositions de 12% depuis janvier. Les analystes divergent entre un test des 100 000$ et une correction liée à la liquidité globale.',
  },
]

export const metadata = {
  title: 'Signal — Prisme',
  description: 'L\'actualité qui compte. Les faits bruts, sans bruit.',
}

export default function SignalPage() {
  return (
    <>
      <Header activeNav="signal" />

      <div className={styles.band}>
        <div className={styles.bandLeft}>
          <span className={styles.livePill}>
            <span className={styles.liveDot} />
            LIVE
          </span>
          <div>
            <div className={styles.bandLabel}>Signal</div>
            <div className={styles.bandDesc}>L'actualité qui compte. Les faits bruts, sans bruit.</div>
          </div>
        </div>
        <div className={styles.bandDate}>17 mars 2026</div>
      </div>

      <div className={styles.feed}>
        {signals.map((item, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.itemMeta}>
              <span className={styles.itemDot} style={{ background: item.catColor }} />
              <span className={styles.itemCat} style={{ color: item.catColor }}>{item.cat}</span>
              <span className={styles.itemDate}>{item.date}</span>
            </div>
            <h2 className={styles.itemHeadline}>{item.headline}</h2>
            <p className={styles.itemBody}>{item.body}</p>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Pris<em>me</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Prisme · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
