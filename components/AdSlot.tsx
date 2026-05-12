import { getActiveAd, bumpImpression, type Ad } from '../lib/ads'
import styles from './AdSlot.module.css'

type Props = {
  slotId: string
  variant?: 'banner' | 'inline' | 'sidebar'
  preloadedAd?: Ad | null
}

export default async function AdSlot({ slotId, variant = 'banner', preloadedAd }: Props) {
  const ad = preloadedAd !== undefined ? preloadedAd : await getActiveAd(slotId)
  if (!ad) return null

  bumpImpression(ad.id).catch(() => {})

  const klass =
    variant === 'inline' ? styles.inline :
    variant === 'sidebar' ? styles.sidebar :
    styles.banner
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
