import { MetadataRoute } from 'next'

// Chemins privés, jamais indexables (admin, auth, API, pages techniques).
const PRIVATE_PATHS = [
  '/admin',
  '/admin-unlock',
  '/api/',
  '/bientot',
  '/preview-unlock',
  '/compte',
  '/connexion',
  '/reset-password',
  '/mot-de-passe-oublie',
]

// Robots de recherche et de citation IA : on les AUTORISE. Ils lisent les
// pages pour pouvoir citer SOARA et renvoyer du trafic (ChatGPT, Claude,
// Perplexity). Les bloquer reviendrait à disparaître de ces réponses.
const AI_SEARCH_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
]

// Robots d'entraînement : on les BLOQUE. Ils aspirent le contenu pour
// nourrir les modèles, sans attribution ni trafic en retour. Bloquer
// Google-Extended exclut l'entraînement de Gemini sans toucher au
// classement Google Search (robot distinct de Googlebot).
const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bytespider',
  'Meta-ExternalAgent',
  'FacebookBot',
  'Omgilibot',
  'cohere-ai',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_SEARCH_BOTS,
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: '/',
      },
    ],
    sitemap: 'https://soara.fr/sitemap.xml',
  }
}
