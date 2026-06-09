// Mapping centralisé catégorie → modules de la colonne droite.
// Pour réajuster l'ordre ou les modules d'une catégorie, éditer
// uniquement ce fichier. Aucune autre source de vérité.
//
// Modules disponibles (clé) :
//   - 'lettre'       : dernier numéro de La lettre du mardi
//   - 'ailleurs'     : Ailleurs sur Soara (POPULAR_POOL filtré, sélection
//                      éditoriale assumée, jamais nommée "Les plus lus"
//                      tant qu'on n'a pas de compteur réel)
//   - 'portraits'    : Portraits, 2 ou 3 entrées
//   - 'tv'           : Soara TV, un épisode récent avec vignette
//   - 'retrospective': Rétrospective 2025, un mois récent
//   - 'grands-formats': Grands formats, 1 ou 2 entrées
//   - 'indicateurs'  : Indicateurs (énergie, devises, matières), priorité éco
//   - 'newsletter'   : Bloc d'abonnement compact à /abonnement

export type SidebarModuleKey =
  | 'lettre'
  | 'ailleurs'
  | 'portraits'
  | 'tv'
  | 'retrospective'
  | 'grands-formats'
  | 'indicateurs'
  | 'newsletter'

// Clé de catégorie telle qu'elle apparaît dans articles.json (geo, eco, etc.).
export type CategoryKey =
  | 'geo' | 'eco' | 'tech' | 'env' | 'soc' | 'culture' | 'portrait'

// Ordre des modules par catégorie. Trois à quatre par défaut, ce qui tient
// confortablement dans la colonne droite sans la faire dépasser la longueur
// de la liste à gauche, même sur une catégorie mince (env, 4 articles).
export const CATEGORY_MODULES: Record<CategoryKey, SidebarModuleKey[]> = {
  geo:      ['grands-formats', 'ailleurs', 'tv', 'lettre'],
  eco:      ['indicateurs', 'grands-formats', 'ailleurs', 'newsletter'],
  tech:     ['grands-formats', 'ailleurs', 'tv', 'lettre'],
  env:      ['ailleurs', 'grands-formats', 'retrospective', 'newsletter'],
  soc:      ['lettre', 'ailleurs', 'portraits', 'newsletter'],
  culture:  ['portraits', 'lettre', 'ailleurs', 'newsletter'],
  portrait: ['portraits', 'ailleurs', 'tv', 'newsletter'],
}
