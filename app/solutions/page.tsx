export const metadata = {
  title: 'Changer le monde · Soara',
  description: '157 solutions concrètes pour la planète. Sélection ChangeNow 2026.',
}

export default function SolutionsPage() {
  return (
    <iframe
      src="/visuels/solutions-map.html"
      style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', border:'none', zIndex:0 }}
      title="Changer le monde"
      allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation allow-forms"
    />
  )
}
