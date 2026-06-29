// @ts-nocheck
import { C } from '../data'
import FactBlock from '../parts/FactBlock'

/* ═══════════════════════════════════════════════════
    VI — LA DÉPENDANCE
    ═══════════════════════════════════════════════════ */
export default function Dependance({ sectionRef, revealed }) {
  return (
    <section
      ref={sectionRef}
      data-id="dependance"
      style={{
        padding: '80px 24px 80px',
        maxWidth: 1200,
        margin: '0 auto',
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: C.dim,
        marginBottom: 20,
      }}>
        Mouvement VI · La dépendance
      </div>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 400,
        fontSize: 'clamp(30px, 4.5vw, 56px)',
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
        margin: 0,
        marginBottom: 44,
        maxWidth: 900,
      }}>
        Ce que Rosatom produit, <em style={{ color: C.accent }}>l'Occident l'achète.</em>
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 28,
        marginBottom: 48,
      }}>
        <FactBlock target={25} suffix=" %"
          label="de l'enrichissement des réacteurs américains provenait encore de Russie en 2024"
          source="National Interest, déc. 2025"
          trigger={revealed} />
        <FactBlock target={700} suffix=" M€"
          label="dépensés par les utilities européennes en combustible russe en 2024"
          source="Bruegel, 2025"
          trigger={revealed}
          accent />
        <FactBlock target={10} suffix=" ans"
          label="pour qu'une nouvelle installation d'enrichissement atteigne sa pleine capacité"
          source="Centrus, 10-K 2026"
          trigger={revealed} />
      </div>

      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(19px, 2.3vw, 26px)',
        lineHeight: 1.45,
        fontWeight: 400,
        color: C.text,
        margin: 0,
        marginBottom: 32,
        fontStyle: 'italic',
        maxWidth: 820,
        paddingTop: 32,
        borderTop: `1px solid ${C.line}`,
      }}>
        La souveraineté énergétique européenne ne se joue pas seulement
        dans les gazoducs. Elle se joue aussi dans la quantité d'uranium 235
        que Moscou consent à séparer pour Paris, Bruxelles et Washington.
      </p>

      <p style={{
        fontSize: 'clamp(15px, 1.5vw, 17px)',
        lineHeight: 1.6,
        color: C.dim,
        fontWeight: 300,
        margin: 0,
        maxWidth: 720,
      }}>
        Urenco, Orano et Centrus étendent leurs capacités. Le département
        de l'Énergie américain a engagé 3,4 milliards de dollars en contrats
        de long terme. Ces investissements ne porteront leurs fruits qu'à
        la fin de la décennie. D'ici là, la cascade du monde reste russe.
      </p>
    </section>
  )
}
