# Système typographique Soara, proposition

Document de Phase 2 du Chantier 2. Proposition à valider avant tout refactor. Aucun fichier CSS n'est touché à ce stade. Une fois validé, sert de spec pour la Phase 3 (application).

Décisions du fondateur déjà actées :
- Cormorant Garamond pour les chapeaux, italique sur article, droit sur grand format
- Deux esprits pour les chiffres, Playfair pour stats éditoriales, DM Mono pour données techniques
- Trois poids autorisés, 400 / 600 / 700
- Deux contextes H1, un standard et un hero

## 1. Principes

| # | Principe |
|---|---|
| 1 | Une seule police par rôle. Si deux endroits font la même chose, ils utilisent la même police. |
| 2 | Une échelle modulaire fixe. Toute taille en dehors de l'échelle doit être justifiée par écrit. |
| 3 | Trois poids autorisés (400, 600, 700) plus le 500 en variante "bold" pour les polices qui n'ont pas de 600/700. |
| 4 | Chaque élément éditorial déclare sa propre `font-family`. Aucun rendu ne doit dépendre de l'héritage `body`. |
| 5 | Variables CSS centralisées dans `globals.css`. Les modules ne définissent plus de tailles ou poids en dur. |

## 2. Polices retenues, mise à jour du chargement

Les 5 polices actuelles sont conservées. Une 6e (Source Serif Pro orpheline) est supprimée.

