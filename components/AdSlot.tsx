import { getActiveAd, bumpImpression } from '../lib/ads'
import styles from './AdSlot.module.css'

type Props = {
  slotId: string
  variant?: 'banner' | 'inline'
}

export default async function AdSlot({ slotId, variant = 'banner' }: Props) {
  const ad = await getActiveAd(slotId)
  if (!ad) return null

  // Fire-and-forget : on n'attend pas la fin de l'incrément pour ne pas
  // bloquer le rendu si Supabase est lent.
  bumpImpression(ad.id).catch(() => {})

  const klass = variant === 'inline' ? styles.inline : styles.banner
  const hasImage = !!ad.image_url

  return (
    <aside className={`${styles.adslot} ${klass}`} aria-label="Contenu sponsorisé">
      <a
        href={`/api/ads/click?id=${ad.id}`}
        rel="sponsored noopener"
        target="_blank"
        className={styles.link}
      >
        <div className={`${styles.inner} ${hasImage ? '' : styles.noImage}`}>
          {hasImage && (
            <div className={styles.imageWrap}>
              <img
                src={ad.image_url!}
                alt=""
                loading="lazy"
                className={styles.image}
              />
            </div>
          )}
          <div className={styles.body}>
            <div className={styles.eyebrow}>
              Paid Post · {ad.advertiser}
            </div>
            <h3 className={styles.title}>{ad.title}</h3>
            {ad.body && <p className={styles.text}>{ad.body}</p>}
            <span className={styles.cta}>Découvrir</span>
          </div>
        </div>
      </a>
    </aside>
  )
}
