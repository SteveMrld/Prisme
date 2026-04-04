export const metadata = {
  title: 'Confins Signal — Carte des tensions géopolitiques',
  description: 'Les zones de tension suivies par Confins en temps réel. Cycle jour/nuit, routes maritimes, crises actives.',
}

export default function SignalMapPage() {
  return (
    <iframe
      src="/signal-globe.html"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        zIndex: 0,
      }}
      title="Confins Signal"
      allowFullScreen
    />
  )
}
