# Audit typographique Soara, état au 2026-05-19

Document généré dans le cadre du Chantier 2 du sprint pré-launch. Lecture seule, aucune modification de code à ce stade. Sert de base de discussion à la Phase 2 (proposition d'un système typographique unifié).

## 1. Polices déclarées dans le projet

| Police | Mode de chargement | Déclaration | Usage observé |
|---|---|---|---|
| Playfair Display | `<link>` Google Fonts | `app/globals.css:1` | Titres, logos, chiffres mis en avant |
| Cormorant Garamond | `<link>` Google Fonts | `app/globals.css:1` | Chapeaux, citations, descriptions |
| DM Sans | `<link>` Google Fonts | `app/globals.css:1`, appliquée au `body` ligne 74 | Corps standard (par défaut) |
| DM Mono | `<link>` Google Fonts | `app/globals.css:1` | Eyebrows, tags, dates, CTA, catégories |
| Source Serif 4 | `next/font/google` | `app/layout.tsx:3-20`, variable CSS `--font-source-serif` | Corps éditoriaux longs (articles) |
| Georgia | Fallback OS | Combinée à Playfair dans plusieurs modules | Filet de sécurité |

### Polices marginales ou héritées

| Police | Statut | Remarque |
|---|---|---|
| Source Serif Pro | Référence orpheline | `entretien.module.css:257` la cite mais elle n'est chargée nulle part. Probable faute de frappe pour Source Serif 4. À corriger. |
| Helvetica Neue, Arial | Legacy | 6 occurrences, toutes dans des éléments de sourçage légal (recoupement, mentions). Pas dans le flux éditorial. |
| IBM Plex Mono | Fallback | 3 mentions en chaîne `font-family`, jamais en valeur principale. |
| Courier New | Isolée | 1 occurrence, contexte non éditorial. |

### Verdict

Quatre polices "éditoriales" en service (Playfair, Cormorant, DM Sans, DM Mono) plus une cinquième (Source Serif 4) chargée via une mécanique différente (`next/font`). Cinq familles c'est déjà beaucoup pour un site éditorial, mais le découpage usage par usage tient debout. Le vrai problème n'est pas la quantité de polices, c'est la façon dont chacune est appliquée d'une page à l'autre.

## 2. Inventaire des types typographiques

Pour chaque type, on liste toutes les déclarations trouvées dans le projet. Une multiplicité de lignes pour un même type = incohérence à arbitrer en Phase 2.

### H1 (titres principaux)

| Page / contexte | Fichier:ligne | font-family | font-size | font-weight | line-height |
|---|---|---|---|---|---|
| Home | `page.module.css:100` | Playfair Display | clamp(26px, 5vw, 38px) | 700 | 1.1 |
| Article standard (CSS legacy) | `article-content.css:96` | Playfair Display | clamp(28px, 4.5vw, 52px) | 400 | 1.1 |
| Article standard (layout) | `ArticleLayout.module.css:60` | Playfair Display | clamp(34px, 6vw, 64px) | 400 | 1.1 |
| Grand format | `GrandFormatLayout.module.css:89` | Playfair Display, Georgia | clamp(36px, 5.5vw, 68px) | 900 | 1.0 |
| Entretien | `entretien.module.css:82` | Playfair Display | clamp(36px, 5vw, 58px) | 700 | 1.05 |
| Catégorie | `category.module.css:28` | Playfair Display | clamp(36px, 5vw, 64px) | 300 | 1.05 |
| Indicateurs | `indicateurs.module.css:33` | Playfair Display | clamp(28px, 5vw, 52px) | 300 | 1.05 |
| Visuels | `visuels.module.css:22` | Playfair Display | clamp(48px, 6vw, 72px) | 300 | 1.04 |

**8 déclarations différentes** pour H1. La police est cohérente (Playfair partout), mais les poids vont de 300 à 900 et les tailles maximales de 38px à 72px.

### H2 et H3

| Type | Fichier:ligne | font-family | font-size | font-weight | line-height |
|---|---|---|---|---|---|
| H2 article | `article-content.css:29` | Playfair Display | 28px | 400 | 1.15 |
| H2 entretien | `entretien.module.css:247` | Playfair Display | 19px | 700 | 1.45 |
| H3 article | `article-content.css:30` | Playfair Display | 22px | 400 | 1.15 |

Écart H2 article (28px / 400) versus H2 entretien (19px / 700) très visible.

### Corps de texte

| Page / contexte | Fichier:ligne | font-family | font-size | font-weight | line-height |
|---|---|---|---|---|---|
| Tout le site (défaut) | `globals.css:74` | DM Sans | hérité | 300 | hérité |
| Article standard | `article-content.css:9` | Source Serif 4 (via var) | 19px | 400 | 1.6 |
| Entretien | `entretien.module.css:257` | Source Serif Pro (orpheline) | 17px | 400 | 1.75 |

Le corps article et le corps entretien ne tournent pas sur la même police. L'entretien référence même une police qui n'est pas chargée (Source Serif Pro vs Source Serif 4).

### Lead, chapeau, intro

| Page / contexte | Fichier:ligne | font-family | font-size | font-weight | line-height |
|---|---|---|---|---|---|
| Article (CSS legacy) | `article-content.css:108` | Cormorant Garamond | 21px | 400 | 1.65 |
| Article (layout) | `ArticleLayout.module.css:75` | Cormorant Garamond | clamp(17px, 2.2vw, 21px) | 400 | 1.65 |
| Grand format | `GrandFormatLayout.module.css:103` | Playfair Display, Georgia | clamp(15px, 1.7vw, 19px) | 400 | 1.6 |

Article et grand format n'utilisent pas la même police pour le chapeau (Cormorant versus Playfair).

### Eyebrow (surtitre catégorie)

| Page / contexte | Fichier:ligne | font-family | font-size | font-weight |
|---|---|---|---|---|
| Home (eyebrow 1) | `page.module.css:27` | DM Mono | 9px | 700 |
| Home (eyebrow 2) | `page.module.css:61` | DM Mono | 9px | 700 |
| Signal | `signal.module.css:43` | hérité (DM Sans) | 9px | 700 |
| Visuels | `visuels.module.css:10` | DM Mono | 10px | 500 |

Signal ne déclare pas de `font-family`, l'eyebrow y est rendu en DM Sans alors que partout ailleurs c'est DM Mono.

### Métadonnées (date, auteur, temps de lecture)

| Page / contexte | Fichier:ligne | font-family | font-size | font-weight |
|---|---|---|---|---|
| Article | `article-content.css:87` | hérité (DM Sans) | 9px | hérité |
| Home | `page.module.css:12` | hérité | 9px | hérité |
| Article layout | `ArticleLayout.module.css:50` | hérité | 9px | 400 |

Aucune déclaration explicite de `font-family`, dépendance à l'héritage du body. Sur l'article on s'attend probablement à du DM Mono comme partout, mais ce n'est pas écrit.

### Légendes d'image

| Page / contexte | Fichier:ligne | font-family | font-size | font-weight |
|---|---|---|---|---|
| Article layout | `ArticleLayout.module.css:18` | hérité | 11px | hérité |
| Home | `page.module.css:184` | hérité | 10px | 700 |

Tailles divergentes (10px versus 11px), aucune police explicite.

### Citations et pull-quotes

| Type | Fichier:ligne | font-family | font-size | font-weight | line-height |
|---|---|---|---|---|---|
| Blockquote standard | `article-content.css:480` | Playfair Display | 22px | 400 | 1.5 |
| Blockquote variante | `article-content.css:507` | Playfair Display | 24px | 400 | 1.5 |
| Pull-quote home | `page.module.css:272` | Cormorant Garamond | clamp(20px, 2.4vw, 26px) | 400 | 1.35 |

Trois traitements différents pour exprimer une citation.

### Boutons et CTA

| Page / contexte | Fichier:ligne | font-family | font-size | font-weight |
|---|---|---|---|---|
| Abonnement | `abonnement.module.css:149` | DM Mono | 9px | 700 |
| Home (CTA 1) | `page.module.css:329` | DM Mono | 10.5px | hérité |
| Home (CTA 2) | `page.module.css:501` | DM Mono | 10.5px | hérité |

Police OK (DM Mono partout), tailles à arbitrer (9px vs 10.5px) et poids partiellement non spécifié.

### Navigation Header

| Élément | Fichier:ligne | font-family | font-size | font-weight |
|---|---|---|---|---|
| Logo Header | `Header.module.css:33` | Playfair Display | 44px | 700 |
| Liens nav | `Header.module.css:56` | hérité (DM Sans) | 9px | 500 |

### Footer

| Élément | Fichier:ligne | font-family | font-size | font-weight |
|---|---|---|---|---|
| Logo Footer | `Footer.module.css:29` | Playfair Display | 32px | 400 |
| Slogan Footer | `Footer.module.css:45` | Cormorant Garamond | 17px | 400 |
| Liens Footer | `Footer.module.css:73` | DM Mono | 10px | 500 |

### Chiffres et statistiques

| Page / contexte | Fichier:ligne | font-family | font-size | font-weight |
|---|---|---|---|---|
| Article stats | `article-content.css:398` | Playfair Display | 36px | 300 |
| Article stats | `article-content.css:428` | Playfair Display | 48px | 300 |
| Article stats | `article-content.css:455` | Playfair Display | 52px | 300 |
| Indicateurs | `indicateurs.module.css:119` | DM Mono | clamp(22px, 3.5vw, 32px) | 500 |

Deux esprits radicalement opposés pour les chiffres : Playfair serif éditorial pour les articles, DM Mono technique pour les indicateurs. À trancher en Phase 2 (probablement les deux usages sont légitimes, à condition de documenter quand on utilise lequel).

## 3. Tableau synthétique des incohérences les plus visibles

| Type | Page A | Page B | Différence |
|---|---|---|---|
| H1 | Home (Playfair 38px, 700) | Article (Playfair 64px, 400) | 26px d'écart en max-size, poids 700 vs 400 |
| H1 | Article (Playfair 64px, 400) | Grand format (Playfair 68px, 900) | Poids 400 vs 900 (extrême) |
| H1 | Catégorie (Playfair 300) | Home (Playfair 700) | Poids 300 vs 700 sur la même police |
| Chapeau | Article (Cormorant 21px) | Grand format (Playfair 19px) | Police différente |
| Corps | Article (Source Serif 4, 19px) | Entretien (Source Serif Pro, 17px) | Police différente (Pro n'est pas chargée), taille différente |
| Eyebrow | Home (DM Mono explicite) | Signal (DM Sans hérité) | Police différente faute de déclaration explicite |
| Métadonnées | Article, Home, ArticleLayout | tous | Aucune police explicite, dépendance fragile à l'héritage |
| Légendes | Article (11px) | Home (10px) | Taille divergente, aucune police explicite |
| Chiffres | Article (Playfair 36-52px, 300) | Indicateurs (DM Mono 22-32px, 500) | Deux philosophies opposées, à arbitrer ou documenter |

## 4. Règles mortes, conflictuelles ou suspectes

| Symptôme | Localisation | Impact |
|---|---|---|
| Source Serif Pro référencée mais non chargée | `entretien.module.css:257` | Le navigateur fallback sur autre chose, rendu probable en serif système. Visuel non maîtrisé. |
| `:global(p.interview-question)` et 3 autres | `entretien.module.css:235, 246, 256, 264, 272` | Contourne CSS Modules, couple le module à un nommage global non documenté. Fragile au refactor. |
| `!important` sur font-family | `article-content.css:480, 506, 571, 784` (env. 4 occurrences) | Surcharges non documentées, source de bugs si on touche aux styles parents. |
| Helvetica Neue, Arial dans des éléments éditoriaux | sourçage légal uniquement | Pas un bug visible, mais polices "fantômes" dans le projet. À nettoyer en Phase 2. |
| `.liveText` (indicateurs) avec DM Mono explicite | `indicateurs.module.css:23` | À vérifier que la classe est encore utilisée. |
| Migration `.article-body` versus `.soara-article` à mi-chemin | divers | Suggère un refactor inachevé, à clore. |
| Eyebrow Signal sans `font-family` | `signal.module.css:43` | Visuellement le rendu diffère des autres eyebrows, probablement non voulu. |
| Métadonnées sans `font-family` partout | toutes les pages | Si un jour quelqu'un change le `body { font-family }`, les métadonnées suivent silencieusement. |

## 5. Synthèse pour la Phase 2

Le diagnostic confirme le sentiment du fondateur. Soara n'a pas un problème de "trop de polices", il a un problème de **système absent**. Les mêmes polices sont déclinées en 5 à 8 variantes selon la page. Aucun fichier ne sert de référence centrale ("voici les 6 tailles autorisées, voici les 3 poids autorisés"). Chaque module CSS a improvisé.

Les 4 points les plus urgents à traiter en Phase 2 :

1. **Hiérarchie H1, H2, H3 unifiée** : une seule échelle clamp, un seul poids par niveau, un seul line-height. Aujourd'hui H1 oscille entre 300 et 900 en poids et 38px à 72px en taille max.
2. **Choix tranché pour les chapeaux** : Cormorant Garamond OU Playfair, pas les deux. Le mélange actuel est probablement à l'origine du "ça change selon la page" perçu par le fondateur.
3. **Corps unique** : Source Serif 4 partout en lecture longue (article + entretien + grand format), DM Sans réservé aux composants UI courts. Supprimer la référence orpheline "Source Serif Pro".
4. **Déclarations explicites** : aucun élément éditorial ne devrait dépendre de l'héritage `body`. Métadonnées, eyebrows, légendes doivent toutes déclarer leur `font-family`.

Une fois ces 4 points tranchés en Phase 2 (proposition d'un système, validation, puis Phase 3 application), on aura une base typo stable pour le launch du 1er juin.
