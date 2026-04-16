import fs from 'fs'
import nodePath from 'path'
import { createClient } from "../../../lib/supabase-server"
import GrandFormatLayout from "../../../components/GrandFormatLayout";

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "La fabrique de l'impossible, Soara",
  description: "Quatre-vingt ans de Skunk Works : du cirque de Burbank à la détection d'un battement de cœur dans le désert iranien.",
};

export default async function Page({ searchParams }: { searchParams?: { lang?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'steve.moradel@gmail.com'
  let isSubscribed = false
  if (user && !isAdmin) {
    const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single()
    isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
  }
  const showPaywall = !isAdmin && !isSubscribed
  const lang = searchParams?.lang === 'en' ? 'en' : 'fr'
  const toggleUrl = lang === 'en' ? `/grands-formats/skunkworks` : `/grands-formats/skunkworks?lang=en`
  const enPath = nodePath.join(process.cwd(), 'lib', 'content', 'skunkworks-en.html')
  let enContent = lang === 'en' && fs.existsSync(enPath) ? fs.readFileSync(enPath, 'utf-8') : null
  if (enContent) {
    enContent = `<a href="/grands-formats/skunkworks" style="display:inline-block;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#C8A96E;text-decoration:none;border-bottom:1.5px solid #C8A96E;padding-bottom:1px;margin-bottom:28px">Lire en français</a>` + enContent
  }
  // Toggle EN/FR — statique, pas de JS

  return (
    <GrandFormatLayout
      slug="skunkworks"
      showPaywall={showPaywall}
      author="La rédaction"
      authorRole=""
      lang={lang}
      hasEnglish={true}
      content={enContent || undefined}
      toggleUrl={toggleUrl}
    >
      <div className="soara-article">

        {/* CHAPEAU */}
        <p>En juin 1943, Clarence Johnson réunit vingt-trois ingénieurs dans une tente de cirque louée à la hâte, adossée à une usine chimique qui empoisonnait l&apos;air de Burbank, Californie. Pas de contrat signé. Juste une poignée de main avec le Pentagone, une promesse de livrer un prototype de chasseur à réaction en cent cinquante jours, et une urgence réelle : les Allemands venaient de faire voler le Messerschmitt Me 262, premier chasseur à réaction opérationnel de l&apos;histoire, et les Alliés n&apos;avaient rien à lui opposer.</p>

        <p>Johnson livra en cent quarante-trois jours. Sept de moins que prévu.</p>

        <p>Quatre-vingt ans plus tard, Lockheed Martin a reconnu dans ses résultats financiers avoir perdu 1,8 milliard de dollars sur un programme aéronautique classifié dont elle n&apos;a pas révélé le nom. Et cette semaine, le directeur de la CIA a évoqué devant la presse des "technologies exquises que nul autre service de renseignement ne possède" — liées à la détection d&apos;un battement de cœur humain à soixante-cinq kilomètres de distance dans le désert iranien.</p>

        <p>L&apos;histoire du Skunk Works, c&apos;est l&apos;histoire d&apos;une institution qui, depuis plus de huit décennies, fabrique des objets que le reste du monde ne sait pas encore que c&apos;est possible.</p>

        {/* IMAGE HERO */}
        <figure style={{ margin: "56px -40px" }}>
          <img src="/grands-formats/skunkworks/hangar-1943.png"
            alt="Le hangar de Burbank, juin 1943, illustration éditoriale"
            style={{ width: "100%", height: "auto", display: "block" }} />
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            Burbank, Californie, juin 1943. Johnson et son équipe travaillent sous une tente de cirque louée à la hâte. En 143 jours, ils livrent le premier chasseur à réaction américain. © Soara.
          </figcaption>
        </figure>

        <h2>I. Les quatorze commandements</h2>

        <p>Kelly Johnson n&apos;était pas un manager. C&apos;était un ingénieur obsessionnel qui avait appris, à ses dépens, ce que la bureaucratie fait à l&apos;innovation : elle la noie. Sa réponse fut un code de quatorze règles qu&apos;il appliquait avec une rigidité quasi religieuse, publiées aujourd&apos;hui sur le site de Lockheed Martin dans leur version originale.</p>

        <p>Le chef de projet a une autorité pratiquement totale. L&apos;équipe est réduite à dix à vingt-cinq pour cent des effectifs d&apos;un programme "normal". Les rapports sont limités au strict minimum. L&apos;accès au projet est contrôlé avec une sévérité qu&apos;il qualifiait lui-même de "quasi-vicieuse". Le contractant doit pouvoir tester son produit en vol, s&apos;il ne le fait pas, il perd rapidement la compétence de concevoir le suivant.</p>

        <p>Ce que ces règles décrivent, c&apos;est l&apos;exact opposé du Pentagone. Là où un programme militaire standard mobilise des milliers de personnes, des comités d&apos;évaluation et des chaînes d&apos;approbation qui transforment chaque décision en marathon administratif, Johnson opérait avec une poignée de gens de confiance et une hiérarchie plate. Il disait : un bon ingénieur vaut dix mauvais. Il agissait en conséquence.</p>

        <div className="pull-quote">
          <p>"Be quick, be quiet, be on time."
            <br /><span style={{ fontSize: "13px", fontStyle: "normal", opacity: 0.9, color: "#8a7f72" }}>Devise de Kelly Johnson, fondateur du Skunk Works</span>
          </p>
        </div>

        <p>Sa devise tenait en trois mots. Ce modèle a depuis été copié, réinterprété, invoqué. Apple, Amazon, Google, toutes ont à un moment présenté tel ou tel projet interne comme leur "Skunk Works". Aucune n&apos;a livré un avion espion en sept mois sur une poignée de main.</p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        <h2>II. L&apos;Ange, le Blackbird, le Fantôme</h2>

        {/* IMAGE U-2 */}
        <figure style={{ margin: "48px -40px 56px" }}>
          <img src="/grands-formats/skunkworks/u2-survol.png"
            alt="Le U-2 au-dessus de l'URSS, illustration éditoriale"
            style={{ width: "100%", height: "auto", display: "block" }} />
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            De 1956 à 1960, le U-2 survola impunément le territoire soviétique à 21 000 mètres. Le 1er mai 1960, Gary Powers fut abattu. © Soara.
          </figcaption>
        </figure>

        <p>En 1954, le président Eisenhower avait un problème que personne ne pouvait résoudre poliment : il voulait savoir ce que les Soviétiques construisaient derrière le Rideau de fer, et aucun avion existant ne pouvait traverser leur espace aérien sans être abattu. Il convoqua la CIA. La CIA convoqua Johnson.</p>

        <p>Ce dernier proposa un avion que personne n&apos;avait conçu avant lui : extrêmement léger, envergure d&apos;aile démesurée empruntée aux planeurs, capable de voler à 21 000 mètres d&apos;altitude, au-dessus de tout missile soviétique existant. Il le baptisa "l&apos;Ange". L&apos;armée de l&apos;air le rebaptisa U-2. Johnson promit un prototype en huit mois. Il livra en sept.</p>

        <p>Pendant quatre ans, le U-2 photographia en toute impunité les installations militaires soviétiques. Jusqu&apos;au 1er mai 1960, quand un missile soviétique atteignit l&apos;appareil du pilote Gary Powers à 21 000 mètres. L&apos;incident faillit faire basculer la Guerre froide en guerre tout court. La réponse de Johnson fut de concevoir quelque chose de plus rapide que tout missile existant. Ce fut le SR-71 Blackbird.</p>

        {/* IMAGE TITANE */}
        <figure style={{ margin: "48px -40px 56px" }}>
          <img src="/grands-formats/skunkworks/titane-sovietique.png"
            alt="Le titane soviétique, illustration éditoriale"
            style={{ width: "100%", height: "auto", display: "block" }} />
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            Le paradoxe du Blackbird : la CIA acheta le titane à l&apos;URSS via des sociétés fantômes pour construire l&apos;avion destiné à espionner l&apos;URSS. © Soara.
          </figcaption>
        </figure>

        <p>Pour résister aux températures que génère un vol à Mach 3,2, les bords d&apos;attaque atteignent 560 degrés Celsius, il fallait du titane. Beaucoup de titane. Le plus grand producteur mondial en 1960 était l&apos;Union soviétique. La CIA créa donc une série de sociétés fantômes dans des pays tiers et obtint, via de fausses commandes, suffisamment de métal pour construire trente-deux SR-71. L&apos;une des histoires qui circule dans les milieux de l&apos;aéronautique évoque des "fours à pizza" comme couverture.</p>

        <p>Les Soviétiques, selon l&apos;ingénieur Ben Rich qui travailla sur le programme, "n&apos;avaient aucune idée de la façon dont ils contribuaient à la construction de l&apos;avion conçu pour espionner leur pays." Le métal vendu par l&apos;URSS pour se chauffer des pizzas fut utilisé pour construire l&apos;avion chargé de surveiller ses arsenaux nucléaires. Le Blackbird vola à partir de 1966. Il ne fut jamais abattu. Il détient encore les records de vitesse et d&apos;altitude pour un avion à réaction avec équipage.</p>

        <p>En 1976, un ingénieur nommé Denys Overholser apporta à Ben Rich une formule mathématique empruntée à un physicien soviétique des années 1960. La formule calculait la surface équivalente radar d&apos;un objet en fonction de sa géométrie. Overholser avait compris que des angles précis, des arêtes calculées, pouvaient réduire la signature radar à la taille d&apos;une bille de métal. Ce fut la démonstration qui donna naissance au F-117 Nighthawk.</p>

        <p>Le F-117 effectua son premier vol en 1981. Il fut mis en service opérationnel en 1983. Son existence resta secrète jusqu&apos;en 1988. Pendant cinq ans, l&apos;armée de l&apos;air américaine opéra une flotte d&apos;avions furtifs que le reste du monde ignorait. Aujourd&apos;hui, 85% des travaux du Skunk Works restent classifiés.</p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        <h2>III. Ghost Murmur, ou la physique comme programme secret</h2>

        {/* IMAGE GHOST MURMUR */}
        <figure style={{ margin: "48px -40px 56px" }}>
          <img src="/grands-formats/skunkworks/ghost-murmur.png"
            alt="Ghost Murmur, illustration éditoriale"
            style={{ width: "100%", height: "auto", display: "block" }} />
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            "Dude 44 Bravo", officier de systèmes d&apos;armes, 36 heures dans une fissure rocheuse en Iran. Retrouvé, selon des sources anonymes, grâce à la détection de son battement de cœur. © Soara.
          </figcaption>
        </figure>

        <p>Le 3 avril 2026, un F-15E américain est abattu au-dessus du sud de l&apos;Iran. L&apos;officier de systèmes d&apos;armes, identifié uniquement par son indicatif d&apos;appel "Dude 44 Bravo" — disparaît dans la nature, blessé, 200 miles en territoire ennemi, avec une prime sur sa tête. Il se cache dans une fissure rocheuse en montagne pendant trente-six heures.</p>

        <p>Le 6 avril, Trump et le directeur de la CIA John Ratcliffe convoquent la presse. Ratcliffe parle de "technologies exquises qu&apos;aucun autre service de renseignement ne possède." Trump dit que la CIA a localisé l&apos;aviateur à quarante miles de distance. Deux jours plus tard, le <em>New York Post</em> rapporte, citant deux sources anonymes, que l&apos;outil s&apos;appelle Ghost Murmur. Développé par le Skunk Works. Première utilisation opérationnelle. Le système combine magnétométrie quantique et intelligence artificielle pour détecter la signature électromagnétique d&apos;un battement de cœur humain à soixante-cinq kilomètres de distance.</p>

        <blockquote style={{ margin: "40px 0", padding: "24px 32px", background: "#1C1814", color: "#EDE6DA", fontFamily: "Georgia, serif", fontSize: "16px", fontStyle: "italic", lineHeight: "1.75", borderRadius: "2px" }}>
          "C&apos;est comme entendre une voix dans un stade, sauf que le stade fait mille miles carrés de désert. Si votre cœur bat, nous vous trouverons."
          <br /><span style={{ opacity: 0.9, fontSize: "13px", color: "#8a7f72" }}>Source anonyme, New York Post, 8 avril 2026.</span>
        </blockquote>

        <p>Sauf que <em>Scientific American</em> a immédiatement sollicité des physiciens spécialistes. John Wikswo, professeur de biophysique à Vanderbilt : "À dix centimètres de la poitrine, le champ magnétique cardiaque est à peine détectable. À un mètre, il est un millième de ce qu&apos;il était." Chad Orzel, physicien à Union College : "Même avec de l&apos;intelligence artificielle, vous ne pouvez pas trouver un signal assez grand pour identifier une personne à des kilomètres dans un désert." Quarante miles, c&apos;est soixante-cinq kilomètres. La physique connue n&apos;explique pas ça.</p>

        <p>Deux hypothèses. La première : le Skunk Works a résolu quelque chose que la physique publiée n&apos;a pas encore documenté. La seconde : Ghost Murmur est une opération de désinformation délibérée pour forcer des adversaires à modifier leurs doctrines de dissimulation. Trump a ajouté, dans la même interview : "Nous avons beaucoup d&apos;autres choses que personne n&apos;a jamais entendues. Nous avons du matériel que personne n&apos;a jamais imaginé." Il est impossible de savoir si c&apos;est vrai ou si c&apos;est le point.</p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        <h2>IV. Le programme fantôme à 1,8 milliard</h2>

        {/* IMAGE SR-72 */}
        <figure style={{ margin: "48px -40px 56px" }}>
          <img src="/grands-formats/skunkworks/sr72-fantome.png"
            alt="Le SR-72, programme fantôme, illustration éditoriale"
            style={{ width: "100%", height: "auto", display: "block" }} />
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            Palmdale, désert californien. Ce que Lockheed construit ici, personne ne le sait officiellement. 1,8 milliard de dollars perdus sur un programme sans nom. © Soara.
          </figcaption>
        </figure>

        <p>En juillet 2024, Lockheed Martin annonça une perte de 950 millions de dollars sur un seul programme aéronautique classifié, due à "des défis continus de conception, d&apos;intégration et de test." En janvier 2025, 555 millions supplémentaires sur le même programme. En ajoutant les dépassements antérieurs, le total dépasse 1,8 milliard de dollars sur un projet dont Lockheed n&apos;a révélé ni le nom, ni la nature, ni la destination. Le PDG a qualifié ce programme de "capacité révolutionnaire." C&apos;est tout ce qu&apos;il a dit.</p>

        <p>La communauté des analystes de défense s&apos;accorde à penser qu&apos;il s&apos;agit du SR-72, successeur hypersonique du Blackbird annoncé en 2013. Capable, selon les spécifications déclarées, de voler à Mach 6, soit plus de 7 000 kilomètres par heure. À cette vitesse, un avion peut traverser n&apos;importe quel espace aérien défendu avant que les systèmes sol-air aient le temps de calculer une trajectoire. Des sources évoquent la livraison de "premiers articles" à l&apos;armée de l&apos;air. Lockheed avait évoqué un premier vol démonstratif "au milieu des années 2020". Nous sommes en 2026. Le silence est absolu.</p>

        <p>Un directeur de programme du Skunk Works avait dit un jour : "Le problème avec nos programmes, c&apos;est qu&apos;ils obtiennent généralement le crédit d&apos;avoir changé l&apos;histoire longtemps après l&apos;avoir effectivement changée."</p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        <h2>V. Pourquoi ça compte maintenant</h2>

        <p>Le Skunk Works n&apos;a jamais été une curiosité technique. C&apos;est l&apos;instrument par lequel les États-Unis ont maintenu, depuis 1943, une avance structurelle dans la maîtrise des cieux sur tous leurs adversaires. Le U-2 a donné à Eisenhower les photographies qui lui ont permis d&apos;évaluer l&apos;arsenal soviétique, et c&apos;est un U-2 qui a photographié les missiles soviétiques à Cuba en octobre 1962, déclenchant la crise. Le SR-71 a survolé impunément chaque théâtre de conflit américain pendant trente ans. Le F-117 a ouvert les guerres de la décennie 1990 avec une démonstration que l&apos;adversaire ne pouvait pas comprendre, faute d&apos;avoir jamais vu l&apos;avion.</p>

        <p>Cette mécanique fonctionne parce qu&apos;elle s&apos;appuie sur une asymétrie fondamentale : l&apos;adversaire ne sait pas ce qu&apos;il ne voit pas. Le moment où cette asymétrie disparaît est le moment où la menace devient existentielle.</p>

        <p>La Chine investit massivement dans l&apos;hypersonique. Le missile DF-17, les planeurs hypersoniques testés en 2021 qui ont, selon les mots d&apos;un officiel du Pentagone, "tout le monde sur le cul", les programmes de chasseurs de sixième génération exposés au salon de Zhuhai, Beijing a compris que la prochaine confrontation se gagnera ou se perdra dans les couches supérieures de l&apos;atmosphère, à des vitesses où les systèmes de défense actuels ne fonctionnent plus.</p>

        <p>Dans ce contexte, la question de ce que le Skunk Works construit dans ses hangars de Palmdale, et de ce que Ghost Murmur représente réellement, cesse d&apos;être une question de passionnés d&apos;aéronautique pour devenir une question géopolitique directe.</p>

        {/* ÉPILOGUE */}
        <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: "40px", marginTop: "56px" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#B8860B", marginBottom: "24px" }}>Épilogue</div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontStyle: "italic", lineHeight: "1.75", color: "#2a2a2a", marginBottom: "1.4em" }}>
            L&apos;histoire du Skunk Works suggère que la réponse existe déjà. Elle vole probablement depuis plusieurs années. Elle détecte peut-être des battements de cœur que la physique ne sait pas encore expliquer. Et personne, en dehors d&apos;une poignée d&apos;ingénieurs et de généraux, ne sait exactement ce que c&apos;est.
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "21px", fontWeight: 700, fontStyle: "italic", lineHeight: "1.55", color: "#1a1a1a", borderTop: "1px solid #DDD9D2", paddingTop: "28px", marginBottom: 0 }}>
            C&apos;est précisément le point.
          </p>
        </div>

        {/* SOURCES */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "2px solid #DDD9D2" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8a7f72", marginBottom: "12px" }}>Sources</div>
          <p style={{ fontSize: "13px", color: "#8a7f72", lineHeight: "1.6" }}>
            Lockheed Martin (site officiel, résultats financiers Q2 2024 et Q1 2025) · Wikipedia (Skunk Works, Kelly Johnson, Ghost Murmur) · The War Zone · Sandboxx · 19FortyFive · National Interest · <em>Scientific American</em> (physiciens John Wikswo, Chad Orzel, Thad Walker) · Newsweek · New York Post · Ben Rich, <em>Skunk Works</em> (Simon &amp; Schuster, 1994).
          </p>
        </div>

      </div>
    </GrandFormatLayout>
  );
}
