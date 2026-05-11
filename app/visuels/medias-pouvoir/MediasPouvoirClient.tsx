// @ts-nocheck
'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell
} from 'recharts'
import Header from '../../../components/Header'


const C = {
  bg:"#08090b",surface:"#0f1116",surfaceHover:"#13151c",border:"#1e2028",
  gold:"#c9a84c",goldLight:"#e8c97a",muted:"#4a4f5e",text:"#d8dae2",dim:"#7a7f92",
  uk:"#6b9bd2",arg:"#e8956d",fr:"#7ec8a4",avoid:"#b07cc6",
};

const interestData=[
  {year:"2015",uk:70,arg:null,fr:58},{year:"2016",uk:66,arg:null,fr:56},
  {year:"2017",uk:62,arg:77,fr:54},{year:"2018",uk:58,arg:70,fr:52},
  {year:"2019",uk:54,arg:65,fr:50},{year:"2020",uk:51,arg:60,fr:51},
  {year:"2021",uk:48,arg:56,fr:48},{year:"2022",uk:44,arg:52,fr:46},
  {year:"2023",uk:41,arg:48,fr:43},{year:"2024",uk:38,arg:45,fr:40},
];
const avoidanceData=[
  {year:"2017",v:29},{year:"2018",v:31},{year:"2019",v:32},{year:"2020",v:34},
  {year:"2021",v:36},{year:"2022",v:38},{year:"2023",v:38},{year:"2024",v:40},
];
const trustData=[
  {c:"Finlande",t:67},{c:"Danemark",t:56},{c:"Portugal",t:54},{c:"Pays-Bas",t:50},
  {c:"Allemagne",t:47},{c:"États-Unis",t:32},{c:"France",t:30},{c:"Espagne",t:28},
  {c:"Hongrie",t:22},{c:"Grèce",t:22},
];

const ecosystem={
  "États-Unis":{
    influencers:[
      {name:"Joe Rogan",platforms:["Spotify","YouTube"],reach:"22% des Américains / semaine",note:"#1 podcast mondial"},
      {name:"Tucker Carlson",platforms:["YouTube","X"],reach:"14% des Américains / semaine",note:"Ex-Fox News, ligne nationaliste"},
      {name:"Lex Fridman",platforms:["YouTube","Spotify"],reach:"~5M abonnés",note:"Tech, IA, géopolitique"},
      {name:"Philip DeFranco",platforms:["YouTube"],reach:"6,6M abonnés",note:"Actu quotidienne, centriste"},
      {name:"Dylan Page",platforms:["TikTok","YouTube"],reach:"Millions — mondial",note:"Résumés d'actu ultra-courts, Gen Z"},
    ],
    media:[
      {name:"The Intercept",platforms:["Web","Podcast"],reach:"~5M visiteurs/mois",note:"Journalisme d'investigation"},
      {name:"Bellingcat",platforms:["Web","YouTube"],reach:"Référence mondiale OSINT",note:"Investigation open-source"},
      {name:"Jacobin",platforms:["Web","Podcast"],reach:"~3M visiteurs/mois",note:"Gauche intellectuelle"},
      {name:"The Daily (NYT)",platforms:["Podcast"],reach:"~2M écoutes/jour",note:"Hybride institution / nouveau format"},
      {name:"Meidas Touch",platforms:["YouTube","Podcast"],reach:"~2M abonnés",note:"Progressiste, collectif créateurs"},
    ],
  },
  "France":{
    influencers:[
      {name:"HugoDécrypte",platforms:["YouTube","Instagram","TikTok"],reach:"2,8M abonnés YouTube",note:"Référence Gen Z, actu/politique"},
      {name:"Thinkerview",platforms:["YouTube"],reach:"1,2M abonnés",note:"Entretiens longs format, indépendant"},
      {name:"Grand Angle",platforms:["YouTube"],reach:"~500K abonnés",note:"Vulgarisation économique hebdo"},
      {name:"Gaspard G",platforms:["YouTube","TikTok"],reach:"~400K abonnés",note:"Politique et société, ton direct"},
      {name:"Osons Comprendre",platforms:["YouTube"],reach:"~350K abonnés",note:"Économie critique, pédagogique"},
    ],
    media:[
      {name:"Blast",platforms:["YouTube","Web"],reach:"~600K abonnés YouTube",note:"Fondé par Denis Robert, investigation"},
      {name:"Sismique",platforms:["Podcast","YouTube"],reach:"~200K abonnés",note:"Économie, société, transitions"},
      {name:"Acropolis",platforms:["YouTube"],reach:"~300K abonnés",note:"Vulgarisation politique / institutions"},
      {name:"Le Média",platforms:["YouTube","Web"],reach:"~400K abonnés",note:"Financement participatif, indépendant"},
      {name:"Mediapart",platforms:["Web","Podcast"],reach:"~200K abonnés payants",note:"Investigation, modèle abonnement"},
    ],
  },
  "Royaume-Uni":{
    influencers:[
      {name:"Dylan Page",platforms:["TikTok","YouTube"],reach:"Millions — mondial",note:"Gen Z, pas journaliste formé"},
      {name:"Blackbelt Barrister",platforms:["YouTube"],reach:"~500K abonnés",note:"Avocat en exercice, droit et libertés"},
      {name:"Martin Lewis",platforms:["YouTube","X","TV"],reach:"7M+ followers totaux",note:"Finance perso, hybride trad./réseaux"},
      {name:"Gary Lineker",platforms:["X","Podcast"],reach:"9M followers X",note:"Ex-BBC, prise de position politique"},
      {name:"James O'Brien",platforms:["YouTube","Podcast"],reach:"1M+ abonnés",note:"Centre-gauche, hybride radio/indép."},
    ],
    media:[
      {name:"Novara Media",platforms:["YouTube","Web"],reach:"~500K abonnés YouTube",note:"Gauche indépendante, investigation"},
      {name:"Tortoise Media",platforms:["Podcast","Web"],reach:"~100K abonnés payants",note:"Slow journalism, membership"},
      {name:"The Rest Is Politics",platforms:["Podcast","YouTube"],reach:"Top 5 UK podcast",note:"Campbell & Stewart, bipartisan"},
      {name:"Declassified UK",platforms:["Web","YouTube"],reach:"~150K abonnés",note:"Investigation politique et défense"},
      {name:"Double Down News",platforms:["YouTube"],reach:"~400K abonnés",note:"Gauche, formats vidéo courts"},
    ],
  },
  "Allemagne":{
    influencers:[
      {name:"Alice Weidel (AfD)",platforms:["YouTube","X","TikTok"],reach:"~1,5M followers totaux",note:"Contourne les médias traditionnels"},
      {name:"Vermietertagebuch",platforms:["YouTube"],reach:"~800K abonnés",note:"Immobilier puis commentaire politique"},
      {name:"Aktien im Kopf",platforms:["YouTube","Podcast"],reach:"~600K abonnés",note:"Bourse et économie libérale"},
      {name:"Jan Böhmermann",platforms:["YouTube","TV"],reach:"1,8M abonnés YouTube",note:"Satire politique, hybride TV/indép."},
      {name:"MrWissen2go",platforms:["YouTube","Instagram"],reach:"~1,5M abonnés",note:"Actu et politique, jeune audience"},
    ],
    media:[
      {name:"Krautreporter",platforms:["Web","Podcast"],reach:"~35K membres",note:"Journalisme de solutions, membership"},
      {name:"Correctiv",platforms:["Web","YouTube"],reach:"Référence fact-checking DE",note:"Investigation sans publicité"},
      {name:"Republik",platforms:["Web"],reach:"~30K abonnés payants",note:"Modèle coopératif, rigueur éditoriale"},
      {name:"NachDenkSeiten",platforms:["Web","Podcast"],reach:"~1M visiteurs/mois",note:"Gauche critique, très controversé"},
      {name:"Tagesschau (ARD)",platforms:["YouTube","App"],reach:"2M+ abonnés YouTube",note:"Service public dominant sur réseaux"},
    ],
  },
};

