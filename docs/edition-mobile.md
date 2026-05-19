# Édition mobile, mode d'emploi

Trois espaces du site sont éditables directement depuis l'application GitHub mobile, sans repasser par Claude Code ni par un éditeur de bureau. Chaque espace est piloté par un fichier JSON centralisé dans `lib/`.

| Espace | Fichier | Effet sur le site |
|---|---|---|
| Fil signal | `lib/fil-signal.json` | Liste des brèves sur `/signal` |
| Indicateurs | `lib/indicateurs.json` | Six cartes sur `/indicateurs` (libellés, contexte, valeurs de repli) |
| Signal Map | `lib/signal-zones.json` | Douze zones du globe sur `/signal-map` |

## Workflow général depuis l'app GitHub mobile

1. Ouvrir le repo `Prisme` dans l'app GitHub
2. Naviguer dans `lib/` et choisir le bon JSON
3. Toucher l'icône crayon en haut à droite pour éditer
4. Modifier le contenu (ajouter, supprimer, corriger une entrée)
5. Toucher "Commit changes" en haut à droite
6. Saisir un message de commit court, par exemple `content: ajout breve Pékin`
7. Valider, le commit pousse directement sur `main`
8. Vercel détecte le push et rebuild automatiquement (compter 1 à 2 minutes)
9. Vérifier sur le site en production (https://soara.fr ou la preview de la branche)

## Pièges JSON à connaître

Le JSON est strict, le moindre caractère oublié casse le build. Vercel rejettera le déploiement et le site restera sur la version précédente, donc rien n'est cassé en prod, mais la modification n'apparaîtra pas tant que le JSON n'est pas valide.

**Virgules entre entrées**. Chaque objet `{...}` dans une liste est séparé par une virgule, sauf le dernier.

```json
[
  { "id": "a" },
  { "id": "b" },
  { "id": "c" }
]
```

**Pas de virgule traînante** après le dernier élément. Ceci casse :

```json
[
  { "id": "a" },
  { "id": "b" },
]
```

**Guillemets droits uniquement**. Toujours `"` (droit), jamais `"` ou `"` (typographiques). Idem pour les apostrophes dans les valeurs, c'est `'` qui passe sans souci à l'intérieur d'une chaîne `"..."`.

**Guillemets dans une chaîne**. Si une citation contient un guillemet, l'échapper avec un anti-slash : `"il a dit \"non\""`.

**Accents**. Aucun problème, le JSON est en UTF-8. Écrire normalement `Pékin`, `Côte d'Ivoire`, `Düsseldorf`.

**Pas de tiret cadratin** (le long, `&mdash;` en HTML, U+2014). Règle Soara, on n'en met jamais. Préférer virgule, deux-points ou simple tiret `-`.

**Saut de ligne dans un texte**. Utiliser `\n` à l'intérieur de la chaîne, jamais un vrai retour à la ligne.

## Format détaillé par fichier

### lib/fil-signal.json

Une brève dans le tableau `breves` :

```json
{
  "date": "12 mai 2026",
  "cat": "Géopolitique",
  "catColor": "var(--geo)",
  "headline": "Titre court et incisif",
  "body": "Corps en un paragraphe, factuel, sans em-dash."
}
```

`cat` et `catColor` doivent rester appariés. Valeurs admises :

| `cat` | `catColor` |
|---|---|
| Géopolitique | `var(--geo)` |
| Économie | `var(--eco)` |
| Société | `var(--soc)` |
| Environnement | `var(--env)` |
| Technologie | `var(--tech)` |

Pour **ajouter** une brève en haut du fil, l'insérer en première position du tableau. L'ordre du JSON détermine l'ordre d'affichage.

Pour **mettre à jour** la date du dernier rafraîchissement éditorial, modifier `date_maj` en haut du fichier (format `YYYY-MM-DD`).

### lib/indicateurs.json

Un indicateur dans le tableau `indicateurs` :

```json
{
  "id": "brent",
  "label": "Pétrole Brent",
  "sub": "USD / baril",
  "unit": "$",
  "cat": "Énergie",
  "catColor": "#C4793A",
  "context": "Phrase éditoriale qui explique pourquoi ça bouge.",
  "value": 78.40,
  "prev": 78.92,
  "history": [81.2, 80.4, 79.6, 79.8, 79.1, 78.9, 78.40]
}
```

**Important sur les chiffres**. Les vraies valeurs (`value`, `prev`, `history`) sont rafraîchies en direct depuis les API Frankfurter et Alpha Vantage à chaque chargement de page. Le JSON ne sert que de repli si les API sont indisponibles ou trop lentes. Donc :

- Modifier `label`, `sub`, `cat`, `catColor`, `context` change ce qui s'affiche en permanence
- Modifier `value`, `prev`, `history` n'a d'effet que pendant la fraction de seconde avant le premier appel API réussi

Pour vraiment changer les chiffres affichés, il faut modifier la source API ou désactiver l'appel API correspondant dans le code (demande à Claude Code).

Les six `id` actuels (`brent`, `gold`, `wheat`, `copper`, `eurusd`, `usdcny`) sont câblés à six appels API spécifiques. Ne pas renommer un `id` sans prévenir, l'API correspondante ne se rebrancherait plus.

### lib/signal-zones.json

Une zone dans le tableau `zones` :

```json
{
  "slug": "iran-usa",
  "name": "Iran, États-Unis",
  "region": "Moyen-Orient",
  "lat": 32.4,
  "lng": 53.6,
  "status": "crisis",
  "trend": "up",
  "updated": "13 avril 2026",
  "france": 9,
  "affected": "5 000+ morts (Iran + Liban)",
  "figures": [
    "Jour 45 du conflit",
    "Pétrole : +$100/baril",
    "Blocus US des ports iraniens"
  ],
  "desc": "Description longue, deux à quatre phrases.",
  "tags": ["Conflit armé", "Blocus naval", "Nucléaire"],
  "tagColors": ["#FC8181", "#FC8181", "#F6AD55"],
  "linkedTo": ["ormuz"]
}
```

`status` admis : `crisis`, `tension`, `watch`, `climate`, `calm`.

`trend` admis : `up`, `down`, `stable`.

`france` est un score de 0 à 10 (impact pour la France).

`tags` et `tagColors` doivent avoir le **même nombre d'éléments**, le tag i étant rendu dans la couleur i. Couleurs codées en hex `#RRGGBB`.

`linkedTo` est une liste de **slugs** d'autres zones (pas d'indices). Slugs existants :

