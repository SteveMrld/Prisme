'use client'

import styles from '../app/page.module.css'

export default function NewsletterForm() {
  return (
    <form
      className={styles.nlForm}
      onSubmit={(e) => {
        e.preventDefault()
        window.location.href = '/abonnement'
      }}
    >
      <input type="email" placeholder="votre@email.com" className={styles.nlInput} required />
      <button type="submit" className={styles.nlBtn}>S'abonner →</button>
    </form>
  )
}
