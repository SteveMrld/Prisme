'use client'
import Link from 'next/link'
import { createClient } from '../lib/supabase'
import styles from './AdminNav.module.css'

type Section = 'dashboard' | 'articles' | 'publicite'

export default function AdminNav({ active }: { active?: Section }) {
  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className={styles.nav}>
      <Link href="/admin" className={styles.brand}>
        SOARA <span>Console</span>
      </Link>

      <div className={styles.links}>
        <Link
          href="/admin/articles"
          className={active === 'articles' ? `${styles.link} ${styles.active}` : styles.link}
        >
          Articles
        </Link>
        <Link
          href="/admin/publicite"
          className={active === 'publicite' ? `${styles.link} ${styles.active}` : styles.link}
        >
          Publicité
        </Link>
      </div>

      <div className={styles.right}>
        <Link href="/" className={styles.back}>Retour au site</Link>
        <button onClick={logout} className={styles.logout}>Déconnexion</button>
      </div>
    </nav>
  )
}
