"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./verger.module.css";

/* Les trois blocs prolongent la photographie de couverture : un fond de
   nuit, une lampe posée bas, des ombres hors de proportion avec les
   objets qui les projettent. Codage couleur constant :
     or (#D3A05A)     le donateur de 1998 et la frontière américaine
     acier (#7E9BC4)  la Chine, receveuse devenue rivale
     pousse (#8FBE9A) l'Afrique et le verger                          */

/* Deux drapeaux distincts, et la distinction compte : `seen` commande
   l'état final du dessin, `anim` le montage des balises <animate>.
   Sous mouvement réduit, `seen` passe à vrai sans que `anim` suive, si
   bien que la visualisation s'affiche complète et fixe au lieu de
   rester invisible. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSeen(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSeen(true);
          setAnim(true);
          io.disconnect();
        }
      },
      { rootMargin: "-10% 0px -10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return { ref, seen, anim };
}


/* Les libellés des trois visualisations. L'anglais n'est pas une glose
   du français : les intitulés sont réécrits pour sonner juste dans la
   langue, pas transposés mot à mot. */
type Lang = "fr" | "en";

const S = {
  fr: {
    f_eyebrow: "Novembre 1998 · Pékin",
    f_t1: "Six personnes, ", f_t2: "une ligne d’horizon",
    f_sf: "Une pièce, quelques bureaux, une lampe. Les silhouettes que le laboratoire projette portent aujourd’hui l’industrie chinoise de l’intelligence artificielle.",
    f_aria: "Le laboratoire Microsoft de Pékin, minuscule au pied d’un mur, projette sept silhouettes monumentales portant les noms de SenseTime, Megvii, Yitu, Horizon Robotics, Baidu, Alibaba Cloud et Sinovation",
    f_lieu: "Pékin, 1998",
    f_lab: "MICROSOFT RESEARCH ASIA",
    f_six: "SIX PERSONNES · KAI-FU LEE",
    f_src: "Microsoft, communiqué d’ouverture du laboratoire, novembre 1998 · CommonWealth Magazine, mai 2024, d’après une enquête du New York Times, janvier 2024 · hauteurs des silhouettes sans valeur chiffrée",

    r_eyebrow: "2023 — 2026",
    r_t1: "L’écart, ", r_t2: "et rien d’autre",
    r_sf: "Chaque bande sombre est la distance qui séparait encore le meilleur modèle chinois du meilleur modèle américain. C’est le vide qu’il faut lire, pas les masses qui l’encadrent.",
    r_lg1: "Meilleur modèle américain", r_lg2: "Meilleur modèle chinois",
    r_aria: "Quatre relevés de l’écart entre modèles américains et chinois, de dix-sept à trente et un points en 2023 jusqu’à 2,7 points en mars 2026",
    r_axe: "ÉCART EN POINTS",
    r_rows: ["MAI 2023", "JANV. 2024", "FÉVR. 2025", "MARS 2026"],
    r_vals: ["17,5 à 31,6", "9,3", "1,7", "2,7"],
    r_src: "Stanford Institute for Human-Centered Artificial Intelligence · AI Index Report 2026 pour le relevé de mars 2026, éditions antérieures du même rapport pour les relevés de 2023 à 2025",

    a_eyebrow: "Le sol sous la graine",
    a_t1: "Mille braises, ", a_t2: "six allumées",
    a_sf: "Chaque point vaut un millième de la capacité mondiale de centres de données. Ce qui brûle sur le continent africain tient dans les six points verts, quand le modèle présenté à Shanghai réclame quatre à huit accélérateurs haut de gamme pour une simple mise en service.",
    a_l1: "De la capacité mondiale de centres de données",
    a_l2: "Poids du modèle présenté à Shanghai, en précision native",
    a_l3: "Places de formation promises sur cinq ans, tout le Sud confondu",
    a_src: "Africa Data Centres Association, rapport économique 2026 · Moonshot AI, South China Morning Post et VentureBeat, juillet 2026 · discours d’ouverture de la World Artificial Intelligence Conference, Shanghai, 17 juillet 2026",
  },
  en: {
    f_eyebrow: "November 1998 · Beijing",
    f_t1: "Six people, ", f_t2: "one skyline",
    f_sf: "One room, a few desks, a lamp. The silhouettes the laboratory throws against the wall now carry China’s artificial intelligence industry.",
    f_aria: "Microsoft’s Beijing laboratory, tiny at the foot of a wall, casts seven monumental silhouettes bearing the names SenseTime, Megvii, Yitu, Horizon Robotics, Baidu, Alibaba Cloud and Sinovation",
    f_lieu: "Beijing, 1998",
    f_lab: "MICROSOFT RESEARCH ASIA",
    f_six: "SIX PEOPLE · KAI-FU LEE",
    f_src: "Microsoft, laboratory opening announcement, November 1998 · CommonWealth Magazine, May 2024, drawing on a New York Times investigation, January 2024 · silhouette heights carry no numerical value",

    r_eyebrow: "2023 — 2026",
    r_t1: "The gap, ", r_t2: "and nothing else",
    r_sf: "Each dark band is the distance that still separated the best Chinese model from the best American one. It is the void that carries the reading, not the masses framing it.",
    r_lg1: "Best American model", r_lg2: "Best Chinese model",
    r_aria: "Four readings of the gap between American and Chinese models, from seventeen to thirty-one points in 2023 down to 2.7 points in March 2026",
    r_axe: "GAP IN POINTS",
    r_rows: ["MAY 2023", "JAN. 2024", "FEB. 2025", "MARCH 2026"],
    r_vals: ["17.5 to 31.6", "9.3", "1.7", "2.7"],
    r_src: "Stanford Institute for Human-Centered Artificial Intelligence · AI Index Report 2026 for the March 2026 reading, earlier editions of the same report for the 2023 to 2025 readings",

    a_eyebrow: "The soil beneath the seed",
    a_t1: "A thousand embers, ", a_t2: "six alight",
    a_sf: "Each point stands for one thousandth of the world’s data centre capacity. What burns on the African continent fits into the six green points, while the model unveiled in Shanghai calls for four to eight high-end accelerators just to be brought up and run.",
    a_l1: "Of the world’s data centre capacity",
    a_l2: "Weight of the model unveiled in Shanghai, at native precision",
    a_l3: "Training places promised over five years, across the entire South",
    a_src: "Africa Data Centres Association, 2026 economic report · Moonshot AI, South China Morning Post and VentureBeat, July 2026 · opening address, World Artificial Intelligence Conference, Shanghai, 17 July 2026",
  },
} as const;

