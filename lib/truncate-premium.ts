/**
 * Tronque le HTML d'un article premium pour produire un teaser.
 *
 * Strategie : on garde tout le HTML jusqu'au debut du corps de l'article
 * (.article-body, .article-content, .essentiel reste preserve), puis on
 * limite le corps aux N premiers paragraphes (compte des </p>).
 *
 * Pour les articles sans wrapper de body (cas ArticleLayout ou content =
 * juste un flux de <p>, <h2>...), on tronque directement apres N </p>.
 *
 * On NE referme PAS proprement les divs ouvertes : le HTML obtenu peut
 * etre malforme, mais c'est rendu via dangerouslySetInnerHTML — le
 * navigateur tolere et la troncature est masquee visuellement par le
 * fade-out + le bloc paywall qui suit.
 */

const BODY_WRAPPER_RE = /<div\s+class\s*=\s*["'][^"']*\barticle-body\b[^"']*["'][^>]*>/i

export function truncatePremiumHtml(html: string, paragraphCount: number = 3): string {
  if (paragraphCount <= 0) return ''
  if (!html) return ''

  const bodyMatch = html.match(BODY_WRAPPER_RE)
  if (bodyMatch && bodyMatch.index !== undefined) {
    const bodyStart = bodyMatch.index + bodyMatch[0].length
    const before = html.slice(0, bodyStart)
    const after = html.slice(bodyStart)
    return before + sliceParagraphs(after, paragraphCount) + '</div>'
  }

  return sliceParagraphs(html, paragraphCount)
}

function sliceParagraphs(html: string, n: number): string {
  const re = /<\/p\s*>/gi
  let count = 0
  let cutAt = -1
  let match: RegExpExecArray | null
  while ((match = re.exec(html)) !== null) {
    count++
    if (count === n) {
      cutAt = match.index + match[0].length
      break
    }
  }
  return cutAt === -1 ? html : html.slice(0, cutAt)
}
