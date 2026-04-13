import GrandFormatLayout from "../../../components/GrandFormatLayout"

export const metadata = {
  title: "Terres rares : la guerre invisible — Soara",
  description: "Du cobalt du Katanga au raffinage de Guangdong, une analyse des flux qui alimentent la transition verte — et la nouvelle géographie de la dépendance mondiale.",
}

export default function TerresRaresPage() {
  return (
    <GrandFormatLayout
      slug="terres-rares"
      author="La rédaction"
      authorRole=""
    >
      <div className="soara-article">

        <p>Le cobalt qui alimente la batterie de votre voiture électrique a toutes les chances de venir du Katanga. Dans cette province du sud-est de la République démocratique du Congo, des enfants creusent à mains nues dans des galeries de fortune. Ils s'appellent des <em>creuseurs artisanaux</em>. Derrière eux, une chaîne logistique parfaitement huilée achemine le minerai vers des comptoirs tenus majoritairement par des sociétés chinoises, puis vers les fonderies de Guangdong, puis vers les usines de batteries de Shenzhen, puis vers les véhicules électriques vendus comme symboles d'un avenir propre. La transition verte repose sur une extraction qui en nie tous les principes. C'est la contradiction fondamentale de notre époque.</p>

        <p>Les terres rares ne sont pas, à proprement parler, des raretés géologiques. Le cérium est plus abondant dans la croûte terrestre que le cuivre. Le néodyme, l'yttrium, le lanthane se trouvent sur tous les continents. Ce qui est rare, c'est leur concentration en gisements exploitables, et surtout la capacité industrielle à les raffiner. C'est là que commence la géopolitique.</p>

        <h2>I. La géographie du sous-sol</h2>

        <p>Trois zones concentrent l'essentiel des ressources stratégiques nécessaires à la transition énergétique. Le cobalt et le coltan au Congo. Le lithium dans le triangle formé par le Chili, la Bolivie et l'Argentine. Les terres rares au sens strict, celles utilisées dans les aimants permanents des éoliennes et des moteurs électriques, principalement en Chine, en Australie et en Russie.</p>

        <p>Le Congo représente plus de 70% de la production mondiale de cobalt. Ce chiffre suffit à mesurer la fragilité du système. Un pays dont le PIB par habitant stagne sous les 600 dollars, dont l'est du territoire est en guerre chronique depuis trente ans, dont les institutions minières sont gangrenées par la corruption, tient dans son sous-sol une clé de la décarbonation planétaire. Les multinationales occidentales ont longtemps feint de l'ignorer. Les entreprises chinoises, elles, ont racheté les concessions minières congolaises à partir des années 2000, méthodiquement, sans état d'âme.</p>

        <p>En Amérique du Sud, le "triangle du lithium" concentre plus de la moitié des réserves mondiales connues. Le lithium est l'élément central des batteries Li-ion. La Bolivie en possède les plus grandes réserves théoriques, mais son exploitation reste embryonnaire, coincée entre les ambitions nationalisatrices de gouvernements successifs et l'absence d'infrastructure industrielle. Le Chili extrait, l'Argentine suit. Et dans les deux cas, Pékin a pris position.</p>

        {/* VISUALISATION INTERACTIVE */}
        <figure style={{ margin: "56px -40px" }}>
          <div style={{ background: "#06090f", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
              Soara Atlas · Visualisation interactive
            </span>
          </div>
          <iframe
            src="/visuels/terres-rares.html"
            style={{ width: "100%", height: "620px", border: "none", display: "block" }}
            title="Terres rares : flux mondiaux et géopolitique des ressources critiques"
            loading="lazy"
          />
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            Flux mondiaux des terres rares — de l'extraction au raffinage. Sources : IEA Critical Minerals Report 2024 · USGS · Soara.
          </figcaption>
        </figure>

        <h2>II. Le verrou chinois</h2>

        <p>La Chine ne domine pas seulement l'extraction. Elle contrôle la transformation. C'est une distinction que les Occidentaux ont mis des décennies à comprendre, souvent trop tard.</p>

        <p>Aujourd'hui, plus de 85% du raffinage mondial des terres rares s'effectue en Chine. Pour certains matériaux critiques comme le graphite naturel utilisé dans les anodes de batteries, la part dépasse 90%. Même les minerais australiens ou africains finissent par transiter par les fonderies chinoises faute d'alternative. Pékin a construit cette position sur trente ans d'investissements massifs, de subventions industrielles et d'une tolérance délibérée aux externalités environnementales que les démocraties libérales ne pouvaient pas se permettre politiquement.</p>

        <p>En juillet 2023, la Chine a annoncé des restrictions à l'exportation de gallium et de germanium, deux métaux critiques pour les semi-conducteurs et l'optique militaire. En octobre de la même année, c'est au tour du graphite. Ces décisions ne sont pas des accidents. Elles constituent une démonstration de force calculée : Pékin signifie à Washington et à Bruxelles qu'il dispose d'un levier de pression considérable, et qu'il n'hésitera pas à l'utiliser si la guerre technologique s'intensifie.</p>

        <div className="pull-quote">
          <p>
            "La Chine représente 85% du raffinage mondial des terres rares. Ce n'est pas une domination naturelle — c'est le résultat de trente ans de stratégie industrielle délibérée."
            <br /><span style={{ fontSize: "13px", fontStyle: "normal", opacity: 0.9, color: "#8a7f72" }}>Soara · World Inequality in Minerals Report, IEA 2024</span>
          </p>
        </div>

        <h2>III. Le réveil tardif de l'Occident</h2>

        <p>L'Europe a mis du temps à nommer le problème. Pendant deux décennies, la dépendance aux matières premières chinoises était absorbée dans la rhétorique du libre-échange et de l'interdépendance bénéfique. La pandémie de Covid-19, puis la guerre en Ukraine, ont brisé cette illusion. Quand les chaînes d'approvisionnement se sont grippées, les capitales européennes ont découvert avec stupeur leur vulnérabilité structurelle.</p>

        <p>Le Critical Raw Materials Act, adopté par l'Union européenne en 2024, fixe des objectifs ambitieux : extraire 10% des matériaux critiques sur le sol européen d'ici 2030, en transformer 40%, et limiter à 65% la dépendance envers un seul pays tiers pour chaque matériau. Les objectifs sont clairs. Les moyens, nettement moins. Rouvrir des mines en Europe se heurte à des délais d'autorisation de dix à quinze ans, à une opposition locale quasi systématique et à des coûts de production sans commune mesure avec les standards chinois.</p>

        <p>Les États-Unis ont emprunté une autre voie avec l'Inflation Reduction Act : des subventions massives pour reconstruire une filière nationale, conditionnées à l'origine des matériaux. L'objectif est de contourner la dépendance chinoise par la force budgétaire. Résultat : une guerre de subventions transatlantique qui fragilise davantage une alliance censée faire front commun.</p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        <h2>IV. Ce que ça annonce</h2>

        <p>La bataille des terres rares n'est pas un épisode transitoire. Elle est structurelle et s'inscrira dans la décennie à venir comme l'un des axes majeurs de la rivalité entre grandes puissances.</p>

        <p>Plusieurs dynamiques sont à l'œuvre simultanément. La demande en matériaux critiques va tripler d'ici 2030 selon l'Agence internationale de l'énergie, portée par les véhicules électriques, les éoliennes offshore et les réseaux électriques intelligents. Les pays du Sud global, qui détiennent les réserves, commencent à refuser le rôle de simples fournisseurs de matières premières brutes. L'Indonésie a interdit l'exportation de nickel non transformé en 2020. La Zambie réfléchit à en faire autant pour le cuivre. Le Zimbabwe a suspendu les exportations de lithium brut en 2023.</p>

        <p>Ce nationalisme des ressources n'est pas irrationnel. C'est la revendication d'une souveraineté économique longtemps confisquée. Mais il complique considérablement les plans de transition énergétique des pays consommateurs, qui découvrent que le monde multipolaire qu'ils ont contribué à affaiblir est désormais capable de leur dicter ses conditions.</p>

        <p>La transition verte était censée émanciper les économies des énergies fossiles et, par extension, de leurs zones de production instables. Elle a créé une nouvelle dépendance, différente dans sa géographie, comparable dans sa logique. Hier le pétrole du Golfe, aujourd'hui le cobalt du Katanga et le lithium des Andes. Les ressources changent. La structure de pouvoir qu'elles génèrent, elle, reste remarquablement constante.</p>

      </div>
    </GrandFormatLayout>
  )
}
