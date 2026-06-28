import { createClient } from "../../../lib/supabase-server"
import GrandFormatLayout from "../../../components/GrandFormatLayout"
import CycleClimAnim from "./anims/CycleClimAnim"
import ParadoxeAnim from "./anims/ParadoxeAnim"
import ParcMondialAnim from "./anims/ParcMondialAnim"
import IlotChaleurAnim from "./anims/IlotChaleurAnim"
import "./climatisation.css"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "La chaleur déplacée",
  description: "La climatisation ne fabrique pas de froid : elle déplace de la chaleur, d'une pièce vers la rue, en consommant de l'électricité pour le faire. Anodin dans un salon, ce geste devient un fait énergétique majeur quand des milliards d'appareils s'y mettent en même temps.",
  alternates: { canonical: 'https://soara.fr/grands-formats/climatisation' },
}

// ── Styles partagés (tokens du site : Playfair, Source Serif, DM Mono) ──
const eyebrow: React.CSSProperties = {
  fontFamily: "'DM Mono', ui-monospace, monospace",
  fontSize: '10px',
  fontWeight: 500,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: '#B91C1C',
  marginBottom: '14px',
  display: 'block',
}

const partLabel: React.CSSProperties = {
  fontFamily: "'DM Mono', ui-monospace, monospace",
  fontSize: '10px',
  fontWeight: 500,
  letterSpacing: '0.30em',
  textTransform: 'uppercase',
  color: '#C8A96E',
  textAlign: 'center',
  margin: '72px 0 36px',
  paddingTop: '24px',
  borderTop: '1px solid #DDD9D2',
}

const leadStyle: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 'clamp(20px, 2vw, 24px)',
  fontStyle: 'italic',
  fontWeight: 400,
  lineHeight: 1.5,
  color: '#1a1a1a',
  margin: '28px 0 28px',
}

const chapoOpener: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 'clamp(19px, 1.8vw, 22px)',
  fontStyle: 'italic',
  fontWeight: 400,
  lineHeight: 1.55,
  color: '#3D3D3D',
  margin: '0 0 44px',
  paddingBottom: '32px',
  borderBottom: '1px solid #DDD9D2',
}

const animPlaceholder: React.CSSProperties = {
  margin: '40px 0',
  padding: '28px 24px',
  background: '#F7F4EF',
  border: '1px dashed #C8A96E',
  borderRadius: '4px',
  fontFamily: "'DM Mono', ui-monospace, monospace",
  fontSize: '12px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#8a7f72',
  textAlign: 'center',
}

