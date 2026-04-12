// @ts-nocheck
'use client'
import { CrisisViz, OwnershipMap } from '../../visuels/medias-pouvoir/MediasPouvoirClient'

export default function MediasVizClient() {
  return (
    <div>
      <CrisisViz />
      <div style={{ borderTop: '2px solid #1a1d25', margin: '0' }} />
      <OwnershipMap />
    </div>
  )
}