```
iran-usa, ormuz, ukraine, sahel, taiwan, corne-afrique,
coree-nord, lac-tchad, cachemire, jourdain-eau, nil-gerd, inde-puissance
```

**Particularité technique**. Le globe `/signal-map` est servi en HTML statique (`public/signal-globe.html`), il ne peut pas lire le JSON directement. Un script Node `scripts/sync-signal-zones.mjs` régénère le bloc des zones dans le HTML à chaque build. Vercel le lance automatiquement avant le build, donc rien à faire manuellement.

Si la regénération échoue (slug invalide dans `linkedTo`, JSON malformé), le build Vercel échoue avec un message clair dans les logs Vercel.

## Vérification post-déploiement

Après le commit, attendre 1 à 2 minutes puis :

1. Ouvrir le site (prod ou preview) sur la page concernée
2. Rafraîchir avec un "hard reload" (sur Safari mobile, maintenir l'icône de rechargement)
3. Vérifier que la modification est visible

Si la modification n'apparaît pas après 3 minutes :

1. Ouvrir l'onglet "Deployments" du projet sur Vercel
2. Chercher le dernier déploiement (correspondant au commit qu'on vient de pousser)
3. S'il est en rouge, ouvrir les logs et lire le message d'erreur (souvent une virgule manquante ou une accolade non fermée)
4. Corriger le JSON depuis l'app GitHub, recommit

En cas de blocage, demander à Claude Code de vérifier le JSON et proposer la correction.
