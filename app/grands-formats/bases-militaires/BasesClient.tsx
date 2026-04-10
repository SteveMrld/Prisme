"use client";

import { useState, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import styles from "./bases.module.css";

// ── SOURCES ───────────────────────────────────────────────────────────────────
const SOURCES = [
  { id: "pentagon2024",  nation: "usa",    label: "Pentagon Base Structure Report 2024",                          url: "https://www.acq.osd.mil/eie/BSI/BEI_Library.html",                            note: "128 bases dans 55 pays — chiffre officiel US" },
  { id: "vine2021",      nation: "usa",    label: "David Vine, Base Nation (2015, mise à jour 2021)",              url: "https://www.amazon.com/Base-Nation-Americas-Overseas-Military/dp/1627791507",  note: "750+ bases — méthodologie élargie incluant lily pads" },
  { id: "crs2024",       nation: "usa",    label: "Congressional Research Service — U.S. Military Bases Abroad",  url: "https://crsreports.congress.gov",                                              note: "Juillet 2024 — données non classifiées" },
  { id: "quincy2021",    nation: "usa",    label: "Quincy Institute — Drawdown (2021)",                           url: "https://quincyinst.org/report/drawdown/",                                      note: "Coût annuel estimé à 156 Md$/an" },
  { id: "dmdc2025",      nation: "usa",    label: "Defense Manpower Data Center — Personnel by Country (déc. 2025)", url: "https://dwp.dmdc.osd.mil/dwp/app/main",                                   note: "221 599 militaires et civils en poste à l'étranger" },
  { id: "declassifieduk",nation: "uk",     label: "Declassified UK — Phil Miller (nov. 2020)",                    url: "https://www.declassifieduk.org/revealed-the-uk-militarys-overseas-base-network-involves-145-sites-in-42-countries/", note: "145 sites dans 42 pays — enquête indépendante" },
  { id: "ukcommons2024", nation: "uk",     label: "House of Commons Library — UK Forces in the Middle East (oct. 2024)", url: "https://commonslibrary.parliament.uk/research-briefings/cbp-8794/",   note: "Bases permanentes Bahreïn, Oman, Chypre" },
  { id: "modgov",        nation: "uk",     label: "GOV.UK — Permanent Joint Operating Bases",                     url: "https://www.gov.uk/government/publications/permanent-joint-operating-bases-pjobs/fd", note: "Liste officielle du Ministère de la Défense britannique" },
  { id: "izvestiya2018", nation: "russia", label: "Izvestiya / Ministère russe de la Défense (2018)",             url: "https://newlinesinstitute.org/strategic-competition/russia/russias-extraterritorial-military-deployments/", note: "21 installations significatives — seul chiffre officiel russe" },
  { id: "ponars2021",    nation: "russia", label: "PONARS Eurasia — Russia's Foreign Military Basing Strategy",   url: "https://www.ponarseurasia.org/russias-foreign-military-basing-strategy/",     note: "Analyse de la stratégie de basing russe" },
  { id: "tartus2026",    nation: "russia", label: "Wikipedia — Tartus Naval Base (fév. 2026)",                    url: "https://en.wikipedia.org/wiki/Tartus_naval_base",                              note: "Statut 2025 : traité suspendu mais non terminé" },
  { id: "atlanticcouncil", nation:"russia",label: "Atlantic Council — Russia's Most Important Middle East Base (déc. 2025)", url: "https://www.atlanticcouncil.org/blogs/menasource/russias-most-important-middle-east-base-is-not-where-you-think/", note: "Réseau logistique libyen et Africa Corps post-Syrie" },
  { id: "euractiv2025",  nation: "france", label: "Euractiv — La France perd sa dernière base en Afrique (juil. 2025)", url: "https://euractiv.fr/news/larmee-francaise-perd-lune-de-ses-dernieres-bases-en-afrique/", note: "Depuis le 17 juillet 2025, seule base africaine = Djibouti" },
  { id: "publicsenat",   nation: "france", label: "Public Sénat — Fin de la présence permanente en Afrique de l'Ouest (juil. 2025)", url: "https://www.publicsenat.fr/actualites/international/defense-la-france-met-fin-a-sa-presence-permanente-en-afrique-de-louest", note: "Tchad jan. 2025, Côte d'Ivoire fév. 2025, Sénégal juil. 2025" },
  { id: "ifri2025",      nation: "france", label: "IFRI — Ce que la France perd en fermant ses bases (2025)",     url: "https://theconversation.com/ce-que-la-france-perd-en-fermant-ses-bases-militaires-en-afrique-247200", note: "De 20 000 hommes en 1970 à ~2 300 en 2025 en Afrique subsaharienne" },
  { id: "iiss2024",      nation: "china",  label: "IISS Military Balance 2024",                                   url: "https://www.iiss.org/publications/the-military-balance/",                       note: "1 base officielle (Djibouti) + présences alléguées" },
  { id: "wsj2021",       nation: "china",  label: "Wall Street Journal — China Secretly Building Military Facility in UAE (2021)", url: "https://www.wsj.com/articles/china-secretly-building-military-facility-in-uae-11630511114", note: "Construction stoppée sous pression américaine" },
];

// ── TYPES ─────────────────────────────────────────────────────────────────────
type Nation = "usa" | "uk" | "russia" | "turkey" | "france" | "china";
type Certainty = "confirmée" | "probable" | "alléguée";

interface Base {
  id: number;
  name: string;
  nation: Nation;
  country: string;
  lat: number;
  lng: number;
  troops: number;
  certainty: Certainty;
  note: string;
  sourceId?: string;
}

// ── COULEURS ──────────────────────────────────────────────────────────────────
const COLORS: Record<Nation, string> = {
  usa:    "#7F1D1D",
  uk:     "#0F766E",
  russia: "#166534",
  turkey: "#6D28D9",
  france: "#1D4ED8",
  china:  "#C2410C",
};
const FLAGS:  Record<Nation, string> = { usa:"🇺🇸", uk:"🇬🇧", russia:"🇷🇺", turkey:"🇹🇷", france:"🇫🇷", china:"🇨🇳" };
const LABELS: Record<Nation, string> = { usa:"États-Unis", uk:"Royaume-Uni", russia:"Russie", turkey:"Turquie", france:"France", china:"Chine" };

// ── DONNÉES CORRIGÉES ─────────────────────────────────────────────────────────
// Sources : voir panneau Sources ci-dessous
const BASES: Base[] = [
  // ── USA (Pentagon BSR 2024 + Vine 2021) ──
  { id:1,  nation:"usa", name:"Camp Humphreys",           country:"Corée du Sud",     lat:36.97,  lng:127.03,  troops:36000, certainty:"confirmée", note:"Plus grande base US à l'étranger (14,7 km²). La Corée du Sud finance 50% du coût.", sourceId:"pentagon2024" },
  { id:2,  nation:"usa", name:"Yokosuka Naval Base",      country:"Japon",            lat:35.29,  lng:139.67,  troops:24000, certainty:"confirmée", note:"QG de la 7e Flotte. Seul port-base d'un porte-avions hors territoire américain.", sourceId:"pentagon2024" },
  { id:3,  nation:"usa", name:"Kadena Air Base",          country:"Japon",            lat:26.36,  lng:127.77,  troops:18000, certainty:"confirmée", note:"Principale base aérienne US en Asie. Okinawa supporte 70% des bases US au Japon pour 0,6% du territoire national.", sourceId:"pentagon2024" },
  { id:4,  nation:"usa", name:"Camp Arifjan",             country:"Koweït",           lat:29.20,  lng:47.94,   troops:13000, certainty:"confirmée", note:"Principale base logistique Moyen-Orient. Blindés lourds pré-positionnés.", sourceId:"pentagon2024" },
  { id:5,  nation:"usa", name:"Al Udeid Air Base",        country:"Qatar",            lat:25.12,  lng:51.32,   troops:10000, certainty:"confirmée", note:"QG du CENTCOM. Plus grande base US au Moyen-Orient.", sourceId:"pentagon2024" },
  { id:6,  nation:"usa", name:"Yokota Air Base",          country:"Japon",            lat:35.75,  lng:139.35,  troops:11000, certainty:"confirmée", note:"QG Forces Aériennes Pacifique. Contrôle l'espace aérien de la région Tokyo.", sourceId:"pentagon2024" },
  { id:7,  nation:"usa", name:"Osan Air Base",            country:"Corée du Sud",     lat:37.09,  lng:127.03,  troops:10000, certainty:"confirmée", note:"Première ligne face à la DMZ. Détection des lancements nord-coréens.", sourceId:"pentagon2024" },
  { id:8,  nation:"usa", name:"Camp Kościuszko / Powidz", country:"Pologne",          lat:52.39,  lng:17.00,   troops:10300, certainty:"confirmée", note:"Brigade blindée en rotation. Équipements pré-positionnés pour un corps d'armée complet.", sourceId:"pentagon2024" },
  { id:9,  nation:"usa", name:"NSA Bahrain (5e Flotte)",  country:"Bahreïn",          lat:26.23,  lng:50.58,   troops:8200,  certainty:"confirmée", note:"QG de la 5e Flotte. Surveillance du Golfe et du détroit d'Ormuz.", sourceId:"pentagon2024" },
  { id:10, nation:"usa", name:"Camp Foster / MCAS Futenma",country:"Japon",           lat:26.30,  lng:127.78,  troops:8200,  certainty:"confirmée", note:"QG III Marine Expeditionary Force. Okinawa supporte 70% des bases US pour 0,6% du territoire.", sourceId:"pentagon2024" },
  { id:11, nation:"usa", name:"Andersen Air Force Base",  country:"Guam (US)",        lat:13.58,  lng:144.93,  troops:7800,  certainty:"confirmée", note:"B-52 en alerte permanente. Symbole de la puissance US dans le Pacifique occidental.", sourceId:"pentagon2024" },
  { id:12, nation:"usa", name:"Ramstein Air Base",        country:"Allemagne",        lat:49.44,  lng:7.60,    troops:9400,  certainty:"confirmée", note:"Centre névralgique du commandement aérien européen. Nœud des opérations de drones.", sourceId:"pentagon2024" },
  { id:13, nation:"usa", name:"Grafenwöhr Training Area", country:"Allemagne",        lat:49.71,  lng:11.94,   troops:7200,  certainty:"confirmée", note:"Plus grande zone d'entraînement US en Europe. Formation des forces ukrainiennes depuis 2022.", sourceId:"pentagon2024" },
  { id:14, nation:"usa", name:"USAG Stuttgart (AFRICOM)", country:"Allemagne",        lat:48.74,  lng:9.17,    troops:6800,  certainty:"confirmée", note:"QG de l'AFRICOM — la stratégie militaire américaine en Afrique est pilotée depuis l'Allemagne.", sourceId:"pentagon2024" },
  { id:15, nation:"usa", name:"Guantanamo Bay",           country:"Cuba",             lat:19.91,  lng:-75.10,  troops:6000,  certainty:"confirmée", note:"Symbole mondial de la violation des droits humains post-11 septembre. Cuba refuse le loyer de 4 085$/an depuis 1960.", sourceId:"pentagon2024" },
  { id:16, nation:"usa", name:"Al Dhafra Air Base",       country:"Émirats Arabes Unis",lat:24.24,lng:54.55,  troops:5000,  certainty:"confirmée", note:"Drones RQ-4 et F-35. Surveillance de l'Iran.", sourceId:"pentagon2024" },
  { id:17, nation:"usa", name:"Aviano Air Base",          country:"Italie",           lat:46.03,  lng:12.60,   troops:4800,  certainty:"confirmée", note:"Projection vers Méditerranée et Moyen-Orient. F-16 et drones de surveillance.", sourceId:"pentagon2024" },
  { id:18, nation:"usa", name:"RAF Lakenheath",           country:"Royaume-Uni",      lat:52.41,  lng:0.56,    troops:4700,  certainty:"confirmée", note:"Seule base US d'armes nucléaires tactiques en Europe (bombes B61).", sourceId:"pentagon2024" },
  { id:19, nation:"usa", name:"NAS Sigonella",            country:"Italie",           lat:37.40,  lng:14.92,   troops:4100,  certainty:"confirmée", note:"Carrefour méditerranéen. Drones Global Hawk. Opérations contre-terrorisme Afrique du Nord.", sourceId:"pentagon2024" },
  { id:20, nation:"usa", name:"Camp Lemonnier",           country:"Djibouti",         lat:11.55,  lng:43.16,   troops:4000,  certainty:"confirmée", note:"Seule base US permanente officielle en Afrique. À 8 km de la base chinoise.", sourceId:"pentagon2024" },
  { id:21, nation:"usa", name:"MK Air Base",              country:"Roumanie",         lat:44.36,  lng:28.49,   troops:4200,  certainty:"confirmée", note:"Principale tête de pont OTAN flanc est depuis 2022.", sourceId:"pentagon2024" },
  { id:22, nation:"usa", name:"NSF Diego Garcia",         country:"Diego Garcia",     lat:-7.32,  lng:72.42,   troops:3800,  certainty:"confirmée", note:"Île dont les habitants furent expulsés de force. L'ICJ a condamné la présence britannique en 2019.", sourceId:"pentagon2024" },
  { id:23, nation:"usa", name:"Muwaffaq Salti AB",        country:"Jordanie",         lat:31.73,  lng:37.05,   troops:3200,  certainty:"confirmée", note:"Opérations contre Daech en Syrie et Irak. La Jordanie reçoit 1,5 Md$ d'aide US par an.", sourceId:"pentagon2024" },
  { id:24, nation:"usa", name:"Camp Bondsteel",           country:"Kosovo",           lat:42.36,  lng:21.36,   troops:3600,  certainty:"confirmée", note:"Plus grande base US construite depuis le Viêtnam. Sentinelle des Balkans depuis 1999.", sourceId:"pentagon2024" },
  { id:25, nation:"usa", name:"NSA Rota",                 country:"Espagne",          lat:36.65,  lng:-6.35,   troops:3700,  certainty:"confirmée", note:"Principale base navale en Méditerranée occidentale. Destroyers antimissiles balistiques.", sourceId:"pentagon2024" },
  { id:26, nation:"usa", name:"Basa Air Base",            country:"Philippines",      lat:14.99,  lng:120.50,  troops:3200,  certainty:"confirmée", note:"9 bases sous accord EDCA. Stratégie de containment de la Chine en mer de Chine méridionale.", sourceId:"pentagon2024" },
  { id:27, nation:"usa", name:"Al Asad Air Base",         country:"Irak",             lat:33.79,  lng:42.44,   troops:3000,  certainty:"confirmée", note:"Ciblée par 16 missiles iraniens en janvier 2020 après l'assassinat de Soleimani.", sourceId:"pentagon2024" },
  { id:28, nation:"usa", name:"Prince Sultan Air Base",   country:"Arabie Saoudite",  lat:24.06,  lng:47.58,   troops:2800,  certainty:"confirmée", note:"Réactivée en 2019. La présence de soldats US en terre sainte est invoquée par Al-Qaïda.", sourceId:"pentagon2024" },
  { id:29, nation:"usa", name:"RAF Menwith Hill (NSA)",   country:"Royaume-Uni",      lat:54.00,  lng:-1.69,   troops:2100,  certainty:"confirmée", note:"Plus grande station d'écoute US hors territoire américain. Réseau ECHELON.", sourceId:"vine2021" },
  { id:30, nation:"usa", name:"Pine Gap",                 country:"Australie",        lat:-23.80, lng:133.74,  troops:1000,  certainty:"confirmée", note:"Installation de renseignement ultra-secrète CIA/NSA. Guidage de drones de combat. Révélations Snowden 2013.", sourceId:"vine2021" },
  { id:31, nation:"usa", name:"Darwin Marines",           country:"Australie",        lat:-12.46, lng:130.85,  troops:2500,  certainty:"confirmée", note:"Rotation de Marines. Verrou stratégique du détroit de Lombok vers l'Indo-Pacifique.", sourceId:"pentagon2024" },
  { id:32, nation:"usa", name:"Kwajalein Missile Range",  country:"Îles Marshall",    lat:8.72,   lng:167.73,  troops:1100,  certainty:"confirmée", note:"Tests de missiles balistiques intercontinentaux. Les Marshallais bannis de leur propre atoll.", sourceId:"pentagon2024" },
  { id:33, nation:"usa", name:"NSA Souda Bay",            country:"Grèce",            lat:35.52,  lng:24.15,   troops:1100,  certainty:"confirmée", note:"Porte d'entrée vers la Méditerranée orientale. Sous-marins nucléaires.", sourceId:"pentagon2024" },
  { id:34, nation:"usa", name:"Incirlik Air Base",        country:"Turquie",          lat:37.00,  lng:35.43,   troops:2500,  certainty:"confirmée", note:"Dernier stockage de bombes nucléaires B61 en zone de tension. Relations US-Turquie instables.", sourceId:"pentagon2024" },
  { id:35, nation:"usa", name:"Lajes Field",              country:"Portugal (Açores)", lat:38.76,  lng:-27.09,  troops:780,  certainty:"confirmée", note:"Verrou de l'Atlantique Nord. Lutte anti-sous-marine.", sourceId:"pentagon2024" },
  { id:36, nation:"usa", name:"Soto Cano Air Base",       country:"Honduras",         lat:14.38,  lng:-87.62,  troops:600,   certainty:"confirmée", note:"Vestige de la stratégie Reagan en Amérique centrale. Opérations anti-drogue.", sourceId:"pentagon2024" },

  // ── ROYAUME-UNI (Declassified UK 2020 + MoD GOV.UK) ──
  { id:101, nation:"uk", name:"Akrotiri / Dhekelia",      country:"Chypre",           lat:34.59,  lng:33.05,   troops:2290,  certainty:"confirmée", note:"17 installations dans les deux zones souveraines. Surveillance Méditerranée orientale, Moyen-Orient, Syrie.", sourceId:"modgov" },
  { id:102, nation:"uk", name:"Gibraltar",                country:"Gibraltar",        lat:36.15,  lng:-5.35,   troops:700,   certainty:"confirmée", note:"Verrou stratégique du détroit entre Atlantique et Méditerranée. Revendiqué par l'Espagne.", sourceId:"modgov" },
  { id:103, nation:"uk", name:"Mount Pleasant (Malouines)",country:"Falkland Islands", lat:-51.82, lng:-58.45,  troops:1200,  certainty:"confirmée", note:"Construit après la guerre des Malouines (1982). Réaffirmation de la souveraineté face à l'Argentine.", sourceId:"modgov" },
  { id:104, nation:"uk", name:"RAF Ascension Island",     country:"Ascension (UK)",   lat:-7.97,  lng:-14.39,  troops:400,   certainty:"confirmée", note:"Pivot atlantique. Soutien aux Falklands, surveillance sous-marine.", sourceId:"modgov" },
  { id:105, nation:"uk", name:"Duqm — Oman",              country:"Oman",             lat:19.67,  lng:57.70,   troops:500,   certainty:"confirmée", note:"Base navale permanente ouverte en 2018. Porte-avions britanniques dans l'océan Indien. 16 sites au total en Oman.", sourceId:"ukcommons2024" },
  { id:106, nation:"uk", name:"Brunei Garrison",          country:"Brunei",           lat:4.64,   lng:114.30,  troops:900,   certainty:"confirmée", note:"Seul bataillon de Gurkhas permanent hors Royaume-Uni. Brunei finance entièrement la présence.", sourceId:"modgov" },
  { id:107, nation:"uk", name:"UK Joint Support Base Bahreïn", country:"Bahreïn",    lat:26.22,  lng:50.60,   troops:500,   certainty:"confirmée", note:"Première base navale permanente au Moyen-Orient depuis 1971.", sourceId:"ukcommons2024" },
  { id:108, nation:"uk", name:"Présence en Arabie Saoudite (15 sites)", country:"Arabie Saoudite", lat:24.70, lng:46.70, troops:300, certainty:"confirmée", note:"15 sites documentés par Declassified UK. RAF observe les frappes de la coalition saoudienne au Yémen.", sourceId:"declassifieduk" },
  { id:109, nation:"uk", name:"British Forces Kenya",     country:"Kenya",            lat:0.02,   lng:37.03,   troops:350,   certainty:"confirmée", note:"Formation de l'armée kényane. Présence permanente depuis l'indépendance.", sourceId:"declassifieduk" },
  { id:110, nation:"uk", name:"Diego Garcia (BIOT, usage UK)", country:"Diego Garcia", lat:-7.30,  lng:72.41,   troops:150,   certainty:"confirmée", note:"Co-opéré avec les États-Unis. L'ICJ a condamné l'administration britannique en 2019.", sourceId:"modgov" },
  { id:111, nation:"uk", name:"Belize Training Area",     country:"Belize",           lat:17.53,  lng:-88.30,  troops:230,   certainty:"confirmée", note:"Centre d'entraînement jungle depuis l'indépendance de 1981.", sourceId:"declassifieduk" },

  // ── RUSSIE (Izvestiya/MoD 2018 — 21 installations — + Africa Corps 2025) ──
  { id:201, nation:"russia", name:"Hmeimim Air Base",     country:"Syrie",            lat:35.40,  lng:35.95,   troops:2000,  certainty:"probable",  note:"Réactivée octobre 2025 après suspension. Statut précaire après chute d'Assad. Accord avec al-Sharaa en négociation.", sourceId:"tartus2026" },
  { id:202, nation:"russia", name:"Tartus Naval Base",    country:"Syrie",            lat:34.89,  lng:35.89,   troops:500,   certainty:"probable",  note:"Traité 'suspendu mais non terminé' — les navires russes ont quitté début mars 2025. Accès au cas par cas depuis. Seul accès russe à la Méditerranée.", sourceId:"tartus2026" },
  { id:203, nation:"russia", name:"Base 102 — Gyumri",   country:"Arménie",          lat:40.80,  lng:43.86,   troops:3500,  certainty:"confirmée", note:"Verrou face à la Turquie et l'Azerbaïdjan. L'Arménie paie le prix de cette dépendance après la défaite au Karabagh.", sourceId:"izvestiya2018" },
  { id:204, nation:"russia", name:"201e base — Douchanbe",country:"Tadjikistan",      lat:38.56,  lng:68.77,   troops:7000,  certainty:"confirmée", note:"Plus grande base russe à l'étranger en effectifs. Surveillance de l'Afghanistan post-retrait américain.", sourceId:"izvestiya2018" },
  { id:205, nation:"russia", name:"Base de Kant",         country:"Kirghizstan",      lat:42.89,  lng:74.85,   troops:500,   certainty:"confirmée", note:"Seule base aérienne russe en Asie centrale.", sourceId:"izvestiya2018" },
  { id:206, nation:"russia", name:"Sébastopol (Flotte Mer Noire)", country:"Ukraine (occ.)", lat:44.62, lng:33.52, troops:20000, certainty:"confirmée", note:"Annexion illégale de la Crimée en 2014. QG de la Flotte de la Mer Noire. Cible de frappes ukrainiennes depuis 2022.", sourceId:"izvestiya2018" },
  { id:207, nation:"russia", name:"Garnisons — Biélorussie", country:"Biélorussie",   lat:53.90,  lng:27.50,   troops:10000, certainty:"confirmée", note:"Déploiement massif depuis 2022. La Biélorussie utilisée comme plateforme d'attaque en février 2022.", sourceId:"ponars2021" },
  { id:208, nation:"russia", name:"Abkhazie — Ossétie du Sud", country:"Géorgie (occ.)", lat:43.00, lng:41.50, troops:4000,  certainty:"confirmée", note:"Territoires occupés depuis 2008. Bases d'infanterie et blindés.", sourceId:"izvestiya2018" },
  { id:209, nation:"russia", name:"Transnistrie",         country:"Moldova",          lat:47.00,  lng:29.40,   troops:1500,  certainty:"confirmée", note:"~1500 soldats depuis le début des années 1990. Contrôle des stocks d'armes soviétiques.", sourceId:"izvestiya2018" },
  { id:210, nation:"russia", name:"Kaliningrad (enclave)", country:"Russie (enclave)", lat:54.72,  lng:20.52,   troops:15000, certainty:"confirmée", note:"Enclave hypermilitarisée entre Pologne et Lituanie. Missiles Iskander pointés vers Berlin et Varsovie.", sourceId:"ponars2021" },
  { id:211, nation:"russia", name:"Africa Corps — Mali",  country:"Mali",             lat:15.55,  lng:-4.20,   troops:1500,  certainty:"confirmée", note:"Après le coup d'État de 2021. Mines d'or saisies en contrepartie du soutien militaire.", sourceId:"atlanticcouncil" },
  { id:212, nation:"russia", name:"Africa Corps — RCA",   country:"Rép. Centrafricaine",lat:4.36, lng:18.56,   troops:2000,  certainty:"confirmée", note:"Présence la plus ancienne de Wagner/Africa Corps en Afrique. Mines de diamants.", sourceId:"atlanticcouncil" },
  { id:213, nation:"russia", name:"Africa Corps — Niger", country:"Niger",            lat:13.52,  lng:2.12,    troops:1500,  certainty:"confirmée", note:"Ont pris possession de la base d'Agadez abandonnée par les Américains en 2024.", sourceId:"atlanticcouncil" },
  { id:214, nation:"russia", name:"Africa Corps — Burkina Faso", country:"Burkina Faso", lat:12.37, lng:-1.53, troops:800,   certainty:"confirmée", note:"Après expulsion des Français (2023). Schéma identique : coup d'État, France dehors, Russie dedans.", sourceId:"atlanticcouncil" },
  { id:215, nation:"russia", name:"Libye — Maaten al-Sarra + Benghazi", country:"Libye", lat:25.50, lng:16.00, troops:1500,  certainty:"probable",  note:"Réseau logistique libyen renforcé depuis décembre 2024 (Atlantic Council). Hub de transit vers le Sahel.", sourceId:"atlanticcouncil" },

  // ── TURQUIE (sources académiques + journalistiques) ──
  { id:301, nation:"turkey", name:"Forces en Chypre du Nord", country:"Chypre du Nord", lat:35.17, lng:33.36,  troops:32000, certainty:"confirmée", note:"Occupation depuis 1974, condamnée par l'ONU. 30 000-40 000 soldats. Chypre du Nord reconnue seulement par Ankara.", sourceId:"izvestiya2018" },
  { id:302, nation:"turkey", name:"Irak du Nord (12+ bases)", country:"Irak",          lat:37.14,  lng:43.00,   troops:5000,  certainty:"confirmée", note:"Plus de bases militaires en Irak que tout autre pays étranger. Opérations permanentes contre le PKK malgré Bagdad.", sourceId:"ponars2021" },
  { id:303, nation:"turkey", name:"Libye — Misrata / Tripoli", country:"Libye",        lat:32.38,  lng:15.09,   troops:3500,  certainty:"confirmée", note:"Soutien au gouvernement de Tripoli face aux Russes qui soutiennent Haftar. Drones Bayraktar TB2.", sourceId:"ponars2021" },
  { id:304, nation:"turkey", name:"Somalie — Mogadiscio",  country:"Somalie",          lat:2.05,   lng:45.34,   troops:1000,  certainty:"confirmée", note:"Depuis 2017. Formation de l'armée somalienne. Projection de la soft power via mosquées, hôpitaux et bases.", sourceId:"ponars2021" },
  { id:305, nation:"turkey", name:"Qatar — Camp Tariq",    country:"Qatar",            lat:25.26,  lng:51.44,   troops:3000,  certainty:"confirmée", note:"Accord signé pendant le blocus de 2017. Protection du Qatar contre l'Arabie Saoudite.", sourceId:"ponars2021" },
  { id:306, nation:"turkey", name:"Syrie du Nord — Afrin / Idlib", country:"Syrie",   lat:36.51,  lng:36.85,   troops:8000,  certainty:"confirmée", note:"Opérations contre les Kurdes (YPG/SDF). Zones d'occupation depuis 2018.", sourceId:"ponars2021" },
  { id:307, nation:"turkey", name:"Azerbaïdjan — Bakou",   country:"Azerbaïdjan",      lat:40.41,  lng:49.87,   troops:1500,  certainty:"confirmée", note:"Après la victoire au Karabagh (2020) où les drones turcs ont été décisifs.", sourceId:"ponars2021" },

  // ── FRANCE (chiffre révisé — 6 déploiements permanents — Euractiv juil. 2025) ──
  { id:401, nation:"france", name:"FFDj — Djibouti",       country:"Djibouti",         lat:11.60,  lng:43.15,   troops:1450,  certainty:"confirmée", note:"Seule base permanente française en Afrique subsaharienne depuis juillet 2025. QG pour la Corne de l'Afrique et l'océan Indien occidental.", sourceId:"euractiv2025" },
  { id:402, nation:"france", name:"Gabon — Libreville (camp partagé)", country:"Gabon", lat:0.39,  lng:9.45,    troops:100,   certainty:"confirmée", note:"Transformée en 'camp partagé' depuis 2025. ~100 soldats. Académie militaire co-financée.", sourceId:"publicsenat" },
  { id:403, nation:"france", name:"EAU — Abu Dhabi (base navale)", country:"Émirats Arabes Unis", lat:24.38, lng:54.44, troops:750, certainty:"confirmée", note:"Première base militaire française dans le Golfe (2009). Porte d'entrée vers l'Asie et l'océan Indien.", sourceId:"modgov" },
  { id:404, nation:"france", name:"Polynésie française",   country:"Polynésie française", lat:-17.53, lng:-149.57, troops:900, certainty:"confirmée", note:"Ancienne zone d'essais nucléaires (193 tirs, 1966-1996). Base de surveillance du Pacifique Sud.", sourceId:"modgov" },
  { id:405, nation:"france", name:"Nouvelle-Calédonie (FANC)", country:"Nouvelle-Calédonie", lat:-22.28, lng:166.46, troops:1100, certainty:"confirmée", note:"Territoire en tension indépendantiste. Vaste ZEE. Position stratégique face à la montée de la Chine dans le Pacifique.", sourceId:"modgov" },
  { id:406, nation:"france", name:"Réunion / Mayotte",     country:"France (DOM)",      lat:-20.88, lng:55.45,   troops:1700,  certainty:"confirmée", note:"Projection dans l'océan Indien. Surveillance maritime. Présence française en océan Indien via DOM.", sourceId:"modgov" },

  // ── CHINE (IISS Military Balance 2024 + sources journalistiques) ──
  { id:501, nation:"china", name:"Base de Djibouti",       country:"Djibouti",         lat:11.54,  lng:43.15,   troops:2000,  certainty:"confirmée", note:"Première et unique base militaire officielle de la Chine à l'étranger (2017). À 8 km du Camp Lemonnier américain.", sourceId:"iiss2024" },
  { id:502, nation:"china", name:"Gwadar — Pakistan",      country:"Pakistan",          lat:25.12,  lng:62.33,   troops:500,   certainty:"probable",  note:"Port du Corridor économique Chine-Pakistan. Infrastructure duale (civile/militaire). Accès naval non confirmé officiellement.", sourceId:"iiss2024" },
  { id:503, nation:"china", name:"Ream Naval Base",         country:"Cambodge",         lat:10.54,  lng:103.63,  troops:400,   certainty:"probable",  note:"Rénovation chinoise de la base navale révélée en 2022. Cambodge nie l'usage exclusivement militaire chinois.", sourceId:"iiss2024" },
  { id:504, nation:"china", name:"Îles artificielles — mer de Chine", country:"Mer de Chine méridionale (disputée)", lat:9.55, lng:114.05, troops:3000, certainty:"confirmée", note:"7 îles artificielles avec pistes, silos à missiles, radars. Illégales selon la sentence de La Haye (2016).", sourceId:"iiss2024" },
  { id:505, nation:"china", name:"Négociations — Tanzanie", country:"Tanzanie",         lat:-6.79,  lng:39.21,   troops:200,   certainty:"alléguée",  note:"Négociations pour une base navale sur l'île de Pemba. Non finalisée. Inquiétudes US et UK.", sourceId:"iiss2024" },
  { id:506, nation:"china", name:"Accord sécurité — Îles Salomon", country:"Îles Salomon", lat:-9.43, lng:160.03, troops:100, certainty:"alléguée",  note:"Accord de sécurité de 2022 permettant potentiellement des escales navales. Alerte à Canberra et Washington.", sourceId:"iiss2024" },
  { id:507, nation:"china", name:"Pamirs — Tadjikistan",   country:"Tadjikistan",       lat:38.17,  lng:74.00,   troops:300,   certainty:"probable",  note:"Poste de surveillance secret dans les Pamirs révélé en 2019. Surveille l'Afghanistan et le corridor Wakhan.", sourceId:"iiss2024" },
  { id:508, nation:"china", name:"Infrastructure EAU (stoppée)", country:"Émirats Arabes Unis", lat:24.49, lng:54.36, troops:100, certainty:"alléguée", note:"Construction suspectée d'être militaire révélée par le WSJ (2021). Arrêtée sous pression américaine.", sourceId:"wsj2021" },
];

// ── DONNÉES BARRE ─────────────────────────────────────────────────────────────
const BAR_DATA = [
  { nation:"usa" as Nation,    count:750, official:128, label:"bases dans 80+ pays", source:"Pentagon BSR 2024 / Vine 2021",       toggle: true },
  { nation:"uk" as Nation,     count:145, official:145, label:"sites dans 42 pays",  source:"Declassified UK, Phil Miller, 2020",  toggle: false },
  { nation:"russia" as Nation, count:21,  official:21,  label:"installations + Africa Corps", source:"Izvestiya / MoD russe, 2018", toggle: false },
  { nation:"turkey" as Nation, count:7,   official:7,   label:"déploiements confirmés",source:"Sources académiques / journalistiques", toggle: false },
  { nation:"france" as Nation, count:6,   official:6,   label:"bases permanentes",   source:"Euractiv / Public Sénat, juil. 2025",toggle: false },
  { nation:"china" as Nation,  count:1,   official:1,   label:"base officielle + ~6 alléguées", source:"IISS Military Balance 2024",toggle: false },
];

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NATIONS: Nation[] = ["usa", "uk", "russia", "turkey", "france", "china"];

// ── COMPOSANT ─────────────────────────────────────────────────────────────────
export default function BasesClient() {
  const [activeNations, setActiveNations] = useState<Set<Nation>>(new Set(NATIONS));
  const [hoveredBase, setHoveredBase] = useState<Base | null>(null);
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);
  const [showSources, setShowSources] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<Nation | "all">("all");
  const [usaMode, setUsaMode] = useState<"vine" | "officiel">("vine");
  const [barProgress] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([15, 10]);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const toggleNation = (n: Nation) => {
    setActiveNations(prev => {
      const next = new Set(prev);
      if (next.size === 1 && next.has(n)) return new Set(NATIONS);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const filteredBases = BASES.filter(b => activeNations.has(b.nation));

  const getR = (troops: number, isUSA: boolean): number => {
    const s = isUSA ? 1.9 : 1;
    if (troops > 25000) return 13 * s;
    if (troops > 10000) return 9 * s;
    if (troops > 5000)  return 6.5 * s;
    if (troops > 2000)  return 4.5 * s;
    if (troops > 500)   return 3 * s;
    return 2.2 * s;
  };

  const sourcesFiltered = SOURCES.filter(s => sourceFilter === "all" || s.nation === sourceFilter);

  return (
    <div className={styles.wrapper}>

      {/* CHAPEAU ──────────────────────────────────────────── */}
      <div className={styles.intro}>
        <p className={styles.chapeau}>
          En 2025, <strong>19 pays seulement</strong> maintiennent des bases militaires à l'étranger.
          Six d'entre eux concentrent la quasi-totalité de l'empreinte mondiale.
          La dissymétrie est totale et les équilibres sont en train de changer —
          au Sahel, en Méditerranée, dans le Pacifique.
        </p>
      </div>

      {/* LAYOUT PRINCIPAL ─────────────────────────────────── */}
      <div className={styles.mainLayout}>

        {/* BARRE COMPARATIVE */}
        <div className={styles.barPanel}>
          <div className={styles.barTitle}>Bases militaires à l'étranger — 2025</div>
          <div className={styles.barSubtitle}>Données vérifiées · Sources primaires</div>
          <div className={styles.barGrid}>
          {BAR_DATA.map((d) => {
            const count = d.nation === "usa" && usaMode === "officiel" ? d.official : d.count;
            const pct = (count / 750) * 100 * barProgress;
            const isUSA = d.nation === "usa";
            return (
              <div key={d.nation} className={styles.barRow}>
                <div className={styles.barMeta}>
                  <span className={styles.barFlag}>{FLAGS[d.nation]}</span>
                  <div className={styles.barInfo}>
                    <span className={styles.barNation} style={{ color: COLORS[d.nation] }}>{LABELS[d.nation]}</span>
                    <span className={styles.barDetail}>{d.label}</span>
                  </div>
                  <span className={styles.barCount} style={{ color: COLORS[d.nation] }}>
                    {count}{isUSA && usaMode === "vine" ? "+" : ""}
                  </span>
                </div>
                <div className={styles.barTrack} style={{ height: isUSA ? 10 : 6 }}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${pct}%`, background: COLORS[d.nation], boxShadow: isUSA ? `0 0 10px ${COLORS[d.nation]}44` : "none" }}
                  />
                </div>
                <div className={styles.barSource}>{d.source}</div>
                {isUSA && (
                  <div className={styles.usaToggle}>
                    <button className={`${styles.toggleChip} ${usaMode === "vine" ? styles.toggleChipActive : ""}`} style={usaMode === "vine" ? { background: COLORS.usa, borderColor: COLORS.usa } : {}} onClick={() => setUsaMode("vine")}>
                      750+ Vine/Quincy
                    </button>
                    <button className={`${styles.toggleChip} ${usaMode === "officiel" ? styles.toggleChipActive : ""}`} style={usaMode === "officiel" ? { background: COLORS.usa, borderColor: COLORS.usa } : {}} onClick={() => setUsaMode("officiel")}>
                      128 Pentagone
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          </div>
          <button className={styles.sourcesBtn} onClick={() => setShowSources(s => !s)}>
            {showSources ? "▲ Masquer les sources" : "▼ Voir les 17 sources"}
          </button>
        </div>

        {/* CARTE */}
        <div className={styles.mapPanel}>
          {/* Filtres nations */}
          <div className={styles.nationFilters}>
            {NATIONS.map(n => {
              const active = activeNations.has(n);
              return (
                <button key={n} onClick={() => toggleNation(n)} className={`${styles.nationBtn} ${active ? styles.nationBtnActive : styles.nationBtnOff}`}
                  style={active ? { background: COLORS[n], borderColor: COLORS[n] } : {}}>
                  <span>{FLAGS[n]}</span>
                  <span className={styles.nationBtnName}>{LABELS[n]}</span>
                </button>
              );
            })}
          </div>

          {/* Carte */}
          <div className={styles.mapWrap}>
            <div className={styles.zoomControls}>
              <button className={styles.zoomBtn} onClick={() => setZoom(z => Math.min(z * 1.5, 16))} title="Zoom avant">+</button>
              <button className={styles.zoomBtn} onClick={() => { setZoom(1); setCenter([15, 10]); }} title="Réinitialiser">⌂</button>
              <button className={styles.zoomBtn} onClick={() => setZoom(z => Math.max(z / 1.5, 1))} title="Zoom arrière">−</button>
            </div>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 130, center: [15, 15] }}
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup
                zoom={zoom}
                center={center}
                onMoveEnd={({ zoom: z, coordinates }) => { setZoom(z); setCenter(coordinates as [number, number]); }}
                minZoom={1}
                maxZoom={16}
              >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: { fill: "#EDE9DF", stroke: "#C0BAB0", strokeWidth: 0.5, outline: "none" },
                        hover:   { fill: "#E5E0D5", stroke: "#C0BAB0", strokeWidth: 0.5, outline: "none" },
                        pressed: { fill: "#E5E0D5", outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Autres puissances d'abord */}
              {filteredBases.filter(b => b.nation !== "usa").map(base => {
                const r = getR(base.troops, false);
                const col = COLORS[base.nation];
                const isHov = hoveredBase?.id === base.id;
                const isSel = selectedBase?.id === base.id;
                const opacity = base.certainty === "confirmée" ? 0.82 : base.certainty === "probable" ? 0.55 : 0.3;
                return (
                  <Marker key={base.id} coordinates={[base.lng, base.lat]}>
                    <circle
                      r={isHov || isSel ? r + 2.5 : r}
                      fill={col}
                      fillOpacity={isHov || isSel ? 1 : opacity}
                      stroke={isSel ? "#fff" : "rgba(255,255,255,0.5)"}
                      strokeWidth={isSel ? 1.5 : 0.6}
                      strokeDasharray={base.certainty !== "confirmée" ? "2,1.5" : undefined}
                      style={{ cursor: "pointer", transition: "r 0.15s" }}
                      onMouseEnter={() => setHoveredBase(base)}
                      onMouseLeave={() => setHoveredBase(null)}
                      onClick={() => setSelectedBase(isSel ? null : base)}
                    />
                  </Marker>
                );
              })}

              {/* USA au-dessus */}
              {filteredBases.filter(b => b.nation === "usa").map(base => {
                const r = getR(base.troops, true);
                const isHov = hoveredBase?.id === base.id;
                const isSel = selectedBase?.id === base.id;
                return (
                  <Marker key={base.id} coordinates={[base.lng, base.lat]}>
                    <circle
                      r={isHov || isSel ? r + 3 : r}
                      fill={COLORS.usa}
                      fillOpacity={isHov || isSel ? 1 : 0.88}
                      stroke={isSel ? "#fff" : "rgba(255,255,255,0.6)"}
                      strokeWidth={isSel ? 1.8 : 0.8}
                      style={{ cursor: "pointer", transition: "r 0.15s" }}
                      onMouseEnter={() => setHoveredBase(base)}
                      onMouseLeave={() => setHoveredBase(null)}
                      onClick={() => setSelectedBase(isSel ? null : base)}
                    />
                  </Marker>
                );
              })}
              </ZoomableGroup>
            </ComposableMap>

            {/* Tooltip */}
            {hoveredBase && !selectedBase && (
              <div ref={tooltipRef} className={styles.tooltip}>
                <div className={styles.ttNation} style={{ color: COLORS[hoveredBase.nation] }}>
                  {FLAGS[hoveredBase.nation]} {LABELS[hoveredBase.nation]}
                </div>
                <div className={styles.ttName}>{hoveredBase.name}</div>
                <div className={styles.ttCountry}>{hoveredBase.country}</div>
                <div className={styles.ttRow}>
                  <span>{hoveredBase.troops.toLocaleString("fr-FR")} militaires</span>
                  <span className={styles.ttCert} data-c={hoveredBase.certainty}>{hoveredBase.certainty}</span>
                </div>
              </div>
            )}
            {(["confirmée","probable","alléguée"] as Certainty[]).map(c => (
                <div key={c} className={styles.certItem}>
                  <svg width={16} height={16}>
                    <circle cx={8} cy={8} r={4} fill="#5A5550"
                      opacity={c === "confirmée" ? 0.85 : c === "probable" ? 0.55 : 0.3}
                      stroke={c !== "confirmée" ? "#5A5550" : "none"}
                      strokeDasharray={c !== "confirmée" ? "2,1.5" : undefined}
                      strokeWidth="1"
                    />
                  </svg>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FICHE BASE SÉLECTIONNÉE */}
      {selectedBase && (
        <div className={styles.baseCard} style={{ borderLeftColor: COLORS[selectedBase.nation] }}>
          <button className={styles.cardClose} onClick={() => setSelectedBase(null)}>×</button>
          <div className={styles.cardNation} style={{ color: COLORS[selectedBase.nation] }}>
            {FLAGS[selectedBase.nation]} {LABELS[selectedBase.nation]}
            {selectedBase.certainty !== "confirmée" && (
              <span className={styles.certBadge} data-c={selectedBase.certainty}> — {selectedBase.certainty}</span>
            )}
          </div>
          <h3 className={styles.cardName}>{selectedBase.name}</h3>
          <div className={styles.cardCountry}>{selectedBase.country} · {selectedBase.troops.toLocaleString("fr-FR")} militaires</div>
          <p className={styles.cardNote}>{selectedBase.note}</p>
          {selectedBase.sourceId && (() => {
            const src = SOURCES.find(s => s.id === selectedBase.sourceId);
            return src ? (
              <a href={src.url} target="_blank" rel="noopener noreferrer" className={styles.cardSource}>
                📎 Source : {src.label}
              </a>
            ) : null;
          })()}
        </div>
      )}

      {/* PANNEAU SOURCES */}
      {showSources && (
        <div className={styles.sourcesPanel}>
          <div className={styles.sourcesHeader}>
            <div>
              <div className={styles.sourcesTitle}>Sources & méthodologie</div>
              <div className={styles.sourcesSub}>17 sources primaires — cliquez pour accéder aux documents originaux</div>
            </div>
            <div className={styles.sourcesTabs}>
              {(["all","usa","uk","russia","turkey","france","china"] as (Nation|"all")[]).map(n => (
                <button key={n} onClick={() => setSourceFilter(n)}
                  className={`${styles.sourceTab} ${sourceFilter === n ? styles.sourceTabActive : ""}`}
                  style={sourceFilter === n && n !== "all" ? { borderColor: COLORS[n as Nation], color: COLORS[n as Nation] } : {}}>
                  {n === "all" ? "Toutes" : FLAGS[n as Nation]}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.sourcesGrid}>
            {sourcesFiltered.map(src => (
              <a key={src.id} href={src.url} target="_blank" rel="noopener noreferrer" className={styles.sourceCard}>
                <div className={styles.sourceCardNation} style={{ color: COLORS[src.nation as Nation] }}>
                  {FLAGS[src.nation as Nation]} {LABELS[src.nation as Nation]}
                </div>
                <div className={styles.sourceCardLabel}>{src.label}</div>
                <div className={styles.sourceCardNote}>{src.note}</div>
                <div className={styles.sourceCardLink}>↗ Consulter la source</div>
              </a>
            ))}
          </div>
          <div className={styles.methodNote}>
            <strong>Note méthodologique</strong> — Les chiffres de bases militaires varient fortement selon la définition retenue.
            Le Pentagone comptabilise les installations permanentes majeures (128 pour les USA).
            David Vine et le Quincy Institute incluent les "lily pads", accords d'accès et sites temporaires recurrents (750+).
            Pour la Russie, seul le chiffre officiel du Ministère de la Défense est utilisé (21 installations, Izvestiya 2018) —
            le statut des bases syriennes est indiqué "probable" en raison de la situation post-Assad (voir Wikipedia Tartus, fév. 2026).
            Pour la France, les données sont mises à jour au 17 juillet 2025 (dernières bases africaines restituées au Sénégal, Euractiv).
          </div>
        </div>
      )}

      {/* ARTICLE ÉDITORIAL */}
      <div className="soara-article">
        <h2>Le retrait silencieux</h2>
        <p><strong>En juillet 2025, la France a remis les clés du camp Geille aux autorités sénégalaises.</strong> Une cérémonie sobre, couverte par quelques journaux spécialisés, presque invisible dans le débat public français. Pourtant, cette restitution marquait la fin d'une présence militaire de soixante-cinq ans au Sénégal et, avec elle, la fin de la présence permanente française en Afrique de l'Ouest. En trois ans, Paris avait quitté le Mali, le Burkina Faso, le Niger, le Tchad, la Côte d'Ivoire. Il ne reste plus qu'une seule base française en Afrique subsaharienne : Djibouti, sur la Corne du continent, là où le détroit de Bab-el-Mandeb transforme n'importe quelle présence navale en levier géopolitique.</p>
        <p>Ce mouvement de retrait est probablement la transformation la plus profonde de la géopolitique militaire française depuis la décolonisation. Il ne résulte pas d'une décision stratégique assumée mais d'une succession d'expulsions. Le Mali d'abord, en 2022, après des années de tension entre Paris et les juntes successives. Le Burkina Faso, le Niger, le Tchad ensuite, dans un enchaînement qui ressemblait moins à une politique africaine de la France qu'à une débâcle. Et pendant que les soldats français pliaient bagages, d'autres arrivaient. Les mêmes hangars, les mêmes pistes, les mêmes drapeaux changés. L'Africa Corps s'installait à Agadez quelques semaines après le départ américain. La géographie du Sahel ne tolère pas le vide.</p>
        <div className="pull-quote">
          <p>Le 17 juillet 2025, la France a rendu ses dernières emprises militaires au Sénégal. En trois ans, six pays africains lui avaient montré la porte. Ce n'est pas de la géopolitique. C'est une sentence.</p>
        </div>
        <h2>Les 750 bases et le problème du vocabulaire</h2>
        <p>Les États-Unis ont 128 bases militaires à l'étranger. C'est ce qu'indique le Base Structure Report du Pentagone, publié chaque année conformément à une obligation légale du Congrès. Le chercheur David Vine, après une décennie de travail sur les archives du Department of Defense, en comptabilise 750. L'écart entre ces deux chiffres n'est pas une erreur de mesure. C'est un désaccord sur ce qu'on appelle une base. Le Pentagone comptabilise les installations permanentes majeures. Vine inclut les sites temporaires récurrents, les accords d'accès sans dénomination officielle, les "lily pads" logistiques, les antennes de renseignement que personne ne présente comme des bases mais qui fonctionnent comme telles. Quand une installation américaine en Éthiopie opère des drones au-dessus de la Somalie depuis dix ans sans avoir jamais été officiellement reconnue, on peut appeler ça de la coopération bilatérale. On peut aussi appeler ça une base.</p>
        <p>Cette question de vocabulaire n'est pas anodine. Elle détermine le débat politique intérieur américain, la perception internationale de l'empreinte militaire des États-Unis, et la capacité des populations des pays hôtes à nommer ce qui se passe sur leur sol. Un pays ne peut pas débattre de ce qu'il ne peut pas désigner. C'est l'une des fonctions les moins commentées du déni taxonomique pratiqué par Washington depuis 1945.</p>
        <h2>Moscou joue à huis clos</h2>
        <p>Le dernier chiffre officiel russe sur les bases à l'étranger date de 2018 : 21 installations, selon Izvestiya citant le Ministère de la Défense. Depuis, la Russie a perdu la Syrie — ou presque. Quand Assad s'est effondré en décembre 2024, les navires russes ont quitté Tartous, les équipements ont été transférés sur des cargos en direction de la Libye orientale, et des images satellites ont montré des hélicoptères Ka-52 chargés dans des Antonov en partance pour le désert libyen. Puis, en octobre 2025, le nouveau gouvernement syrien d'Ahmed al-Sharaa a reçu Poutine et déclaré vouloir honorer les accords existants. Hmeimim a été réactivée. Tartous reste dans un statut hybride que personne ne sait tout à fait nommer.</p>
        <p>Pendant ce temps, l'Africa Corps a pris ses quartiers au Niger, au Mali, au Burkina Faso, en Centrafrique, en Libye. Le modèle est rodé : un coup d'État crée une transition, la transition chasse les Français ou les Américains, et quelques semaines plus tard des instructeurs russes débarquent avec du matériel soviétique reconditionné et des accords de sécurité dont les clauses restent confidentielles. En échange, des concessions minières. En Centrafrique, les revenus de l'or et des diamants financent en partie la présence militaire. C'est un empire qui s'autofinance.</p>
        <h2>Pékin prend son temps</h2>
        <p>La Chine a une base à Djibouti. Une seule, officiellement. À huit kilomètres du Camp Lemonnier américain, dans un pays grand comme la Bretagne qui accueille plus de puissances militaires étrangères par kilomètre carré qu'aucun autre endroit sur terre. Mais la base de Djibouti est moins intéressante comme installation que comme symbole d'une stratégie qui s'étend ailleurs et autrement. Les îles artificielles en mer de Chine méridionale ne sont pas des bases au sens diplomatique du terme ; la Cour permanente d'arbitrage de La Haye les a déclarées illégales en 2016, et Pékin n'a pas daigné reconnaître la sentence. Elles ont des pistes d'atterrissage, des silos à missiles, des systèmes radar. Le débat sémantique sur leur statut juridique n'intéresse plus grand monde à l'état-major de l'armée populaire de libération.</p>
        <p>Ce qui se construit au Pakistan, au Cambodge, dans les négociations discrètes avec la Tanzanie et les Îles Salomon, c'est une présence militaire mondiale qui avance masquée derrière des investissements d'infrastructure. Le port de Gwadar est un port commercial. La base navale de Ream est une rénovation humanitaire. La terminologie change à chaque escale. Ce que Vine a documenté pour les États-Unis sur cinquante ans, la Chine est en train de le construire en dix. La différence est que personne, pour l'instant, ne publie le rapport annuel.</p>
        <h2>La souveraineté n'est pas une abstraction</h2>
        <p>Regarder cette carte longtemps, c'est finir par se poser une question que les chancelleries évitent soigneusement : à qui appartient le territoire sur lequel ces bases sont installées ? La réponse juridique est simple. La réponse politique l'est moins. Quand les habitants d'Okinawa votent depuis trente ans pour le départ des Marines et que les bases sont toujours là, la souveraineté japonaise sur ces terres est réelle sur le papier et limitée dans les faits. Quand Bahreïn accueille la 5e Flotte américaine pendant que son gouvernement réprime ses opposants, la présence militaire américaine n'est pas neutre dans l'équation politique intérieure du pays. Quand Diego Garcia a été vidée de force de sa population chagossienne pour y construire une piste de bombardiers, on a posé les fondations d'une base sur une expulsion.</p>
        <p>Ces réalités ne figurent dans aucun Base Structure Report. Elles ne rentrent pas dans les catégories "grande", "moyenne", "petite" du Pentagone. Mais elles sont là, dans chaque point de cette carte, derrière chaque nom de base et chaque coordonnée. La puissance militaire mondiale se mesure en bases. Elle se vit en souveraineté cédée, en populations déplacées, en décisions prises ailleurs que là où leurs conséquences s'exercent.</p>
      </div>
    </div>
  );
}