/* ══ 1. L'OMBRE DU LABORATOIRE ═════════════════════════════════════
   Un mur en lumière rasante, une lampe au sol, et le laboratoire
   réduit à un rectangle de vingt pixels. Ce qui en est sorti monte en
   ligne d'horizon. Les hauteurs sont libres et ne codent aucune
   donnée, ce que la légende dit explicitement.                     */

const TOURS = [
  { n: "SENSETIME", x: 212, w: 56, h: 196 },
  { n: "MEGVII", x: 276, w: 44, h: 150 },
  { n: "YITU", x: 328, w: 40, h: 168 },
  { n: "HORIZON ROBOTICS", x: 376, w: 62, h: 268 },
  { n: "BAIDU", x: 446, w: 46, h: 158 },
  { n: "ALIBABA CLOUD", x: 500, w: 58, h: 230 },
  { n: "SINOVATION", x: 566, w: 50, h: 182 },
];

function Filiation({ lang = "fr" }: { lang?: Lang }) {
  const t = S[lang];
  const { ref, seen, anim } = useInView<HTMLDivElement>();
  const SOL = 372;
  const LX = 104;
  const LY = 356;
  const EASE = { calcMode: "spline", keyTimes: "0;1", keySplines: "0.22 0 0.12 1" };

  return (
    <div className={styles.nuit} ref={ref}>
      <span className={styles.eyebrow}>{t.f_eyebrow}</span>
      <h3 className={styles.vizTitle}>
        {t.f_t1}<em>{t.f_t2}</em>
      </h3>
      <p className={styles.standfirst}>
        {t.f_sf}
      </p>

      <div className={styles.scroll}>
        <svg
          viewBox="0 0 780 470"
          width="100%"
          style={{ display: "block", minWidth: 640 }}
          role="img"
          aria-label={t.f_aria}
        >
          <defs>
            <radialGradient id="vf-mur" cx="13%" cy="96%" r="92%">
              <stop offset="0%" stopColor="#5A4630" />
              <stop offset="34%" stopColor="#33291D" />
              <stop offset="72%" stopColor="#1C1814" />
              <stop offset="100%" stopColor="#141210" />
            </radialGradient>
            <radialGradient id="vf-halo">
              <stop offset="0%" stopColor="#F0B65C" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#C98A33" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#C98A33" stopOpacity="0" />
            </radialGradient>
            {/* Une ombre ne se découpe jamais net. */}
            <filter id="vf-flou" x="-14%" y="-14%" width="128%" height="128%">
              <feGaussianBlur stdDeviation="2.4" />
            </filter>
          </defs>

          <rect x="0" y="0" width="780" height={SOL} fill="url(#vf-mur)" />
          <rect x="0" y={SOL} width="780" height={470 - SOL} fill="#0E0C0B" />
          <rect x="0" y={SOL - 1} width="780" height="1.2" fill="#3A3025" opacity="0.55" />

          <g filter="url(#vf-flou)">
            {TOURS.map((t, i) => (
              <rect
                key={t.n}
                x={t.x}
                y={seen && !anim ? SOL - t.h : SOL}
                width={t.w}
                height={seen && !anim ? t.h : 0}
                fill="#0B0A09"
                fillOpacity="0.9"
              >
                {anim && (
                  <>
                    <animate
                      attributeName="height"
                      from="0"
                      to={String(t.h)}
                      dur="2.4s"
                      begin={`${i * 0.16}s`}
                      fill="freeze"
                      {...EASE}
                    />
                    <animate
                      attributeName="y"
                      from={String(SOL)}
                      to={String(SOL - t.h)}
                      dur="2.4s"
                      begin={`${i * 0.16}s`}
                      fill="freeze"
                      {...EASE}
                    />
                  </>
                )}
              </rect>
            ))}
          </g>

          {/* Les noms courent à la verticale dans la tranche d'ombre. */}
          {TOURS.map((t, i) => {
            const cx = t.x + t.w / 2;
            return (
              <g key={t.n} opacity={seen && !anim ? 1 : 0}>
                {anim && (
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.8s"
                    begin={`${1.5 + i * 0.16}s`}
                    fill="freeze"
                  />
                )}
                <text
                  x={cx}
                  y={SOL - 16}
                  fill="#B6AC9C"
                  fontFamily="'DM Mono',monospace"
                  fontSize="9.5"
                  letterSpacing="2.2"
                  textAnchor="start"
                  transform={`rotate(-90 ${cx} ${SOL - 16})`}
                >
                  {t.n}
                </text>
              </g>
            );
          })}

          <circle cx={LX} cy={LY} r="118" fill="url(#vf-halo)" />
          <rect x={LX + 16} y={SOL - 13} width="20" height="13" fill="#0B0A09" />
          <circle cx={LX} cy={LY} r="5.5" fill="#FBD79A" />
          <circle cx={LX} cy={LY} r="2.4" fill="#FFF3DC" />

          <text x="150" y="404" fill="#C9BFAF" fontFamily="'Playfair Display',Georgia,serif" fontSize="19" fontWeight="700">
            {t.f_lieu}
          </text>
          <text x="150" y="424" fill="#7C7468" fontFamily="'DM Mono',monospace" fontSize="9" letterSpacing="1.6">
            {t.f_lab}
          </text>
          <text x="150" y="440" fill="#6A6359" fontFamily="'DM Mono',monospace" fontSize="9" letterSpacing="1.6">
            {t.f_six}
          </text>
        </svg>
      </div>

      <p className={styles.source}>
        {t.f_src}
      </p>
    </div>
  );
}

