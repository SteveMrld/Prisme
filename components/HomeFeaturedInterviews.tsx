import { getHomeInterviewsPartition } from '../lib/interviews'
import FeaturedInterviews from './FeaturedInterviews'
import styles from './HomeInterviewBanner.module.css'

/* Zone vedette entretiens, à placer dans la colonne centrale de la
   home (.homeTopCenter). Ne contient que les grands entretiens publiés
   (max 2, côte à côte sur desktop, empilés sur mobile). La rangée
   carousel « Les entretiens Soara » est sortie en pleine largeur via
   HomeInterviewsRow pour éviter le blanc latéral sous .homeTop. */
export default function HomeFeaturedInterviews() {
  const { featured } = getHomeInterviewsPartition()
  if (featured.length === 0) return null
  return (
    <div className={styles.wrap}>
      <FeaturedInterviews items={featured} />
    </div>
  )
}