export default async function ClimatisationPage() {
  // Accès libre : pas de paywall, quel que soit l'utilisateur.
  const supabase = createClient()
  await supabase.auth.getUser()

  return (
    <GrandFormatLayout
      slug="climatisation"
      showPaywall={false}
      author="Steve Moradel"
      authorRole=""
    >
      <div className="soara-article">

        {/* ── OUVERTURE : CHAPO comme intro lyrique du corps ── */}
        <p style={chapoOpener}>
          Les étés s'allongent, les nuits refroidissent de moins en moins, et partout le même geste gagne du terrain : appuyer sur une télécommande pour rafraîchir l'air. En une génération, la climatisation est passée du luxe à l'équipement courant. Derrière ce geste simple se joue une mécanique qu'on voit rarement : d'où vient ce frais, et où part la chaleur.
        </p>

        {/* ── CHAPITRE I · LA MACHINE ── */}
        <span style={eyebrow}>Chapitre I</span>
        <h2>La machine</h2>

        <p style={leadStyle}>
          La climatisation ne fabrique pas de froid : elle déplace de la chaleur, d'une pièce vers la rue, en consommant de l'électricité pour le faire. Anodin dans un salon, ce geste devient un fait énergétique majeur quand des milliards d'appareils s'y mettent en même temps. Avant d'en mesurer le prix, voici comment la machine s'y prend.
        </p>

        <CycleClimAnim />

        {/* ── CHAPITRE II · LE PARADOXE (section sombre full-bleed) ── */}
        <section className="clim-dark">
          <span className="clim-dark-eyebrow">Chapitre II</span>
          <h2>Dehors, on rejette plus de chaleur qu'on n'en a retiré dedans.</h2>

          <p>L'électricité consommée par le compresseur ne disparaît pas : elle finit elle aussi en chaleur, ajoutée à celle de la pièce. Le bloc extérieur évacue donc la somme des deux. C'est une loi de conservation, pas une opinion. À l'échelle d'une ville entière qui climatise, cette chaleur supplémentaire s'accumule dans la rue.</p>

          <ParadoxeAnim />
        </section>

        {/* ── PARTIE : LES ENJEUX ── */}
        <div style={partLabel}>Les enjeux</div>

        {/* ── CHAPITRE III · LE MONDE QUI CLIMATISE ── */}
        <span style={eyebrow}>Chapitre III</span>
        <h2>Un geste individuel devenu un fait énergétique mondial.</h2>

        <p>Climatiseurs et ventilateurs représentent aujourd'hui environ un cinquième de l'électricité consommée par les bâtiments dans le monde, soit près de 10 % de toute l'électricité mondiale. Le refroidissement est devenu le poste de demande énergétique des bâtiments qui croît le plus vite.</p>

        <p>Le parc mondial de climatiseurs passerait de 1,6 milliard d'unités aujourd'hui à 5,6 milliards en 2050, soit l'équivalent de dix appareils vendus chaque seconde pendant trente ans. La demande d'énergie pour le refroidissement pourrait tripler. Plus de 80 % de cette croissance viendra des pays émergents, là où la chaleur est la plus dure et l'accès encore rare.</p>

        <ParcMondialAnim />

        {/* ── CHAPITRE IV · LA VILLE QUI CHAUFFE ── */}
        <span style={eyebrow}>Chapitre IV</span>
        <h2>La ville qui chauffe.</h2>

        <p>La chaleur rejetée par les blocs extérieurs s'ajoute à l'effet d'îlot de chaleur urbain, surtout la nuit, au moment où le corps a le plus besoin de récupérer. Une simulation de Météo-France et du CNRS, pour une canicule de type 2003 à Paris, estime que si tous les bâtiments climatisaient pour maintenir 23 °C, l'air extérieur nocturne pourrait monter de jusqu'à 2,4 °C, et jusqu'à 3,6 °C lors d'une canicule plus extrême.</p>

        <p>Les fluides frigorigènes les plus répandus sont de puissants gaz à effet de serre en cas de fuite. Leur impact se mesure en PRG (Potentiel de Réchauffement Global) : combien de fois un kilo de fluide réchauffe le climat par rapport à un kilo de CO₂. Le règlement européen F-Gas (UE 2024/573) organise leur disparition progressive au profit de fluides à très faible PRG.</p>

        <IlotChaleurAnim />

        {/* ── PARTIE : UNE AUTRE VOIE ── */}
        <div style={partLabel}>Une autre voie</div>

        {/* ── CHAPITRE V · L'AUTRE INTELLIGENCE ── */}
        <span style={eyebrow}>Chapitre V</span>
        <h2>La première intelligence n'est pas artificielle.</h2>

        <p style={leadStyle}>
          Avant la climatisation, dans certaines des régions les plus chaudes du monde, on a longtemps su construire des bâtiments qui restaient frais sans la moindre machine. Pas par nostalgie, mais par nécessité, et avec une précision qui étonne encore les ingénieurs.
        </p>

        <p>En Iran, les tours à vent, les bâdgirs, captent le moindre souffle d'air en hauteur et le font descendre vers les pièces du bas. Quand cet air passe au-dessus d'un bassin ou d'un canal, il se rafraîchit encore par évaporation. La ville de Yazd, en plein désert, en compte tant qu'on la surnomme la ville des tours à vent, le tout sans un watt d'électricité. Des études estiment que ces dispositifs abaissent la température intérieure de plusieurs degrés, parfois d'une dizaine.</p>

        <p>Les mêmes bâtisseurs allaient plus loin. Avec les yakhchāl, de grands dômes de terre aux murs très épais reliés à des canaux souterrains, les qanats, ils fabriquaient et conservaient de la glace en plein désert, l'hiver, sans aucun combustible. De l'air, de la terre, de l'eau et la fraîcheur des nuits claires suffisaient.</p>

        <p>Ce savoir n'est pas qu'un vestige. Des architectes le réactivent. À Harare, au Zimbabwe, l'Eastgate Centre s'inspire des termitières pour se ventiler seul : il consomme environ un tiers d'énergie de moins que des immeubles équivalents climatisés, et a même coûté moins cher à bâtir, sans climatisation classique. Avant la machine, il existe tout un répertoire : l'orientation des façades, l'inertie des murs, les couleurs claires, l'ombre des cours intérieures, la ventilation de la nuit.</p>

        <p>D'où une question simple. Le réflexe dominant est d'équiper un à un les logements, les bureaux, les écoles, ce qui revient à pousser la chaleur dehors et à réchauffer la ville. Une autre voie consisterait à repenser et à rénover le bâti lui-même pour qu'il reste frais par sa forme, avant d'allumer un appareil. Cette voie a ses limites : sous une chaleur humide ou lors des pics extrêmes, la climatisation reste parfois nécessaire, en particulier pour les plus fragiles. Ce n'est donc pas l'un contre l'autre. Mais à l'heure où l'on parle de villes intelligentes et d'intelligence artificielle, la première intelligence est peut-être la plus ancienne : celle d'un bâtiment qui sait, par lui-même, tenir la chaleur à distance.</p>

        <div style={animPlaceholder}>[ Illustration canvas, tour à vent (bâdgir), Phase 3 ]</div>

        {/* ── PARTIE : CE QU'IL FAUT RETENIR ── */}
        <div style={partLabel}>Ce qu'il faut retenir</div>

        {/* ── CHAPITRE VI · LE FROID N'EXISTE PAS ── */}
        <span style={eyebrow}>Chapitre VI</span>
        <h2>Le froid n'existe pas. Il n'y a que de la chaleur déplacée, et le coût de l'avoir déplacée.</h2>

        <p style={leadStyle}>
          Comprendre la climatisation, c'est comprendre qu'elle ne supprime rien : elle transfère un problème de l'intérieur vers l'extérieur, en y ajoutant sa propre consommation. La question n'est plus de savoir si elle fonctionne, mais à quel prix collectif, sur le réseau, dans la rue et dans l'atmosphère. L'efficacité des appareils, leur fluide et la sobriété d'usage décideront de l'ampleur de l'addition.
        </p>

        {/* ── SOURCES ── */}
        <div style={{ marginTop: '56px', paddingTop: '24px', borderTop: '2px solid #DDD9D2' }}>
          <div style={{
            fontFamily: "'DM Mono', ui-monospace, monospace",
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#8a7f72',
            marginBottom: '16px',
          }}>Sources</div>
          <p style={{ fontSize: '14px', color: '#4a4540', lineHeight: 1.65, marginBottom: '10px' }}>
            <strong>Agence internationale de l'énergie (AIE)</strong> : <em>The Future of Cooling</em> (2018) ; <em>World Energy Outlook</em> 2024 ; <em>Space Cooling</em> ; <em>Staying cool without overheating the energy system</em> (2025).
          </p>
          <p style={{ fontSize: '14px', color: '#4a4540', lineHeight: 1.65, marginBottom: '10px' }}>
            <strong>Météo-France &amp; CNRS</strong> : simulations de l'impact de la climatisation sur la température extérieure parisienne lors d'une canicule de type 2003.
          </p>
          <p style={{ fontSize: '14px', color: '#4a4540', lineHeight: 1.65, marginBottom: '10px' }}>
            <strong>Institut Paris Région / Géoconfluences</strong> : effet d'îlot de chaleur urbain, écarts ville-campagne jusqu'à 10 °C en canicule.
          </p>
          <p style={{ fontSize: '14px', color: '#4a4540', lineHeight: 1.65, marginBottom: '10px' }}>
            <strong>Union européenne</strong> : règlement (UE) 2024/573 du 7 février 2024 relatif aux gaz à effet de serre fluorés (F-Gas).
          </p>
          <p style={{ fontSize: '14px', color: '#4a4540', lineHeight: 1.65, marginBottom: '10px' }}>
            <strong>Our World in Data</strong> : la climatisation représente environ 3 % des émissions mondiales de gaz à effet de serre (Ritchie, 2024).
          </p>
          <p style={{ fontSize: '14px', color: '#4a4540', lineHeight: 1.65, marginBottom: '10px' }}>
            <strong>Architecture vernaculaire</strong> : tours à vent (bâdgir), yakhchāl et qanats, rafraîchissement passif en climat désertique (Encyclopaedia Iranica ; travaux sur le windcatcher iranien).
          </p>
          <p style={{ fontSize: '14px', color: '#4a4540', lineHeight: 1.65, marginBottom: '10px' }}>
            <strong>Eastgate Centre, Harare</strong> : Mick Pearce, ingénierie Arup (1996), ventilation et rafraîchissement passifs inspirés des termitières, environ un tiers d'énergie en moins.
          </p>
          <p style={{ fontSize: '14px', color: '#4a4540', lineHeight: 1.65, marginBottom: 0 }}>
            <strong>Principes thermodynamiques</strong> : cycle frigorifique à compression (compresseur, condenseur, détendeur, évaporateur), conservation de l'énergie.
          </p>
        </div>

      </div>
    </GrandFormatLayout>
  )
}
