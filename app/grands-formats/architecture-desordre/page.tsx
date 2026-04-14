import { createClient } from "../../../lib/supabase-server"
import GrandFormatLayout from "../../../components/GrandFormatLayout";

export const metadata = {
  title: "L'architecture du désordre, Soara",
  description: "Pourquoi le droit international ne fonctionne que quand les grandes puissances veulent bien qu'il fonctionne.",
};

export default async function ArchitectureDesordre() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'steve.moradel@gmail.com'
  let isSubscribed = false
  if (user && !isAdmin) {
    const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single()
    isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
  }
  const showPaywall = !isAdmin && !isSubscribed

  return (
    <GrandFormatLayout
      slug="architecture-desordre"
      showPaywall={showPaywall}
      author="Steve Moradel"
      authorRole=""
    >
      <div className="soara-article">

        <p>En 539 avant notre ère, Cyrus le Grand entre dans Babylone. Pas en conquérant. Sans pillage, sans massacre. Il libère les esclaves, laisse les peuples déportés rentrer chez eux, respecte leurs dieux, maintient leurs prêtres en fonction. Il fait graver tout cela sur un cylindre d&apos;argile en caractères cunéiformes. Ce texte, conservé au British Museum, a été traduit par l&apos;ONU dans toutes ses langues officielles en 1971. Une réplique trône au siège de New York comme symbole de la première charte des droits humains de l&apos;histoire.</p>

        <p>Cyrus dirigeait le plus grand empire du monde connu. Sa tolérance était sa politique de stabilité. Un empire qui respecte les dieux des vaincus ne se bat pas contre des révoltes religieuses. L&apos;humanisme et la puissance ne s&apos;opposaient pas. Ils se servaient mutuellement.</p>

        <p>Vingt-cinq siècles plus tard, Harry Truman prononce un discours dans le Veterans Building de San Francisco, le 26 juin 1945. Il parle de "victoire sur la guerre elle-même." Le monde vient d&apos;enterrer cinquante millions de morts. Truman aussi a son cylindre : la Charte des Nations Unies, signée ce jour-là par cinquante nations. Sauf que cette Charte, comme le cylindre de Cyrus, dit une chose et fait autre chose.</p>

        <h2>I. San Francisco, la cérémonie</h2>

        <p>La Charte avait déjà été rédigée ailleurs. À Dumbarton Oaks en 1944, puis à Yalta en février 1945, les États-Unis, l&apos;URSS, le Royaume-Uni et la Chine avaient décidé l&apos;essentiel. San Francisco était la cérémonie. Les autres pays étaient invités à ratifier, pas à négocier.</p>

        <p>La question du veto faillit faire échouer la conférence. Les petites puissances voyaient la mécanique : l&apos;architecture du nouvel ordre mondial garantissait aux vainqueurs de la guerre le droit permanent de bloquer toute décision contraire à leurs intérêts. L&apos;ONU note dans sa propre histoire officielle que "les petites puissances se sont inclinées pour ne pas faire obstacle à la création de l&apos;Organisation."</p>

        <p>La scène s&apos;était déjà jouée. En 1235, Soundiata Keïta fonde l&apos;Empire du Mali après la bataille de Kirina. Il proclame la Charte du Manden, texte de gouvernance qui garantit la justice et la protection des individus, plusieurs siècles avant les déclarations européennes. Un siècle plus tard, Mansa Musa règne sur l&apos;empire le plus riche du monde médiéval. Lors de son pèlerinage à La Mecque en 1324, il traverse Le Caire avec une caravane de dix mille personnes et plusieurs tonnes d&apos;or. Il distribue tant de métal précieux que le cours de l&apos;or s&apos;effondre en Égypte pour des années. L&apos;Atlas catalan de 1375 le représente comme le souverain le plus puissant du monde. La Charte du Manden proclamait l&apos;universalité. Le mansa tenait le pouvoir. Les deux coexistaient sans se contredire — mais sans être égaux.</p>

        <p>Même structure à Westphalie en 1648. Après trente ans de guerre européenne, la France, la Suède et les Habsbourg négocient les règles du système des États-nations. Les petits États d&apos;Empire sont convoqués pour ratifier. L&apos;ordre international proclame l&apos;égalité souveraine de tous. Les puissances qui l&apos;ont rédigé restent au-dessus.</p>

        <p>San Francisco en 1945 reproduit exactement ce modèle. Universel dans ses ambitions, oligarchique dans sa structure.</p>

        <h2>II. La mécanique du veto</h2>

        <p>L&apos;article 2 de la Charte interdit le recours à la force dans les relations internationales. C&apos;est la norme cardinale, le jus cogens, la règle dont aucune dérogation n&apos;est possible. Mais le chapitre VII donne au Conseil de sécurité seul l&apos;autorité d&apos;autoriser l&apos;usage de cette force. Et les cinq membres permanents disposent chacun d&apos;un veto sur toute décision du Conseil.</p>

        <p>Si les grandes puissances sont d&apos;accord, elles agissent. Si elles ne le sont pas, le système se bloque. La paix internationale dépend du consensus permanent entre Washington, Moscou, Pékin, Londres et Paris. En 1947, deux ans après San Francisco, la Guerre froide paralysait déjà le Conseil. Entre 1945 et 1991, l&apos;URSS a utilisé son veto 119 fois. Les États-Unis 82 fois. Depuis la fin de la Guerre froide, Washington est de loin le premier utilisateur du veto, majoritairement pour bloquer les résolutions sur le conflit israélo-palestinien.</p>

        <h2>III. Les exceptions</h2>

        <p>En 1999, l&apos;OTAN bombarde la Yougoslavie 78 jours sans autorisation du Conseil de sécurité, bloqué par le veto russe. L&apos;argument avancé est celui d&apos;une "intervention humanitaire" pour stopper le nettoyage ethnique au Kosovo. La formule est nouvelle. Elle ne figure nulle part dans la Charte.</p>

        <p>En 2003, les États-Unis et le Royaume-Uni envahissent l&apos;Irak sans mandat. La résolution 1441 autorisait des inspections, pas la guerre. Kofi Annan qualifie l&apos;invasion d&apos;illégale en 2004. Les armes invoquées n&apos;existaient pas. Le secrétaire général avait raison sur le droit et n&apos;avait aucun moyen de l&apos;imposer.</p>

        <p>En 2011, la résolution 1973 autorise des mesures pour protéger les civils libyens. En quelques mois, elle devient la couverture d&apos;un changement de régime. Kadhafi est tué. La Libye s&apos;effondre. Moscou et Pékin, qui s&apos;étaient abstenus, retiennent la leçon : ne jamais plus s&apos;abstenir sur une résolution susceptible d&apos;être détournée.</p>

        <h2>IV. L&apos;argument de Poutine</h2>

        <p>Quand Vladimir Poutine invoque le "précédent du Kosovo" pour justifier l&apos;annexion de la Crimée en 2014, puis l&apos;invasion de l&apos;Ukraine en 2022, les chancelleries occidentales protestent que la comparaison est fallacieuse. Elles ont raison sur les faits. Le Kosovo n&apos;a pas été annexé. L&apos;Ukraine n&apos;attaquait pas la Russie. Les contextes sont incomparables.</p>

        <p>Poutine ne dit pas que les situations sont identiques. Il dit que le principe est le même : quand une grande puissance décide que ses intérêts sont en jeu, elle agit indépendamment du Conseil de sécurité. L&apos;argument est cynique. Il est aussi juridiquement cohérent. Et c&apos;est pour ça qu&apos;il fonctionne dans les capitales du Sud global, qui ont regardé les trente dernières années avec une attention que les Occidentaux sous-estiment.</p>

        <h2>V. La structure qui ne change pas</h2>

        <p>La Charte de 1945 a construit un système dans lequel la légalité internationale dépend de l&apos;accord des puissances qui ont intérêt à la violer. Ce n&apos;était pas un accident. C&apos;était une condition de l&apos;existence du système. Les grandes puissances ne l&apos;auraient pas signé autrement.</p>

        <p>Cyrus respectait les dieux de Babylone parce que ça stabilisait son empire. Soundiata Keïta accordait la justice aux peuples du Manden parce que ça assurait leur allégeance. Les fondateurs de l&apos;ONU accordaient le veto aux grandes puissances parce que sans ça, il n&apos;y aurait pas eu d&apos;ONU. L&apos;universel s&apos;est toujours construit sur un particulier qu&apos;on ne dit pas tout à fait.</p>

        <p>Le droit international n&apos;est pas un système de règles. C&apos;est un système de négociation entre puissances dans lequel les règles servent d&apos;argument quand elles conviennent et de cible quand elles ne conviennent pas.</p>

        <p>L&apos;Ukraine subit une guerre d&apos;agression manifeste. La Russie viole la Charte qu&apos;elle a signée. Et pourtant une large partie du monde refuse de condamner l&apos;invasion clairement : l&apos;Inde, le Brésil, l&apos;Afrique du Sud, l&apos;Indonésie, une cinquantaine de pays. Ce n&apos;est ni de la naïveté ni de la sympathie pour Poutine. Ces pays ont regardé les trente dernières années et en ont tiré une conclusion pragmatique : dans un système où les règles ne s&apos;appliquent pas à tous de la même façon, la prudence consiste à ne pas choisir un camp.</p>

        <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: "40px", marginTop: "56px" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#B8860B", marginBottom: "24px" }}>Épilogue</div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontStyle: "italic", lineHeight: "1.75", color: "#2a2a2a", marginBottom: "1.4em" }}>
            Tout amendement à la Charte exige l&apos;accord des cinq puissances qui bénéficient du système. La réforme est par construction impossible.
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "21px", fontWeight: 700, fontStyle: "italic", lineHeight: "1.55", color: "#1a1a1a", borderTop: "1px solid #DDD9D2", paddingTop: "28px", marginBottom: 0 }}>
            L&apos;Occident peut gagner le débat moral sur l&apos;Ukraine. Il a déjà perdu le débat institutionnel. Et ce sont les institutions, pas la morale, qui déterminent la durée des ordres internationaux.
          </p>
        </div>

        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "2px solid #DDD9D2" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8a7f72", marginBottom: "12px" }}>Sources</div>
          <p style={{ fontSize: "13px", color: "#8a7f72", lineHeight: "1.6" }}>
            Charte des Nations Unies (1945) · ONU Info (San Francisco, 2020) · CFCPI (droit de veto) · Universalis · Herodote.net · Wikipedia (Cyrus le Grand, Empire du Mali, Traités de Westphalie) · Pierre Briant, <em>Histoire de l&apos;Empire perse</em> (Fayard, 1996) · British Museum (Cylindre de Cyrus) · Global Policy Forum (statistiques des vetos).
          </p>
        </div>

      </div>
    </GrandFormatLayout>
  );
}
