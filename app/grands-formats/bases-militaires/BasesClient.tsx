"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./bases.module.css";

type Nation = "usa" | "uk" | "russia" | "turkey" | "france" | "china";
type Region = "europe" | "indo-pacifique" | "moyen-orient" | "afrique" | "ameriques" | "pacifique";
type Certainty = "confirmée" | "probable" | "alléguée";

interface MilBase {
  id: number;
  name: string;
  nation: Nation;
  country: string;
  city: string;
  lat: number;
  lng: number;
  region: Region;
  troops: number;
  founded: number;
  annualCostM: number;
  certainty: Certainty;
  note: string;
}

const NATION_COLORS: Record<Nation, string> = {
  usa:    "#1E3A8A",
  uk:     "#B91C1C",
  russia: "#16A34A",
  turkey: "#EA580C",
  france: "#7C3AED",
  china:  "#CA8A04",
};

const NATION_LABELS: Record<Nation, string> = {
  usa:    "États-Unis",
  uk:     "Royaume-Uni",
  russia: "Russie",
  turkey: "Turquie",
  france: "France",
  china:  "Chine",
};

const NATION_FLAGS: Record<Nation, string> = {
  usa: "🇺🇸", uk: "🇬🇧", russia: "🇷🇺", turkey: "🇹🇷", france: "🇫🇷", china: "🇨🇳",
};