| Police | Rôle | Poids à charger |
|---|---|---|
| Playfair Display | Titres, chiffres éditoriaux, logo Header | 400, 600, 700 (italic et droit) |
| Cormorant Garamond | Chapeaux, lead court, slogan Footer | 400, 500, 600, 700 (italic et droit) |
| Source Serif 4 | Corps lecture longue (article, entretien, grand format) | 400, 600, 700 |
| DM Sans | UI, légendes d'image | 400, 600, 700 |
| DM Mono | Eyebrows, métadonnées, boutons, chiffres techniques | 300, 400, 500 (le 600/700 n'existe pas chez Google) |

**Action Phase 3** : remplacer l'`@import` Google Fonts en haut de `globals.css` pour charger les poids 600 et 700 sur Cormorant Garamond et DM Sans, ajouter 600 sur Playfair Display. Aucune modification pour DM Mono (limité au 500).

**Cas particulier DM Mono**. Google Fonts ne charge que jusqu'au 500. Donc pour les composants en DM Mono qui doivent paraître "bold" (boutons, eyebrows, liens nav), on utilise le 500 amplifié par `text-transform: uppercase` et `letter-spacing`. Documenté ci-dessous.

## 3. Échelle modulaire, 6 tailles + 1 modificateur hero

| Variable | Valeur | Usage type |
|---|---|---|
| `--type-xs` | `10px` | Eyebrows, tags catégorie, ID techniques, dates de mise à jour techniques |
| `--type-sm` | `13px` | Métadonnées (date, auteur, temps de lecture), légendes d'image, liens Header et Footer |
| `--type-base` | `17px` | UI courte, lead encart, citations Footer |
| `--type-lg` | `clamp(18px, 1.6vw, 21px)` | Corps lecture longue (article, entretien, grand format), chapeau article et grand format, H3 |
| `--type-h2` | `clamp(24px, 2.6vw, 32px)` | H2, citations pull-quote |
| `--type-h1` | `clamp(34px, 4.8vw, 56px)` | H1 standard (90% des pages) |
| `--type-h1-hero` | `clamp(56px, 7vw, 88px)` | H1 hero (Home, Grands Formats) |

L'échelle suit un ratio approximatif de 1.3 entre niveaux adjacents. Lisible sur mobile, hiérarchique sur desktop.

## 4. Poids autorisés

| Variable | Valeur | Usage |
|---|---|---|
| `--weight-regular` | `400` | Corps, chapeau, lead, légendes, citations |
| `--weight-semibold` | `600` | H2, H3, sous-titres, métadonnées appuyées |
| `--weight-bold` | `700` | H1, logos, boutons (sauf DM Mono) |
| `--weight-mono-bold` | `500` | Variante "bold" pour les composants en DM Mono uniquement (boutons, eyebrows, liens nav) |

## 5. Line-heights

| Variable | Valeur | Usage |
|---|---|---|
| `--lh-tight` | `1.0` | Titres très grands (H1 hero, chiffres XL) |
| `--lh-title` | `1.1` | H1 standard, H2, logos |
| `--lh-ui` | `1.45` | H3, lead court, UI, boutons, métadonnées |
| `--lh-reading` | `1.65` | Corps lecture longue, chapeau article |

## 6. Couleurs d'encre, alignement avec l'existant

Le projet a déjà ses variables couleurs dans `globals.css`. On les conserve, on ne crée pas de doublons. Pour la doc typo, on précise simplement quelle variable couleur correspond à quel rôle.

| Variable existante | Valeur | Rôle typographique |
|---|---|---|
| `--encre` | #0A0A0A | Corps texte par défaut, titres |
| `--gris` | #3D3D3D | Texte secondaire, paragraphes désaccentués |
| `--gris-m` | #6A6A6A | Métadonnées, légendes |
| `--gris-l` | #9A9590 | Texte tertiaire, placeholders |
| `--or` | #C8A96E | Accents éditoriaux, mots-clés mis en avant |
| `--geo` | #1A3E6B | Bleu Prussian, accent géopolitique, certains H1 thématiques |

Pas besoin de nouvelles variables couleurs.

## 7. Tableau rôle, spécification complète

Tableau de référence à utiliser pendant la Phase 3 pour chaque CSS Module. Une ligne = un rôle = une déclaration unique appliquée partout.

| Rôle | Police | Taille | Poids | Line-height | Style |
|---|---|---|---|---|---|
| **H1 standard** | Playfair Display | `--type-h1` | `--weight-bold` (700) | `--lh-title` | normal |
| **H1 hero** (Home, Grands Formats) | Playfair Display | `--type-h1-hero` | `--weight-bold` (700) | `--lh-tight` | normal |
| **H2** | Playfair Display | `--type-h2` | `--weight-semibold` (600) | `--lh-title` | normal |
| **H3** | Playfair Display | `--type-lg` | `--weight-semibold` (600) | `--lh-ui` | normal |
| **Corps article / entretien / grand format** | Source Serif 4 | `--type-lg` | `--weight-regular` (400) | `--lh-reading` | normal |
| **Chapeau article** | Cormorant Garamond | `--type-lg` | `--weight-regular` (400) | `--lh-reading` | italic |
| **Chapeau grand format** | Cormorant Garamond | `--type-lg` | `--weight-regular` (400) | `--lh-reading` | normal |
| **Lead court (cards, encarts)** | Cormorant Garamond | `--type-base` | `--weight-regular` (400) | `--lh-ui` | normal |
| **Eyebrow / surtitre catégorie** | DM Mono | `--type-xs` | `--weight-mono-bold` (500) | `--lh-ui` | uppercase, letter-spacing 0.08em |
| **Métadonnées (date, auteur, temps de lecture)** | DM Mono | `--type-sm` | `--weight-regular` (400) | `--lh-ui` | normal |
| **Légendes d'image** | DM Sans | `--type-sm` | `--weight-regular` (400) | `--lh-ui` | italic optionnel |
| **Citations / pull-quotes** | Cormorant Garamond | `--type-h2` | `--weight-regular` (400) | `--lh-title` | italic |
| **Boutons / CTA** | DM Mono | `--type-base` | `--weight-mono-bold` (500) | `--lh-ui` | uppercase, letter-spacing 0.06em |
| **Liens nav Header** | DM Mono | `--type-sm` | `--weight-mono-bold` (500) | `--lh-ui` | uppercase, letter-spacing 0.06em |
| **Logo Header** | Playfair Display | 44px (fixe) | `--weight-bold` (700) | `--lh-tight` | normal |
| **Logo Footer** | Playfair Display | `--type-h2` | `--weight-regular` (400) | `--lh-tight` | normal |
| **Slogan Footer** | Cormorant Garamond | `--type-base` | `--weight-regular` (400) | `--lh-ui` | normal |
| **Liens Footer** | DM Mono | `--type-sm` | `--weight-mono-bold` (500) | `--lh-ui` | uppercase, letter-spacing 0.06em |
| **Chiffres éditoriaux (stats articles)** | Playfair Display | variable (`--type-h2` à `--type-h1`) | `--weight-regular` (400) | `--lh-tight` | normal |
| **Chiffres techniques (indicateurs, ID)** | DM Mono | variable (`--type-base` à `--type-h2`) | `--weight-mono-bold` (500) | `--lh-tight` | normal, tabular-nums |

## 8. Critère de choix Playfair versus DM Mono pour les chiffres

Règle, à inscrire en commentaire dans `globals.css` :

> Un chiffre se rend en **Playfair Display** s'il est intégré au récit éditorial, comme une statistique citée dans un paragraphe d'article ou un grand format. Le chiffre fait alors partie de la prose, il participe au rythme de lecture.
>
> Un chiffre se rend en **DM Mono** s'il est une donnée technique, comme une valeur d'indicateur, un identifiant, une date de mise à jour, un poids, une coordonnée. Le chiffre est alors une lecture rapide, monospace pour l'alignement vertical (`tabular-nums`).

Si on hésite entre les deux, se demander : "est-ce que ce chiffre se lit dans une phrase ?". Si oui, Playfair. Si non, DM Mono.

## 9. H1 standard versus H1 hero, politique

| Contexte | H1 utilisé | Justification |
|---|---|---|
| **Home** | hero | Page d'accueil, impact visuel maximal |
| **Grands Formats** | hero | Format long-form, le titre est un événement |
| **Article standard** | standard | Lecture quotidienne, le titre ne doit pas écraser le contenu |
| **Entretien** | standard | Idem |
| **Signal** | standard | Page liste, hiérarchie sobre |
| **Indicateurs** | standard | Idem |
| **Catégorie** | standard | Idem |
| **Abonnement** | standard | Page transactionnelle, pas de spectacle |
| **Visuels / Atlas** | standard | Le visuel est la vedette, pas le titre |

Toute nouvelle page utilise H1 standard par défaut. Le hero reste l'exception.

## 10. Bloc de variables CSS à ajouter dans `globals.css`

Proposition de bloc à insérer dans `:root` au-dessus des couleurs catégorielles. Aucune des variables existantes n'est touchée.

```css
:root {
  /* Échelle typographique (Phase 3 du Chantier 2 typo) */
  --type-xs:      10px;
  --type-sm:      13px;
  --type-base:    17px;
  --type-lg:      clamp(18px, 1.6vw, 21px);
  --type-h2:      clamp(24px, 2.6vw, 32px);
  --type-h1:      clamp(34px, 4.8vw, 56px);
  --type-h1-hero: clamp(48px, 6.5vw, 76px);

  --weight-regular:    400;
  --weight-semibold:   600;
  --weight-bold:       700;
  --weight-mono-bold:  500;

  --lh-tight:    1.0;
  --lh-title:    1.1;
  --lh-ui:       1.45;
  --lh-reading:  1.65;

  --font-serif-display: 'Playfair Display', Georgia, serif;
  --font-serif-text:    'Cormorant Garamond', Georgia, serif;
  --font-serif-reading: var(--font-source-serif), Georgia, serif;
  --font-sans:          'DM Sans', system-ui, sans-serif;
  --font-mono:          'DM Mono', ui-monospace, monospace;
}
```

Note sur `--font-serif-reading` : la variable `--font-source-serif` est déjà créée par `next/font/google` dans `layout.tsx`. On l'enveloppe dans une variable composite cohérente avec les autres familles.

## 11. Plan de refactor Phase 3

Quand la Phase 2 est validée, la Phase 3 s'exécute en 4 sous-étapes, chacune testée visuellement avant la suivante.

| Sous-étape | Action | Risque visuel |
|---|---|---|
| 3.1 | Étendre l'`@import` Google Fonts (ajouter 600 et 700 sur Cormorant et DM Sans, 600 sur Playfair) | Nul, on ajoute des poids, on n'en retire pas |
| 3.2 | Ajouter le bloc de variables CSS dans `globals.css`. Supprimer la référence orpheline `Source Serif Pro` dans `entretien.module.css` | Faible, juste un fix d'héritage sur entretien |
| 3.3 | Refactor module par module (page.module.css, ArticleLayout, GrandFormatLayout, entretien, category, indicateurs, signal, abonnement, visuels, Header, Footer). Remplacer toutes les déclarations en dur par les variables. Ajouter `font-family` explicite sur eyebrows, métadonnées, légendes. | Moyen, chaque module testé visuellement après refactor |
| 3.4 | Supprimer les `!important` non documentés dans `article-content.css` après vérification que le cascade fonctionne. Nettoyer les polices fantômes (Helvetica Neue, Arial) dans le sourçage légal. | Faible, audit final |

Estimation Phase 3 : 1h30 à 2h, un seul commit en fin de phase comme convenu.

---

**Décision attendue de Steve** : valider ce système tel quel, ou demander des ajustements. Une fois validé, je passe en Phase 3.
