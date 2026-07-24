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

function Filiation() {
  const { ref, seen, anim } = useInView<HTMLDivElement>();
  const SOL = 372;
  const LX = 104;
  const LY = 356;
  const EASE = { calcMode: "spline", keyTimes: "0;1", keySplines: "0.22 0 0.12 1" };

  return (
    <div className={styles.nuit} ref={ref}>
      <span className={styles.eyebrow}>Novembre 1998 · Pékin</span>
      <h3 className={styles.vizTitle}>
        Six personnes, <em>une ligne d&rsquo;horizon</em>
      </h3>
      <p className={styles.standfirst}>
        Une pièce, quelques bureaux, une lampe. Les silhouettes que le
        laboratoire projette portent aujourd&rsquo;hui l&rsquo;industrie chinoise
        de l&rsquo;intelligence artificielle.
      </p>

      <div className={styles.scroll}>
        <svg
          viewBox="0 0 780 470"
          width="100%"
          style={{ display: "block", minWidth: 640 }}
          role="img"
          aria-label="Le laboratoire Microsoft de Pékin, minuscule au pied d'un mur, projette sept silhouettes monumentales portant les noms de SenseTime, Megvii, Yitu, Horizon Robotics, Baidu, Alibaba Cloud et Sinovation"
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
            Pékin, 1998
          </text>
          <text x="150" y="424" fill="#7C7468" fontFamily="'DM Mono',monospace" fontSize="9" letterSpacing="1.6">
            MICROSOFT RESEARCH ASIA
          </text>
          <text x="150" y="440" fill="#6A6359" fontFamily="'DM Mono',monospace" fontSize="9" letterSpacing="1.6">
            SIX PERSONNES · KAI-FU LEE
          </text>
        </svg>
      </div>

      <p className={styles.source}>
        Microsoft, communiqué d&rsquo;ouverture du laboratoire, novembre 1998 ·
        CommonWealth Magazine, mai 2024, d&rsquo;après une enquête du New York
        Times, janvier 2024 · hauteurs des silhouettes sans valeur chiffrée
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

function Rattrapage() {
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
      <span className={styles.eyebrow}>2023 — 2026</span>
      <h3 className={styles.vizTitle}>
        L&rsquo;écart, <em>et rien d&rsquo;autre</em>
      </h3>
      <p className={styles.standfirst}>
        Chaque bande sombre est la distance qui séparait encore le meilleur
        modèle chinois du meilleur modèle américain. C&rsquo;est le vide
        qu&rsquo;il faut lire, pas les masses qui l&rsquo;encadrent.
      </p>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: "#D3A05A" }} />
          Meilleur modèle américain
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: "#7E9BC4" }} />
          Meilleur modèle chinois
        </span>
      </div>

      <div className={styles.scroll}>
        <svg
          viewBox="0 0 780 330"
          width="100%"
          style={{ display: "block", minWidth: 600 }}
          role="img"
          aria-label="Quatre relevés de l'écart entre modèles américains et chinois, de dix-sept à trente et un points en 2023 jusqu'à 2,7 points en mars 2026"
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
            ÉCART EN POINTS
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
                  {r.an}
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
                  {r.txt}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className={styles.source}>
        Stanford Institute for Human-Centered Artificial Intelligence · AI Index
        Report 2026 pour le relevé de mars 2026, éditions antérieures du même
        rapport pour les relevés de 2023 à 2025
      </p>
    </div>
  );
}

/* ══ 3. BRAISES ════════════════════════════════════════════════════
   Mille points, six allumés. Dans le noir les six rayonnent au lieu
   d'être posés à plat.                                             */

function Asymetrie() {
  const { ref, seen, anim } = useInView<HTMLDivElement>();

  return (
    <div className={styles.nuit} ref={ref}>
      <span className={styles.eyebrow}>Le sol sous la graine</span>
      <h3 className={styles.vizTitle}>
        Mille braises, <em>six allumées</em>
      </h3>
      <p className={styles.standfirst}>
        Chaque point vaut un millième de la capacité mondiale de centres de
        données. Ce qui brûle sur le continent africain tient dans les six
        points verts, quand le modèle présenté à Shanghai réclame quatre à huit
        accélérateurs haut de gamme pour une simple mise en service.
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
            De la capacité mondiale de centres de données
          </span>
        </div>
        <div className={styles.ch}>
          <span className={styles.chV}>
            594<small>Go</small>
          </span>
          <span className={styles.chL}>
            Poids du modèle présenté à Shanghai, en précision native
          </span>
        </div>
        <div className={styles.ch}>
          <span className={styles.chV}>5 000</span>
          <span className={styles.chL}>
            Places de formation promises sur cinq ans, tout le Sud confondu
          </span>
        </div>
      </div>

      <p className={styles.source}>
        Africa Data Centres Association, rapport économique 2026 · Moonshot AI,
        South China Morning Post et VentureBeat, juillet 2026 · discours
        d&rsquo;ouverture de la World Artificial Intelligence Conference,
        Shanghai, 17 juillet 2026
      </p>
    </div>
  );
}

export { Filiation, Rattrapage, Asymetrie };
