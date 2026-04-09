"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./bases.module.css";

// ── TYPES ─────────────────────────────────────────────────────────────────────
type Region = "europe" | "indo-pacifique" | "moyen-orient" | "afrique" | "ameriques" | "autre";
type BaseType = "grande" | "moyenne" | "petite" | "lily-pad";
type DataMode = "officiel" | "vine";

interface MilBase {
  id: number;
  name: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  region: Region;
  type: BaseType;
  branch: string;
  troops: number;
  founded: number;
  annualCostM: number; // millions USD
  note: string;
  vine?: true; // uniquement dans le dataset élargi Vine/Quincy
}

// ── DONNÉES ───────────────────────────────────────────────────────────────────
const BASES: MilBase[] = [
  // ─ ALLEMAGNE
  { id:1,  name:"Ramstein Air Base",          country:"Allemagne",   city:"Ramstein-Miesenbach", lat:49.437, lng:7.600,   region:"europe",        type:"grande",   branch:"USAF",    troops:9400,  founded:1953, annualCostM:1200, note:"Centre névralgique du commandement aérien en Europe. Nœud des opérations de drones en Afrique et Moyen-Orient." },
  { id:2,  name:"Grafenwöhr Training Area",   country:"Allemagne",   city:"Grafenwöhr",          lat:49.707, lng:11.941,  region:"europe",        type:"grande",   branch:"Army",    troops:7200,  founded:1910, annualCostM:680,  note:"Plus grande base d'entraînement américaine en Europe. Utilisée intensivement depuis 2022 pour former les forces ukrainiennes." },
  { id:3,  name:"USAG Stuttgart",             country:"Allemagne",   city:"Stuttgart",           lat:48.736, lng:9.168,   region:"europe",        type:"grande",   branch:"Army",    troops:6800,  founded:1945, annualCostM:890,  note:"Quartier général de l'AFRICOM et de l'EUCOM. Centre décisionnel pour l'Afrique et l'Europe." },
  { id:4,  name:"Spangdahlem Air Base",        country:"Allemagne",   city:"Spangdahlem",         lat:49.973, lng:6.692,   region:"europe",        type:"moyenne",  branch:"USAF",    troops:4200,  founded:1952, annualCostM:420,  note:"Base aérienne tactique. Soutien à l'OTAN, opérations de surveillance en Europe de l'Est." },
  { id:5,  name:"Landstuhl Regional Med Ctr", country:"Allemagne",   city:"Landstuhl",           lat:49.378, lng:7.574,   region:"europe",        type:"moyenne",  branch:"Army",    troops:2300,  founded:1953, annualCostM:280,  note:"Principal hôpital militaire américain hors États-Unis. Triage de tous les blessés de guerre depuis 2001." },
  { id:6,  name:"USAG Hohenfels",             country:"Allemagne",   city:"Hohenfels",           lat:49.192, lng:11.840,  region:"europe",        type:"moyenne",  branch:"Army",    troops:3100,  founded:1951, annualCostM:210,  note:"Centre de formation au combat interarmes. Entraînement des forces européennes post-Ukraine." },
  { id:7,  name:"Baumholder Garrison",        country:"Allemagne",   city:"Baumholder",          lat:49.643, lng:7.336,   region:"europe",        type:"petite",   branch:"Army",    troops:1800,  founded:1951, annualCostM:140,  note:"Base d'infanterie. Partie du complexe militaire du Palatinat rhénan." },
  // ─ ROYAUME-UNI
  { id:8,  name:"RAF Lakenheath",             country:"Royaume-Uni", city:"Brandon",             lat:52.409, lng:0.560,   region:"europe",        type:"grande",   branch:"USAF",    troops:4700,  founded:1941, annualCostM:560,  note:"Seule base américaine d'armes nucléaires tactiques en Europe (bombes B61). Opérations F-35A." },
  { id:9,  name:"RAF Mildenhall",             country:"Royaume-Uni", city:"Mildenhall",          lat:52.362, lng:0.487,   region:"europe",        type:"moyenne",  branch:"USAF",    troops:3200,  founded:1934, annualCostM:310,  note:"Ravitaillement aérien et renseignement. Plaque tournante des opérations de surveillance transatlantique." },
  { id:10, name:"RAF Croughton",              country:"Royaume-Uni", city:"Brackley",            lat:52.074, lng:-1.189,  region:"europe",        type:"petite",   branch:"USAF",    troops:1200,  founded:1941, annualCostM:95,   note:"Station de communications et de renseignement classifiée. Soupçonnée d'héberger la NSA." },
  { id:11, name:"RAF Menwith Hill",           country:"Royaume-Uni", city:"Harrogate",           lat:54.004, lng:-1.691,  region:"europe",        type:"petite",   branch:"NSA/USAF",troops:2100, founded:1954, annualCostM:320,  note:"La plus grande station d'écoute américaine au monde hors territoire US. Interception de communications globales (ECHELON)." },
  // ─ ITALIE
  { id:12, name:"Aviano Air Base",            country:"Italie",      city:"Aviano",              lat:46.032, lng:12.596,  region:"europe",        type:"grande",   branch:"USAF",    troops:4800,  founded:1954, annualCostM:510,  note:"Base de projection vers la Méditerranée et le Moyen-Orient. Avions F-16 et drones de surveillance." },
  { id:13, name:"Caserma Ederle (Vicenza)",   country:"Italie",      city:"Vicenza",             lat:45.534, lng:11.535,  region:"europe",        type:"grande",   branch:"Army",    troops:3800,  founded:1955, annualCostM:380,  note:"QG de la 173e brigade aéroportée. Force d'action rapide pour toute l'Europe et l'Afrique." },
  { id:14, name:"NAS Sigonella",              country:"Italie",      city:"Catane (Sicile)",     lat:37.402, lng:14.922,  region:"europe",        type:"grande",   branch:"Navy",    troops:4100,  founded:1959, annualCostM:440,  note:"Carrefour méditerranéen. Drones Global Hawk, sous-marins, opérations contre-terrorisme en Afrique du Nord." },
  { id:15, name:"NSA Naples",                 country:"Italie",      city:"Naples",              lat:40.827, lng:14.188,  region:"europe",        type:"moyenne",  branch:"Navy",    troops:1900,  founded:1951, annualCostM:190,  note:"Soutien naval méditerranéen. QG de la 6e Flotte américaine jusqu'en 2004." },
  // ─ ESPAGNE
  { id:16, name:"Naval Station Rota",         country:"Espagne",     city:"Rota",                lat:36.645, lng:-6.349,  region:"europe",        type:"grande",   branch:"Navy",    troops:3700,  founded:1953, annualCostM:450,  note:"Principale base navale US en Méditerranée occidentale. Destroyers antimissiles balistiques (BMD). Accès atlantique stratégique." },
  { id:17, name:"Morón Air Base",             country:"Espagne",     city:"Morón de la Frontera", lat:37.175, lng:-5.617, region:"europe",        type:"moyenne",  branch:"USAF",    troops:2400,  founded:1953, annualCostM:220,  note:"Réserve rapide pour l'Afrique du Nord. Deployments de Marine Corps et opérations spéciales." },
  // ─ PORTUGAL / AÇORES
  { id:18, name:"Lajes Field",                country:"Portugal",    city:"Açores (Terceira)",   lat:38.762, lng:-27.091, region:"europe",        type:"moyenne",  branch:"USAF",    troops:780,   founded:1943, annualCostM:95,   note:"Verrou stratégique de l'Atlantique Nord. Lutte anti-sous-marine, ravitaillement transoceanique." },
  // ─ GRÈCE
  { id:19, name:"NSA Souda Bay",              country:"Grèce",       city:"Crète",               lat:35.521, lng:24.151,  region:"europe",        type:"moyenne",  branch:"Navy",    troops:1100,  founded:1969, annualCostM:130,  note:"Porte d'entrée vers la Méditerranée orientale. Ravitaillement naval et sous-marins nucléaires." },
  // ─ TURQUIE
  { id:20, name:"Incirlik Air Base",          country:"Turquie",     city:"Adana",               lat:37.002, lng:35.426,  region:"moyen-orient",  type:"grande",   branch:"USAF",    troops:2500,  founded:1954, annualCostM:290,  note:"Dernier stockage d'armes nucléaires B61 en zone de tension. Relations américano-turques de plus en plus tendues depuis 2016." },
  // ─ ROUMANIE
  { id:21, name:"MK Air Base",                country:"Roumanie",    city:"Mihail Kogalniceanu", lat:44.362, lng:28.489,  region:"europe",        type:"grande",   branch:"Army",    troops:4200,  founded:2002, annualCostM:380,  note:"Principale tête de pont de l'OTAN sur le flanc est depuis l'invasion russe de 2022. Armement lourd pré-positionné." },
  { id:22, name:"Deveselu (Aegis Ashore)",    country:"Roumanie",    city:"Deveselu",            lat:44.100, lng:24.283,  region:"europe",        type:"petite",   branch:"Navy",    troops:600,   founded:2016, annualCostM:80,   note:"Bouclier antimissile balistique en Europe. Irritant majeur pour Moscou, invoqué dans les négociations pré-guerre." },
  // ─ POLOGNE
  { id:23, name:"Camp Kościuszko",            country:"Pologne",     city:"Poznań",              lat:52.390, lng:16.847,  region:"europe",        type:"moyenne",  branch:"Army",    troops:5500,  founded:2017, annualCostM:460,  note:"Présence permanente effective depuis 2022. Brigade blindée américaine en rotation. La Pologne finance une partie de l'installation." },
  { id:24, name:"Redzikowo Aegis Ashore",     country:"Pologne",     city:"Słupsk",              lat:54.467, lng:17.067,  region:"europe",        type:"petite",   branch:"Navy",    troops:900,   founded:2024, annualCostM:120,  note:"Deuxième site européen du bouclier antimissile. Opérationnel en 2024. Flanc nord de l'OTAN face à Kaliningrad." },
  // ─ KOSOVO
  { id:25, name:"Camp Bondsteel",             country:"Kosovo",      city:"Ferizaj/Uroševac",    lat:42.360, lng:21.358,  region:"europe",        type:"grande",   branch:"Army",    troops:3600,  founded:1999, annualCostM:270,  note:"La plus grande base américaine construite depuis le Viêtnam. Sentinelle des Balkans. Construit sur des terres confisquées à des paysans." },
  // ─ BULGARIE
  { id:26, name:"Novo Selo Training Area",    country:"Bulgarie",    city:"Sliven",              lat:42.567, lng:26.300,  region:"europe",        type:"petite",   branch:"Army",    troops:550,   founded:2006, annualCostM:55,   note:"Déploiements rotationnels. Accroissement significatif depuis 2022." },
  // ─ JAPON
  { id:27, name:"Kadena Air Base",            country:"Japon",       city:"Okinawa",             lat:26.356, lng:127.768, region:"indo-pacifique", type:"grande",   branch:"USAF",    troops:18000, founded:1945, annualCostM:1800, note:"La plus grande base aérienne américaine en Asie. Surveillance de la Chine, Taiwan, de la mer de Chine. 113 sites américains au Japon au total." },
  { id:28, name:"MCAS Futenma",               country:"Japon",       city:"Okinawa (Ginowan)",   lat:26.274, lng:127.756, region:"indo-pacifique", type:"grande",   branch:"Marines", troops:5800,  founded:1945, annualCostM:620,  note:"Au cœur d'une ville dense. Objet de 30 ans de protestations civiques à Okinawa. Déplacement en cours vers Camp Schwab." },
  { id:29, name:"Yokota Air Base",            country:"Japon",       city:"Tokyo (banlieue)",    lat:35.749, lng:139.349, region:"indo-pacifique", type:"grande",   branch:"USAF",    troops:11000, founded:1945, annualCostM:1100, note:"QG des Forces Aériennes du Pacifique. Contrôle l'espace aérien de la région Tokyo — symbole de la souveraineté limitée du Japon." },
  { id:30, name:"Yokosuka Naval Base",        country:"Japon",       city:"Yokosuka",            lat:35.288, lng:139.674, region:"indo-pacifique", type:"grande",   branch:"Navy",    troops:24000, founded:1945, annualCostM:2200, note:"QG de la 7e Flotte américaine. Le seul port-base d'un porte-avions américain hors des États-Unis." },
  { id:31, name:"Camp Zama",                  country:"Japon",       city:"Sagamihara",          lat:35.483, lng:139.383, region:"indo-pacifique", type:"grande",   branch:"Army",    troops:4200,  founded:1945, annualCostM:480,  note:"QG de l'armée américaine au Japon. Forces d'opérations spéciales et commandement terrestre Pacifique." },
  { id:32, name:"NAS Atsugi",                 country:"Japon",       city:"Ayase",               lat:35.455, lng:139.450, region:"indo-pacifique", type:"moyenne",  branch:"Navy",    troops:3600,  founded:1943, annualCostM:310,  note:"Base aéronavale dans la métropole de Tokyo. Nuisances sonores chroniques, sujet de contentieux diplomatique régulier." },
  { id:33, name:"MCAS Iwakuni",               country:"Japon",       city:"Iwakuni",             lat:34.144, lng:132.236, region:"indo-pacifique", type:"grande",   branch:"Marines", troops:7200,  founded:1938, annualCostM:680,  note:"Renforcement majeur depuis 2017 avec F-35B. Projection vers la mer de Chine méridionale." },
  { id:34, name:"Misawa Air Base",            country:"Japon",       city:"Misawa",              lat:40.703, lng:141.368, region:"indo-pacifique", type:"grande",   branch:"USAF",    troops:5400,  founded:1938, annualCostM:520,  note:"Surveillance de la Russie (Vladivostok, Sakhaline) et de la Corée du Nord. Renseignement signals (SIGINT)." },
  // ─ CORÉE DU SUD
  { id:35, name:"Camp Humphreys",             country:"Corée du Sud", city:"Pyeongtaek",         lat:36.971, lng:127.029, region:"indo-pacifique", type:"grande",   branch:"Army",    troops:36000, founded:1919, annualCostM:3100, note:"La plus grande base américaine à l'étranger en superficie (14,7 km²). Déménagement de Seoul achevé en 2019. La Corée du Sud finance 50% du coût." },
  { id:36, name:"Osan Air Base",              country:"Corée du Sud", city:"Osan",               lat:37.090, lng:127.029, region:"indo-pacifique", type:"grande",   branch:"USAF",    troops:10000, founded:1951, annualCostM:980,  note:"Première ligne face à la DMZ. Avions A-10, U-2, drones Global Hawk. Détection des lancements nord-coréens." },
  { id:37, name:"Kunsan Air Base",            country:"Corée du Sud", city:"Gunsan",             lat:35.904, lng:126.616, region:"indo-pacifique", type:"grande",   branch:"USAF",    troops:3800,  founded:1950, annualCostM:380,  note:"Base d'attaque au sol. F-16 en alerte permanente contre menace nord-coréenne." },
  // ─ PHILIPPINES
  { id:38, name:"Basa Air Base",              country:"Philippines", city:"Pampanga",            lat:14.987, lng:120.500, region:"indo-pacifique", type:"grande",   branch:"USAF",    troops:3200,  founded:2014, annualCostM:290,  note:"Accès rétabli après 1992 (Pinatubo). Tension avec la Chine en mer de Chine méridionale. 9 bases sous accord EDCA 2014." },
  { id:39, name:"Antonio Bautista AB",        country:"Philippines", city:"Palawan",             lat:9.754,  lng:118.718, region:"indo-pacifique", type:"petite",   branch:"USAF",    troops:800,   founded:2014, annualCostM:85,   note:"Face aux îles disputées de la mer de Chine méridionale. Présence américaine croissante face aux récifs artificiels chinois." },
  { id:40, name:"Mactan-Benito Ebuen AB",     country:"Philippines", city:"Cebu",               lat:10.306, lng:123.979, region:"indo-pacifique", type:"petite",   branch:"USAF",    troops:600,   founded:2014, annualCostM:60,   note:"Hub logistique central pour les Philippines. Réponse humanitaire et opérations maritimes." },
  // ─ GUAM (territoire américain)
  { id:41, name:"Andersen Air Force Base",    country:"Guam (US)",  city:"Dededo",              lat:13.584, lng:144.926, region:"indo-pacifique", type:"grande",   branch:"USAF",    troops:7800,  founded:1944, annualCostM:820,  note:"Bombardiers B-52 en alerte permanente. Symbole de la puissance américaine dans le Pacifique occidental. $8 milliards d'investissements 2020-2030." },
  { id:42, name:"Naval Base Guam",            country:"Guam (US)",  city:"Apra Harbor",         lat:13.442, lng:144.654, region:"indo-pacifique", type:"grande",   branch:"Navy",    troops:6200,  founded:1898, annualCostM:690,  note:"Base sous-marine nucléaire stratégique. Déploiement de sous-marins d'attaque pour surveiller la Chine." },
  // ─ AUSTRALIE
  { id:43, name:"Pine Gap",                   country:"Australie",  city:"Alice Springs",       lat:-23.798, lng:133.738, region:"indo-pacifique", type:"grande",  branch:"CIA/NSA", troops:1000,  founded:1970, annualCostM:480,  note:"L'une des installations de renseignement les plus secrètes au monde. Guidage de drones de combat. Surveillance des missiles. Révélations Snowden 2013." },
  { id:44, name:"JDFPG Darwin",               country:"Australie",  city:"Darwin",              lat:-12.462, lng:130.846, region:"indo-pacifique", type:"moyenne",  branch:"Marines", troops:2500, founded:2012, annualCostM:210,  note:"Rotation de Marines. Projet annoncé par Obama. Verrou stratégique du détroit de Lombok et des routes maritimes indo-pacifiques." },
  // ─ SINGAPOUR
  { id:45, name:"NSA Singapore (Sembawang)",  country:"Singapour",  city:"Sembawang",           lat:1.438,  lng:103.819, region:"indo-pacifique", type:"petite",   branch:"Navy",    troops:1200,  founded:1990, annualCostM:140,  note:"Port d'attache pour les navires de la 7e Flotte. Signifie que les États-Unis contrôlent indirectement le passage du détroit de Malacca." },
  // ─ DIEGO GARCIA
  { id:46, name:"Naval Support Facility Diego Garcia", country:"Diego Garcia (BIOT)", city:"Diego Garcia", lat:-7.319, lng:72.423, region:"indo-pacifique", type:"grande", branch:"Navy/USAF", troops:3800, founded:1971, annualCostM:620, note:"L'île dont les habitants ont été chassés de force pour construire la base. B-52 qui ont bombardé l'Afghanistan et l'Irak décollaient d'ici. L'ICJ a condamné la présence britannique en 2019." },
  // ─ QATAR
  { id:47, name:"Al Udeid Air Base",          country:"Qatar",      city:"Al Udeid",            lat:25.118, lng:51.315,  region:"moyen-orient",  type:"grande",   branch:"USAF",    troops:10000, founded:1996, annualCostM:1400, note:"QG du CENTCOM pour la région. La plus grande base américaine au Moyen-Orient. Gère les opérations aériennes de l'Afghanistan à la Libye." },
  // ─ KOWEÏT
  { id:48, name:"Camp Arifjan",               country:"Koweït",     city:"Shuaiba",             lat:29.196, lng:47.938,  region:"moyen-orient",  type:"grande",   branch:"Army",    troops:13000, founded:1991, annualCostM:980,  note:"Principale base logistique pour l'Irak et l'Afghanistan. Pré-positionnement de blindés lourds. Verrou du Golfe persique." },
  { id:49, name:"Ali Al Salem Air Base",      country:"Koweït",     city:"Al Jahra",            lat:29.458, lng:47.520,  region:"moyen-orient",  type:"moyenne",  branch:"USAF",    troops:4500,  founded:1991, annualCostM:420,  note:"Base aérienne nord. Point de départ des opérations contre l'Irak en 2003." },
  // ─ BAHREÏN
  { id:50, name:"NSA Bahrain (5e Flotte)",    country:"Bahreïn",    city:"Manama",              lat:26.233, lng:50.583,  region:"moyen-orient",  type:"grande",   branch:"Navy",    troops:8200,  founded:1948, annualCostM:860,  note:"QG de la 5e Flotte américaine. Surveillance du Golfe, du détroit d'Ormuz, mer Rouge. Bahreïn = monarchie qui réprime ses opposants avec l'aval américain." },
  // ─ ÉMIRATS ARABES UNIS
  { id:51, name:"Al Dhafra Air Base",         country:"Émirats Arabes Unis", city:"Abu Dhabi", lat:24.242, lng:54.548,  region:"moyen-orient",  type:"grande",   branch:"USAF",    troops:5000,  founded:1991, annualCostM:580,  note:"Drones RQ-4 Global Hawk et F-35. Surveillance de l'Iran. L'accord Abraham normalise la relation militaire US-Émirats." },
  // ─ ARABIE SAOUDITE
  { id:52, name:"Prince Sultan Air Base",     country:"Arabie Saoudite", city:"Al-Kharj",      lat:24.062, lng:47.581,  region:"moyen-orient",  type:"grande",   branch:"USAF",    troops:2800,  founded:1990, annualCostM:340,  note:"Réactivée en 2019 après les attaques sur les installations saoudiennes. Containment de l'Iran. La présence de soldats américains en terre sainte est invoquée par Al-Qaïda pour légitimer son djihad." },
  // ─ IRAK
  { id:53, name:"Al Asad Air Base",           country:"Irak",       city:"Al Anbar",            lat:33.786, lng:42.441,  region:"moyen-orient",  type:"grande",   branch:"USAF",    troops:3000,  founded:1987, annualCostM:280,  note:"Base visée par 16 missiles iraniens en janvier 2020 après l'assassinat de Soleimani. Entraînement des forces irakiennes contre Daech." },
  { id:54, name:"Victory Base Complex (Baghdad)", country:"Irak",   city:"Bagdad",              lat:33.292, lng:44.234,  region:"moyen-orient",  type:"grande",   branch:"Army",    troops:4200,  founded:2003, annualCostM:310,  note:"Complexe de bases autour de l'aéroport de Bagdad. Construit sur d'anciens palais de Saddam Hussein. Présence réduite mais persistante." },
  { id:55, name:"Erbil Air Base",             country:"Irak",       city:"Erbil (Kurdistan)",   lat:36.237, lng:43.963,  region:"moyen-orient",  type:"moyenne",  branch:"Army",    troops:2200,  founded:2003, annualCostM:190,  note:"Présence en zone kurde autonome. Tensions avec Bagdad sur la légitimité de la présence américaine post-2021." },
  // ─ JORDANIE
  { id:56, name:"Muwaffaq Salti Air Base (H5)", country:"Jordanie", city:"Azraq",               lat:31.727, lng:37.045,  region:"moyen-orient",  type:"moyenne",  branch:"USAF",    troops:3200,  founded:1990, annualCostM:240,  note:"Opérations contre Daech en Syrie et Irak. Déploiements de drones et F-15. La Jordanie reçoit $1,5 milliard d'aide américaine annuelle." },
  // ─ DJIBOUTI
  { id:57, name:"Camp Lemonnier",             country:"Djibouti",   city:"Djibouti-ville",      lat:11.546, lng:43.160,  region:"afrique",       type:"grande",   branch:"Navy",    troops:4000,  founded:2002, annualCostM:520,  note:"Seule base américaine permanente en Afrique (officiellement). Opérations de drones en Somalie, Yémen. Coexiste avec une base chinoise à 8 km." },
  // ─ KENYA
  { id:58, name:"Camp Simba (Manda Bay)",     country:"Kenya",      city:"Manda Bay, Lamu",     lat:-2.301, lng:40.914,  region:"afrique",       type:"petite",   branch:"Army",    troops:150,   founded:2003, annualCostM:45,   note:"Base drone et forces spéciales. Attaquée par Al-Shabaab en janvier 2020 (3 Américains tués). Cible persistante." },
  // ─ SOMALIE
  { id:59, name:"Baledogle Air Base",         country:"Somalie",    city:"Baledogle",           lat:2.995,  lng:45.062,  region:"afrique",       type:"petite",   branch:"SOCOM",   troops:450,   founded:2019, annualCostM:60,   note:"Base drone contre Al-Shabaab. Présence discrète, jamais officiellement reconnue avant 2020." },
  // ─ ÉTHIOPIE (installation secrète)
  { id:60, name:"Arba Minch Airport (ops spec.)", country:"Éthiopie", city:"Arba Minch",       lat:6.060,  lng:37.590,  region:"afrique",       type:"lily-pad",  branch:"SOCOM",   troops:120,   founded:2011, annualCostM:25,   note:"Opérations de drones révélées en 2011. L'un des nombreux sites africains jamais confirmés officiellement.", vine:true },
  // ─ NIGER (base fermée 2024)
  { id:61, name:"Air Base 201 (Agadez)",      country:"Niger",      city:"Agadez",              lat:16.966, lng:7.922,   region:"afrique",       type:"petite",   branch:"USAF",    troops:1100,  founded:2018, annualCostM:110,  note:"$110M investis, évacuée en 2024 après le coup d'État. La junte a expulsé les Américains et accueilli des troupes russes (Wagner/Africa Corps)." },
  // ─ HONDURAS
  { id:62, name:"Soto Cano Air Base",         country:"Honduras",   city:"Comayagua",           lat:14.382, lng:-87.621, region:"ameriques",     type:"grande",   branch:"USAF",    troops:600,   founded:1954, annualCostM:75,   note:"Vestige de la stratégie Reagan en Amérique centrale. Opérations anti-drogue, aide humanitaire. Les régimes pro-américains y trouvent une garantie." },
  // ─ CUBA
  { id:63, name:"Guantanamo Bay Naval Station", country:"Cuba",     city:"Guantanamo",          lat:19.906, lng:-75.099, region:"ameriques",     type:"grande",   branch:"Navy",    troops:6000,  founded:1898, annualCostM:540,  note:"Symbole mondial de la violation des droits humains post-11 septembre. Cuba refuse le chèque de loyer de $4 085/an depuis 1960. Zone de non-droit revendiquée." },
  // ─ BAHAMAS / ATLANTIQUE NORD
  { id:64, name:"Naval Air Station Bermuda",  country:"Royaume-Uni (Bermudes)", city:"Bermudes", lat:32.370, lng:-64.693, region:"ameriques",    type:"petite",   branch:"Navy",    troops:180,   founded:1941, annualCostM:30,   note:"Station de surveillance sous-marine. Détection des sous-marins russes dans l'Atlantique Nord.", vine:true },
  // ─ ÎLES MARSHALL
  { id:65, name:"Ronald Reagan Ballistic Missile Defense Site", country:"Îles Marshall", city:"Kwajalein Atoll", lat:8.720, lng:167.730, region:"indo-pacifique", type:"grande", branch:"Army", troops:1100, founded:1944, annualCostM:380, note:"Site de test des missiles balistiques intercontinentaux. Radar de surveillance de l'espace. Les Marshallais ne peuvent pas accéder à leur propre atoll." },
  // ─ ESTONIE
  { id:66, name:"Tapa Army Base (rotation OTAN)", country:"Estonie", city:"Tapa",               lat:59.257, lng:25.971,  region:"europe",        type:"petite",   branch:"Army",    troops:1800,  founded:2017, annualCostM:150,  note:"Présence renforcée depuis 2022. Flanc oriental de l'OTAN, 200 km de la frontière russe." },
  // ─ LITUANIE
  { id:67, name:"Rukla (rotation US)",         country:"Lituanie",   city:"Rukla",               lat:55.086, lng:24.035,  region:"europe",        type:"petite",   branch:"Army",    troops:1500,  founded:2017, annualCostM:130,  note:"Sécurisation du Couloir de Suwalki, corridor terrestre OTAN entre Pologne et Lituanie. Point vulnérable entre Biélorussie et Kaliningrad." },
  // ─ COLOMBIE
  { id:68, name:"Palanquero Air Base (accord)",country:"Colombie",   city:"Puerto Salgar",       lat:5.484,  lng:-74.657, region:"ameriques",     type:"petite",   branch:"USAF",    troops:400,   founded:2009, annualCostM:50,   note:"Accord de coopération militaire signé en 2009, jamais entré en vigueur après protestation des voisins. Maintenu discret.", vine:true },
  // ─ ÎLES CANARIES (Espagne)
  { id:69, name:"NSS Gran Canaria (joint use)",country:"Espagne",    city:"Las Palmas",          lat:27.931, lng:-15.387, region:"europe",        type:"lily-pad",  branch:"Navy",    troops:90,    founded:1995, annualCostM:18,   note:"Escale navale. Surveillance des migrations en Atlantique oriental.", vine:true },
  // ─ POLOGNE SUPPLÉMENTAIRE
  { id:70, name:"Powidz Air Base",             country:"Pologne",    city:"Powidz",              lat:52.379, lng:17.853,  region:"europe",        type:"grande",   branch:"USAF",    troops:4800,  founded:2022, annualCostM:420,  note:"Positionnement pré-avancé de véhicules blindés. Stockage d'équipements de l'US Army pour un corps d'armée complet." },
  // ─ CHYPRE (base UK, usage US)
  { id:71, name:"Akrotiri/Episkopi (usage US)", country:"Chypre",   city:"Limassol",            lat:34.591, lng:32.972,  region:"moyen-orient",  type:"petite",   branch:"USAF",    troops:350,   founded:1956, annualCostM:40,   note:"Base britannique à usage américain. Surveillance Méditerranée orientale, Syrie, Liban.", vine:true },
  // ─ ISRAËL
  { id:72, name:"Site 512 (Dimona Radar)",     country:"Israël",     city:"Néguev",              lat:31.076, lng:35.083,  region:"moyen-orient",  type:"petite",   branch:"Army",    troops:120,   founded:2009, annualCostM:55,   note:"Radar de défense antimissile (FBX-T). Seule présence militaire américaine officielle en Israël. Financement US de la défense israélienne : $3,8Md/an." },
  // ─ JAPON – sites supplémentaires
  { id:73, name:"Camp Foster (Okinawa)",        country:"Japon",     city:"Okinawa",             lat:26.298, lng:127.776, region:"indo-pacifique", type:"grande",   branch:"Marines", troops:8200, founded:1945, annualCostM:780,  note:"QG du III Marine Expeditionary Force. Okinawa (0,6% du territoire japonais) supporte 70% des bases américaines au Japon." },
  { id:74, name:"Camp Schwab (remplacement Futenma)", country:"Japon", city:"Okinawa (Nord)",  lat:26.628, lng:128.050, region:"indo-pacifique", type:"grande",   branch:"Marines", troops:1200, founded:1957, annualCostM:320,  note:"Site du futur remplacement de Futenma. Construction controversée sur récif corallien. Objet d'une bataille juridique et civique depuis 20 ans." },
  { id:75, name:"Torii Station (Okinawa)",      country:"Japon",     city:"Okinawa",             lat:26.360, lng:127.712, region:"indo-pacifique", type:"petite",   branch:"Army",    troops:1500, founded:1945, annualCostM:130,  note:"Forces spéciales (1er groupe des Forces spéciales). Opérations dans tout le Pacifique occidental." },
  // ─ TAIWAN (présence discrète)
  { id:76, name:"Présence SOCOM (non confirmée)", country:"Taïwan",  city:"Taipei",              lat:25.033, lng:121.565, region:"indo-pacifique", type:"lily-pad", branch:"SOCOM",  troops:200,   founded:2021, annualCostM:30,   note:"Présence confirmée par des sources WSJ et NYT en 2021. Washington maintient l'ambiguïté stratégique. Chaque dévoilement provoque une réaction de Pékin.", vine:true },
  // ─ ARABIE SAOUDITE supplémentaire
  { id:77, name:"Eskan Village AB (Riyad)",    country:"Arabie Saoudite", city:"Riyad",          lat:24.487, lng:46.606,  region:"moyen-orient",  type:"petite",   branch:"USAF",    troops:800,   founded:1991, annualCostM:90,   note:"Support logistique et personnel américain civil-militaire. La présence américaine au cœur du Hedjaz reste un sujet religieusement explosif." },
  // ─ IRAQ – base Ain al-Asad
  { id:78, name:"Ain al-Asad Airbase",         country:"Irak",       city:"Al Anbar",            lat:33.786, lng:42.441,  region:"moyen-orient",  type:"grande",   branch:"USAF",    troops:2200,  founded:1987, annualCostM:195,  note:"Ciblée en janvier 2020 par des missiles iraniens en représailles à l'assassinat de Soleimani." },
  // ─ OMAN
  { id:79, name:"Masirah Island Air Base",     country:"Oman",       city:"Masirah",             lat:20.676, lng:58.895,  region:"moyen-orient",  type:"petite",   branch:"USAF",    troops:500,   founded:1980, annualCostM:60,   note:"Point de ravitaillement et surveillance de l'océan Indien. Utilisé lors de l'opération Eagle Claw (1980) et de la première guerre du Golfe.", vine:true },
  // ─ MEXIQUE (coopération)
  { id:80, name:"Activités SOCOM/DEA (Mexique)", country:"Mexique",  city:"Monterrey",           lat:25.686, lng:-100.316, region:"ameriques",    type:"lily-pad",  branch:"SOCOM",   troops:300,  founded:2008, annualCostM:45,   note:"Présence non confirmée officiellement. Coopération anti-narcotrafic (opération Mérida). Tensions souverainistes croissantes.", vine:true },
  // ─ THAÏLANDE
  { id:81, name:"Utapao Royal Thai Navy AB",   country:"Thaïlande",  city:"Sattahip",            lat:12.680, lng:101.006, region:"indo-pacifique", type:"petite",   branch:"Navy",    troops:350,   founded:1966, annualCostM:55,   note:"Utilisée lors des guerres du Viêtnam, Irak, Afghanistan pour le transit. Déploiements humanitaires et exercices Cobra Gold annuels.", vine:true },
  // ─ ALLEMAGNE – SOUTHCOM (à Stuttgart)
  // déjà couvert par USAG Stuttgart id:3
];

