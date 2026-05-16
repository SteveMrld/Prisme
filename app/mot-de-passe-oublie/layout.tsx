import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mot de passe oublié',
  description: 'Réinitialisez votre mot de passe Soara.',
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
