import Header from '../../components/Header'
import Link from 'next/link'
import styles from './contributeurs.module.css'

export const metadata = {
  title: 'Contributeurs — Prisme',
  description: 'Les auteurs qui écrivent pour Prisme.',
}

const contributeurs = [
  {
    name: 'Agathe Cagé',
    role: 'Contributrice · Science politique & Démocratie',
    bio: 'Docteure en science politique (Paris I), diplômée de l\'ENA. Directrice d\'études à l\'École normale supérieure, autrice de "Respect !" (Éditions des Équateurs). Ses travaux portent sur les inégalités, la mobilité sociale et les recompositions démocratiques.',
    domaines: ['Politique', 'Société', 'Démocratie'],
    portrait: '/portraits/cage.jpg',
    linkedin: 'https://www.linkedin.com/in/cag%C3%A9-agathe-2b1bb344/',
  },
  {
    name: 'Léo Cottencin',
    role: 'Contributeur · Finance & Stratégie',
    bio: 'Associé fondateur chez & Co., ancien chez Eurazeo et Messier & Associés. Diplômé de l\'ESSEC et de l\'IESEG, il analyse les dynamiques du capital privé et les stratégies de création de valeur.',
    domaines: ['Économie', 'Finance', 'Stratégie'],
    portrait: '/portraits/cottencin.jpg',
    linkedin: 'https://www.linkedin.com/in/l%C3%A9o-cottencin-11617474/',
  },
  {
    name: 'Jade Desroses',
    role: 'Contributrice · Culture & Société',
    bio: 'Professeure de lettres et essayiste. Elle explore les liens entre littérature, mémoire et politique, avec une attention particulière aux voix longtemps marginalisées du canon occidental.',
    domaines: ['Culture', 'Société', 'Portraits'],
    portrait: '/portraits/desroses.jpg',
    linkedin: 'https://www.linkedin.com/in/jade-desroses-0670b1336/',
  },
  {
    name: 'Laetitia Hélouet',
    role: 'Contributrice · Politiques publiques & Territoire',
    bio: 'Haute fonctionnaire, diplômée de Sciences Po Rennes et de l\'INET. Présidente de l\'Observatoire national de la politique de la Ville, ancienne rapporteure à la Cour des comptes.',
    domaines: ['Politique publique', 'Territoire', 'Société'],
    portrait: '/portraits/helouet.jpg',
    linkedin: 'https://www.linkedin.com/in/laetitia-helouet-5b3a92168/',
  },
  {
    name: 'Fatemeh Jailani',
    role: 'Contributrice · Europe & Politiques publiques',
    bio: 'Née en Californie de parents afghans, diplômée de Sciences Po. Ses analyses portent sur les politiques européennes, les migrations et les recompositions identitaires dans les démocraties libérales.',
    domaines: ['Europe', 'Politique', 'Société'],
    portrait: '/portraits/jailani.jpg',
    linkedin: 'https://www.linkedin.com/in/fatemeh-jailani-37814127/',
  },
  {
    name: 'Claire Le Flécher',
    role: 'Contributrice · Diplomatie & Relations internationales',
    bio: 'Ambassadrice de France, ancienne première conseillère en Arménie, diplômée de l\'ENA. Ses analyses portent sur la diplomatie contemporaine et les recompositions géopolitiques au Moyen-Orient.',
    domaines: ['Géopolitique', 'Diplomatie', 'Relations internationales'],
    portrait: '/portraits/leflecher.jpg',
    linkedin: 'https://www.linkedin.com/in/claire-le-fl%C3%A9cher-3199b442/',
  },
  {
    name: 'Élodie Mielczareck',
    role: 'Contributrice · Langage & Communication',
    bio: 'Sémiologue diplômée en Lettres et Linguistique (Sorbonne), autrice de plusieurs ouvrages sur le langage et le pouvoir. Elle décrypte les stratégies discursives des organisations et des acteurs politiques.',
    domaines: ['Société', 'Médias', 'Politique'],
    portrait: '/portraits/mielczareck.jpg',
    linkedin: 'https://www.linkedin.com/in/elodie-mielczareck-semiologue/',
  },
  {
    name: 'Élisabeth Moreno',
    role: 'Contributrice · Leadership & Égalité',
    bio: 'Née au Cap-Vert, ancienne PDG de Lenovo France et DG Afrique de Hewlett-Packard, Ministre déléguée à l\'Égalité femmes-hommes (2020–2022). Fondatrice de LEIA Partners et présidente de Ring Capital.',
    domaines: ['Leadership', 'Égalité', 'Technologie', 'Afrique'],
    portrait: '/portraits/moreno.jpg',
    linkedin: 'https://www.linkedin.com/in/elisabeth-moreno-745362248/',
  },
  {
    name: 'Éric Ouzounian',
    role: 'Contributeur · Médias & Culture',
    bio: 'Journaliste et essayiste, fondateur du magazine Immersion. Il documente les mutations culturelles et médiatiques à l\'ère numérique, avec un regard particulier sur les industries créatives.',
    domaines: ['Culture', 'Médias', 'Technologie'],
    portrait: '/portraits/ouzounian.jpg',
    linkedin: null,
  },
  {
    name: 'Pierre Sonigo',
    role: 'Contributeur · Sciences & Épistémologie',
    bio: 'Biologiste, directeur de recherche à l\'INSERM, il a participé en 1985 au séquençage du VIH à l\'Institut Pasteur. Auteur de travaux fondamentaux sur la génétique des virus et l\'évolution moléculaire.',
    domaines: ['Sciences', 'Épistémologie', 'Santé'],
    portrait: '/portraits/sonigo.jpg',
    linkedin: 'https://www.linkedin.com/in/pierre-sonigo-300800a9/',
  },
  {
    name: 'Majda Vincent',
    role: 'Contributrice · Management & Organisations',
    bio: 'Diplômée de l\'IAE Paris Sorbonne, ancienne DRH de Sodexo France, elle est aujourd\'hui DRH monde du groupe Adecco. Elle analyse les transformations du travail et les enjeux humains des grandes organisations.',
    domaines: ['Économie', 'Société', 'Management'],
    portrait: '/portraits/vincent.jpg',
    linkedin: 'https://www.linkedin.com/in/majda-vincent-59641442/',
  },
]

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('')
}