// ── CONSTANTES ─────────────────────────────────────────────────────────────────
const REGION_COLORS: Record<Region, string> = {
  "europe":         "#1E3A8A",
  "indo-pacifique": "#B91C1C",
  "moyen-orient":   "#B45309",
  "afrique":        "#065F46",
  "ameriques":      "#7C3AED",
  "autre":          "#6B7280",
};

const REGION_LABELS: Record<Region, string> = {
  "europe":         "Europe",
  "indo-pacifique": "Indo-Pacifique",
  "moyen-orient":   "Moyen-Orient",
  "afrique":        "Afrique",
  "ameriques":      "Amériques",
  "autre":          "Autre",
};

const BRANCH_ICONS: Record<string, string> = {
  "USAF": "✈",
  "Navy": "⚓",
  "Army": "★",
  "Marines": "🎯",
  "SOCOM": "◆",
  "CIA/NSA": "◉",
  "NSA/USAF": "◉",
};

// ── PROJECTION MERCATOR SIMPLIFIÉE ────────────────────────────────────────────
function project(lat: number, lng: number, width: number, height: number): [number, number] {
  const x = (lng + 180) / 360 * width;
  const latRad = lat * Math.PI / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (mercN / Math.PI) * (height * 0.78);
  return [x, y];
}

