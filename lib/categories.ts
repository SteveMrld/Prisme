// Table centrale catégorie -> libellé.
// Les couleurs vivent déjà dans globals.css (variables --geo, --eco, --tech,
// --env, --soc, --culture) et se propagent via l'attribut data-cat ->
// --catColor. Ce module ne porte que les libellés, pour éviter de les
// redéfinir entrée par entrée (certains articles n'ont pas de categoryLabel).

export type CategoryKey =
  | 'geo' | 'eco' | 'tech' | 'env' | 'soc' | 'culture' | 'portrait'

export const CATEGORY_LABELS: Record<string, string> = {
  geo: 'Géopolitique',
  eco: 'Économie',
  tech: 'Technologie',
  env: 'Environnement',
  soc: 'Société',
  culture: 'Culture',
  portrait: 'Portrait',
}

// Renvoie le libellé d'une catégorie. Tolère un libellé explicite en repli
// (champ categoryLabel d'une entrée) puis une chaîne vide si rien ne matche.
export function categoryLabel(code?: string, fallback?: string): string {
  if (code && CATEGORY_LABELS[code]) return CATEGORY_LABELS[code]
  return fallback || ''
}