const BASES: MilBase[] = [
  // USA
  { id:1,   nation:"usa", name:"Ramstein Air Base",                  country:"Allemagne",              city:"Ramstein",              lat:49.437, lng:7.600,    region:"europe",         troops:9400,  founded:1953, annualCostM:1200, certainty:"confirmée", note:"Centre névralgique du commandement aérien européen. Nœud pour les opérations de drones en Afrique et Moyen-Orient." },
  { id:2,   nation:"usa", name:"Grafenwöhr Training Area",           country:"Allemagne",              city:"Grafenwöhr",            lat:49.707, lng:11.941,   region:"europe",         troops:7200,  founded:1910, annualCostM:680,  certainty:"confirmée", note:"Plus grande zone d'entraînement US en Europe. Formation des forces ukrainiennes depuis 2022." },
  { id:3,   nation:"usa", name:"USAG Stuttgart (AFRICOM/EUCOM)",     country:"Allemagne",              city:"Stuttgart",             lat:48.736, lng:9.168,    region:"europe",         troops:6800,  founded:1945, annualCostM:890,  certainty:"confirmée", note:"QG de l'AFRICOM — la stratégie militaire américaine en Afrique pilotée depuis l'Allemagne." },
  { id:4,   nation:"usa", name:"Spangdahlem Air Base",               country:"Allemagne",              city:"Spangdahlem",           lat:49.973, lng:6.692,    region:"europe",         troops:4200,  founded:1952, annualCostM:420,  certainty:"confirmée", note:"Base aérienne tactique. Soutien OTAN, surveillance Europe de l'Est." },
  { id:5,   nation:"usa", name:"Camp Humphreys",                     country:"Corée du Sud",           city:"Pyeongtaek",            lat:36.971, lng:127.029,  region:"indo-pacifique", troops:36000, founded:1919, annualCostM:3100, certainty:"confirmée", note:"Plus grande base US à l'étranger (14,7 km²). La Corée du Sud finance 50% du coût." },
  { id:6,   nation:"usa", name:"Yokosuka Naval Base",                country:"Japon",                  city:"Yokosuka",              lat:35.288, lng:139.674,  region:"indo-pacifique", troops:24000, founded:1945, annualCostM:2200, certainty:"confirmée", note:"QG de la 7e Flotte. Seul port-base d'un porte-avions hors territoire américain." },
  { id:7,   nation:"usa", name:"Kadena Air Base",                    country:"Japon",                  city:"Okinawa",               lat:26.356, lng:127.768,  region:"indo-pacifique", troops:18000, founded:1945, annualCostM:1800, certainty:"confirmée", note:"Principale base aérienne en Asie. Surveillance de la Chine et de Taiwan. Okinawa supporte 70% des bases US au Japon." },
  { id:8,   nation:"usa", name:"Yokota Air Base",                    country:"Japon",                  city:"Tokyo (banlieue)",      lat:35.749, lng:139.349,  region:"indo-pacifique", troops:11000, founded:1945, annualCostM:1100, certainty:"confirmée", note:"QG Forces Aériennes Pacifique. Contrôle l'espace aérien de la région Tokyo." },
  { id:9,   nation:"usa", name:"Osan Air Base",                      country:"Corée du Sud",           city:"Osan",                  lat:37.090, lng:127.029,  region:"indo-pacifique", troops:10000, founded:1951, annualCostM:980,  certainty:"confirmée", note:"Première ligne face à la DMZ. Détection des lancements nord-coréens." },
  { id:10,  nation:"usa", name:"Al Udeid Air Base",                  country:"Qatar",                  city:"Al Udeid",              lat:25.118, lng:51.315,   region:"moyen-orient",   troops:10000, founded:1996, annualCostM:1400, certainty:"confirmée", note:"QG du CENTCOM. Plus grande base US au Moyen-Orient. Opérations de l'Afghanistan à la Libye." },
  { id:11,  nation:"usa", name:"Camp Arifjan",                       country:"Koweït",                 city:"Shuaiba",               lat:29.196, lng:47.938,   region:"moyen-orient",   troops:13000, founded:1991, annualCostM:980,  certainty:"confirmée", note:"Principale base logistique pour le Moyen-Orient. Blindés lourds pré-positionnés." },
  { id:12,  nation:"usa", name:"NSA Bahrain (5e Flotte)",            country:"Bahreïn",                city:"Manama",                lat:26.233, lng:50.583,   region:"moyen-orient",   troops:8200,  founded:1948, annualCostM:860,  certainty:"confirmée", note:"QG de la 5e Flotte. Surveillance du Golfe et du détroit d'Ormuz." },
  { id:13,  nation:"usa", name:"RAF Lakenheath",                     country:"Royaume-Uni",            city:"Brandon",               lat:52.409, lng:0.560,    region:"europe",         troops:4700,  founded:1941, annualCostM:560,  certainty:"confirmée", note:"Seule base US d'armes nucléaires tactiques en Europe (bombes B61). F-35A." },
  { id:14,  nation:"usa", name:"Aviano Air Base",                    country:"Italie",                 city:"Aviano",                lat:46.032, lng:12.596,   region:"europe",         troops:4800,  founded:1954, annualCostM:510,  certainty:"confirmée", note:"Projection vers Méditerranée et Moyen-Orient. F-16 et drones de surveillance." },
  { id:15,  nation:"usa", name:"NAS Sigonella",                      country:"Italie",                 city:"Catane (Sicile)",       lat:37.402, lng:14.922,   region:"europe",         troops:4100,  founded:1959, annualCostM:440,  certainty:"confirmée", note:"Carrefour méditerranéen. Drones Global Hawk. Opérations contre-terrorisme Afrique du Nord." },
  { id:16,  nation:"usa", name:"Naval Station Rota",                 country:"Espagne",                city:"Rota",                  lat:36.645, lng:-6.349,   region:"europe",         troops:3700,  founded:1953, annualCostM:450,  certainty:"confirmée", note:"Principale base navale en Méditerranée occidentale. Destroyers antimissiles balistiques." },
  { id:17,  nation:"usa", name:"Andersen Air Force Base",            country:"Guam (US)",              city:"Dededo",                lat:13.584, lng:144.926,  region:"pacifique",      troops:7800,  founded:1944, annualCostM:820,  certainty:"confirmée", note:"B-52 en alerte permanente. Symbole de la puissance US dans le Pacifique occidental." },
  { id:18,  nation:"usa", name:"NSF Diego Garcia",                   country:"Diego Garcia (UK)",      city:"Diego Garcia",          lat:-7.319, lng:72.423,   region:"indo-pacifique", troops:3800,  founded:1971, annualCostM:620,  certainty:"confirmée", note:"Île dont les habitants furent expulsés de force. B-52 vers Afghanistan et Irak. L'ICJ a condamné la présence britannique en 2019." },
  { id:19,  nation:"usa", name:"Camp Lemonnier",                     country:"Djibouti",               city:"Djibouti-ville",        lat:11.546, lng:43.160,   region:"afrique",        troops:4000,  founded:2002, annualCostM:520,  certainty:"confirmée", note:"Seule base US permanente officielle en Afrique. Drones vers Somalie et Yémen. À 8 km de la base chinoise." },
  { id:20,  nation:"usa", name:"Camp Bondsteel",                     country:"Kosovo",                 city:"Ferizaj",               lat:42.360, lng:21.358,   region:"europe",         troops:3600,  founded:1999, annualCostM:270,  certainty:"confirmée", note:"Plus grande base US construite depuis le Viêtnam. Sentinelle des Balkans depuis 1999." },
  { id:21,  nation:"usa", name:"Al Dhafra Air Base",                 country:"Émirats Arabes Unis",    city:"Abu Dhabi",             lat:24.242, lng:54.548,   region:"moyen-orient",   troops:5000,  founded:1991, annualCostM:580,  certainty:"confirmée", note:"Drones RQ-4 et F-35. Surveillance de l'Iran." },
  { id:22,  nation:"usa", name:"MK Air Base (Roumanie)",             country:"Roumanie",               city:"Mihail Kogalniceanu",   lat:44.362, lng:28.489,   region:"europe",         troops:4200,  founded:2002, annualCostM:380,  certainty:"confirmée", note:"Principale tête de pont OTAN flanc est depuis 2022. Armement lourd pré-positionné." },
  { id:23,  nation:"usa", name:"Camp Kościuszko / Powidz",           country:"Pologne",                city:"Poznań / Powidz",       lat:52.390, lng:17.000,   region:"europe",         troops:10300, founded:2017, annualCostM:880,  certainty:"confirmée", note:"Brigade blindée en rotation. Équipements pré-positionnés pour un corps d'armée complet." },
  { id:24,  nation:"usa", name:"Incirlik Air Base",                  country:"Turquie",                city:"Adana",                 lat:37.002, lng:35.426,   region:"moyen-orient",   troops:2500,  founded:1954, annualCostM:290,  certainty:"confirmée", note:"Dernier stockage de bombes nucléaires B61 en zone de tension. Relations US-Turquie instables." },
  { id:25,  nation:"usa", name:"NSA Souda Bay",                      country:"Grèce",                  city:"Crète",                 lat:35.521, lng:24.151,   region:"europe",         troops:1100,  founded:1969, annualCostM:130,  certainty:"confirmée", note:"Porte d'entrée vers la Méditerranée orientale. Sous-marins nucléaires." },
  { id:26,  nation:"usa", name:"RAF Menwith Hill (NSA)",             country:"Royaume-Uni",            city:"Harrogate",             lat:54.004, lng:-1.691,   region:"europe",         troops:2100,  founded:1954, annualCostM:320,  certainty:"confirmée", note:"Plus grande station d'écoute US hors territoire américain. Réseau ECHELON." },
  { id:27,  nation:"usa", name:"Pine Gap",                           country:"Australie",              city:"Alice Springs",         lat:-23.798,lng:133.738,  region:"pacifique",      troops:1000,  founded:1970, annualCostM:480,  certainty:"confirmée", note:"Installation de renseignement ultra-secrète. Guidage de drones de combat. Révélations Snowden 2013." },
  { id:28,  nation:"usa", name:"JDFPG Darwin (Marines)",             country:"Australie",              city:"Darwin",                lat:-12.462,lng:130.846,  region:"pacifique",      troops:2500,  founded:2012, annualCostM:210,  certainty:"confirmée", note:"Rotation de Marines. Verrou stratégique du détroit de Lombok." },
  { id:29,  nation:"usa", name:"Muwaffaq Salti AB",                  country:"Jordanie",               city:"Azraq",                 lat:31.727, lng:37.045,   region:"moyen-orient",   troops:3200,  founded:1990, annualCostM:240,  certainty:"confirmée", note:"Opérations contre Daech en Syrie et Irak. F-15 et drones. La Jordanie reçoit 1,5 Md$ d'aide US par an." },
  { id:30,  nation:"usa", name:"Prince Sultan Air Base",             country:"Arabie Saoudite",        city:"Al-Kharj",              lat:24.062, lng:47.581,   region:"moyen-orient",   troops:2800,  founded:1990, annualCostM:340,  certainty:"confirmée", note:"Réactivée en 2019. La présence de soldats US en terre sainte est invoquée par Al-Qaïda pour légitimer son djihad." },
  { id:31,  nation:"usa", name:"Guantanamo Bay Naval Station",       country:"Cuba",                   city:"Guantanamo",            lat:19.906, lng:-75.099,  region:"ameriques",      troops:6000,  founded:1898, annualCostM:540,  certainty:"confirmée", note:"Symbole mondial de la violation des droits humains post-11 septembre. Cuba refuse le loyer de 4 085$/an depuis 1960." },
  { id:32,  nation:"usa", name:"Camp Foster / MCAS Futenma",         country:"Japon",                  city:"Okinawa",               lat:26.298, lng:127.776,  region:"indo-pacifique", troops:8200,  founded:1945, annualCostM:780,  certainty:"confirmée", note:"QG III Marine Expeditionary Force. Okinawa supporte 70% des bases US au Japon pour 0,6% du territoire national." },
  { id:33,  nation:"usa", name:"Basa Air Base (Philippines)",        country:"Philippines",            city:"Pampanga",              lat:14.987, lng:120.500,  region:"indo-pacifique", troops:3200,  founded:2014, annualCostM:290,  certainty:"confirmée", note:"9 bases sous accord EDCA pour contenir la Chine en mer de Chine méridionale." },
  { id:34,  nation:"usa", name:"Kwajalein Missile Range",            country:"Îles Marshall",          city:"Kwajalein Atoll",       lat:8.720,  lng:167.730,  region:"pacifique",      troops:1100,  founded:1944, annualCostM:380,  certainty:"confirmée", note:"Tests de missiles balistiques intercontinentaux. Les Marshallais bannis de leur propre atoll." },
  { id:35,  nation:"usa", name:"Al Asad / Victory Base Complex",     country:"Irak",                   city:"Al Anbar / Bagdad",     lat:33.500, lng:43.000,   region:"moyen-orient",   troops:3000,  founded:1987, annualCostM:280,  certainty:"confirmée", note:"Ciblée par 16 missiles iraniens en janvier 2020 après l'assassinat de Soleimani." },
  { id:36,  nation:"usa", name:"Soto Cano Air Base",                 country:"Honduras",               city:"Comayagua",             lat:14.382, lng:-87.621,  region:"ameriques",      troops:600,   founded:1954, annualCostM:75,   certainty:"confirmée", note:"Vestige de la stratégie Reagan en Amérique centrale. Opérations anti-drogue." },
  { id:37,  nation:"usa", name:"Air Base 201 — Agadez (fermée 2024)",country:"Niger",                  city:"Agadez",                lat:16.966, lng:7.922,    region:"afrique",        troops:100,   founded:2018, annualCostM:0,    certainty:"confirmée", note:"110 M$ investis, évacuée en 2024. La junte a expulsé les Américains et accueilli des Russes (Africa Corps)." },
  { id:38,  nation:"usa", name:"Lajes Field",                        country:"Portugal (Açores)",      city:"Terceira",              lat:38.762, lng:-27.091,  region:"europe",         troops:780,   founded:1943, annualCostM:95,   certainty:"confirmée", note:"Verrou de l'Atlantique Nord. Lutte anti-sous-marine, ravitaillement transocéanique." },
  // UK
  { id:101, nation:"uk", name:"Akrotiri / Dhekelia (Chypre)",        country:"Chypre",                 city:"Akrotiri",              lat:34.590, lng:33.050,   region:"moyen-orient",   troops:3500,  founded:1956, annualCostM:280,  certainty:"confirmée", note:"Territoire britannique souverain d'outre-mer. Base de surveillance pour tout le Moyen-Orient. Frappes en Syrie depuis 2014." },
  { id:102, nation:"uk", name:"RAF Gibraltar",                       country:"Gibraltar",              city:"Gibraltar",             lat:36.148, lng:-5.347,   region:"europe",         troops:700,   founded:1939, annualCostM:95,   certainty:"confirmée", note:"Verrou stratégique du détroit entre Atlantique et Méditerranée. Revendiqué par l'Espagne." },
  { id:103, nation:"uk", name:"Mount Pleasant Complex (Malouines)",  country:"Falkland Islands",       city:"Port Stanley",          lat:-51.823,lng:-58.447,  region:"ameriques",      troops:1200,  founded:1985, annualCostM:180,  certainty:"confirmée", note:"Construit après la guerre des Malouines (1982). Réaffirmation de la souveraineté face à l'Argentine." },
  { id:104, nation:"uk", name:"RAF Ascension Island",                country:"Ascension (UK)",         city:"Georgetown",            lat:-7.969, lng:-14.394,  region:"afrique",        troops:400,   founded:1942, annualCostM:65,   certainty:"confirmée", note:"Pivot atlantique. Soutien aux Falklands, surveillance sous-marine." },
  { id:105, nation:"uk", name:"Bases en Oman (16 sites)",            country:"Oman",                   city:"Muscat / Duqm",         lat:23.584, lng:58.406,   region:"moyen-orient",   troops:1500,  founded:1980, annualCostM:140,  certainty:"confirmée", note:"16 installations. Accès au port de Duqm sur l'océan Indien — position stratégique face à l'Iran." },
  { id:106, nation:"uk", name:"Brunei Garrison",                     country:"Brunei",                 city:"Seria",                 lat:4.640,  lng:114.300,  region:"indo-pacifique", troops:900,   founded:1971, annualCostM:80,   certainty:"confirmée", note:"Seul bataillon de Gurkhas permanent hors Royaume-Uni. Brunei finance entièrement la présence britannique." },
  { id:107, nation:"uk", name:"Bases en Arabie Saoudite (15)",       country:"Arabie Saoudite",        city:"Riyad / Tabuk",         lat:24.700, lng:46.700,   region:"moyen-orient",   troops:800,   founded:1990, annualCostM:90,   certainty:"confirmée", note:"15 installations. Soutien à la coalition anti-Houthis. Présence discrète mais significative." },
  { id:108, nation:"uk", name:"UK Joint Support Base Bahreïn",       country:"Bahreïn",                city:"Manama",                lat:26.215, lng:50.596,   region:"moyen-orient",   troops:500,   founded:2018, annualCostM:70,   certainty:"confirmée", note:"Première base navale permanente au Moyen-Orient depuis 1971. Coexistence avec la 5e Flotte américaine." },
  { id:109, nation:"uk", name:"British Forces Kenya",                country:"Kenya",                  city:"Nanyuki",               lat:0.022,  lng:37.034,   region:"afrique",        troops:350,   founded:1964, annualCostM:55,   certainty:"confirmée", note:"Formation de l'armée kényane. Présence permanente depuis l'indépendance." },
  { id:110, nation:"uk", name:"Belize Training Area",                country:"Belize",                 city:"Ladyville",             lat:17.531, lng:-88.302,  region:"ameriques",      troops:230,   founded:1962, annualCostM:40,   certainty:"confirmée", note:"Centre d'entraînement jungle. Maintenu après l'indépendance de 1981 face aux revendications guatémaltèques." },
  // RUSSIA
  { id:201, nation:"russia", name:"Base navale de Tartous",          country:"Syrie",                  city:"Tartous",               lat:34.894, lng:35.887,   region:"moyen-orient",   troops:1500,  founded:1971, annualCostM:150,  certainty:"confirmée", note:"Seule base navale russe en Méditerranée. Préservée au prix d'un soutien militaire au régime Assad depuis 2015." },
  { id:202, nation:"russia", name:"Base aérienne de Hmeimim",        country:"Syrie",                  city:"Lattaquié",             lat:35.401, lng:35.949,   region:"moyen-orient",   troops:4000,  founded:2015, annualCostM:320,  certainty:"confirmée", note:"Tête de pont aérienne pour les opérations en Syrie. Frappes régulières depuis 2015." },
  { id:203, nation:"russia", name:"Base 102 — Gyumri",               country:"Arménie",                city:"Gyumri",                lat:40.795, lng:43.855,   region:"europe",         troops:3500,  founded:1995, annualCostM:180,  certainty:"confirmée", note:"Verrou stratégique face à la Turquie. L'Arménie paie le prix de cette dépendance après la défaite au Karabagh." },
  { id:204, nation:"russia", name:"201e base militaire (Tadjikistan)",country:"Tadjikistan",           city:"Douchanbe",             lat:38.558, lng:68.774,   region:"moyen-orient",   troops:7000,  founded:1992, annualCostM:220,  certainty:"confirmée", note:"Plus grande base russe à l'étranger en effectifs. Surveillance de l'Afghanistan post-retrait américain." },
  { id:205, nation:"russia", name:"Base de Kant",                    country:"Kirghizstan",            city:"Kant",                  lat:42.885, lng:74.850,   region:"moyen-orient",   troops:500,   founded:2003, annualCostM:45,   certainty:"confirmée", note:"Seule base aérienne russe en Asie centrale. Compétition avec l'ancienne base américaine de Manas." },
  { id:206, nation:"russia", name:"Sébastopol (Flotte Mer Noire)",   country:"Ukraine (occupée)",      city:"Sébastopol",            lat:44.616, lng:33.524,   region:"europe",         troops:25000, founded:1783, annualCostM:800,  certainty:"confirmée", note:"Annexion de la Crimée en 2014. QG de la Flotte de la Mer Noire. Cible de frappes ukrainiennes dès 2022." },
  { id:207, nation:"russia", name:"Garnisons en Biélorussie",        country:"Biélorussie",            city:"Minsk / Babruysk",      lat:53.900, lng:27.500,   region:"europe",         troops:12000, founded:2022, annualCostM:350,  certainty:"confirmée", note:"Déploiement massif depuis 2022. La Biélorussie utilisée comme plateforme d'attaque en février 2022." },
  { id:208, nation:"russia", name:"Kaliningrad (enclave militarisée)",country:"Russie (enclave)",      city:"Kaliningrad",           lat:54.716, lng:20.516,   region:"europe",         troops:15000, founded:1946, annualCostM:600,  certainty:"confirmée", note:"Enclave hypermilitarisée entre Pologne et Lituanie. Missiles Iskander pointés vers Berlin et Varsovie." },
  { id:209, nation:"russia", name:"Africa Corps — Mali",             country:"Mali",                   city:"Bamako / Kidal",        lat:15.552, lng:-4.199,   region:"afrique",        troops:1500,  founded:2021, annualCostM:120,  certainty:"confirmée", note:"Après le coup d'État de 2021. Mines d'or saisies en contrepartie du soutien militaire." },
  { id:210, nation:"russia", name:"Africa Corps — Burkina Faso",     country:"Burkina Faso",           city:"Ouagadougou",           lat:12.366, lng:-1.534,   region:"afrique",        troops:800,   founded:2023, annualCostM:75,   certainty:"confirmée", note:"Après l'expulsion des Français (Barkhane). Schéma identique : coup d'État, départ de la France, arrivée de Moscou." },
  { id:211, nation:"russia", name:"Africa Corps — RCA",              country:"Rép. Centrafricaine",    city:"Bangui",                lat:4.361,  lng:18.556,   region:"afrique",        troops:2000,  founded:2018, annualCostM:95,   certainty:"confirmée", note:"Présence la plus ancienne de Wagner/Africa Corps en Afrique. Mines de diamants. Garde présidentielle." },
  { id:212, nation:"russia", name:"Africa Corps — Libye (est)",      country:"Libye",                  city:"Benghazi / Syrte",      lat:32.115, lng:20.069,   region:"afrique",        troops:1200,  founded:2019, annualCostM:85,   certainty:"probable",  note:"Soutien à Khalifa Haftar (LNA). Présence de systèmes S-300. Jamais officiellement reconnu par Moscou." },
  { id:213, nation:"russia", name:"Africa Corps — Niger",            country:"Niger",                  city:"Agadez / Niamey",       lat:13.515, lng:2.117,    region:"afrique",        troops:1500,  founded:2024, annualCostM:60,   certainty:"confirmée", note:"Occupent la base abandonnée par les Américains. Déploiement express pour combler le vide stratégique." },
  { id:214, nation:"russia", name:"Présence navale — Cuba",          country:"Cuba",                   city:"La Havane",             lat:23.136, lng:-82.359,  region:"ameriques",      troops:200,   founded:2023, annualCostM:30,   certainty:"probable",  note:"Escales régulières de frégates et sous-marins depuis 2023. Signal fort vers Washington." },
  // TURKEY
  { id:301, nation:"turkey", name:"Forces en Chypre du Nord",        country:"Chypre du Nord",         city:"Nicosie-Nord",          lat:35.165, lng:33.363,   region:"moyen-orient",   troops:32000, founded:1974, annualCostM:450,  certainty:"confirmée", note:"Occupation depuis 1974, condamnée par l'ONU. 30 000-40 000 soldats. Chypre du Nord reconnue seulement par Ankara." },
  { id:302, nation:"turkey", name:"Bases en Irak du Nord (12+)",     country:"Irak",                   city:"Dohuk / Zakho",         lat:37.143, lng:43.000,   region:"moyen-orient",   troops:5000,  founded:1990, annualCostM:180,  certainty:"confirmée", note:"Plus de bases militaires en Irak que tout autre pays étranger. Opérations permanentes contre le PKK malgré Bagdad." },
  { id:303, nation:"turkey", name:"Présence militaire en Libye",     country:"Libye",                  city:"Misrata / Tripoli",     lat:32.375, lng:15.091,   region:"afrique",        troops:3500,  founded:2019, annualCostM:200,  certainty:"confirmée", note:"Soutien au gouvernement de Tripoli face aux Russes qui soutiennent Haftar. Drones Bayraktar TB2." },
  { id:304, nation:"turkey", name:"Base militaire de Mogadiscio",    country:"Somalie",                city:"Mogadiscio",            lat:2.046,  lng:45.341,   region:"afrique",        troops:1000,  founded:2017, annualCostM:95,   certainty:"confirmée", note:"Formation de l'armée somalienne. Projection de la soft power turque via mosquées, hôpitaux, et bases militaires." },
  { id:305, nation:"turkey", name:"Camp Tariq (Qatar)",              country:"Qatar",                  city:"Doha",                  lat:25.261, lng:51.444,   region:"moyen-orient",   troops:3000,  founded:2016, annualCostM:120,  certainty:"confirmée", note:"Accord signé pendant le blocus (2017). Protection du Qatar contre l'Arabie Saoudite. Turquie = gendarme du Golfe." },
  { id:306, nation:"turkey", name:"Présence en Azerbaïdjan",         country:"Azerbaïdjan",            city:"Bakou / Gabala",        lat:40.409, lng:49.867,   region:"europe",         troops:1500,  founded:2021, annualCostM:85,   certainty:"confirmée", note:"Après la victoire au Karabagh (2020) où les drones turcs ont été décisifs. Instructeurs et base conjointe." },
  { id:307, nation:"turkey", name:"Opérations en Syrie du Nord",     country:"Syrie",                  city:"Afrin / Idlib",         lat:36.507, lng:36.853,   region:"moyen-orient",   troops:8000,  founded:2018, annualCostM:220,  certainty:"confirmée", note:"Opérations contre les Kurdes (YPG/SDF). Zones d'occupation dans le nord syrien en tension avec Washington." },
  { id:308, nation:"turkey", name:"Présence en Éthiopie",            country:"Éthiopie",               city:"Addis-Abeba",           lat:9.025,  lng:38.747,   region:"afrique",        troops:200,   founded:2022, annualCostM:25,   certainty:"probable",  note:"Accord de défense signé en 2022. Formation militaire. Extension du modèle somalien vers l'Afrique de l'Est." },
  // FRANCE
  { id:401, nation:"france", name:"Forces françaises de Djibouti",   country:"Djibouti",               city:"Djibouti-ville",        lat:11.601, lng:43.145,   region:"afrique",        troops:1450,  founded:1977, annualCostM:130,  certainty:"confirmée", note:"Plus ancienne base permanente française en Afrique. QG pour la Corne de l'Afrique et l'océan Indien occidental." },
  { id:402, nation:"france", name:"Forces françaises du Gabon",      country:"Gabon",                  city:"Libreville",            lat:0.393,  lng:9.454,    region:"afrique",        troops:350,   founded:1960, annualCostM:55,   certainty:"confirmée", note:"Présence post-coloniale. Réduite après le coup d'État de 2023. Futur incertain." },
  { id:403, nation:"france", name:"Forces françaises au Sénégal",    country:"Sénégal",                city:"Dakar",                 lat:14.693, lng:-17.445,  region:"afrique",        troops:350,   founded:1960, annualCostM:60,   certainty:"confirmée", note:"Présence réduite depuis 2010. Retrait total demandé par le président Faye (élu 2024)." },
  { id:404, nation:"france", name:"Forces françaises en Côte d'Ivoire", country:"Côte d'Ivoire",       city:"Abidjan",               lat:5.359,  lng:-4.008,   region:"afrique",        troops:600,   founded:1961, annualCostM:75,   certainty:"confirmée", note:"Base 43e BIMA. Présence contestée. Négociations en cours pour réduction significative." },
  { id:405, nation:"france", name:"Forces françaises au Tchad",      country:"Tchad",                  city:"N'Djamena",             lat:12.107, lng:15.044,   region:"afrique",        troops:1000,  founded:1986, annualCostM:110,  certainty:"confirmée", note:"N'Djamena a demandé le départ des forces françaises en 2024. Fin de l'opération Barkhane." },
  { id:406, nation:"france", name:"Base navale d'Abu Dhabi (EAU)",   country:"Émirats Arabes Unis",    city:"Abu Dhabi",             lat:24.380, lng:54.440,   region:"moyen-orient",   troops:750,   founded:2009, annualCostM:95,   certainty:"confirmée", note:"Première base militaire française dans le Golfe. Porte d'entrée vers l'Asie et l'océan Indien." },
  { id:407, nation:"france", name:"Polynésie française (Papeete)",   country:"Polynésie française",    city:"Papeete",               lat:-17.534,lng:-149.569, region:"pacifique",      troops:900,   founded:1962, annualCostM:120,  certainty:"confirmée", note:"Ancienne zone d'essais nucléaires (193 tirs, 1966-1996). Base de surveillance du Pacifique Sud." },
  { id:408, nation:"france", name:"Nouvelle-Calédonie (FANC)",       country:"Nouvelle-Calédonie",     city:"Nouméa",                lat:-22.275,lng:166.458,  region:"pacifique",      troops:1100,  founded:1853, annualCostM:130,  certainty:"confirmée", note:"Territoire en tension indépendantiste. Vaste ZEE. Position stratégique face à la montée de la Chine dans le Pacifique." },
  { id:409, nation:"france", name:"La Réunion / Mayotte",            country:"France (DOM)",           city:"Saint-Denis",           lat:-20.882,lng:55.450,   region:"afrique",        troops:1700,  founded:1638, annualCostM:180,  certainty:"confirmée", note:"Projection dans l'océan Indien. Gendarmerie, surveillance maritime. Présence française en océan Indien via DOM." },
  // CHINA
  { id:501, nation:"china", name:"Base de soutien de Djibouti",      country:"Djibouti",               city:"Djibouti-ville",        lat:11.540, lng:43.148,   region:"afrique",        troops:2000,  founded:2017, annualCostM:200,  certainty:"confirmée", note:"Première et unique base militaire officielle de la Chine à l'étranger. À 8 km du Camp Lemonnier américain." },
  { id:502, nation:"china", name:"Présence à Gwadar (CPEC/Pakistan)",country:"Pakistan",               city:"Gwadar",                lat:25.122, lng:62.325,   region:"indo-pacifique", troops:500,   founded:2016, annualCostM:80,   certainty:"probable",  note:"Port clé du Corridor économique Chine-Pakistan. Infrastructure duale (civile/militaire)." },
  { id:503, nation:"china", name:"Rénovation base navale Ream",      country:"Cambodge",               city:"Sihanoukville",         lat:10.535, lng:103.629,  region:"indo-pacifique", troops:400,   founded:2023, annualCostM:60,   certainty:"probable",  note:"Rénovation chinoise révélée en 2022. Le Cambodge nie l'usage exclusivement chinois. Le Pentagone surveille." },
  { id:504, nation:"china", name:"Négociations base navale Tanzanie", country:"Tanzanie",              city:"Dar es Salaam",         lat:-6.792, lng:39.208,   region:"afrique",        troops:200,   founded:2021, annualCostM:35,   certainty:"alléguée",  note:"Négociations pour une base navale sur l'île de Pemba. Non finalisée. Inquiétudes US et UK." },
  { id:505, nation:"china", name:"Accord sécurité Îles Salomon",     country:"Îles Salomon",           city:"Honiara",               lat:-9.428, lng:160.033,  region:"pacifique",      troops:100,   founded:2022, annualCostM:20,   certainty:"alléguée",  note:"Accord de 2022 permettant potentiellement des escales navales. Alerte maximale à Canberra et Washington." },
  { id:506, nation:"china", name:"Présence en Guinée équatoriale",   country:"Guinée équatoriale",     city:"Bata",                  lat:1.853,  lng:9.760,    region:"afrique",        troops:200,   founded:2022, annualCostM:30,   certainty:"alléguée",  note:"Première base potentielle sur la côte atlantique africaine. Permettrait de surveiller les navires US de l'Atlantique." },
  { id:507, nation:"china", name:"Présence au Tadjikistan (Pamirs)", country:"Tadjikistan",            city:"Murghab",               lat:38.167, lng:74.000,   region:"moyen-orient",   troops:300,   founded:2016, annualCostM:25,   certainty:"probable",  note:"Poste de surveillance secret dans les Pamirs révélé en 2019. Surveille l'Afghanistan et le corridor Wakhan." },
  { id:508, nation:"china", name:"Îles artificielles mer de Chine",  country:"Mer de Chine (disputée)",city:"Fiery Cross / Mischief", lat:9.550,  lng:114.050,  region:"indo-pacifique", troops:3000,  founded:2015, annualCostM:400,  certainty:"confirmée", note:"7 îles artificielles avec pistes, silos à missiles, radars. Illégales selon la sentence de La Haye (2016)." },
  { id:509, nation:"china", name:"Infrastructure militaire EAU",     country:"Émirats Arabes Unis",    city:"Abu Dhabi (port Khalifa)",lat:24.490,lng:54.360,   region:"moyen-orient",   troops:100,   founded:2021, annualCostM:20,   certainty:"alléguée",  note:"Travaux de construction suspectés d'être militaires révélés par le WSJ (2021). Construction arrêtée sous pression US." },
];

