"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./verger.module.css";

/* ── Codage couleur constant sur les trois visualisations ──────────
   OR    : le donateur de 1998 et la frontière américaine
   BLEU  : la Chine, receveuse devenue rivale
   VERT  : l'Afrique et le verger                                  */
const OR = "#8C6F2E";
const BLEU = "#1A3E6B";
const VERT = "#2D6B4A";

/* Révélation au défilement. Les animations SMIL ne sont montées qu'une
   fois le bloc à l'écran, sinon elles se jouent hors champ.

   Deux drapeaux distincts, et la distinction compte : `seen` commande
   l'état final du dessin, `anim` commande le montage des balises
   <animate>. Sous mouvement réduit, `seen` passe à vrai immédiatement
   et `anim` reste faux, si bien que la visualisation s'affiche
   complète et fixe. Les confondre rendrait le graphique invisible aux
   personnes qui ont désactivé les animations. */
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
      { rootMargin: "-12% 0px -12% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return { ref, seen, anim };
}

/* ══ 1. LA FILIATION ══════════════════════════════════════════════
   Le laboratoire de Pékin à gauche, ce qui en est sorti à droite.
   Les branches passent de l'or au bleu sur leur propre longueur :
   le trait dit ce que le texte démontre, le don change de mains. */

const HERITIERS = [
  { nom: "SenseTime", note: "Vision par ordinateur" },
  { nom: "Megvii", note: "Reconnaissance faciale" },
  { nom: "Yitu", note: "Vision et santé" },
  { nom: "Horizon Robotics", note: "Puces embarquées" },
  { nom: "Baidu", note: "Direction de la recherche" },
  { nom: "Alibaba Cloud", note: "Informatique en nuage" },
  { nom: "Sinovation", note: "Investissement et modèles" },
];

