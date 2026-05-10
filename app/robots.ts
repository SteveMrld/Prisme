import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/preview-unlock',
          '/compte',
          '/connexion',
          '/reset-password',
          '/mot-de-passe-oublie',
        ],
      },
      {
        // GPTBot, Claude, common AI crawlers — on bloque
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'Omgilibot',
          'FacebookBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://soara.fr/sitemap.xml',
  }
}
