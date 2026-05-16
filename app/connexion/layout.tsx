import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Se connecter',
  description: 'Connectez-vous à votre compte Soara.',
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
