import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accès anticipé',
  description: 'Accès anticipé Soara avant le lancement public.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
