import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Réinitialiser mon mot de passe',
  description: 'Choisissez un nouveau mot de passe pour votre compte Soara.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
