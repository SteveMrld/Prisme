import type { Metadata } from 'next'
import MediasPouvoirClient from './MediasPouvoirClient'

export const metadata: Metadata = {
  title: 'Médias : chiffres, pouvoir et nouveaux acteurs · Atlas Soara',
  description: 'Désaffection, concentration du capital, newsfluenceurs. Une analyse interactive du paysage médiatique occidental en 2025.',
}

export default function MediasPouvoirPage() {
  return <MediasPouvoirClient />
}