function project(lat: number, lng: number, width: number, height: number): [number, number] {
  const x = (lng + 180) / 360 * width;
  const latRad = lat * Math.PI / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (mercN / Math.PI) * (height * 0.78);
  return [x, y];
}

function getRadius(troops: number): number {
  if (troops > 20000) return 11;
  if (troops > 10000) return 8;
  if (troops > 5000)  return 6;
  if (troops > 2000)  return 4.5;
  if (troops > 500)   return 3.2;
  return 2.5;
}

const NATIONS: Nation[] = ["usa", "uk", "russia", "turkey", "france", "china"];

const CERTAINTY_STYLES: Record<Certainty, { opacity: number; dasharray: string }> = {
  "confirmée": { opacity: 0.85, dasharray: "none" },
  "probable":  { opacity: 0.60, dasharray: "2,1" },
  "alléguée":  { opacity: 0.35, dasharray: "3,2" },
};

export default function BasesClient() {
  const [activeNations, setActiveNations] = useState<Set<Nation>>(new Set(NATIONS));
  const [hoveredBase, setHoveredBase] = useState<MilBase | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedBase, setSelectedBase] = useState<MilBase | null>(null);
  const [worldPaths, setWorldPaths] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 480 });

  useEffect(() => {
    function update() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDims({ w, h: Math.round(w * 0.50) });
      }
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then(r => r.json())
      .then(data => {
        const paths: string[] = [];
        data.features.forEach((f: any) => {
          const geom = f.geometry;
          if (!geom) return;
          const toPath = (coords: number[][]) => {
            if (coords.length < 2) return "";
            let d = "";
            coords.forEach(([lng, lat], i) => {
              const [x, y] = project(lat, lng, 1000, 540);
              d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
            });
            return d + "Z";
          };
          if (geom.type === "Polygon") paths.push(toPath(geom.coordinates[0]));
          else if (geom.type === "MultiPolygon") geom.coordinates.forEach((p: number[][][]) => paths.push(toPath(p[0])));
        });
        setWorldPaths(paths);
      }).catch(() => {});
  }, []);

  const toggleNation = (n: Nation) => {
    setActiveNations(prev => {
      const next = new Set(prev);
      if (next.size === 1 && next.has(n)) return new Set(NATIONS);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const filteredBases = BASES.filter(b => activeNations.has(b.nation));
  const scaleX = dims.w / 1000;
  const scaleY = dims.h / 540;

  const countByNation = BASES.reduce((acc, b) => {
    acc[b.nation] = (acc[b.nation] || 0) + 1;
    return acc;
  }, {} as Record<Nation, number>);

  function handleMouseMove(e: React.MouseEvent, base: MilBase) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredBase(base);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.intro}>
        <p className={styles.chapeau}>
          En 2025, <strong>19 pays seulement</strong> maintiennent des bases militaires à l'étranger.
          Six d'entre eux concentrent la quasi-totalité de l'empreinte mondiale.
          La dissymétrie est totale : les États-Unis possèdent à eux seuls plus de bases
          que les cinq autres puissances réunies, multipliées par dix.
          Derrière ce rapport de forces figé, une recomposition est en cours —
          au Sahel, dans le Pacifique, sur les côtes de l'océan Indien.
        </p>
        <p className={styles.source}>
          Sources : David Vine, <em>Base Nation</em> · Pentagon Base Structure Report 2024 ·
          Congressional Research Service (juil. 2024) · IISS Military Balance 2024 · Quincy Institute ·
          World Beyond War. Les bases russes, turques et chinoises s'appuient sur des rapports ouverts,
          analyses académiques et sources journalistiques (Reuters, WSJ, Foreign Policy).
          La fiabilité est indiquée pour chaque site.
        </p>
      </div>

      <div className={styles.nationFilters}>
        {NATIONS.map(n => {
          const active = activeNations.has(n);
          return (
            <button
              key={n}
              className={`${styles.nationBtn} ${active ? styles.nationActive : styles.nationInactive}`}
              style={active ? { background: NATION_COLORS[n], borderColor: NATION_COLORS[n] } : {}}
              onClick={() => toggleNation(n)}
            >
              <span className={styles.nationFlag}>{NATION_FLAGS[n]}</span>
              <span className={styles.nationName}>{NATION_LABELS[n]}</span>
              <span className={styles.nationCount}>{countByNation[n]}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.mapContainer} ref={containerRef}>
        <svg width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`} className={styles.mapSvg}>
          <rect width={dims.w} height={dims.h} fill="#E8EEF5" />
          <g transform={`scale(${scaleX},${scaleY})`}>
            {worldPaths.map((d, i) => (
              <path key={i} d={d} fill="#F2EFE8" stroke="#C8C2B4" strokeWidth="0.6" />
            ))}
          </g>
          {[-60,-30,0,30,60].map(lat => {
            const [,y] = project(lat, 0, dims.w, dims.h);
            return <line key={lat} x1={0} x2={dims.w} y1={y} y2={y} stroke="#D0CCCA" strokeWidth="0.4" strokeDasharray="3,5" />;
          })}
          {[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lng => {
            const [x] = project(0, lng, dims.w, dims.h);
            return <line key={lng} x1={x} x2={x} y1={0} y2={dims.h} stroke="#D0CCCA" strokeWidth="0.4" strokeDasharray="3,5" />;
          })}
          {filteredBases.map(base => {
            const [x, y] = project(base.lat, base.lng, dims.w, dims.h);
            const r = getRadius(base.troops);
            const color = NATION_COLORS[base.nation];
            const isHov = hoveredBase?.id === base.id;
            const isSel = selectedBase?.id === base.id;
            const { opacity, dasharray } = CERTAINTY_STYLES[base.certainty];
            if (x < 0 || x > dims.w || y < 0 || y > dims.h) return null;
            return (
              <g key={base.id} transform={`translate(${x},${y})`} style={{ cursor: "pointer" }}
                onMouseMove={e => handleMouseMove(e, base)}
                onMouseLeave={() => setHoveredBase(null)}
                onClick={() => setSelectedBase(isSel ? null : base)}
              >
                {base.troops > 8000 && <circle r={r + 6} fill="none" stroke={color} strokeWidth="1" opacity="0.18" />}
                <circle
                  r={isHov || isSel ? r + 2 : r}
                  fill={color}
                  opacity={isHov || isSel ? 1 : opacity}
                  stroke={isSel ? "#fff" : dasharray !== "none" ? color : "rgba(255,255,255,0.4)"}
                  strokeWidth={isSel ? 1.8 : dasharray !== "none" ? 1 : 0.7}
                  strokeDasharray={dasharray !== "none" ? dasharray : undefined}
                  style={{ transition: "r 0.15s" }}
                />
              </g>
            );
          })}
        </svg>

        {hoveredBase && !selectedBase && (
          <div className={styles.tooltip} style={{ left: Math.min(tooltipPos.x + 14, dims.w - 290), top: Math.max(tooltipPos.y - 60, 8) }}>
            <div className={styles.ttNation} style={{ color: NATION_COLORS[hoveredBase.nation] }}>
              {NATION_FLAGS[hoveredBase.nation]} {NATION_LABELS[hoveredBase.nation]}
            </div>
            <div className={styles.ttName}>{hoveredBase.name}</div>
            <div className={styles.ttLoc}>{hoveredBase.city}, {hoveredBase.country}</div>
            <div className={styles.ttRow}>
              <span>{hoveredBase.troops.toLocaleString("fr-FR")} militaires</span>
              <span className={styles.ttCertainty} data-c={hoveredBase.certainty}>{hoveredBase.certainty}</span>
            </div>
          </div>
        )}

        <div className={styles.certLegend}>
          <div className={styles.certTitle}>Fiabilité</div>
          {(["confirmée","probable","alléguée"] as Certainty[]).map(c => (
            <div key={c} className={styles.certItem}>
              <svg width="18" height="18">
                <circle cx="9" cy="9" r="5" fill="#555"
                  opacity={CERTAINTY_STYLES[c].opacity}
                  stroke={CERTAINTY_STYLES[c].dasharray !== "none" ? "#555" : "none"}
                  strokeDasharray={CERTAINTY_STYLES[c].dasharray !== "none" ? CERTAINTY_STYLES[c].dasharray : undefined}
                  strokeWidth="1"
                />
              </svg>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedBase && (
        <div className={styles.baseCard} style={{ borderLeftColor: NATION_COLORS[selectedBase.nation] }}>
          <button className={styles.cardClose} onClick={() => setSelectedBase(null)}>×</button>
          <div className={styles.cardNation} style={{ color: NATION_COLORS[selectedBase.nation] }}>
            {NATION_FLAGS[selectedBase.nation]} {NATION_LABELS[selectedBase.nation]}
            {selectedBase.certainty !== "confirmée" && (
              <span className={styles.cardCertaintyBadge} data-c={selectedBase.certainty}> — {selectedBase.certainty}</span>
            )}
          </div>
          <h3 className={styles.cardName}>{selectedBase.name}</h3>
          <div className={styles.cardLoc}>{selectedBase.city}, <strong>{selectedBase.country}</strong></div>
          <div className={styles.cardGrid}>
            <div className={styles.cardStat}><span className={styles.cardStatNum}>{selectedBase.troops.toLocaleString("fr-FR")}</span><span className={styles.cardStatLabel}>militaires</span></div>
            <div className={styles.cardStat}><span className={styles.cardStatNum}>${selectedBase.annualCostM}M</span><span className={styles.cardStatLabel}>coût annuel</span></div>
            <div className={styles.cardStat}><span className={styles.cardStatNum}>{selectedBase.founded}</span><span className={styles.cardStatLabel}>fondée</span></div>
            <div className={styles.cardStat}><span className={styles.cardStatNum}>{selectedBase.region}</span><span className={styles.cardStatLabel}>région</span></div>
          </div>
          <p className={styles.cardNote}>{selectedBase.note}</p>
        </div>
      )}

      <div className="soara-article">
        <h2>La dissymétrie absolue</h2>
        <p><strong>750 contre 12.</strong> C'est le rapport brut entre les États-Unis et la deuxième puissance en termes de bases à l'étranger. Cette dissymétrie ne s'explique pas seulement par la puissance économique ou militaire des États-Unis — la Chine dispose désormais du deuxième budget de défense mondial, la Russie d'un arsenal nucléaire comparable. Elle s'explique par une décision stratégique assumée depuis 1945 : la projection permanente de force sur l'ensemble de la planète, en temps de paix comme en temps de guerre. Aucune nation dans l'histoire n'avait jamais tenté quelque chose d'équivalent à cette échelle.</p>
        <p>Cette hégémonie n'est pas sans fissures. Depuis 2020, les États-Unis ont perdu l'accès à trois bases africaines majeures (Niger, Mali, Burkina Faso) en l'espace de quatre ans. À chaque fois, le même scénario : coup d'État militaire, expulsion des Français d'abord, des Américains ensuite, arrivée des Russes. Ce mouvement de reconfiguration est peut-être le signal le plus puissant de la transformation des équilibres géopolitiques en cours.</p>
        <div className="pull-quote">
          <p>En 2024, pour la première fois depuis la guerre froide, les États-Unis ont perdu simultanément l'accès à trois pays africains au profit de la Russie. L'empire ne s'effondre pas — mais il rétrécit.</p>
        </div>
        <h2>La Russie : la puissance qui avance</h2>
        <p>Le réseau russe est infiniment plus modeste que celui des États-Unis — mais sa trajectoire est inverse. Là où Washington perd du terrain en Afrique, Moscou en gagne. L'Africa Corps (héritier de Wagner après la mort de Prigojine) est présent dans au moins six pays africains, toujours selon le même mode opératoire : soutien à un régime fragilisé, accès aux ressources minières, déploiement d'instructeurs. En Méditerranée, Tartous et Hmeimim ont transformé la Russie en puissance régionale — ce qu'elle n'avait plus été depuis l'URSS.</p>
        <h2>La Turquie : l'ambition néo-ottomane</h2>
        <p>En 2010, la Turquie n'avait de bases que dans le nord de Chypre. En 2025, elle est présente en Libye, en Somalie, au Qatar, en Azerbaïdjan, dans le nord de la Syrie, en Éthiopie. Ce déploiement suit une doctrine cohérente : la Turquie comme puissance régionale autonome, ni vassale de Washington ni alignée sur Moscou. Les drones Bayraktar TB2 — qui ont changé l'issue de plusieurs conflits (Libye, Karabagh, Ukraine) — sont l'instrument de cette ambition autant que ses bases.</p>
        <h2>La France : la retraite en ordre dispersé</h2>
        <p>Le réseau français en Afrique subsaharienne est le résidu direct de la Françafrique. Ce système s'effondre. En deux ans, la France a été contrainte de quitter le Mali, le Burkina Faso, le Niger et le Tchad. Fin 2024, le Sénégal et la Côte d'Ivoire négocient à leur tour le départ des forces françaises. Ce retrait n'est pas seulement militaire — il est le symptôme d'une crise profonde de légitimité de la présence française en Afrique.</p>
        <h2>La Chine : un empire qui commence</h2>
        <p>La Chine n'a officiellement qu'une seule base militaire à l'étranger : Djibouti, ouverte en 2017. Mais autour de ce point d'ancrage, tout un réseau de présences potentielles se dessine — des îles artificielles de la mer de Chine méridionale aux ports duaux du Pakistan et de la Tanzanie. La stratégie chinoise diffère du modèle américain : pas de bases ouvertement militaires, mais des investissements d'infrastructure qui peuvent être militarisés. C'est le squelette d'une puissance de projection qui n'ose pas encore dire son nom — mais qui grandit.</p>
      </div>
    </div>
  );
}
