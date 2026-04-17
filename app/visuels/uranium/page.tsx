import type { Metadata } from 'next'
import UraniumClient from './UraniumClient'

export const metadata: Metadata = {
  title: 'Uranium : la cascade du monde — Atlas Soara',
  description: "De 0,7 % à 90 %. Une cartographie visuelle de l'enrichissement de l'uranium, des cascades industrielles de Rosatom, Urenco, Orano, CNNC et Centrus aux seuils qui basculent dans le militaire.",
}

export default function UraniumPage() {
  return <UraniumClient />
}