// ── COMPOSANT PRINCIPAL ───────────────────────────────────────────────────────
export default function BasesClient() {
  const [dataMode, setDataMode] = useState<DataMode>("vine");
  const [activeRegion, setActiveRegion] = useState<Region | "all">("all");
  const [hoveredBase, setHoveredBase] = useState<MilBase | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedBase, setSelectedBase] = useState<MilBase | null>(null);
  const [worldPaths, setWorldPaths] = useState<string[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 500 });

  // Responsive dims
  useEffect(() => {
    function update() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDims({ w, h: Math.round(w * 0.52) });
      }
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Charger les contours du monde (SVG paths simplifié via Natural Earth)
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then(r => r.json())
      .then(data => {
        // Convertir en paths SVG via projection Mercator
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
          if (geom.type === "Polygon") {
            paths.push(toPath(geom.coordinates[0]));
          } else if (geom.type === "MultiPolygon") {
            geom.coordinates.forEach((poly: number[][][]) => paths.push(toPath(poly[0])));
          }
        });
        setWorldPaths(paths);
        setMapReady(true);
      })
      .catch(() => setMapReady(true));
  }, []);

  const filteredBases = BASES.filter(b => {
    if (dataMode === "officiel" && b.vine) return false;
    if (activeRegion !== "all" && b.region !== activeRegion) return false;
    return true;
  });

  const stats = {
    total: dataMode === "vine" ? "750+" : "128",
    pays: dataMode === "vine" ? "80+" : "55",
    troupes: filteredBases.reduce((s, b) => s + b.troops, 0),
    cout: 70,
  };

  const scaleX = dims.w / 1000;
  const scaleY = dims.h / 540;

  function getRadius(troops: number): number {
    if (troops > 20000) return 11;
    if (troops > 10000) return 8;
    if (troops > 5000) return 6;
    if (troops > 2000) return 4.5;
    if (troops > 500) return 3;
    return 2.5;
  }

  function handleMouseMove(e: React.MouseEvent, base: MilBase) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredBase(base);
  }

  const regions: (Region | "all")[] = ["all", "europe", "indo-pacifique", "moyen-orient", "afrique", "ameriques"];

  return (
    <div className={styles.wrapper}>

      {/* ── INTRO ──────────────────────────────────────────────── */}
      <div className={styles.intro}>
        <p className={styles.chapeau}>
          En 2025, les États-Unis maintiennent entre{" "}
          <strong>750 et 800 bases militaires</strong> dans plus de 80 pays —
          soit davantage que les 10 principales puissances militaires mondiales réunies.
          Chaque point sur cette carte représente un morceau de souveraineté cédée,
          un dollar soustrait au débat démocratique, une présence que les populations locales
          n'ont jamais votée.
        </p>
        <p className={styles.source}>
          Sources : David Vine, <em>Base Nation</em> (2015, mis à jour 2021) · Quincy Institute for Responsible Statecraft ·
          Pentagon Base Structure Report 2024 · Congressional Research Service (juillet 2024)
        </p>
      </div>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{stats.total}</span>
          <span className={styles.statLabel}>bases à l'étranger</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{stats.pays}</span>
          <span className={styles.statLabel}>pays occupés</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{(stats.troupes / 1000).toFixed(0)}k+</span>
          <span className={styles.statLabel}>militaires (sur carte)</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>${stats.cout}Md</span>
          <span className={styles.statLabel}>coût annuel</span>
        </div>
      </div>

      {/* ── CONTRÔLES ─────────────────────────────────────────── */}
      <div className={styles.controls}>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${dataMode === "vine" ? styles.toggleActive : ""}`}
            onClick={() => setDataMode("vine")}
          >
            750+ bases <span className={styles.toggleSub}>Vine / Quincy</span>
          </button>
          <button
            className={`${styles.toggleBtn} ${dataMode === "officiel" ? styles.toggleActive : ""}`}
            onClick={() => setDataMode("officiel")}
          >
            128 bases <span className={styles.toggleSub}>Pentagone officiel</span>
          </button>
        </div>
        <div className={styles.regionFilters}>
          {regions.map(r => (
            <button
              key={r}
              className={`${styles.regionBtn} ${activeRegion === r ? styles.regionActive : ""}`}
              style={activeRegion === r && r !== "all" ? { background: REGION_COLORS[r as Region], borderColor: REGION_COLORS[r as Region], color: "#fff" } : {}}
              onClick={() => setActiveRegion(r)}
            >
              {r === "all" ? "Toutes régions" : REGION_LABELS[r as Region]}
            </button>
          ))}
        </div>
      </div>

      {/* ── CARTE ─────────────────────────────────────────────── */}
      <div className={styles.mapContainer} ref={containerRef}>
        <svg
          ref={svgRef}
          width={dims.w}
          height={dims.h}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          className={styles.mapSvg}
        >
          {/* fond océan */}
          <rect width={dims.w} height={dims.h} fill="#EEF2F7" />

          {/* contours pays */}
          <g transform={`scale(${scaleX},${scaleY})`}>
            {worldPaths.map((d, i) => (
              <path key={i} d={d} fill="#F4F1EA" stroke="#C8C2B6" strokeWidth="0.5" />
            ))}
          </g>

          {/* grille de méridiens/parallèles discrète */}
          {[-60,-30,0,30,60].map(lat => {
            const [,y] = project(lat, 0, dims.w, dims.h);
            return <line key={lat} x1={0} x2={dims.w} y1={y} y2={y} stroke="#D0CCc4" strokeWidth="0.4" strokeDasharray="3,4" />;
          })}
          {[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lng => {
            const [x] = project(0, lng, dims.w, dims.h);
            return <line key={lng} x1={x} x2={x} y1={0} y2={dims.h} stroke="#D0CCC4" strokeWidth="0.4" strokeDasharray="3,4" />;
          })}

          {/* points de bases */}
          {filteredBases.map(base => {
            const [x, y] = project(base.lat, base.lng, dims.w, dims.h);
            const r = getRadius(base.troops);
            const color = REGION_COLORS[base.region];
            const isHovered = hoveredBase?.id === base.id;
            const isSelected = selectedBase?.id === base.id;
            if (x < 0 || x > dims.w || y < 0 || y > dims.h) return null;
            return (
              <g
                key={base.id}
                transform={`translate(${x},${y})`}
                style={{ cursor: "pointer" }}
                onMouseMove={e => handleMouseMove(e, base)}
                onMouseLeave={() => setHoveredBase(null)}
                onClick={() => setSelectedBase(selectedBase?.id === base.id ? null : base)}
              >
                {/* halo pulsant pour grandes bases */}
                {base.troops > 8000 && (
                  <circle r={r + 5} fill="none" stroke={color} strokeWidth="1" opacity="0.25" />
                )}
                <circle
                  r={isHovered || isSelected ? r + 2 : r}
                  fill={color}
                  opacity={isHovered || isSelected ? 1 : 0.78}
                  stroke={isSelected ? "#1A1A1A" : "rgba(255,255,255,0.5)"}
                  strokeWidth={isSelected ? 1.5 : 0.7}
                  style={{ transition: "r 0.15s, opacity 0.15s" }}
                />
                {base.troops > 15000 && (
                  <text
                    textAnchor="middle"
                    dy="-9"
                    fontSize="8"
                    fill={color}
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {base.name.length > 22 ? base.name.slice(0, 22) + "…" : base.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* tooltip survol */}
        {hoveredBase && !selectedBase && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(tooltipPos.x + 14, dims.w - 280),
              top: Math.max(tooltipPos.y - 60, 10),
            }}
          >
            <div className={styles.ttBranch} style={{ color: REGION_COLORS[hoveredBase.region] }}>
              {BRANCH_ICONS[hoveredBase.branch] || "◦"} {hoveredBase.branch}
            </div>
            <div className={styles.ttName}>{hoveredBase.name}</div>
            <div className={styles.ttLoc}>{hoveredBase.city}, {hoveredBase.country}</div>
            <div className={styles.ttRow}>
              <span>{hoveredBase.troops.toLocaleString("fr-FR")} militaires</span>
              <span>${hoveredBase.annualCostM}M/an</span>
            </div>
          </div>
        )}

        {/* légende taille */}
        <div className={styles.sizeLegend}>
          <div className={styles.sizeLegendTitle}>Effectifs</div>
          {[["&gt;20 000", 11],["5-20 000", 6.5],["500-5 000", 4],["&lt;500", 2.5]].map(([label, r]) => (
            <div key={label as string} className={styles.sizeLegendItem}>
              <svg width="24" height="24">
                <circle cx="12" cy="12" r={r as number} fill="#555" opacity="0.6" />
              </svg>
              <span dangerouslySetInnerHTML={{ __html: label as string }} />
            </div>
          ))}
        </div>

        {/* légende régions */}
        <div className={styles.regionLegend}>
          {(Object.entries(REGION_LABELS) as [Region, string][]).map(([k, v]) => (
            <div key={k} className={styles.regionLegendItem}>
              <span className={styles.regionDot} style={{ background: REGION_COLORS[k] }} />
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FICHE BASE SÉLECTIONNÉE ───────────────────────────── */}
      {selectedBase && (
        <div className={styles.baseCard}>
          <button className={styles.cardClose} onClick={() => setSelectedBase(null)}>×</button>
          <div className={styles.cardRegion} style={{ color: REGION_COLORS[selectedBase.region] }}>
            {BRANCH_ICONS[selectedBase.branch] || "◦"} {selectedBase.branch} · {REGION_LABELS[selectedBase.region]}
          </div>
          <h3 className={styles.cardName}>{selectedBase.name}</h3>
          <div className={styles.cardLoc}>{selectedBase.city}, <strong>{selectedBase.country}</strong></div>
          <div className={styles.cardGrid}>
            <div className={styles.cardStat}>
              <span className={styles.cardStatNum}>{selectedBase.troops.toLocaleString("fr-FR")}</span>
              <span className={styles.cardStatLabel}>militaires</span>
            </div>
            <div className={styles.cardStat}>
              <span className={styles.cardStatNum}>${selectedBase.annualCostM}M</span>
              <span className={styles.cardStatLabel}>coût annuel</span>
            </div>
            <div className={styles.cardStat}>
              <span className={styles.cardStatNum}>{selectedBase.founded}</span>
              <span className={styles.cardStatLabel}>fondée</span>
            </div>
            <div className={styles.cardStat}>
              <span className={styles.cardStatNum}>{selectedBase.type}</span>
              <span className={styles.cardStatLabel}>catégorie</span>
            </div>
          </div>
          <p className={styles.cardNote}>{selectedBase.note}</p>
          {selectedBase.vine && (
            <div className={styles.cardVine}>◈ Incluse uniquement dans le décompte Vine/Quincy — non reconnue officiellement par le Pentagone</div>
          )}
        </div>
      )}

      {/* ── ANALYSE ÉDITORIALE ───────────────────────────────── */}
      <div className="soara-article">
        <h2>L'empire qui ne dit pas son nom</h2>
        <p><strong>Cent vingt-huit.</strong> C'est le chiffre officiel du Pentagone : 128 bases américaines à l'étranger, dans 55 pays, selon le rapport de structure de base 2024. Un chiffre impeccable dans sa précision, et profondément trompeur dans ce qu'il dissimule. Car derrière cette comptabilité propre se cachent des centaines d'autres installations — bases secrètes, sites de drones non reconnus, accords d'accès à durée indéterminée, "lily pads" logistiques que le Pentagone préfère ne pas comptabiliser. Le chercheur David Vine, après une décennie d'enquête et de travail avec les archives du Department of Defense, en dénombre plus de 750. La réalité de l'empreinte militaire américaine se situe quelque part entre ces deux chiffres — et l'écart lui-même est une donnée politique.</p>

        <p>Ce déni taxonomique n'est pas anodin. En définissant étroitement ce qu'est une "base", Washington peut affirmer à ses alliés et à ses adversaires que sa présence est modeste, rationnelle, défensive. La même logique qui conduit à appeler "conseillers" les soldats qui forment des armées étrangères, "accords d'accès" les traités qui garantissent une présence permanente, "appui logistique" les frappes de drones lancées depuis des territoires nominalement souverains.</p>

        <div className="pull-quote">
          <p>Les États-Unis maintiennent plus de bases militaires à l'étranger que les dix premières puissances militaires mondiales réunies. Aucune nation dans l'histoire n'a jamais projeté sa force militaire à cette échelle géographique.</p>
        </div>

        <h2>La géographie de la dépendance</h2>
        <p>Trois pays concentrent à eux seuls la majorité de l'empreinte américaine en Asie : le Japon (113 sites, dont 70% sur la seule île d'Okinawa — 0,6% du territoire national), la Corée du Sud (83 sites, dont Camp Humphreys, la plus grande base américaine à l'étranger en superficie) et les Philippines (9 bases, réactivées après 22 ans d'interruption). Ces trois nations partagent un point commun : elles accueillent des soldats américains depuis la fin de la Seconde Guerre mondiale ou de la guerre de Corée. Les guerres ont pris fin. Les bases, elles, sont restées.</p>

        <p>En Allemagne, 174 sites américains subsistent, 80 ans après la capitulation du Reich. À Stuttgart se trouve l'AFRICOM — le commandement militaire américain pour l'Afrique entière. Autrement dit, la stratégie militaire américaine en Afrique est pilotée depuis l'Europe. Cette géographie dit quelque chose d'essentiel sur la façon dont Washington perçoit le continent africain : comme un théâtre d'opérations, pas comme un partenaire.</p>

        <h2>Le prix de la souveraineté</h2>
        <p>La présence militaire américaine à l'étranger coûte entre 70 et 170 milliards de dollars par an selon la méthode de comptabilisation retenue. Le Pentagone publie un chiffre officiel de 22 milliards — en excluant soigneusement les coûts de personnel, de santé, de soutien familial et d'opérations de guerre. L'Institut Quincy, qui a reconstitué la comptabilité complète, arrive à 156 milliards en 2021. Aucun Congrès, aucun contribuable américain n'a jamais eu à approuver explicitement cette dépense : elle est noyée dans le budget de défense, répartie sur des dizaines de lignes budgétaires, invisibilisée par une comptabilité pensée pour ne pas être lue.</p>

        <p>Pour les pays hôtes, le calcul est différent mais tout aussi ambigu. Le Japon verse 2 milliards de dollars par an en "burden sharing" pour financer les bases américaines sur son sol. La Corée du Sud finance 50% du coût de Camp Humphreys. En échange, ces nations obtiennent une garantie de sécurité — réelle, mais assortie d'une contrainte non négligeable : leur politique étrangère ne peut jamais s'éloigner trop radicalement de celle de Washington sans risquer de perdre le parapluie. Ce n'est pas de la sujétion. C'est de la dépendance organisée, consentie, financée.</p>

        <h2>Les bases que le Pentagone ne compte pas</h2>
        <p>À Djibouti, Camp Lemonnier est la seule base permanente américaine officiellement reconnue en Afrique. Dans un rayon de 8 kilomètres, la Chine a installé sa première base militaire étrangère. Cette coexistence, dans un pays grand comme la Bretagne, résume mieux que n'importe quel rapport de géopolitique la compétition pour l'influence mondiale au XXIe siècle.</p>

        <p>En 2024, après le coup d'État au Niger, la junte a expulsé les troupes américaines de la base d'Agadez (Base 101) — dans laquelle les États-Unis avaient investi 110 millions de dollars. Quelques semaines plus tard, des instructeurs russes prenaient leur place. En 2018, quand la construction de cette base avait été révélée, le sénateur Lindsey Graham avait reconnu lors d'une audience du Sénat ne jamais avoir entendu parler du Niger. Des centaines de millions investis, des soldats déployés, dans un pays dont les élus américains ignoraient l'existence.</p>

        <div className="pull-quote">
          <p>La base d'Agadez a coûté 110 millions de dollars aux contribuables américains. Un sénateur américain l'a appris en lisant les journaux. Quatre ans plus tard, des soldats russes occupaient les lieux.</p>
        </div>

        <h2>Une question posée aux démocraties</h2>
        <p>La question que pose l'empreinte militaire mondiale américaine n'est pas celle de l'utilité stratégique — à Washington, personne ne conteste sérieusement que certaines de ces bases servent des intérêts réels. La question est celle de la légitimité démocratique. Ces centaines de milliards, ces dizaines de pays, ces décisions qui engagent la politique étrangère de nations entières — qui les a votés ? Qui les contrôle ? Qui peut les remettre en cause ?</p>

        <p>Dans les pays hôtes, la réponse est souvent : personne, ou presque. Les traités de stationnement sont négociés entre exécutifs, rarement soumis à ratification parlementaire dans les formes qui permettraient un vrai débat. À Okinawa, les habitants votent depuis trente ans pour la réduction de la présence américaine. Les bases sont toujours là. À Bahreïn, où la 5e Flotte américaine est ancrée depuis 1948, le régime réprime ses opposants — et Washington regarde ailleurs. La géographie militaire américaine a ses propres logiques, imperméables à la démocratie locale.</p>

        <p>Ce n'est pas un constat anti-américain. C'est une question que toute démocratie digne de ce nom devrait poser à ses propres structures de puissance. Y compris, et peut-être surtout, la première d'entre elles.</p>
      </div>
    </div>
  );
}
