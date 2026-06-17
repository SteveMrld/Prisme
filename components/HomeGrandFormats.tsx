import Link from 'next/link'
import { getAllGrandFormats } from '../lib/grands-formats'
import { sortByRecency } from '../lib/home-pools'
import { isFutureDay, formatFrDate } from '../lib/dates'
import GrandFormatsCarousel, { type CarouselGrandFormat } from './GrandFormatsCarousel'
import styles from './HomeGrandFormats.module.css'

export default function HomeGrandFormats() {
  const all = getAllGrandFormats()
  // Tri par score de récence en incluant le futur : les grands formats
  // à paraître apparaissent en cartes teaser, pas masqués.
  const ordered = sortByRecency(all, Date.now(), { includeFuture: true })
  const items: CarouselGrandFormat[] = ordered.map(gf => ({
    slug: gf.slug,
    title: gf.title,
    category: gf.category,
    categoryLabel: gf.categoryLabel,
    image: gf.image,
    href: gf.href,
    isComing: isFutureDay(gf.date),
    comingLabel: isFutureDay(gf.date) ? formatFrDate(gf.date) : '',
  }))

  if (items.length === 0) return null

  return (
    <section className={styles.section} aria-label="Les grands formats">
      <div className={styles.head}>
        <span className={styles.eyebrow}>Les grands formats</span>
        <Link href="/grands-formats" className={styles.all}>Tout voir →</Link>
      </div>
      <GrandFormatsCarousel items={items} />
    </section>
  )
}
