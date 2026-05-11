/**
 * Source de vérité unique pour les sources curées du moteur de recoupement.
 * Consommé par :
 *   - app/api/recoupement/route.ts (envoie la liste au LLM dans le system prompt)
 *   - app/recoupement/RecoupementClient.tsx (UI, abbr, mapping sourceId → metadata)
 *
 * Toute modification se fait ici, jamais dans les deux consommateurs.
 */

export type Source = {
  id: string
  name: string
  type: string
  bias: string
  /** Initiales 2-3 lettres pour le pictogramme UI. */
  abbr: string
  /** Réservé pour usage futur (badge UI). Actuellement non discriminant. */
  niveau?: 'verifie' | 'analyse' | 'veille'
}

export const SOURCES: Source[] = [
  // ── Moyen-Orient / géopolitique mondiale ─────────────
  { id: 'ajenews',        name: 'Al Jazeera',         type: 'Média',         bias: 'Qatar / pro-palestinien',           abbr: 'AJ' },
  { id: 'haaretzcom',     name: 'Haaretz',            type: 'Média',         bias: 'Israélien progressiste',            abbr: 'Ha' },
  { id: 'ft',             name: 'Financial Times',    type: 'Média',         bias: 'Libéral occidental',                abbr: 'FT' },
  { id: 'dropsitenews',   name: 'Drop Site News',     type: 'Média indép.',  bias: 'Investigation',                     abbr: 'DS' },
  { id: 'theintercept',   name: 'The Intercept',      type: 'Média indép.',  bias: 'Gauche américaine',                 abbr: 'TI' },
  { id: 'washingtonpost', name: 'Washington Post',    type: 'Média',         bias: 'Centre libéral US',                 abbr: 'WP' },
  { id: 'nytimes',        name: 'New York Times',     type: 'Média',         bias: 'Centre libéral US',                 abbr: 'NY' },
  { id: 'reuters',        name: 'Reuters',            type: 'Agence',        bias: 'Factuel international',             abbr: 'RE' },
  { id: 'ap',             name: 'AP',                 type: 'Agence',        bias: 'Factuel américain',                 abbr: 'AP' },
  { id: 'thecradlemedia', name: 'The Cradle',         type: 'Média',         bias: 'Pro-résistance',                    abbr: 'TC' },
  { id: 'middleeasteye',  name: 'Middle East Eye',    type: 'Média',         bias: 'Moyen-Orient indép.',               abbr: 'ME' },
  { id: 'theeconomist',   name: 'The Economist',      type: 'Média',         bias: 'Libéral pro-marché',                abbr: 'TE' },
  { id: 'afpfr',          name: 'AFP',                type: 'Agence',        bias: 'Agence française',                  abbr: 'AF' },
  { id: 'foreignpolicy',  name: 'Foreign Policy',     type: 'Média',         bias: 'Géopolitique académique US',        abbr: 'FP' },

  // ── Journalistes / analystes individuels ─────────────
  { id: 'marionawfal',    name: 'Marion Awfal',       type: 'Journaliste',   bias: 'Terrain / sources arabes',          abbr: 'MA' },
  { id: 'rnaudbertrand',  name: 'Arnaud Bertrand',    type: 'Analyste',      bias: 'Pro-multilatéral',                  abbr: 'AB' },
  { id: 'karimbitar',     name: 'Karim Bitar',        type: 'Analyste',      bias: 'Franco-libanais',                   abbr: 'KB' },
  { id: 'sentdefender',   name: 'Sentinel Defender',  type: 'OSINT',         bias: 'Militaire / renseignement',         abbr: 'SD' },
  { id: 'clashreport',    name: 'Clash Report',       type: 'Agrégateur',    bias: 'Breaking news',                     abbr: 'CR' },
  { id: 'kobeissiletter', name: 'The Kobeissi Letter',type: 'Finance',       bias: 'Marchés / géopolitique',            abbr: 'KL' },
  { id: 'iaeaorg',        name: 'IAEA',               type: 'Institution',   bias: 'Nucléaire international',           abbr: 'IA' },
  { id: 'tparsi',         name: 'Trita Parsi',        type: 'Think tank',    bias: 'NIAC / pro-négociation',            abbr: 'TP' },
  { id: 'shanaka86',      name: 'Shanaka',            type: 'Analyste',      bias: 'Géopolitique indépendant',          abbr: 'Sh' },
  { id: 'hamidrezaaz',    name: 'Hamidreza',          type: 'Analyste',      bias: 'Iran / stratégie',                  abbr: 'HR' },
  { id: 'furkangozukara', name: 'Furkan Gözükara',    type: 'Journaliste',   bias: 'Terrain Moyen-Orient',              abbr: 'FG' },
  { id: 'allenanalysis',  name: 'Allen Analysis',     type: 'Analyste',      bias: 'Géopolitique indépendant',          abbr: 'AA' },
  { id: 'nowthis_x_media',name: 'Now This Media',     type: 'Média',         bias: 'Progressiste américain',            abbr: 'NT' },
  { id: 'ramabdu',        name: 'Ram Abdu',           type: 'Analyste',      bias: 'Moyen-Orient indépendant',          abbr: 'RA' },
  { id: 'markseddon1962', name: 'Mark Seddon',        type: 'Journaliste',   bias: 'Indépendant, ex-ONU',               abbr: 'MS' },
  { id: 'jamesmartinsj',  name: 'James Martin SJ',    type: 'Analyste',      bias: 'Éthique internationale',            abbr: 'JM' },
  { id: 'kuwaittimesnews',name: 'Kuwait Times',       type: 'Média',         bias: 'Presse du Golfe',                   abbr: 'KT' },
  { id: 'ryangrim',       name: 'Ryan Grim',          type: 'Journaliste',   bias: 'Investigation indépendant',         abbr: 'RG' },
  { id: 'viviannereim',   name: 'Vivian Nereim',      type: 'Journaliste',   bias: 'Bloomberg / Golfe',                 abbr: 'VN' },
  { id: 'globeeyenews',   name: 'Globe Eye News',     type: 'Agrégateur',    bias: 'Veille globale',                    abbr: 'GE' },
  { id: 'amanpour',       name: 'Christiane Amanpour',type: 'Journaliste',   bias: 'CNN / international',               abbr: 'CA' },
  { id: 'nexta_tv',       name: 'Nexta TV',           type: 'Média',         bias: 'Est-européen / pro-Ukraine',        abbr: 'NX' },
  { id: 'ilangoldenberg', name: 'Ilan Goldenberg',    type: 'Analyste',      bias: 'Think tank DC',                     abbr: 'IG' },
  { id: 'glenn_diesen',   name: 'Glenn Diesen',       type: 'Analyste',      bias: 'Russie-OTAN',                       abbr: 'GD' },
  { id: 'realscottritter',name: 'Scott Ritter',       type: 'Analyste',      bias: 'Ex-inspecteur ONU',                 abbr: 'SR' },
  { id: 'sinatoossi',     name: 'Sina Toossi',        type: 'Analyste',      bias: 'Iran / négociation',                abbr: 'ST' },
  { id: 'citrinowicz',    name: 'Citrinowicz',        type: 'Analyste',      bias: 'Moyen-Orient / sécurité',           abbr: 'CI' },
  { id: 'nicksortor',     name: 'Nick Sortor',        type: 'OSINT',         bias: 'Breaking news US',                  abbr: 'NS' },
  { id: 'sprinterpress',  name: 'Sprinter Press',     type: 'Agrégateur',    bias: 'Veille Moyen-Orient',               abbr: 'SP' },
  { id: 'spectateursfr',  name: 'Spectateur FR',      type: 'Agrégateur',    bias: 'Veille France / Moyen-Orient',      abbr: 'SF' },
  { id: 'timothydsnyder', name: 'Timothy Snyder',     type: 'Analyste',      bias: 'Historien Yale / autoritarisme',    abbr: 'Sn' },
  { id: 'warfrontintel',  name: 'War Front Intel',    type: 'OSINT',         bias: 'Veille conflits / terrain',         abbr: 'WF' },

  // ── Afrique ──────────────────────────────────────────
  { id: 'theafricareport',name: 'The Africa Report',  type: 'Média',         bias: 'Panafricain francophone',           abbr: 'AR' },
  { id: 'dailymaverick',  name: 'Daily Maverick',     type: 'Média indép.',  bias: 'Afrique du Sud / investigation',    abbr: 'DV' },
  { id: 'afriquexxi',     name: 'Afrique XXI',        type: 'Média indép.',  bias: 'Investigation France-Afrique',      abbr: 'A21' },
  { id: 'thecontinent',   name: 'The Continent',      type: 'Média',         bias: 'Panafricain indépendant',           abbr: 'TC2' },

  // ── Asie ─────────────────────────────────────────────
  { id: 'thewire',        name: 'The Wire',           type: 'Média indép.',  bias: 'Inde / investigation',              abbr: 'TW' },
  { id: 'nikkeasia',      name: 'Nikkei Asia',        type: 'Média',         bias: 'Japon / économie Asie',             abbr: 'NK' },
  { id: 'caixin',         name: 'Caixin',             type: 'Média',         bias: 'Chine / économie indépendant',      abbr: 'CX' },

  // ── France & Europe ──────────────────────────────────
  { id: 'mediapart',        name: 'Mediapart',          type: 'Média indép.', bias: 'Investigation française',         abbr: 'MP' },
  { id: 'lesechos',         name: 'Les Échos',          type: 'Média',        bias: 'Économie française',              abbr: 'LE' },
  { id: 'scienceetvie',     name: 'Science et Vie',     type: 'Média',        bias: 'Scientifique français',           abbr: 'SV' },
  { id: 'legrandcontinent', name: 'Le Grand Continent', type: 'Revue',        bias: 'Géopolitique européenne',         abbr: 'GC' },

  // ── États-Unis analytique ────────────────────────────
  { id: 'theatlantic',          name: 'The Atlantic',          type: 'Média',      bias: 'Analytique américain',         abbr: 'TA' },
  { id: 'responsiblestatecraft',name: 'Responsible Statecraft',type: 'Think tank', bias: 'Anti-interventionniste US',    abbr: 'RC' },

  // ── Écologie & ressources ────────────────────────────
  { id: 'carbonbrief',     name: 'Carbon Brief',       type: 'Think tank', bias: 'Climat / data UK',                   abbr: 'CB' },
  { id: 'theshiftproject', name: 'The Shift Project',  type: 'Think tank', bias: 'Décarbonation FR',                   abbr: 'SH' },
  { id: 'globalwitness',   name: 'Global Witness',     type: 'ONG',        bias: 'Ressources / corruption',            abbr: 'GW' },
  { id: 'ieefa',           name: 'IEEFA',              type: 'Think tank', bias: 'Énergie / finance',                  abbr: 'IE' },
  { id: 'taxjustice',      name: 'Tax Justice Network',type: 'Think tank', bias: 'Évasion fiscale',                    abbr: 'TJ' },

  // ── Géopolitique & sécurité ──────────────────────────
  { id: 'chathamhouse', name: 'Chatham House', type: 'Think tank', bias: 'Géopolitique UK',                  abbr: 'CH' },
  { id: 'sipri',        name: 'SIPRI',         type: 'Institut',   bias: 'Armement / conflits Stockholm',    abbr: 'SI' },

  // ── Tech & numérique ─────────────────────────────────
  { id: 'algorithmwatch', name: 'Algorithm Watch', type: 'ONG', bias: 'IA / surveillance',     abbr: 'AW' },
  { id: 'accessnow',      name: 'Access Now',      type: 'ONG', bias: 'Droits numériques',     abbr: 'AN' },

  // ── Santé & sciences ─────────────────────────────────
  { id: 'cochrane',        name: 'Cochrane Collaboration',   type: 'Institut',  bias: 'Méta-analyses médicales',        abbr: 'CO' },
  { id: 'bmj',             name: 'British Medical Journal',  type: 'Revue',     bias: 'Médical UK rigoureux',           abbr: 'BJ' },
  { id: 'statnews',        name: 'STAT News',                type: 'Média',     bias: 'Journalisme médical US',         abbr: 'SN' },
  { id: 'ourworldindata',  name: 'Our World in Data',        type: 'Institut',  bias: 'Données mondiales Oxford',       abbr: 'OW' },
  { id: 'retractionwatch', name: 'Retraction Watch',         type: 'Média',     bias: 'Intégrité scientifique',         abbr: 'RW' },
  { id: 'ioannidis',       name: 'John Ioannidis',           type: 'Chercheur', bias: 'Épidémiologie Stanford',         abbr: 'JI' },
  { id: 'vinay_prasad',    name: 'Vinay Prasad',             type: 'Chercheur', bias: 'Épidémiologie UCSF',             abbr: 'VP' },
  { id: 'bhattacharya',    name: 'Jay Bhattacharya',         type: 'Chercheur', bias: 'Santé publique Stanford',        abbr: 'JB' },

  // ── Économie ─────────────────────────────────────────
  { id: 'imf',           name: 'FMI',                  type: 'Institution', bias: 'Macro international',                       abbr: 'FM' },
  { id: 'worldbank',     name: 'Banque Mondiale',      type: 'Institution', bias: 'Développement international',               abbr: 'WB' },
  { id: 'bis',           name: 'BIS',                  type: 'Institution', bias: 'Banques centrales / stabilité',             abbr: 'BI' },
  { id: 'ocde',          name: 'OCDE',                 type: 'Institution', bias: 'Statistiques internationales',              abbr: 'OC' },
  { id: 'ofce',          name: 'OFCE',                 type: 'Think tank',  bias: 'Conjoncture FR indépendant',                abbr: 'OF' },
  { id: 'bloombergeco',  name: 'Bloomberg Economics',  type: 'Média',       bias: 'Économie / marchés',                        abbr: 'BE' },
  { id: 'stiglitz',      name: 'Joseph Stiglitz',      type: 'Économiste',  bias: 'Nobel / critique consensus Washington',     abbr: 'JS' },
  { id: 'acemoglu',      name: 'Daron Acemoglu',       type: 'Économiste',  bias: 'MIT / institutions & inégalités',           abbr: 'DA' },
  { id: 'positivemoney', name: 'Positive Money',       type: 'Think tank',  bias: 'Finance alternative UK',                    abbr: 'PM' },
]

/**
 * Formate la liste des sources pour insertion dans le system prompt Anthropic.
 * Une ligne par source : [id] Nom — Type, biais
 */
export function formatSourcesForPrompt(sources: Source[] = SOURCES): string {
  return sources.map(s => `[${s.id}] ${s.name} — ${s.type}, ${s.bias}`).join('\n')
}