const ownerColors=["#c9a84c","#6b9bd2","#7ec8a4","#e8956d","#b07cc6","#e8c97a","#9bb8d4","#d4a08a","#a8c4a2","#c4a0c8"];

const ownership={
  "France":[
    {owner:"Vincent Bolloré",fortune:"8 Mds €",sector:"Industrie / Médias",note:"Contrôle total de Lagardère fin 2023 via Vivendi. Empire constitué par acquisitions successives depuis 2012.",
      media:[{name:"CNews",type:"TV",year:2015},{name:"C8",type:"TV",year:2015},{name:"Canal+",type:"TV",year:2012},{name:"Europe 1",type:"Radio",year:2021},{name:"JDD",type:"Presse",year:2023},{name:"Prisma Media",type:"Presse",year:2021},{name:"Louis Hachette Group",type:"Édition",year:2023}]},
    {owner:"Bernard Arnault",fortune:"150 Mds €",sector:"Luxe (LVMH)",note:"1ère fortune mondiale. Expansion médias accélérée depuis 2024. Acquisition de Paris Match en octobre 2024.",
      media:[{name:"Les Échos",type:"Presse",year:2007},{name:"Le Parisien",type:"Presse",year:2015},{name:"Paris Match",type:"Presse",year:2024},{name:"Radio Classique",type:"Radio",year:2017},{name:"L'Opinion",type:"Presse",year:2025},{name:"Challenges",type:"Presse",note:"minoritaire"}]},
    {owner:"Rodolphe Saadé",fortune:"35 Mds €",sector:"Transport maritime (CMA CGM)",note:"Entrée massive dans les médias depuis 2022. Rachète Altice Media été 2024 (1,55 Md€), puis Brut en septembre 2025.",
      media:[{name:"BFMTV",type:"TV",year:2024},{name:"RMC",type:"Radio",year:2024},{name:"La Provence",type:"Presse",year:2022},{name:"La Tribune",type:"Presse",year:2022},{name:"Brut",type:"Digital",year:2025},{name:"M6",type:"TV",note:"10% du capital"}]},
    {owner:"Famille Dassault",fortune:"~20 Mds €",sector:"Aéronautique / Défense",note:"Serge Dassault a acquis Le Figaro en 2004. La famille perpétue cet héritage médiatique.",
      media:[{name:"Le Figaro",type:"Presse",year:2004},{name:"Le Figaro Magazine",type:"Presse"},{name:"Madame Figaro",type:"Presse"}]},
    {owner:"Famille Bouygues",fortune:"~5 Mds €",sector:"BTP / Télécoms",note:"Groupe TF1 historiquement lié à la famille Bouygues depuis la privatisation de 1987.",
      media:[{name:"TF1",type:"TV"},{name:"LCI",type:"TV"},{name:"TMC",type:"TV"},{name:"TFX",type:"TV"}]},
    {owner:"Daniel Kretinsky",fortune:"~7 Mds €",sector:"Énergie / Médias (tchèque)",note:"Milliardaire tchèque, actionnaire de presse française et britannique. Actionnaire de TF1 (~5%).",
      media:[{name:"Elle",type:"Presse",year:2018},{name:"Marianne",type:"Presse"},{name:"Franc Tireur",type:"Presse"},{name:"TF1",type:"TV",note:"~5%"},{name:"Loopsider",type:"Digital",note:"45%"}]},
    {owner:"Pierre-Édouard Stérin",fortune:"1,4 Md €",sector:"Smartbox / Investissements",note:"Stratégie d'influence numérique ciblant les 15-35 ans (plan Périclès, 150M€ / 10 ans). Sources : INPI, Cash Investigation France 2 (24 juin 2025), AFP.",
      media:[{name:"Valeurs Actuelles",type:"Presse",year:2025},{name:"Cerfia",type:"Réseaux",year:2024,note:"1,2M abonnés X"},{name:"Neo.tv",type:"Digital"},{name:"Explore Media",type:"Digital",note:"12M followers"},{name:"Marmeladz",type:"Digital",note:"agence influenceurs"}]},
    {owner:"Famille Mohn (Bertelsmann)",fortune:"—",sector:"Médias (allemand)",note:"Groupe allemand Bertelsmann, principal actionnaire du groupe M6 via RTL Group.",
      media:[{name:"M6",type:"TV"},{name:"W9",type:"TV"},{name:"RTL",type:"Radio"}]},
  ],
  "États-Unis":[
    {owner:"Famille Murdoch",fortune:"~20 Mds €",sector:"Médias (News Corp / Fox Corp)",note:"Empire médiatique mondial. Lachlan Murdoch dirige opérationnellement depuis 2023. Présence aux États-Unis, UK, Australie.",
      media:[{name:"Fox News",type:"TV"},{name:"Fox Business",type:"TV"},{name:"Wall Street Journal",type:"Presse"},{name:"New York Post",type:"Presse"},{name:"The Times (UK)",type:"Presse"},{name:"The Sun (UK)",type:"Presse"},{name:"HarperCollins",type:"Édition"}]},
    {owner:"Elon Musk",fortune:"~300 Mds €",sector:"Tech / SpaceX / Tesla",note:"Rachat de Twitter en 2022, rebaptisé X. Plateforme devenue vecteur d'influence politique directe, notamment lors de la campagne Trump 2024.",
      media:[{name:"X (Twitter)",type:"Réseaux",year:2022}]},
    {owner:"Jeff Bezos",fortune:"~230 Mds €",sector:"Amazon",note:"Propriétaire du Washington Post depuis 2013. Virage éditorial controversé en 2025 : le Post doit soutenir les libertés individuelles et les marchés libres.",
      media:[{name:"Washington Post",type:"Presse",year:2013}]},
    {owner:"Famille Ellison (Skydance)",fortune:"~150 Mds €",sector:"Oracle / Tech",note:"Acquisition de Paramount / CBS en août 2025. Restructuration idéologique immédiate : Bari Weiss nommée rédactrice en chef de CBS News, annulation du Late Show de Colbert.",
      media:[{name:"CBS News",type:"TV",year:2025},{name:"Paramount+",type:"Streaming",year:2025},{name:"MTV",type:"TV",year:2025}]},
    {owner:"Comcast / Roberts",fortune:"—",sector:"Télécoms",note:"Conglomérat contrôlé par la famille Roberts via des actions à droits de vote supérieurs. A scissionné MSNBC en entité Versant fin 2025.",
      media:[{name:"NBC",type:"TV"},{name:"CNBC",type:"TV"},{name:"Peacock",type:"Streaming"},{name:"Universal",type:"Cinéma"}]},
    {owner:"Famille Ochs-Sulzberger",fortune:"—",sector:"Médias (NYT)",note:"Propriétaires du NYT depuis 1896. Plus de 5,5 milliards de visites annuelles (2025). Premier site d'info aux États-Unis.",
      media:[{name:"New York Times",type:"Presse"},{name:"The Athletic",type:"Digital"},{name:"Wirecutter",type:"Digital"}]},
    {owner:"Walt Disney Company",fortune:"—",sector:"Divertissement",note:"Conglomérat coté. Contrôle une large part de l'info et du divertissement américains.",
      media:[{name:"ABC News",type:"TV"},{name:"ESPN",type:"TV"},{name:"Hulu",type:"Streaming"},{name:"Disney+",type:"Streaming"},{name:"National Geographic",type:"TV / Presse"}]},
  ],
  "Royaume-Uni":[
    {owner:"Famille Murdoch (News UK)",fortune:"~20 Mds €",sector:"Médias",note:"Présence dominante dans la presse populaire et de qualité. The Times et The Sun couvrent l'ensemble du spectre politique.",
      media:[{name:"The Times",type:"Presse"},{name:"The Sunday Times",type:"Presse"},{name:"The Sun",type:"Presse"},{name:"TalkTV",type:"TV"}]},
    {owner:"Lord Rothermere (DMGT)",fortune:"~2 Mds €",sector:"Médias",note:"Famille Harmsworth, propriétaires du Daily Mail depuis un siècle. MailOnline est le site d'info en anglais le plus lu au monde.",
      media:[{name:"Daily Mail",type:"Presse"},{name:"Metro",type:"Presse"},{name:"i newspaper",type:"Presse"},{name:"MailOnline",type:"Digital"}]},
    {owner:"Daniel Kretinsky",fortune:"~7 Mds €",sector:"Énergie / Médias (tchèque)",note:"Entrée dans les médias britanniques. The Independent est passé full-digital.",
      media:[{name:"Evening Standard",type:"Presse"},{name:"The Independent",type:"Digital"}]},
    {owner:"Scott Trust (indépendant)",fortune:"—",sector:"Fondation",note:"Structure unique : The Guardian est protégé par une fiducie qui garantit son indépendance éditoriale à perpétuité. Aucun actionnaire privé.",
      media:[{name:"The Guardian",type:"Presse"},{name:"The Observer",type:"Presse"}]},
    {owner:"BBC (service public)",fortune:"—",sector:"Service public",note:"Financée par la redevance. Indépendance structurelle, mais sous pression politique croissante du gouvernement.",
      media:[{name:"BBC News",type:"TV / Radio"},{name:"BBC iPlayer",type:"Streaming"},{name:"BBC World Service",type:"Radio"}]},
  ],
  "Allemagne":[
    {owner:"Famille Mohn (Bertelsmann)",fortune:"~5 Mds €",sector:"Médias (groupe mondial)",note:"Premier groupe médiatique européen. Propriétaire de RTL Group, actif en Allemagne et dans toute l'Europe.",
      media:[{name:"RTL",type:"TV"},{name:"VOX",type:"TV"},{name:"Stern",type:"Presse"},{name:"Brigitte",type:"Presse"},{name:"Penguin Random House",type:"Édition"}]},
    {owner:"Axel Springer",fortune:"—",sector:"Médias (coté / KKR)",note:"Groupe coté, majoritairement contrôlé par KKR depuis 2019. Leader de la presse populaire allemande et présent aux États-Unis via Politico.",
      media:[{name:"Bild",type:"Presse"},{name:"Die Welt",type:"Presse"},{name:"Politico Europe",type:"Digital"},{name:"Business Insider",type:"Digital"}]},
    {owner:"ARD / ZDF (service public)",fortune:"—",sector:"Service public",note:"Service public dominant. Maintient une forte confiance, particulièrement sur les réseaux sociaux. La Tagesschau est la chaîne YouTube la plus suivie d'Allemagne.",
      media:[{name:"Das Erste (ARD)",type:"TV"},{name:"ZDF",type:"TV"},{name:"Tagesschau",type:"App"},{name:"Deutschlandfunk",type:"Radio"}]},
    {owner:"Funke Mediengruppe",fortune:"—",sector:"Médias régionaux",note:"Groupe indépendant, leader de la presse régionale allemande avec plus de 600 publications.",
      media:[{name:"Hamburger Abendblatt",type:"Presse"},{name:"Berliner Morgenpost",type:"Presse"},{name:"WAZ",type:"Presse"}]},
  ],
};

