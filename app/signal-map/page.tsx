export default function SignalMapPage() {
  return (
    <iframe
      id="signal-iframe"
      src="/signal-globe.html"
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        border: 'none', zIndex: 0,
      }}
      title="Soara Signal"
      allowFullScreen
    />
  )
}
