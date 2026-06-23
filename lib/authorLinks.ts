// Source unique des liens d'autorité par auteur (site officiel ou page
// Wikipédia). Utilisée à deux endroits qui doivent rester cohérents :
//  - le bloc signature de fin d'article (composant ArticleLayout) ;
//  - les données structurées JSON-LD (champs `url` et `sameAs` de l'auteur),
//    qui renforcent l'E-E-A-T en reliant l'auteur à son identité publique.
// Clés strictement identiques aux noms d'auteurs dans articles.json
// (accents compris) pour qu'aucun mismatch ne passe silencieusement.

export type AuthorLink = { url: string; type: 'website' | 'wikipedia' }

const AUTHOR_LINKS: Record<string, AuthorLink> = {
  'Majda Vincent': { url: 'https://majdavincent.com/', type: 'website' },
  'Steve Moradel': { url: 'https://stevemoradel.com/', type: 'website' },
  'Abad Boumsong': { url: 'https://leprincedespoetes.fr/', type: 'website' },
  'Jade Desroses': { url: 'https://lespagesdejade.com/', type: 'website' },
  'Agathe Cagé': { url: 'https://fr.wikipedia.org/wiki/Agathe_Cagé', type: 'wikipedia' },
  'Élisabeth Moreno': { url: 'https://fr.wikipedia.org/wiki/Élisabeth_Moreno', type: 'wikipedia' },
}

// Lien unique d'un auteur (ou null s'il n'en a pas), pour l'affichage UI.
export function authorLink(name: string): AuthorLink | null {
  return AUTHOR_LINKS[name] || null
}

// Liste des URL d'autorité d'un auteur, pour le champ schema.org `sameAs`.
export function authorSameAs(name: string): string[] {
  const link = AUTHOR_LINKS[name]
  return link ? [link.url] : []
}