function PlatformTag({name}: {name: string}){
  const s={YouTube:{bg:"#ff4e4e18",color:"#ff9090"},Spotify:{bg:"#1db95418",color:"#1db954"},TikTok:{bg:"#69c9d018",color:"#69c9d0"},X:{bg:"#1d9bf018",color:"#60b3ff"},Web:{bg:"#ffffff0e",color:"#aaa"},Podcast:{bg:"#b07cc618",color:"#c9a0e0"},Instagram:{bg:"#e1306c18",color:"#f48fb1"},TV:{bg:"#c9a84c18",color:"#e8c97a"},App:{bg:"#7ec8a418",color:"#7ec8a4"}}[name]||{bg:"#ffffff0e",color:"#aaa"};
  return <span style={{background:s.bg,color:s.color,fontFamily:"monospace",fontSize:9,padding:"2px 6px",borderRadius:2,letterSpacing:0.5,whiteSpace:"nowrap"}}>{name}</span>;
}

function EcoCard({item,accent}){
  const [hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?C.surfaceHover:C.surface,border:`1px solid ${hov?C.muted:C.border}`,borderLeft:`3px solid ${accent}`,padding:"14px 18px",transition:"background-color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",display:"grid",gridTemplateColumns:"200px 1fr 1fr",gap:16,alignItems:"center"}}>
      <div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:C.text,marginBottom:6}}>{item.name}</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{item.platforms.map(p=><PlatformTag key={p} name={p}/>)}</div>
      </div>
      <div style={{fontFamily:"monospace",fontSize:11,color:C.goldLight}}>{item.reach}</div>
      <div style={{fontFamily:"'Source Serif 4',serif",fontSize:12,color:C.dim,fontStyle:"italic"}}>{item.note}</div>
    </div>
  );
}

function MediaBadge({item}){
  const tc={TV:"#6b9bd2",Radio:"#b07cc6",Presse:"#7ec8a4",Digital:"#e8c97a",Streaming:"#e8956d",Réseaux:"#ff9090",Cinéma:"#c4b5a0",Édition:"#aaa",Groupe:"#888","TV / Radio":"#9bb8d4","TV / Presse":"#a8c4a2","App":"#7ec8a4","TV / Presse":"#a8c4a2"}[item.type]||"#888";
  return(
    <div style={{background:C.bg,border:`1px solid ${C.border}`,padding:"6px 10px",minWidth:110,maxWidth:180}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:700,color:C.text,marginBottom:4}}>{item.name}</div>
      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
        <span style={{fontFamily:"monospace",fontSize:9,color:tc,background:tc+"18",padding:"1px 5px",borderRadius:2}}>{item.type}</span>
        {item.year&&<span style={{fontFamily:"monospace",fontSize:9,color:C.muted}}>{item.year}</span>}
        {item.note&&<span style={{fontFamily:"'Source Serif 4',serif",fontSize:9,color:C.muted,fontStyle:"italic"}}>{item.note}</span>}
      </div>
    </div>
  );
}

