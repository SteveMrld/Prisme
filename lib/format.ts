/* Helpers de formatage partagés pour l'affichage des temps de lecture
   et la sanitization de textes destinés à des attributs (alt, title,
   aria-label) où des balises HTML ne doivent pas apparaître. */

/* Formate un readTime pour affichage. Si la valeur est un entier
   ("8", "12"), on suffixe avec " min" (court) ou " min de lecture"
   (long). Si la valeur est textuelle ("Trilogie", "Carte"), on la
   renvoie telle quelle, sans suffixe. */
export function formatReadTime(
  rt?: string | number | null,
  variant: 'short' | 'long' = 'short'
): string {
  if (rt === null || rt === undefined) return ''
  const s = String(rt).trim()
  if (s === '') return ''
  const suffix = variant === 'long' ? ' min de lecture' : ' min'
  if (/^\d+$/.test(s)) return `${s}${suffix}`
  return s
}

/* Indique si une valeur de readTime est numérique. Utile pour décider
   d'afficher (ou non) un séparateur ou un libellé contextuel. */
export function isNumericReadTime(rt?: string | number | null): boolean {
  if (rt === null || rt === undefined) return false
  return /^\d+$/.test(String(rt).trim())
}

/* Supprime toutes les balises HTML d'une chaîne. Destiné aux contextes
   text-only (attributs alt, title, aria-label, méta-données partagées).
   Décode aussi les entités HTML les plus courantes. */
export function stripHtml(s?: string | null): string {
  if (!s) return ''
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}