function Filiation() {
  const { ref, seen, anim } = useInView<HTMLDivElement>();
  const W = 780;
  const H = 424;
  const rootX = 214;
  const rootY = H / 2;
  const nodeX = 452;
  const top = 26;
  const step = (H - top * 2) / (HERITIERS.length - 1);

  return (
    <div className={styles.wrap} ref={ref}>
      <span className={styles.eyebrow}>Novembre 1998 · Pékin</span>
      <h3 className={styles.vizTitle}>
        Ce qu&rsquo;un laboratoire <em>a produit</em>
      </h3>
      <p className={styles.standfirst}>
        Six personnes dans une poignée de bureaux. Un quart de siècle plus tard,
        la quasi-totalité des directions techniques qui comptent dans
        l&rsquo;intelligence artificielle chinoise sont passées par là.
      </p>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", minWidth: 620, overflow: "visible" }}
          role="img"
          aria-label="Arbre de filiation du laboratoire Microsoft de Pékin vers sept organisations chinoises"
        >
          <defs>
            <linearGradient id="vf-branche" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={OR} stopOpacity="0.85" />
              <stop offset="55%" stopColor="#5A5A52" stopOpacity="0.7" />
              <stop offset="100%" stopColor={BLEU} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Racine */}
          <rect
            x="10"
            y={rootY - 46}
            width={rootX - 10}
            height="92"
            fill="none"
            stroke={OR}
            strokeWidth="1.5"
          />
          <text
            x="26"
            y={rootY - 22}
            fontFamily="'DM Mono',monospace"
            fontSize="8.5"
            letterSpacing="2"
            fill={OR}
          >
            MICROSOFT RESEARCH ASIA
          </text>
          <text
            x="26"
            y={rootY + 2}
            fontFamily="'Playfair Display',Georgia,serif"
            fontSize="21"
            fontWeight="700"
            fill="#111"
          >
            Pékin, 1998
          </text>
          <text
            x="26"
            y={rootY + 24}
            fontFamily="'DM Mono',monospace"
            fontSize="9"
            letterSpacing="0.6"
            fill="#8A857D"
          >
            Six personnes · Kai-Fu Lee
          </text>

          {/* Branches */}
          {HERITIERS.map((h, i) => {
            const y = top + i * step;
            const c1 = rootX + 96;
            const c2 = nodeX - 96;
            const d = `M${rootX},${rootY} C${c1},${rootY} ${c2},${y} ${nodeX - 12},${y}`;
            return (
              <path
                key={h.nom}
                d={d}
                fill="none"
                stroke="url(#vf-branche)"
                strokeWidth="1.4"
                strokeDasharray="420"
                strokeDashoffset={seen && !anim ? undefined : 420}
              >
                {anim && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="420"
                    to="0"
                    dur="1.5s"
                    begin={`${i * 0.13}s`}
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.32 0 0.16 1"
                  />
                )}
              </path>
            );
          })}

          {/* Nœuds */}
          {HERITIERS.map((h, i) => {
            const y = top + i * step;
            return (
              <g key={h.nom} opacity={seen && !anim ? undefined : 0}>
                {anim && (
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.5s"
                    begin={`${0.7 + i * 0.13}s`}
                    fill="freeze"
                  />
                )}
                <circle cx={nodeX - 6} cy={y} r="3.2" fill={BLEU} />
                <text
                  x={nodeX + 10}
                  y={y - 2}
                  fontFamily="'Playfair Display',Georgia,serif"
                  fontSize="15.5"
                  fontWeight="700"
                  fill="#111"
                >
                  {h.nom}
                </text>
                <text
                  x={nodeX + 10}
                  y={y + 13}
                  fontFamily="'DM Mono',monospace"
                  fontSize="8.5"
                  letterSpacing="1.4"
                  fill="#9A9590"
                >
                  {h.note.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className={styles.source}>
        Microsoft, communiqué d&rsquo;ouverture du laboratoire, novembre 1998 ·
        CommonWealth Magazine, mai 2024, d&rsquo;après une enquête du New York
        Times, janvier 2024
      </p>
    </div>
  );
}

/* ══ 2. LA COURBE DE RATTRAPAGE ═══════════════════════════════════
   L'écart mesuré entre le meilleur modèle américain et le meilleur
   modèle chinois. La bande de 2023 rend visible la dispersion selon
   les tests, que le point unique masquerait.                      */

const MESURES = [
  { t: 2024.04, v: 9.3, label: "JANV. 2024" },
  { t: 2025.12, v: 1.7, label: "FÉVR. 2025" },
  { t: 2026.2, v: 2.7, label: "MARS 2026" },
];

function Rattrapage() {
  const { ref, seen, anim } = useInView<HTMLDivElement>();
  const W = 780;
  const H = 316;
  const m = { t: 26, r: 108, b: 44, l: 46 };
  const iW = W - m.l - m.r;
  const iH = H - m.t - m.b;
  const XMIN = 2023.1;
  const XMAX = 2026.55;
  const YMAX = 34;

  const xs = (t: number) => m.l + ((t - XMIN) / (XMAX - XMIN)) * iW;
  const ys = (v: number) => m.t + iH - (v / YMAX) * iH;

  const bande = { t: 2023.37, lo: 17.5, hi: 31.6 };
  const pts = MESURES.map((p) => ({ x: xs(p.t), y: ys(p.v) }));
  const ligne = `M${pts[0].x},${pts[0].y} C${pts[0].x + 78},${pts[0].y} ${
    pts[1].x - 78
  },${pts[1].y} ${pts[1].x},${pts[1].y} C${pts[1].x + 32},${pts[1].y} ${
    pts[2].x - 32
  },${pts[2].y} ${pts[2].x},${pts[2].y}`;

  return (
    <div className={styles.wrap} ref={ref}>
      <span className={styles.eyebrow}>2023 — 2026 · Écart de performance</span>
      <h3 className={styles.vizTitle}>
        La distance qui <em>s&rsquo;efface</em>
      </h3>
      <p className={styles.standfirst}>
        Écart mesuré entre le meilleur modèle américain et le meilleur modèle
        chinois sur les tests de référence. En 2023, la dispersion selon les
        épreuves allait de dix-sept à trente et un points. Trois ans plus tard,
        elle tient dans la marge d&rsquo;erreur.
      </p>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: OR }} />
          Dispersion 2023 selon les tests
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: BLEU }} />
          Écart mesuré
        </span>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", minWidth: 600, overflow: "visible" }}
          role="img"
          aria-label="Courbe de l'écart de performance entre modèles américains et chinois, de plus de dix-sept points en 2023 à 2,7 % en 2026"
        >
          <defs>
            <linearGradient id="vf-aire" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={BLEU} stopOpacity="0.13" />
              <stop offset="100%" stopColor={BLEU} stopOpacity="0" />
            </linearGradient>
            <clipPath id="vf-clip">
              <rect
                x={m.l - 4}
                y={m.t - 14}
                height={iH + 28}
                width={seen && !anim ? iW + m.r : 0}
              >
                {anim && (
                  <animate
                    attributeName="width"
                    from="0"
                    to={String(iW + m.r)}
                    dur="2s"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.36 0 0.18 1"
                  />
                )}
              </rect>
            </clipPath>
          </defs>

          {/* Grille */}
          {[0, 5, 10, 15, 20, 25, 30].map((v) => (
            <g key={v}>
              <line
                x1={m.l}
                x2={m.l + iW}
                y1={ys(v)}
                y2={ys(v)}
                stroke={v === 0 ? "#B9B4AB" : "#E8E4DC"}
                strokeWidth="1"
                strokeDasharray={v === 0 ? "none" : "3 5"}
              />
              <text
                x={m.l - 7}
                y={ys(v) + 3.4}
                textAnchor="end"
                fontFamily="'DM Mono',monospace"
                fontSize="9"
                fill={v === 0 ? "#8A857D" : "#C4BFB6"}
              >
                {v}
              </text>
            </g>
          ))}
          <text
            x={m.l - 7}
            y={m.t - 10}
            textAnchor="end"
            fontFamily="'DM Mono',monospace"
            fontSize="8"
            letterSpacing="1"
            fill="#9A9590"
          >
            PTS
          </text>

          {/* Années */}
          {[2023, 2024, 2025, 2026].map((yr) => (
            <text
              key={yr}
              x={xs(yr + 0.5)}
              y={H - m.b + 18}
              textAnchor="middle"
              fontFamily="'DM Mono',monospace"
              fontSize="9"
              letterSpacing="0.8"
              fill="#9A9590"
            >
              {yr}
            </text>
          ))}

          {/* Bande de dispersion 2023 */}
          <rect
            x={xs(bande.t) - 11}
            y={ys(bande.hi)}
            width="22"
            height={ys(bande.lo) - ys(bande.hi)}
            fill={OR}
            fillOpacity="0.16"
            stroke={OR}
            strokeWidth="1.2"
          />
          <text
            x={xs(bande.t) + 20}
            y={ys(bande.hi) + 4}
            fontFamily="'DM Mono',monospace"
            fontSize="9.5"
            fill={OR}
          >
            31,6
          </text>
          <text
            x={xs(bande.t) + 20}
            y={ys(bande.lo) + 4}
            fontFamily="'DM Mono',monospace"
            fontSize="9.5"
            fill={OR}
          >
            17,5
          </text>
          <text
            x={xs(bande.t)}
            y={ys(bande.hi) - 12}
            textAnchor="middle"
            fontFamily="'DM Mono',monospace"
            fontSize="8"
            letterSpacing="1.4"
            fill={OR}
          >
            MAI 2023
          </text>

          <g clipPath="url(#vf-clip)">
            {/* Raccord approximatif entre la bande et la première mesure */}
            <path
              d={`M${xs(bande.t) + 11},${ys((bande.lo + bande.hi) / 2)} L${
                pts[0].x
              },${pts[0].y}`}
              stroke="#B9B4AB"
              strokeWidth="1"
              strokeDasharray="2 4"
              fill="none"
            />
            <path
              d={`${ligne} L${pts[2].x},${ys(0)} L${pts[0].x},${ys(0)} Z`}
              fill="url(#vf-aire)"
            />
            <path d={ligne} fill="none" stroke={BLEU} strokeWidth="2" />
            {MESURES.map((p, i) => (
              <g key={p.label}>
                <circle cx={pts[i].x} cy={pts[i].y} r="4" fill="#F9F7F3" stroke={BLEU} strokeWidth="2" />
                <text
                  x={pts[i].x}
                  y={pts[i].y - 14}
                  textAnchor="middle"
                  fontFamily="'DM Mono',monospace"
                  fontSize="11"
                  fontWeight="500"
                  fill={BLEU}
                >
                  {String(p.v).replace(".", ",")}
                </text>
                <text
                  x={pts[i].x}
                  y={H - m.b + 32}
                  textAnchor="middle"
                  fontFamily="'DM Mono',monospace"
                  fontSize="7.5"
                  letterSpacing="1.1"
                  fill="#B0ABA2"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </g>

          {/* Annotation de bascule */}
          <line
            x1={pts[1].x}
            x2={pts[1].x}
            y1={pts[1].y + 10}
            y2={ys(0) - 4}
            stroke={BLEU}
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity="0.5"
          />
          <text
            x={pts[1].x + 8}
            y={ys(0) - 26}
            fontFamily="'DM Mono',monospace"
            fontSize="8"
            letterSpacing="1.2"
            fill="#6B7280"
          >
            UN MODÈLE CHINOIS REJOINT
          </text>
          <text
            x={pts[1].x + 8}
            y={ys(0) - 15}
            fontFamily="'DM Mono',monospace"
            fontSize="8"
            letterSpacing="1.2"
            fill="#6B7280"
          >
            LE MEILLEUR SYSTÈME AMÉRICAIN
          </text>

          {/* Repère final */}
          <text
            x={m.l + iW + 12}
            y={ys(2.7) + 4}
            fontFamily="'DM Mono',monospace"
            fontSize="9"
            letterSpacing="1.2"
            fill={BLEU}
          >
            2,7 %
          </text>
        </svg>
      </div>

      <p className={styles.source}>
        Stanford Institute for Human-Centered Artificial Intelligence, AI Index
        Report 2026 · dispersion 2023 mesurée sur MMLU, MMMU, MATH et HumanEval
      </p>
    </div>
  );
}

/* ══ 3. L'ASYMÉTRIE ═══════════════════════════════════════════════
   Mille carrés pour la capacité mondiale de centres de données.
   Six sont verts. C'est toute la part du continent, et c'est le sol
   dans lequel la graine offerte est censée pousser.               */

function Asymetrie() {
  const { ref, seen, anim } = useInView<HTMLDivElement>();
  const total = 1000;
  const allumes = 6;

  return (
    <div className={styles.wrap} ref={ref}>
      <span className={styles.eyebrow}>Le sol sous la graine</span>
      <h3 className={styles.vizTitle}>
        Mille carrés, <em>six pour l&rsquo;Afrique</em>
      </h3>
      <p className={styles.standfirst}>
        Chaque carré vaut un millième de la capacité mondiale de centres de
        données. La part hébergée sur le continent africain tient dans les six
        carrés verts, quand le modèle offert à Shanghai en compte deux mille
        huit cents milliards de paramètres.
      </p>

      <div className={styles.gridWrap}>
        <div className={styles.dotGrid} aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i < allumes && seen ? styles.dotOn : ""}`}
              style={
                i < allumes && anim
                  ? { transition: "background-color .5s ease", transitionDelay: `${i * 90}ms` }
                  : undefined
              }
            />
          ))}
        </div>
        <div className={styles.gridNote}>
          <p>
            Télécharger un modèle ne fournit ni les processeurs qui l&rsquo;ont
            entraîné, ni l&rsquo;électricité qui le fait tourner.
          </p>
          <p>
            <strong>360 MW</strong> en service sur le continent,{" "}
            <strong>238 MW</strong> en construction, <strong>656 MW</strong>{" "}
            planifiés.
          </p>
          <p>
            Certaines régions comptent jusqu&rsquo;à <strong>33</strong> coupures
            de courant par mois, quand un centre de données vise une
            disponibilité de 99,99 %.
          </p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>0,6 %</span>
          <span className={styles.statLabel}>
            De la capacité mondiale de centres de données
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>2 800 Md</span>
          <span className={styles.statLabel}>
            Paramètres du modèle ouvert présenté à Shanghai
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>5 000</span>
          <span className={styles.statLabel}>
            Places de formation promises sur cinq ans, tout le Sud confondu
          </span>
        </div>
      </div>

      <p className={styles.source}>
        Africa Data Centres Association, rapport économique 2026 · Moonshot AI et
        South China Morning Post, juillet 2026 · discours d&rsquo;ouverture de la
        World Artificial Intelligence Conference, Shanghai, 17 juillet 2026
      </p>
    </div>
  );
}

export { Filiation, Rattrapage, Asymetrie };
