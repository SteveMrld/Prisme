import type { Category } from '../data'

export type Pick = {
  name: string
  hook: string
  catOverride?: Category
}

export const FEATURED_PICKS: Pick[] = [
  {
    name: 'Rainforest Connection',
    hook: "Des téléphones recyclés accrochés aux arbres de la forêt amazonienne. Ils écoutent. Dès qu'une tronçonneuse démarre, une alerte est envoyée aux gardes forestiers en temps réel. La technologie au service du vivant, dans ce qu'elle a de plus immédiat.",
  },
  {
    name: 'The Great Bubble Barrier',
    hook: "Un rideau de bulles d'air disposé en travers des rivières néerlandaises. Il remonte les plastiques à la surface avant qu'ils atteignent l'océan, sans entraver la navigation ni la faune aquatique. Simple, efficace, reproductible à l'échelle mondiale.",
  },
  {
    name: 'Justdiggit',
    hook: "En creusant de petites cuvettes dans les terres arides d'Afrique, Justdiggit recapture l'eau de pluie et relance la végétation spontanée. Des millions d'hectares de savane dégradée ont déjà repris vie. Pas de plantation, pas de chimie : juste de la terre et de l'eau.",
  },
  {
    name: 'Mukuru Clean Stoves',
    hook: "En Afrique subsaharienne, cuisiner sur du bois tue. La fumée provoque chaque année plus de décès que le paludisme. Mukuru Clean Stoves fabrique et distribue des foyers améliorés qui consomment 60% de bois en moins. Une réponse à la fois climatique, sanitaire et économique.",
  },
  {
    name: 'Kelp Blue',
    hook: "Les forêts de kelp absorbent jusqu'à 20 fois plus de CO₂ que les forêts terrestres. Kelp Blue cultive de vastes étendues d'algues géantes au large de la Namibie, créant un écosystème marin, captant du carbone, et produisant de la biomasse utile. La mer comme solution.",
  },
  {
    name: 'Planet Wild',
    hook: "Un abonnement mensuel. Chaque mois, une mission de restauration dans le monde : replanter une forêt en Indonésie, réintroduire des loups en Écosse, purifier un lac en Inde. La nature comme service d'abonnement, radical dans sa forme, sérieux dans ses résultats.",
  },
  {
    name: 'Notpla',
    hook: "Notpla fabrique des emballages à partir d'algues et de plantes, compostables en six semaines, sans laisser de trace. Capsules d'eau pour les marathons, sachets de sauce pour les fast-foods, films d'emballage pour le e-commerce. Le plastique a un successeur naturel.",
  },
  {
    name: 'Arbimon',
    hook: "La santé d'un écosystème s'entend avant de se voir. Arbimon déploie des capteurs acoustiques dans les forêts du monde entier et analyse par intelligence artificielle la richesse sonore de la biodiversité. Un outil de mesure objectif pour la restauration écologique, le vivant en données.",
  },
  {
    name: 'Wandusoa',
    hook: "Au Cameroun, la grande majorité des agriculteurs ne vend pas au bon moment et perd jusqu'à 40% de sa récolte faute d'accès au marché. Wandusoa connecte les petits producteurs ruraux aux acheteurs via mobile, sans intermédiaire. Une chaîne alimentaire plus juste, village par village.",
  },
  {
    name: 'Hydraloop',
    hook: "Chaque douche gaspille des dizaines de litres d'eau propre. Hydraloop installe dans les maisons et les hôtels un système de recyclage des eaux grises, douche, bain, climatisation, qui les traite et les réinjecte dans les toilettes et l'arrosage. L'eau du futur commence chez soi.",
  },
]
