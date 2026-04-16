import { createClient } from "../../../lib/supabase-server"
import GrandFormatLayout from "../../../components/GrandFormatLayout";

export const metadata = {
  title: "Palantir. L'ontologie de l'ennemi, Soara",
  description: "Comment une entreprise née d'un coup d'État de salle de réunion est devenue l'infrastructure cognitive des États qui ne la contrôlent pas.",
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

  return (
    <GrandFormatLayout
      slug="palantir"
      showPaywall={showPaywall}
      author="Steve Moradel"
      authorRole=""
      lang={lang}
      hasEnglish={true}
    >
      <div className="soara-article">

        <p>En septembre 2000, Elon Musk prit l&apos;avion pour l&apos;Australie. Lune de miel différée de neuf mois — le mariage avait eu lieu en janvier, le travail n&apos;avait pas permis de partir avant. À Johannesburg, lors d&apos;une escale, il contracta le paludisme. Pendant qu&apos;il était hospitalisé à son retour en Californie, ses associés de PayPal organisèrent dans son dos un conseil d&apos;administration d&apos;urgence. Quand il sortit de l&apos;hôpital, il n&apos;était plus PDG. Son remplaçant temporaire s&apos;appelait Peter Thiel.</p>

        <p>Vingt-cinq ans plus tard, Thiel et Musk co-administrent ensemble l&apos;État américain. L&apos;un dirige le DOGE, département officieux chargé de démanteler la bureaucratie fédérale. L&apos;autre siège dans l&apos;orbite directe du pouvoir pendant que ses anciens collaborateurs occupent des postes au Pentagone, au département de la Sécurité intérieure, au département de la Santé. Et Palantir, l&apos;entreprise que Thiel a fondée en 2003 avec l&apos;argent de la CIA, traite les fichiers de suspects du renseignement intérieur français, cible des adversaires sur les théâtres de guerre, et surveille les migrants aux frontières européennes.</p>

        <p>Cette histoire ne commence pas en 2003. Elle commence dans un hôpital de Johannesburg, lors d&apos;un coup d&apos;État de salle de réunion.</p>

        <h2>La Mafia</h2>

        <p>La "PayPal Mafia" est l&apos;expression inventée par la presse américaine pour désigner la vingtaine d&apos;anciens de PayPal qui, après la vente de l&apos;entreprise à eBay en 2002 pour 1,5 milliard de dollars, sont repartis avec leurs chèques et leurs carnets d&apos;adresses pour fonder un empire parallèle. LinkedIn, YouTube, SpaceX, Palantir, Anduril : autant d&apos;entreprises nées du même réseau, du même capital de départ, des mêmes dîners à Palo Alto.</p>

        <p>Thiel en est le parrain. Founders Fund, son véhicule d&apos;investissement, est l&apos;un des premiers actionnaires de SpaceX, de Palantir, d&apos;Anduril. David Sacks, ancien de PayPal, est aujourd&apos;hui le conseiller IA et crypto de la Maison Blanche. JD Vance, vice-président, est son protégé politique direct. Musk dirige le DOGE. "Ils sont passés de types malins qui esquivaient la régulation gouvernementale à être le gouvernement, en une génération", résume Steve Blank, enseignant à Stanford.</p>

        <p>Musk voulait l&apos;infrastructure physique du monde. Rockets, voitures, cerveau connecté. Thiel voulait quelque chose de différent : définir ce qui constitue une menace.</p>

        <h2>Ce que Gotham fait vraiment</h2>

        <p>Palantir vend deux produits principaux. Gotham est destiné aux agences gouvernementales et militaires : il connecte des bases de données hétérogènes, croise des trajectoires, des transactions, des communications, des déplacements, pour faire apparaître des patterns invisibles à l&apos;analyse humaine. Foundry transpose la même logique au secteur privé. AIP ajoute une couche d&apos;intelligence artificielle qui automatise les recommandations opérationnelles.</p>

        <p>Palantir ne collecte pas de données. Ses clients les lui fournissent. Mais Palantir décide comment les croiser, quels signaux retenir, quels seuils déclencher une alerte. Les critères algorithmiques qui font d&apos;un individu un suspect prioritaire dans les fichiers de la DGSI ne sont pas rédigés à Paris. Ils sont écrits par des ingénieurs à Denver. La grammaire de l&apos;analyse appartient à l&apos;entreprise, pas à l&apos;État qui a signé le contrat.</p>

        <p>Karp lui-même n&apos;a jamais caché la nature de ce que Palantir construit. "Palantir est là pour effrayer les ennemis et, dans certains cas, les éliminer", a-t-il dit en 2025, avec un sourire. Ce n&apos;est pas une formule de commercial. C&apos;est une description de doctrine.</p>

        <h2>René Girard à Denver</h2>

        <p>Peter Thiel est philosophe avant d&apos;être entrepreneur. Au milieu des années 1980, étudiant à Stanford, il suit les cours de René Girard. L&apos;anthropologue français est l&apos;auteur de la théorie du désir mimétique : les êtres humains ne désirent pas spontanément, ils imitent le désir d&apos;autrui. Cette dynamique produit inévitablement de la rivalité, de la violence. Pour y mettre fin, les sociétés désignent un bouc émissaire, une victime collective sur laquelle se cristallise la violence de tous. L&apos;ordre social se fonde sur ce mécanisme de désignation.</p>

        <p>Thiel est, selon ses propres mots, profondément influencé par cette lecture. Il a dédié une branche de sa fondation aux études girardiennes. Quiconque contrôle le mécanisme de désignation du bouc émissaire contrôle la société.</p>

        <p>Gotham automatise ce mécanisme. Il parcourt des millions de points de données pour désigner statistiquement ce qui ressemble à une menace. Ce processus de désignation appartient, dans une démocratie, à des juges, des procureurs, des agents assermentés soumis à un contrôle démocratique. Il a été partiellement délégué à un algorithme dont les paramètres sont propriété d&apos;une entreprise privée américaine. Les États qui ont signé des contrats avec Palantir n&apos;ont généralement aucune visibilité sur ces paramètres.</p>

        <h2>La toile</h2>

        <p>La France utilise Palantir à la DGSI depuis 2016, peu après les attentats du 13 novembre, dans l&apos;urgence d&apos;un État qui avait besoin de traiter des volumes de données que ses propres outils ne pouvaient pas absorber. Le contrat a été renouvelé en 2019, en 2022, et à nouveau en décembre 2025, jusqu&apos;en 2028. À chaque renouvellement, la même formule officielle : "dans l&apos;attente du déploiement d&apos;un outil souverain français." Cette attente dure depuis dix ans.</p>

        <p>La France est le deuxième marché européen de Palantir, derrière le Royaume-Uni. En septembre 2025, le ministère britannique de la Défense a signé un contrat de cinq ans pour 855 millions d&apos;euros. L&apos;Allemagne, l&apos;Italie, les Pays-Bas, la Pologne, le Danemark, la Norvège, la Hongrie : le même mouvement partout, des gouvernements qui signent avec une infrastructure qu&apos;ils ne contrôlent pas, sur des critères qu&apos;ils ne connaissent pas.</p>

        <p>La Suisse a suspendu. En 2024, un audit militaire avait confirmé les capacités techniques du système, mais souligné qu&apos;opérant sous juridiction américaine, Palantir ne pouvait garantir que les données militaires suisses seraient inaccessibles à Washington. L&apos;armée suisse a arrêté la coopération. C&apos;est le seul État européen à l&apos;avoir fait.</p>

        <h2>Le CLOUD Act et la clé</h2>

        <p>Le CLOUD Act, adopté aux États-Unis en 2018, oblige toute entreprise américaine à fournir aux autorités américaines les données qu&apos;elle contrôle, quelle que soit leur localisation géographique. Ce n&apos;est pas le lieu de stockage des serveurs qui importe. C&apos;est la nationalité juridique de l&apos;entreprise. Palantir est américaine. Ses accès aux données de ses clients européens sont potentiellement saisissables par un mandat américain, même si les serveurs sont en Europe.</p>

        <p>Palantir affirme que chaque client opère dans un environnement isolé et sécurisé, et que les données ne sont pas partagées entre clients. C&apos;est vrai dans les conditions normales d&apos;opération. La question est ce qui se passe lorsque Washington émet un mandat. Le mécanisme de contestation existe, mais il est lent et suppose une volonté politique d&apos;y recourir. Sous l&apos;administration Trump, avec Thiel dans l&apos;orbite directe du pouvoir, c&apos;est une hypothèse fragile.</p>

        <blockquote style={{ margin: "40px 0", padding: "24px 32px", background: "#1a1612", color: "#f0ece4", fontFamily: "Georgia, serif", fontSize: "16px", fontStyle: "italic", lineHeight: "1.75", borderRadius: "2px" }}>
          "À partir du moment où l&apos;on voit qu&apos;ils ont pu vouloir débrancher les systèmes de renseignement géospatial en Ukraine, ça veut dire qu&apos;un jour, ils peuvent nous le faire aussi."
          <br /><span style={{ opacity: 0.9, fontSize: "13px", color: "#C8A96E" }}>Pierre Gastineau, Les espions du président (Albin Michel, 2025).</span>
        </blockquote>

        <h2>Ce qu&apos;on ne peut pas désinstaller</h2>

        <p>La dépendance à Palantir n&apos;est pas d&apos;abord technique. Les systèmes peuvent théoriquement être remplacés. Lentement, douloureusement, mais c&apos;est possible. La dépendance réelle est cognitive.</p>

        <p>Dix ans de travail avec les outils de Palantir signifient dix ans de formation des agents structurés par ses catégories, dix ans de décisions fondées sur ses algorithmes, dix ans d&apos;habitudes analytiques construites avec sa grammaire. Les analystes de la DGSI pensent la menace terroriste avec les variables que Gotham a définies. Les officiers britanniques planifient avec des recommandations d&apos;AIP. Quand un État utilise un système pendant dix ans pour définir ce qui constitue un danger, il ne se débarrasse pas de l&apos;outil sans perdre une partie de sa capacité de jugement autonome.</p>

        <p>On n&apos;achète pas un logiciel. On adopte une épistémologie.</p>

        <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: "40px", marginTop: "56px" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#B8860B", marginBottom: "24px" }}>Épilogue</div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontStyle: "italic", lineHeight: "1.75", color: "#2a2a2a", marginBottom: "1.4em" }}>
            Palantir a été fondée avec l&apos;argent de la CIA, par un homme qui a écrit noir sur blanc en 2009 qu&apos;il ne croyait plus que la liberté et la démocratie soient compatibles, pour vendre aux démocraties libérales les instruments de leur sécurité. Ces démocraties ont signé, renouvelé, étendu leurs contrats parce que l&apos;outil fonctionne, parce qu&apos;il n&apos;y a pas d&apos;alternative prête, parce que la menace est réelle et que les solutions souveraines sont perpétuellement en cours de développement.
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "21px", fontWeight: 700, fontStyle: "italic", lineHeight: "1.55", color: "#1a1a1a", borderTop: "1px solid #DDD9D2", paddingTop: "28px", marginBottom: 0 }}>
            La question de qui décide qui est l&apos;ennemi n&apos;a pas de réponse administrative. Elle n&apos;attend pas une solution technique. Elle attend une décision politique que personne, jusqu&apos;ici, n&apos;a eu le courage de prendre.
          </p>
        </div>

        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "2px solid #DDD9D2" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8a7f72", marginBottom: "12px" }}>Sources</div>
          <p style={{ fontSize: "13px", color: "#8a7f72", lineHeight: "1.6" }}>
            Palantir Technologies (résultats financiers, lettres aux actionnaires 2025) · Bloomberg · Fortune · Wikipedia (Palantir, PayPal Mafia, CLOUD Act) · Franceinfo · Solidarité &amp; Progrès · Le Grand Continent · Pierre Gastineau, <em>Les espions du président</em> (Albin Michel, 2025) · Alex Karp, <em>The Technological Republic</em> (2025) · Peter Thiel, "The Education of a Libertarian" (<em>Cato Unbound</em>, 2009).
          </p>
        </div>

      </div>
    </GrandFormatLayout>
  );
}