function OwnerCard({owner,idx,expanded,onToggle}){
  const color=ownerColors[idx%ownerColors.length];
  return(
    <div style={{border:`1px solid ${expanded?color+"66":C.border}`,background:expanded?C.surfaceHover:C.surface,transition:"background-color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",marginBottom:8}}>
      <div onClick={onToggle} style={{padding:"16px 20px",cursor:"pointer",display:"grid",gridTemplateColumns:"1fr auto auto",alignItems:"center",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:4,height:40,background:color,flexShrink:0}}/>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:C.text}}>{owner.owner}</div>
            <div style={{fontFamily:"monospace",fontSize:10,color:C.dim,marginTop:2}}>{owner.sector}</div>
          </div>
        </div>
        <div style={{fontFamily:"monospace",fontSize:13,color:color,fontWeight:700,textAlign:"right"}}>{owner.fortune}</div>
        <div style={{fontFamily:"monospace",fontSize:18,color:C.muted,width:20,textAlign:"center",transition:"transform var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-out)",transform:expanded?"rotate(45deg)":"rotate(0deg)"}}>+</div>
      </div>
      {expanded&&(
        <div style={{borderTop:`1px solid ${C.border}`,padding:"16px 20px 20px",animation:"ownerExpand var(--dur-base) var(--ease-out)"}}>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:12,color:C.dim,margin:"0 0 14px",lineHeight:1.6,fontStyle:"italic"}}>{owner.note}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {owner.media.map((m,i)=><MediaBadge key={i} item={m}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

const TT=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return(<div style={{background:C.surface,border:`1px solid ${C.border}`,padding:"10px 14px",fontFamily:"monospace",fontSize:11,color:C.text}}>
    <div style={{color:C.gold,marginBottom:6,fontSize:10,letterSpacing:2}}>{label}</div>
    {payload.map((p,i)=>p.value&&<div key={i} style={{color:p.color,marginBottom:2}}>{p.name}: <strong>{p.value}%</strong></div>)}
  </div>);
};
const TTBar=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return(<div style={{background:C.surface,border:`1px solid ${C.border}`,padding:"10px 14px",fontFamily:"monospace",fontSize:11,color:C.text}}>
    <div style={{color:C.gold,marginBottom:4,fontSize:10,letterSpacing:2}}>{label}</div>
    <div>Confiance: <strong style={{color:C.goldLight}}>{payload[0].value}%</strong></div>
  </div>);
};

