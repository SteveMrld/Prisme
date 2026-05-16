# Test parcours abonnement bout-en-bout

À exécuter avant launch en navigation privée, sur le domaine de prod (ou la preview Vercel si test sur clés Stripe TEST).

## 1. Pré-requis

- **Navigation privée** (fenêtre incognito Chrome/Firefox). Aucune session Supabase pré-existante, aucun cookie Stripe.
- **Mode Stripe** :
  - Si test sur prod (clés `sk_live`) : carte réelle, montant réellement débité (à rembourser ensuite via Stripe Dashboard, ou test en fin de mois pour annuler avant facture).
  - Si test sur preview (clés `sk_test` configurées sur la preview Vercel) : carte test `4242 4242 4242 4242`, date future, CVC libre, code postal libre.
- **Email jetable** ou alias `+test@gmail.com` non utilisé. Ne pas réutiliser un email déjà lié à un Stripe customer.
- **Onglets ouverts en parallèle** pour observation temps réel :
  - Supabase Studio, table `profiles` filtrée par email du compte test.
  - Stripe Dashboard, vue `Developers > Events` filtrée sur les 30 dernières minutes.
  - DevTools navigateur, onglet `Network`.

## 2. Parcours nominal (inscription, abonnement, paiement)

### Étape 1 : Inscription
1. Aller sur `/inscription`.
2. Remplir email + mot de passe + valider.
3. **Observations attendues** :
   - Redirection vers `/connexion` ou `/compte` selon le flow.
   - Ligne créée dans Supabase `auth.users` (vue Studio > Authentication).
   - Ligne créée dans `profiles` avec `id` = `auth.users.id`, `subscription_status` à `null` ou `'inactive'`, `stripe_customer_id` à `null`.
4. **Critère d'échec** : ligne `profiles` absente après inscription (trigger SQL `handle_new_user` cassé).

### Étape 2 : Abonnement
1. Aller sur `/abonnement` (déjà connecté).
2. Cliquer sur l'offre Mensuel (9,99 EUR) ou Annuel (99 EUR).
3. **Observations attendues** :
   - DevTools Network : `POST /api/stripe/checkout` retourne 200, body `{ url: "https://checkout.stripe.com/..." }`.
   - Redirection vers Stripe Checkout, locale `fr`, montant correct, libellé produit `SOARA Mensuel` ou `SOARA Annuel` après renommage du Dashboard.
   - Dans Supabase `profiles`, `stripe_customer_id` désormais rempli (`cus_...`) : la route checkout crée le customer si absent.
4. **Critères d'échec** :
   - `POST /api/stripe/checkout` retourne 401 (session Supabase perdue).
   - `priceId` invalide côté Stripe (vérifier la valeur passée en payload Network).
   - `stripe_customer_id` reste `null` après l'appel (log `failed to store stripe_customer_id` dans Vercel Logs).

### Étape 3 : Paiement
1. Sur la page Stripe Checkout : carte test `4242 4242 4242 4242` (mode TEST) ou carte réelle (mode LIVE).
2. Valider.
3. **Observations attendues** :
   - Redirection automatique vers `/compte?success=true`.
   - Stripe Dashboard, Events : `checkout.session.completed` puis `customer.subscription.created` puis `customer.subscription.updated` (rapide, quelques secondes).
   - Endpoint webhook répond 200 sur chacun (visible dans Events > détail event > webhook attempts).
4. **Vérifications post-paiement dans Supabase** (Studio, `profiles`, ligne du compte test) :
   - `subscription_status` = `'active'`.
   - `stripe_subscription_id` = `'sub_...'`.
   - `subscription_end_date` = date `current_period_end + 1 mois` (ou `+1 an`).
5. **Critères d'échec** :
   - Webhook répond autre que 200 (signature invalide, env `STRIPE_WEBHOOK_SECRET` mauvaise valeur).
   - `profiles.subscription_status` reste `null` à T+30s alors que les events Stripe sont bien arrivés (filtrage `SOARA_PRICE_IDS` rejette le price : un `priceId` ne figure pas dans la liste codée dans `app/api/stripe/webhook/route.ts`).
   - Webhook ignoré avec `not a SOARA product` dans les logs Vercel (vérifier que le price utilisé matche bien la liste blanche).
   - `not a SOARA event without supabase_user_id metadata`: la metadata `supabase_user_id` n'a pas été propagée (bug `checkout.sessions.create` payload).

### Étape 4 : Accès gated
1. Naviguer vers un article premium (par exemple un grand-format).
2. **Observations attendues** :
   - Contenu complet visible, pas de paywall.
   - Si paywall persistant : le middleware ou le composant gating lit `subscription_status` au moment du render, vérifier qu'un refresh complet (Ctrl+Shift+R) charge la valeur fraîche.

## 3. Parcours portal (annulation)

### Étape 5 : Accès Customer Portal
1. Sur `/compte`, cliquer sur le bouton portal (ou trigger UI équivalent qui appelle `POST /api/stripe/portal`).
2. **Observations attendues** :
   - DevTools Network : `POST /api/stripe/portal` retourne 200, `{ url: "https://billing.stripe.com/p/..." }`.
   - Redirection vers le portail Stripe en français.
   - Le portail affiche l'abonnement actif avec dates et montant.

### Étape 6 : Annulation
1. Dans le portail, annuler l'abonnement (fin de période).
2. Retour sur `/compte`.
3. **Observations attendues** :
   - Stripe Events : `customer.subscription.updated` avec `cancel_at_period_end=true`.
   - Supabase `profiles.subscription_status` reste `'active'` jusqu'à fin de période (comportement normal Stripe).
4. **Pour tester la fin effective** : sur Stripe Dashboard > Subscriptions, action "Cancel immediately" sur la subscription test.
5. **Vérifications après cancel immédiat** :
   - Stripe Events : `customer.subscription.deleted`.
   - Supabase `profiles.subscription_status` = `'inactive'`.
   - Accès article premium re-bloqué après refresh.

## 4. Nettoyage post-test

- Stripe Dashboard, Customers > supprimer le customer test (`cus_...`) si compte test jetable.
- Supabase, supprimer l'utilisateur de test via Authentication > Users > Delete (cascade vers `profiles`).
- Si test sur clés LIVE : émettre un refund sur le paiement test depuis Stripe Dashboard.

## 5. Récap des price IDs SOARA en production

Hardcodés dans `app/api/stripe/webhook/route.ts` (whitelist `SOARA_PRICE_IDS`) :

| Produit         | Price ID                          | Montant       |
|-----------------|-----------------------------------|---------------|
| Mensuel         | `price_1TJXihC6CLNu3aKe1vGRZ9El`  | 9,99 EUR / mois |
| Annuel          | `price_1TJXmhC6CLNu3aKeagFuxvRu`  | 99 EUR / an     |
| Pack recoupement| `price_1TOiedC6CLNu3aKevA5aUahV`  | 3,99 EUR one-time |

Si un de ces price IDs change (renommage Stripe ne change PAS l'ID, mais création d'un nouveau price oui), la whitelist webhook doit être mise à jour dans le code, sinon le webhook ignore les events.