export default function ContributeursPage() {
  return (
    <>
      <Header />

      <div className={styles.band}>
        <span className={styles.eyebrow}>Contributeurs</span>
        <h1 className={styles.title}>Celles et ceux <em>qui écrivent</em></h1>
        <p className={styles.desc}>
          Prisme est construit sur des contributions singulières. Chaque auteur apporte un regard,
          une méthode, un angle. Ce qui les unit : la conviction que l'analyse rigoureuse est utile.
        </p>
      </div>

      <div className={styles.list}>
        {contributeurs.map((c) => (
          <div key={c.name} className={styles.item}>
            <div className={styles.itemLeft}>
              {c.portrait
                ? <img src={c.portrait} alt={c.name} className={styles.avatar} style={{objectFit:'cover', objectPosition:'top center'}} />
                : <div className={styles.avatar}>{initials(c.name)}</div>
              }
            </div>
            <div className={styles.itemRight}>
              <div className={styles.itemName}>{c.name}</div>
              <div className={styles.itemRole}>{c.role}</div>
              <p className={styles.itemBio}>{c.bio}</p>
              <div className={styles.itemDomaines}>
                {c.domaines.map(d => (
                  <span key={d} className={styles.domaine}>{d}</span>
                ))}
              </div>
              {c.linkedin && (
                <a href={c.linkedin} className={styles.linkedin} target="_blank" rel="noopener">
                  LinkedIn →
                </a>
              )}
            </div>
          </div>
        ))}

        <div className={styles.openCall}>
          <div className={styles.openCallLabel}>Rejoindre Prisme</div>
          <h3 className={styles.openCallTitle}>Vous souhaitez contribuer ?</h3>
          <p className={styles.openCallDesc}>
            Prisme accueille des contributions ponctuelles ou régulières d'analystes, chercheurs,
            praticiens et journalistes indépendants. Le critère central n'est pas le statut — c'est
            la rigueur et la singularité du point de vue.
          </p>
          <a href="mailto:contact@prisme.media" className={styles.openCallCta}>
            Nous écrire →
          </a>
        </div>
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