export function CrisisViz() {
  const [ecoCountry,setEcoCountry]=useState("États-Unis");
  const [ownerCountry,setOwnerCountry]=useState("France");
  const [expandedOwner,setExpandedOwner]=useState(null);
  const [visible,setVisible]=useState(false);

  useEffect(()=>{
    const link=document.createElement("link");
    link.href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:wght@400;600&display=swap";
    link.rel="stylesheet";
    document.head.appendChild(link);
    setTimeout(()=>setVisible(true),80);
  },[]);

  const ecoData=ecosystem[ecoCountry];
  const ownerData=ownership[ownerCountry];
  const SL=({n,children})=><div style={{fontFamily:"monospace",fontSize:10,letterSpacing:3,color:C.gold,textTransform:"uppercase",marginBottom:8}}>{n} — {children}</div>;
  const ST=({children})=><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:C.text,margin:"0 0 6px",lineHeight:1.3}}>{children}</h2>;
  const SS=({children})=><p style={{fontFamily:"'Source Serif 4',serif",fontSize:13,color:C.dim,margin:"0 0 28px",lineHeight:1.6,maxWidth:560}}>{children}</p>;
  const DIV=()=><div style={{height:1,background:C.border,margin:"44px 0"}}/>;
  const TABS=({value,onChange,options})=>(
    <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:24}}>
      {options.map(o=><button key={o} onClick={()=>onChange(o)} style={{background:"none",border:"none",borderBottom:`2px solid ${value===o?C.gold:"transparent"}`,color:value===o?C.goldLight:C.dim,fontFamily:"monospace",fontSize:11,letterSpacing:1,padding:"8px 18px 10px",cursor:"pointer",transition:"color var(--dur-fast) var(--ease-out), border-bottom-color var(--dur-base) var(--ease-out)"}}>{o}</button>)}
    </div>
  );

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,paddingBottom:60,opacity:visible?1:0,transition:"opacity var(--dur-page) var(--ease-out)"}}>
      <div style={{borderBottom:`1px solid ${C.border}`,padding:"32px 40px 28px",background:"radial-gradient(ellipse at 15% 60%, rgba(201,168,76,0.05) 0%, transparent 55%)"}}>
        <div style={{fontFamily:"monospace",fontSize:9,letterSpacing:4,color:C.muted,textTransform:"uppercase",marginBottom:14}}>SOARA · Analyse · Reuters Institute Digital News Report 2025</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,3.5vw,40px)",fontWeight:900,color:C.text,margin:"0 0 10px",lineHeight:1.2,maxWidth:720}}>
          La désaffection des médias occidentaux<br/><span style={{color:C.gold}}>en chiffres</span>
        </h1>
        <p style={{fontFamily:"'Source Serif 4',serif",fontSize:14,color:C.dim,margin:0,maxWidth:580,lineHeight:1.6}}>
          Chute de confiance, évitement croissant, transfert d'audience vers les newsfluenceurs et concentration du pouvoir médiatique entre les mains d'une poignée de milliardaires. 48 pays, ~100 000 répondants.
        </p>
      </div>

      <div style={{padding:"40px 40px 0"}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:44}}>
          {[["40%","Confiance mondiale dans les médias — stable 3 ans, 4 pts sous le pic COVID"],["40%","Des personnes évitent les infos — vs 29% en 2017. Record absolu."],["-32 pts","Chute de l'intérêt pour l'info au Royaume-Uni entre 2015 et 2024"],["9","Milliardaires français contrôlent plus de 80% des médias nationaux (2025)"]].map(([v,l])=>(
            <div key={v+l} style={{background:C.surface,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,padding:"16px 20px",flex:1,minWidth:140}}>
              <div style={{fontFamily:"monospace",fontSize:28,fontWeight:700,color:C.goldLight,letterSpacing:-1}}>{v}</div>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:11,color:C.dim,marginTop:4,lineHeight:1.5}}>{l}</div>
            </div>
          ))}
        </div>

        <SL n="01">Décrochage</SL>
        <ST>L'intérêt pour l'information s'effondre</ST>
        <SS>Pourcentage de la population déclarant s'intéresser aux actualités. Le Royaume-Uni a perdu 32 points en moins d'une décennie. L'Argentine, 32 points en 7 ans.</SS>
        <div style={{height:260,marginBottom:12}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={interestData} margin={{top:10,right:20,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="year" tick={{fill:C.muted,fontSize:10,fontFamily:"monospace"}} axisLine={{stroke:C.border}} tickLine={false}/>
              <YAxis domain={[30,80]} tick={{fill:C.muted,fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<TT/>}/>
              <ReferenceLine y={50} stroke={C.muted} strokeDasharray="4 4"/>
              <Line type="monotone" dataKey="uk" name="Royaume-Uni" stroke={C.uk} strokeWidth={2} dot={false} connectNulls/>
              <Line type="monotone" dataKey="arg" name="Argentine" stroke={C.arg} strokeWidth={2} dot={false} connectNulls/>
              <Line type="monotone" dataKey="fr" name="France" stroke={C.fr} strokeWidth={2} dot={false} connectNulls/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{display:"flex",gap:20,marginBottom:4}}>
          {[["Royaume-Uni",C.uk],["Argentine",C.arg],["France",C.fr]].map(([l,col])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:20,height:2,background:col}}/><span style={{fontFamily:"monospace",fontSize:10,color:C.dim}}>{l}</span>
            </div>
          ))}
        </div>

        <DIV/>

        <SL n="02">Évitement</SL>
        <ST>Le refus actif de s'informer</ST>
        <SS>Part de la population déclarant éviter les actualités "parfois ou souvent". Progression ininterrompue depuis 2017.</SS>
        <div style={{height:200,marginBottom:44}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={avoidanceData} margin={{top:10,right:20,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="year" tick={{fill:C.muted,fontSize:10,fontFamily:"monospace"}} axisLine={{stroke:C.border}} tickLine={false}/>
              <YAxis domain={[20,50]} tick={{fill:C.muted,fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<TT/>}/>
              <Line type="monotone" dataKey="v" name="Évitement mondial" stroke={C.avoid} strokeWidth={2.5} dot={{r:3,fill:C.avoid,strokeWidth:0}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <DIV/>

        <SL n="03">Confiance par pays</SL>
        <ST>Le fossé entre nord et sud de l'Europe</ST>
        <SS>Finlande (67%) vs Grèce (22%). La France à 30%, parmi les plus faibles d'Europe occidentale.</SS>
        <div style={{height:300,marginBottom:44}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trustData} layout="vertical" margin={{top:10,right:20,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
              <XAxis type="number" domain={[0,80]} tick={{fill:C.muted,fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <YAxis type="category" dataKey="c" tick={{fill:C.text,fontSize:11,fontFamily:"'Source Serif 4',serif"}} axisLine={false} tickLine={false} width={80}/>
              <Tooltip content={<TTBar/>}/>
              <ReferenceLine x={50} stroke={C.muted} strokeDasharray="4 4"/>
              <Bar dataKey="t" radius={[0,2,2,0]}>
                {trustData.map((e,i)=><Cell key={i} fill={e.t>=50?C.fr:e.t>=40?C.uk:e.t>=30?C.avoid:C.arg}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <DIV/>

        <SL n="04">Le nouvel écosystème</SL>
        <ST>Qui a capté l'audience perdue ?</ST>
        <SS>Deux catégories ont émergé : les individus dont le nom est devenu une marque médiatique, et les nouveaux médias indépendants structurés.</SS>
        <div style={{display:"flex",gap:24,marginBottom:24,flexWrap:"wrap"}}>
          {[[C.gold,C.goldLight,"Newsfluenceurs","individu dont le nom est la marque"],[C.uk,C.uk,"Nouveaux médias","structure éditoriale indépendante"]].map(([acc,col,label,desc])=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:3,height:18,background:acc}}/>
              <span style={{fontFamily:"monospace",fontSize:11,color:col}}>{label}</span>
              <span style={{fontFamily:"'Source Serif 4',serif",fontSize:11,color:C.dim}}>{desc}</span>
            </div>
          ))}
        </div>
        <TABS value={ecoCountry} onChange={setEcoCountry} options={Object.keys(ecosystem)}/>
        <div style={{fontFamily:"monospace",fontSize:10,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Newsfluenceurs — {ecoCountry}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
          {ecoData.influencers.map((item,i)=><EcoCard key={i} item={item} accent={C.gold}/>)}
        </div>
        <div style={{fontFamily:"monospace",fontSize:10,color:C.uk,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Nouveaux médias — {ecoCountry}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {ecoData.media.map((item,i)=><EcoCard key={i} item={item} accent={C.uk}/>)}
        </div>

        <DIV/>

        <SL n="05">Concentration du pouvoir</SL>
        <ST>Qui possède les médias traditionnels ?</ST>
        <SS>Derrière la désaffection du public, une réalité structurelle : une poignée de milliardaires contrôle l'essentiel du paysage médiatique occidental. Cliquez sur chaque propriétaire pour voir ses actifs.</SS>

        {ownerCountry==="France"&&(
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,padding:"12px 16px",marginBottom:20,fontFamily:"'Source Serif 4',serif",fontSize:12,color:C.dim,lineHeight:1.6}}>
            <strong style={{color:C.goldLight}}>9 milliardaires contrôlent plus de 80% des médias français en 2025.</strong> En trois ans, les rachats se sont accélérés : Bolloré absorbe Lagardère fin 2023, Saadé acquiert Altice Media été 2024 puis Brut septembre 2025, Arnault acquiert Paris Match octobre 2024. Le paysage se reforme continuellement.
          </div>
        )}
        {ownerCountry==="États-Unis"&&(
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,padding:"12px 16px",marginBottom:20,fontFamily:"'Source Serif 4',serif",fontSize:12,color:C.dim,lineHeight:1.6}}>
            <strong style={{color:C.goldLight}}>9 des 10 Américains les plus riches sont propriétaires ou dirigeants de médias (Free Press, 2025).</strong> La famille Ellison a acquis Paramount/CBS en août 2025 et vise Warner Bros./CNN. Si l'opération aboutit, deux des plus grands réseaux d'info américains seraient sous le même contrôle familial.
          </div>
        )}

        <TABS value={ownerCountry} onChange={(c)=>{setOwnerCountry(c);setExpandedOwner(null);}} options={Object.keys(ownership)}/>
        <div style={{display:"flex",flexDirection:"column"}}>
          {ownerData.map((owner,i)=>(
            <OwnerCard key={owner.owner} owner={owner} idx={i} expanded={expandedOwner===i} onToggle={()=>setExpandedOwner(expandedOwner===i?null:i)}/>
          ))}
        </div>

        <div style={{marginTop:48,paddingTop:24,borderTop:`1px solid ${C.border}`,fontFamily:"monospace",fontSize:10,color:C.muted,lineHeight:1.9}}>
          <strong style={{color:C.dim}}>Sources :</strong> Reuters Institute Digital News Report 2025 (Oxford University, 48 pays) · Reuters Institute "Mapping news creators and influencers" 2025 · Pew Research Center "News Influencers" 2024 · Free Press Media Capitulation Index 2025 · Cash Investigation France 2 (24 juin 2025) · INPI — données publiques · L'Essentiel de l'Éco, Basta!, Vert.eco (2025) · Données plateformes 2024–2025
        </div>
      </div>
    </div>
  );
}


// ── ARC DIAGRAM ──────────────────────────────────────────────


const CA = {
  bg: "#07080b", surface: "#0d0f14", border: "#1c2030",
  gold: "#c9a84c", dim: "#4a5268", text: "#cdd0da", muted: "#2a2f40",
};

const TYPE_COLOR = {
  TV:"#5b8fd4", Radio:"#9b6bc8", Presse:"#5caa7a",
  Digital:"#c8a030", Streaming:"#c85840", Réseaux:"#d04040",
  Cinéma:"#a09070", Édition:"#7090a8", App:"#5caa7a", "TV/Radio":"#7080b0",
};

const OWNERS_DATA = {
  "France": [
    { name:"Bolloré",   col:"#d4a020", fortune:"8 Mds €",
      media:[{n:"CNews",t:"TV"},{n:"C8",t:"TV"},{n:"Canal+",t:"TV"},{n:"Europe 1",t:"Radio"},{n:"JDD",t:"Presse"},{n:"Prisma Media",t:"Presse"}] },
    { name:"Arnault",   col:"#5caa7a", fortune:"150 Mds €",
      media:[{n:"Les Échos",t:"Presse"},{n:"Le Parisien",t:"Presse"},{n:"Paris Match",t:"Presse"},{n:"Radio Classique",t:"Radio"},{n:"L'Opinion",t:"Presse"}] },
    { name:"Saadé",     col:"#5b8fd4", fortune:"35 Mds €",
      media:[{n:"BFMTV",t:"TV"},{n:"RMC",t:"Radio"},{n:"La Provence",t:"Presse"},{n:"La Tribune",t:"Presse"},{n:"Brut",t:"Digital"}] },
    { name:"Dassault",  col:"#d4703a", fortune:"~20 Mds €",
      media:[{n:"Le Figaro",t:"Presse"},{n:"Fig. Magazine",t:"Presse"},{n:"Mme Figaro",t:"Presse"}] },
    { name:"Bouygues",  col:"#9b6bc8", fortune:"~5 Mds €",
      media:[{n:"TF1",t:"TV"},{n:"LCI",t:"TV"},{n:"TMC",t:"TV"},{n:"TFX",t:"TV"}] },
    { name:"Kretinsky", col:"#6890b8", fortune:"~7 Mds €",
      media:[{n:"Elle",t:"Presse"},{n:"Marianne",t:"Presse"},{n:"Franc Tireur",t:"Presse"},{n:"Loopsider",t:"Digital"}] },
    { name:"Stérin",    col:"#c87050", fortune:"1,4 Md €",
      media:[{n:"Valeurs Actuelles",t:"Presse"},{n:"Cerfia",t:"Réseaux"},{n:"Neo.tv",t:"Digital"},{n:"Explore Media",t:"Digital"}] },
    { name:"Mohn",      col:"#70a870", fortune:"—",
      media:[{n:"M6",t:"TV"},{n:"W9",t:"TV"},{n:"RTL",t:"Radio"}] },
  ],
  "États-Unis": [
    { name:"Murdoch",    col:"#d4a020", fortune:"~20 Mds €",
      media:[{n:"Fox News",t:"TV"},{n:"Wall St. Journal",t:"Presse"},{n:"NY Post",t:"Presse"},{n:"The Sun UK",t:"Presse"}] },
    { name:"Musk",       col:"#5b8fd4", fortune:"~300 Mds €",
      media:[{n:"X (Twitter)",t:"Réseaux"}] },
    { name:"Bezos",      col:"#5caa7a", fortune:"~230 Mds €",
      media:[{n:"Washington Post",t:"Presse"}] },
    { name:"Ellison",    col:"#d4703a", fortune:"~150 Mds €",
      media:[{n:"CBS News",t:"TV"},{n:"Paramount+",t:"Streaming"},{n:"MTV",t:"TV"}] },
    { name:"Comcast",    col:"#9b6bc8", fortune:"—",
      media:[{n:"NBC",t:"TV"},{n:"CNBC",t:"TV"},{n:"Peacock",t:"Streaming"},{n:"Universal",t:"Cinéma"}] },
    { name:"Sulzberger", col:"#6890b8", fortune:"—",
      media:[{n:"New York Times",t:"Presse"},{n:"The Athletic",t:"Digital"}] },
    { name:"Disney",     col:"#c87050", fortune:"—",
      media:[{n:"ABC News",t:"TV"},{n:"ESPN",t:"TV"},{n:"Hulu",t:"Streaming"},{n:"Disney+",t:"Streaming"}] },
  ],
  "Royaume-Uni": [
    { name:"Murdoch",     col:"#d4a020", fortune:"~20 Mds €",
      media:[{n:"The Times",t:"Presse"},{n:"Sunday Times",t:"Presse"},{n:"The Sun",t:"Presse"},{n:"TalkTV",t:"TV"}] },
    { name:"Rothermere",  col:"#5caa7a", fortune:"~2 Mds €",
      media:[{n:"Daily Mail",t:"Presse"},{n:"Metro",t:"Presse"},{n:"i newspaper",t:"Presse"},{n:"MailOnline",t:"Digital"}] },
    { name:"Kretinsky",   col:"#5b8fd4", fortune:"~7 Mds €",
      media:[{n:"Evening Standard",t:"Presse"},{n:"The Independent",t:"Digital"}] },
    { name:"Scott Trust", col:"#6890b8", fortune:"—",
      media:[{n:"The Guardian",t:"Presse"},{n:"The Observer",t:"Presse"}] },
    { name:"BBC",         col:"#70a870", fortune:"—",
      media:[{n:"BBC News",t:"TV/Radio"},{n:"BBC iPlayer",t:"Streaming"},{n:"BBC World",t:"Radio"}] },
  ],
  "Allemagne": [
    { name:"Mohn / Bertelsmann", col:"#d4a020", fortune:"~5 Mds €",
      media:[{n:"RTL",t:"TV"},{n:"VOX",t:"TV"},{n:"Stern",t:"Presse"},{n:"Brigitte",t:"Presse"}] },
    { name:"Axel Springer",      col:"#5b8fd4", fortune:"—",
      media:[{n:"Bild",t:"Presse"},{n:"Die Welt",t:"Presse"},{n:"Politico Europe",t:"Digital"},{n:"Business Insider",t:"Digital"}] },
    { name:"ARD / ZDF",          col:"#5caa7a", fortune:"—",
      media:[{n:"Das Erste",t:"TV"},{n:"ZDF",t:"TV"},{n:"Tagesschau",t:"App"},{n:"Deutschlandfunk",t:"Radio"}] },
    { name:"Funke",              col:"#d4703a", fortune:"—",
      media:[{n:"Hamburger Abendblatt",t:"Presse"},{n:"Berliner Morgenpost",t:"Presse"},{n:"WAZ",t:"Presse"}] },
  ],
};

const NOTE = {
  "France": "9 milliardaires contrôlent plus de 80% des médias français en 2025. Bolloré absorbe Lagardère fin 2023, Saadé acquiert BFMTV/RMC été 2024 puis Brut sept. 2025, Arnault acquiert Paris Match oct. 2024.",
  "États-Unis": "9 des 10 Américains les plus riches sont propriétaires ou dirigeants de médias (Free Press, 2025). La famille Ellison a acquis CBS / Paramount+ en août 2025.",
  "Royaume-Uni": "The Guardian est protégé par le Scott Trust depuis 1936, garantissant son indépendance éditoriale à perpétuité. MailOnline est le site d'info en anglais le plus consulté au monde.",
  "Allemagne": "Les médias publics ARD et ZDF maintiennent la confiance la plus élevée. Axel Springer est détenu à majorité par le fonds KKR depuis 2019.",
};

function ArcDiagram({ owners }) {
  const [hovOwner, setHovOwner]   = useState(null);
  const [hovMedia,  setHovMedia]  = useState(null);

  const W = 960, ownerY = 80, mediaY = 460, padX = 56;

  // Build flat media list sorted by owner
  const allMedia = useMemo(() => {
    const list = [];
    owners.forEach((o, oi) => o.media.forEach((m, mi) => list.push({ ...m, oi, mi, owner: o })));
    return list;
  }, [owners]);

  // Positions
  const ownerX = (i) => padX + (i / Math.max(owners.length - 1, 1)) * (W - 2 * padX);
  const mediaX  = (i) => padX + (i / Math.max(allMedia.length - 1, 1)) * (W - 2 * padX);
  const mid = (ownerY + mediaY) / 2 + 10;

  // Arc path: smooth S-bezier
  const arc = (ox, oy, mx, my) => {
    const c1y = oy + (my - oy) * 0.45;
    const c2y = oy + (my - oy) * 0.55;
    return `M ${ox} ${oy} C ${ox} ${c1y} ${mx} ${c2y} ${mx} ${my}`;
  };

  // Active state
  const isArcActive = (mi_item) => {
    if (hovOwner !== null && mi_item.oi !== hovOwner) return false;
    if (hovMedia  !== null && (mi_item.oi !== hovMedia.oi || mi_item.mi !== hovMedia.mi)) return false;
    return true;
  };

  return (
    <svg viewBox={`0 0 ${W} ${ownerY + (mediaY - ownerY) + 120}`} style={{ width: "100%", display: "block" }}>
      <defs>
        {owners.map((o, oi) =>
          allMedia.filter(m => m.oi === oi).map((m, li) => {
            const mx = mediaX(allMedia.findIndex(x => x.oi === oi && x.mi === m.mi));
            const tc = TYPE_COLOR[m.t] || CA.dim;
            return (
              <linearGradient key={`g${oi}_${li}`} id={`g${oi}_${li}`}
                x1={ownerX(oi)} y1={ownerY} x2={mx} y2={mediaY} gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor={o.col} stopOpacity="1" />
                <stop offset="100%" stopColor={tc}     stopOpacity="0.9" />
              </linearGradient>
            );
          })
        )}
      </defs>

      {/* Arcs */}
      {allMedia.map((m, i) => {
        const ox = ownerX(m.oi);
        const mx = mediaX(i);
        const active = isArcActive(m);
        const inactive = (hovOwner !== null || hovMedia !== null) && !active;
        const tc = TYPE_COLOR[m.t] || CA.dim;
        return (
          <path key={`arc${i}`}
            d={arc(ox, ownerY + 14, mx, mediaY - 14)}
            fill="none"
            stroke={inactive ? CA.muted : `url(#g${m.oi}_${m.mi})`}
            strokeWidth={active ? 1.8 : inactive ? 0.4 : 1.2}
            strokeOpacity={active ? 0.75 : inactive ? 0.06 : 0.3}
            style={{ transition: "stroke-opacity var(--dur-fast) var(--ease-out), stroke-width var(--dur-fast) var(--ease-out)" }}
          />
        );
      })}

      {/* Owner nodes — top row */}
      {owners.map((o, oi) => {
        const x = ownerX(oi);
        const isHov = hovOwner === oi;
        const inactive = hovOwner !== null && !isHov;
        return (
          <g key={`o${oi}`}
            onMouseEnter={() => setHovOwner(oi)}
            onMouseLeave={() => setHovOwner(null)}
            style={{ cursor: "pointer" }}>
            {/* vertical tick */}
            <line x1={x} y1={ownerY - 32} x2={x} y2={ownerY}
              stroke={o.col} strokeWidth={isHov ? 2 : 1}
              strokeOpacity={inactive ? 0.15 : 0.8}
              style={{ transition: "stroke-opacity var(--dur-fast) var(--ease-out), fill-opacity var(--dur-fast) var(--ease-out), stroke-width var(--dur-fast) var(--ease-out), r var(--dur-fast) var(--ease-out), font-size var(--dur-fast) var(--ease-out)" }} />
            {/* dot */}
            <circle cx={x} cy={ownerY - 34} r={isHov ? 5 : 3.5}
              fill={o.col} fillOpacity={inactive ? 0.15 : 1}
              style={{ transition: "stroke-opacity var(--dur-fast) var(--ease-out), fill-opacity var(--dur-fast) var(--ease-out), stroke-width var(--dur-fast) var(--ease-out), r var(--dur-fast) var(--ease-out), font-size var(--dur-fast) var(--ease-out)" }} />
            {/* name */}
            <text x={x} y={ownerY - 44}
              textAnchor="middle" fill={o.col}
              fontSize={isHov ? 13 : 12}
              fontFamily="'Playfair Display', serif" fontWeight="700"
              fillOpacity={inactive ? 0.2 : 1}
              style={{ userSelect: "none", transition: "stroke-opacity var(--dur-fast) var(--ease-out), fill-opacity var(--dur-fast) var(--ease-out), stroke-width var(--dur-fast) var(--ease-out), r var(--dur-fast) var(--ease-out), font-size var(--dur-fast) var(--ease-out)" }}>
              {o.name}
            </text>
            {/* fortune */}
            {o.fortune !== "—" && (
              <text x={x} y={ownerY - 56}
                textAnchor="middle" fill={o.col}
                fontSize={8} fontFamily="monospace"
                fillOpacity={inactive ? 0.15 : 0.55}
                style={{ userSelect: "none", transition: "stroke-opacity var(--dur-fast) var(--ease-out), fill-opacity var(--dur-fast) var(--ease-out), stroke-width var(--dur-fast) var(--ease-out), r var(--dur-fast) var(--ease-out), font-size var(--dur-fast) var(--ease-out)" }}>
                {o.fortune}
              </text>
            )}
          </g>
        );
      })}

      {/* Media nodes — bottom row */}
      {allMedia.map((m, i) => {
        const x = mediaX(i);
        const active = isArcActive(m);
        const inactive = (hovOwner !== null || hovMedia !== null) && !active;
        const tc = TYPE_COLOR[m.t] || CA.dim;
        const isHovM = hovMedia && hovMedia.oi === m.oi && hovMedia.mi === m.mi;
        return (
          <g key={`m${i}`}
            onMouseEnter={() => { setHovMedia(m); setHovOwner(null); }}
            onMouseLeave={() => setHovMedia(null)}
            style={{ cursor: "default" }}>
            {/* tick */}
            <line x1={x} y1={mediaY} x2={x} y2={mediaY + 10}
              stroke={tc} strokeWidth={1}
              strokeOpacity={inactive ? 0.06 : 0.5}
              style={{ transition: "stroke-opacity var(--dur-fast) var(--ease-out), fill-opacity var(--dur-fast) var(--ease-out), stroke-width var(--dur-fast) var(--ease-out), r var(--dur-fast) var(--ease-out), font-size var(--dur-fast) var(--ease-out)" }} />
            {/* dot */}
            <circle cx={x} cy={mediaY + 14} r={isHovM ? 5 : 3.5}
              fill={tc} fillOpacity={inactive ? 0.08 : active ? 1 : 0.5}
              style={{ transition: "stroke-opacity var(--dur-fast) var(--ease-out), fill-opacity var(--dur-fast) var(--ease-out), stroke-width var(--dur-fast) var(--ease-out), r var(--dur-fast) var(--ease-out), font-size var(--dur-fast) var(--ease-out)" }} />
            {/* rotated label */}
            <text
              transform={`translate(${x}, ${mediaY + 24}) rotate(-55)`}
              textAnchor="end"
              fill={active ? CA.text : CA.dim}
              fontSize={10.5}
              fontFamily="'Source Serif 4', serif"
              fillOpacity={inactive ? 0.12 : active ? 1 : 0.6}
              style={{ userSelect: "none", transition: "stroke-opacity var(--dur-fast) var(--ease-out), fill-opacity var(--dur-fast) var(--ease-out), stroke-width var(--dur-fast) var(--ease-out), r var(--dur-fast) var(--ease-out), font-size var(--dur-fast) var(--ease-out)" }}>
              {m.n}
            </text>
          </g>
        );
      })}

      {/* Hover tooltip */}
      {hovMedia && (() => {
        const i = allMedia.findIndex(x => x.oi === hovMedia.oi && x.mi === hovMedia.mi);
        const x = mediaX(i);
        const tc = TYPE_COLOR[hovMedia.t] || CA.dim;
        const label = `${hovMedia.owner.name} · ${hovMedia.t}`;
        const tw = label.length * 6.5 + 20;
        return (
          <g style={{ pointerEvents: "none" }}>
            <rect x={x - tw/2} y={ownerY + 40} width={tw} height={28} rx={3}
              fill={CA.surface} stroke={hovMedia.owner.col} strokeWidth={1} />
            <text x={x} y={ownerY + 58} textAnchor="middle"
              fill={CA.text} fontSize={10} fontFamily="monospace">
              {label}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

export function OwnershipMap() {
  const [country, setCountry] = useState("France");
  const [visible,  setVisible]  = useState(false);
  const countries = Object.keys(OWNERS_DATA);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setVisible(true), 80);
  }, []);

  const owners = OWNERS_DATA[country];

  return (
    <div style={{ background: CA.bg, minHeight: "100vh", color: CA.text, paddingBottom: 60, opacity: visible ? 1 : 0, transition: "opacity var(--dur-page) var(--ease-out)" }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${CA.border}`, padding: "28px 36px 22px", background: "radial-gradient(ellipse at 18% 50%, rgba(201,168,76,0.04) 0%, transparent 60%)" }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 4, color: CA.dim, textTransform: "uppercase", marginBottom: 12 }}>
          SOARA · Concentration des médias · 2025
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 900, color: CA.text, margin: "0 0 6px", lineHeight: 1.2 }}>
          Qui possède les médias ?
        </h1>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: CA.dim, margin: 0, lineHeight: 1.6, maxWidth: 520 }}>
          Survolez un propriétaire ou un média pour révéler les connexions.
        </p>
      </div>

      <div style={{ padding: "22px 36px 0" }}>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${CA.border}`, marginBottom: 20 }}>
          {countries.map(c => (
            <button key={c} onClick={() => setCountry(c)} style={{
              background: "none", border: "none",
              borderBottom: `2px solid ${country === c ? CA.gold : "transparent"}`,
              color: country === c ? CA.gold : CA.dim,
              fontFamily: "monospace", fontSize: 11, letterSpacing: 1,
              padding: "8px 20px 10px", cursor: "pointer", transition: "color var(--dur-fast) var(--ease-out), border-bottom-color var(--dur-base) var(--ease-out)",
            }}>{c}</button>
          ))}
        </div>

        {/* Note */}
        <div style={{ background: CA.surface, border: `1px solid ${CA.border}`, borderLeft: `3px solid ${CA.gold}`, padding: "9px 14px", marginBottom: 20, fontFamily: "'Source Serif 4', serif", fontSize: 12, color: CA.dim, lineHeight: 1.55 }}>
          {NOTE[country]}
        </div>

        {/* Diagram */}
        <div style={{ border: `1px solid ${CA.border}`, background: CA.bg, padding: "24px 0 8px" }}>
          <ArcDiagram key={country} owners={owners} />
        </div>

        {/* Type legend */}
        <div style={{ marginTop: 14, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: CA.dim, letterSpacing: 2, textTransform: "uppercase" }}>Types</span>
          {["TV","Presse","Radio","Digital","Streaming","Réseaux"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: TYPE_COLOR[t] }} />
              <span style={{ fontFamily: "monospace", fontSize: 9, color: CA.dim }}>{t}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${CA.border}`, fontFamily: "monospace", fontSize: 10, color: CA.dim, lineHeight: 1.9 }}>
          <strong style={{ color: "#6a7090" }}>Sources :</strong> L'Essentiel de l'Éco (mai 2025) · Basta! · Cash Investigation France 2 (24 juin 2025) · INPI · Free Press Media Capitulation Index 2025
        </div>
      </div>
    </div>
  );
}

// ── PAGE WRAPPER ──────────────────────────────────────────────────────────────

export default function MediasPouvoirClient() {
  return (
    <>
      <Header activeNav="concept" />
      <div style={{ background: '#07080b', minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{
          background: '#060810',
          borderBottom: '1px solid #1a1d25',
          padding: '56px 64px 44px',
        }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 4, color: '#383d4e', textTransform: 'uppercase', marginBottom: 14 }}>
            SOARA · Atlas · Analyse interactive
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, color: '#cdd0d8', margin: '0 0 14px', lineHeight: 1.15 }}>
            Médias occidentaux :<br />
            <span style={{ color: '#c9a84c' }}>chiffres, pouvoir et nouveaux acteurs</span>
          </h1>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: '#5a6070', margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
            Désaffection du public, concentration du capital médiatique entre les mains d'une poignée de milliardaires, émergence des newsfluenceurs.
            Une analyse interactive fondée sur le Reuters Institute Digital News Report 2025 (48 pays, ~100 000 répondants).
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#c9a84c', opacity: 0.7 }}>Reuters Institute 2025</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a6070' }}>·</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a6070' }}>Free Press Media Capitulation Index</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a6070' }}>·</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a6070' }}>Pew Research Center 2024</div>
          </div>
        </div>

        {/* Section 1 — Analyse crise */}
        <div style={{ borderBottom: '1px solid #1a1d25', padding: '16px 64px 8px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 3, color: '#c9a84c', textTransform: 'uppercase' }}>
            Partie I — Chiffres de la désaffection & nouveaux acteurs
          </div>
        </div>
        <CrisisViz />

        {/* Section 2 — Qui possède */}
        <div style={{ borderTop: '2px solid #1a1d25', borderBottom: '1px solid #1a1d25', padding: '16px 64px 8px', marginTop: 8 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 3, color: '#c9a84c', textTransform: 'uppercase' }}>
            Partie II — Qui possède les médias traditionnels ?
          </div>
        </div>
        <OwnershipMap />

      </div>
    </>
  )
}