/* ══ 2. L'ÉCART COMME VIDE ═════════════════════════════════════════
   Quatre relevés. Deux masses se referment l'une vers l'autre et la
   bande noire qui subsiste entre elles est la donnée. On lit le vide,
   pas les masses. La fourchette de 2023 se rend par une zone
   d'incertitude, ce qu'une courbe ne savait pas dire honnêtement.  */

type Releve = { an: string; v?: number; lo?: number; hi?: number; txt: string };

const RELEVES: Releve[] = [
  { an: "MAI 2023", lo: 17.5, hi: 31.6, txt: "17,5 à 31,6" },
  { an: "JANV. 2024", v: 9.3, txt: "9,3" },
  { an: "FÉVR. 2025", v: 1.7, txt: "1,7" },
  { an: "MARS 2026", v: 2.7, txt: "2,7" },
];

function Rattrapage({ lang = "fr" }: { lang?: Lang }) {
  const t = S[lang];
  const { ref, seen, anim } = useInView<HTMLDivElement>();
  const CX = 430;
  const K = 7.6;
  const X0 = 150;
  const X1 = 742;
  const ROW0 = 44;
  const RH = 66;
  const BH = 30;
  const EASE = { calcMode: "spline", keyTimes: "0;1", keySplines: "0.3 0 0.15 1" };

  return (
    <div className={styles.nuit} ref={ref}>
      <span className={styles.eyebrow}>{t.r_eyebrow}</span>
      <h3 className={styles.vizTitle}>
        {t.r_t1}<em>{t.r_t2}</em>
      </h3>
      <p className={styles.standfirst}>
        {t.r_sf}
      </p>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: "#D3A05A" }} />
          {t.r_lg1}
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: "#7E9BC4" }} />
          {t.r_lg2}
        </span>
      </div>

      <div className={styles.scroll}>
        <svg
          viewBox="0 0 780 330"
          width="100%"
          style={{ display: "block", minWidth: 600 }}
          role="img"
          aria-label={t.r_aria}
        >
          <defs>
            <linearGradient id="vf-or" x1="0" x2="1">
              <stop offset="0%" stopColor="#7A5A2C" />
              <stop offset="100%" stopColor="#D3A05A" />
            </linearGradient>
            <linearGradient id="vf-acier" x1="1" x2="0">
              <stop offset="0%" stopColor="#43597A" />
              <stop offset="100%" stopColor="#7E9BC4" />
            </linearGradient>
          </defs>

          <text
            x={X1}
            y={ROW0 - 16}
            fill="#6A645B"
            fontFamily="'DM Mono',monospace"
            fontSize="8.5"
            letterSpacing="1.8"
            textAnchor="end"
          >
            {t.r_axe}
          </text>

          {RELEVES.map((r, i) => {
            const y = ROW0 + i * RH;
            const dLo = r.lo !== undefined ? (r.lo * K) / 2 : null;
            const dHi = r.hi !== undefined ? (r.hi * K) / 2 : null;
            const dFin = r.v !== undefined ? (r.v * K) / 2 : (dHi as number);
            const ouvert = 6;

            return (
              <g key={r.an}>
                <text
                  x="0"
                  y={y + BH / 2 + 3.5}
                  fill="#6A645B"
                  fontFamily="'DM Mono',monospace"
                  fontSize="9"
                  letterSpacing="1.6"
                >
                  {t.r_rows[i]}
                </text>

                <rect
                  x={X0}
                  y={y}
                  width={seen && !anim ? CX - dFin - X0 : CX - X0 - ouvert}
                  height={BH}
                  fill="url(#vf-or)"
                >
                  {anim && (
                    <animate
                      attributeName="width"
                      from={String(CX - X0 - ouvert)}
                      to={String(CX - dFin - X0)}
                      dur="2.1s"
                      begin={`${i * 0.22}s`}
                      fill="freeze"
                      {...EASE}
                    />
                  )}
                </rect>

                <rect
                  x={seen && !anim ? CX + dFin : CX + ouvert}
                  y={y}
                  width={seen && !anim ? X1 - CX - dFin : X1 - CX - ouvert}
                  height={BH}
                  fill="url(#vf-acier)"
                >
                  {anim && (
                    <>
                      <animate
                        attributeName="x"
                        from={String(CX + ouvert)}
                        to={String(CX + dFin)}
                        dur="2.1s"
                        begin={`${i * 0.22}s`}
                        fill="freeze"
                        {...EASE}
                      />
                      <animate
                        attributeName="width"
                        from={String(X1 - CX - ouvert)}
                        to={String(X1 - CX - dFin)}
                        dur="2.1s"
                        begin={`${i * 0.22}s`}
                        fill="freeze"
                        {...EASE}
                      />
                    </>
                  )}
                </rect>

                {/* Zone d'incertitude : la fourchette publiée en 2023. */}
                {dLo !== null && dHi !== null && (
                  <>
                    <rect x={CX - dHi} y={y} width={dHi - dLo} height={BH} fill="#D3A05A" fillOpacity="0.13" />
                    <rect x={CX + dLo} y={y} width={dHi - dLo} height={BH} fill="#7E9BC4" fillOpacity="0.13" />
                  </>
                )}

                <text
                  x={CX}
                  y={y + BH + 17}
                  fill="#C9BFAF"
                  fontFamily="'Playfair Display',Georgia,serif"
                  fontSize="15"
                  fontWeight="700"
                  textAnchor="middle"
                  opacity={seen && !anim ? 1 : 0}
                >
                  {anim && (
                    <animate
                      attributeName="opacity"
                      from="0"
                      to="1"
                      dur="0.7s"
                      begin={`${1.5 + i * 0.22}s`}
                      fill="freeze"
                    />
                  )}
                  {t.r_vals[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className={styles.source}>
        {t.r_src}
      </p>
    </div>
  );
}

/* ══ 3. BRAISES ════════════════════════════════════════════════════
   Mille points, six allumés. Dans le noir les six rayonnent au lieu
   d'être posés à plat.                                             */

function Asymetrie({ lang = "fr" }: { lang?: Lang }) {
  const t = S[lang];
  const { ref, seen, anim } = useInView<HTMLDivElement>();

  return (
    <div className={styles.nuit} ref={ref}>
      <span className={styles.eyebrow}>{t.a_eyebrow}</span>
      <h3 className={styles.vizTitle}>
        {t.a_t1}<em>{t.a_t2}</em>
      </h3>
      <p className={styles.standfirst}>
        {t.a_sf}
      </p>

      <div className={styles.braises} aria-hidden="true">
        {Array.from({ length: 1000 }, (_, i) => (
          <span
            key={i}
            className={`${styles.br} ${i < 6 && seen ? styles.brOn : ""}`}
            style={
              i < 6 && anim
                ? {
                    transition: "background-color .6s ease, box-shadow .9s ease",
                    transitionDelay: `${i * 130}ms`,
                  }
                : undefined
            }
          />
        ))}
      </div>

      <div className={styles.chiffres}>
        <div className={styles.ch}>
          <span className={styles.chV}>
            0,6<small>%</small>
          </span>
          <span className={styles.chL}>
            {t.a_l1}
          </span>
        </div>
        <div className={styles.ch}>
          <span className={styles.chV}>
            594<small>Go</small>
          </span>
          <span className={styles.chL}>
            {t.a_l2}
          </span>
        </div>
        <div className={styles.ch}>
          <span className={styles.chV}>5 000</span>
          <span className={styles.chL}>
            {t.a_l3}
          </span>
        </div>
      </div>

      <p className={styles.source}>
        {t.a_src}
      </p>
    </div>
  );
}

export { Filiation, Rattrapage, Asymetrie };
