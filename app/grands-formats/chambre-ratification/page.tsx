import fs from 'fs'
import nodePath from 'path'
import GrandFormatLayout from "../../../components/GrandFormatLayout";
import ScrollReveal from "../../../components/ScrollReveal";

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "La chambre de ratification",
  description: "Comment Benjamin Netanyahu a décidé une guerre américaine. Une enquête en miroir : le Situation Room en 2026, le Situation Room en 1962, et soixante-dix ans d'une boucle qui ne se referme pas.",
  alternates: { canonical: 'https://soara.fr/grands-formats/chambre-ratification' },
};

export default async function ChambreRatificationPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const lang = searchParams?.lang === 'en' ? 'en' : 'fr'
  const toggleUrl = lang === 'en' ? `/grands-formats/chambre-ratification` : `/grands-formats/chambre-ratification?lang=en`
  const enPath = nodePath.join(process.cwd(), 'lib', 'content', 'chambre-ratification-en.html')
  let enContent = lang === 'en' && fs.existsSync(enPath) ? fs.readFileSync(enPath, 'utf-8') : null
  if (enContent) {
    enContent = `<a href="/grands-formats/chambre-ratification" style="display:inline-block;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#C8A96E;text-decoration:none;border-bottom:1.5px solid #C8A96E;padding-bottom:1px;margin-bottom:28px">Lire en français</a>` + enContent
  }
  // Toggle EN/FR — statique, pas de JS

  return (
    <GrandFormatLayout
      slug="chambre-ratification"
      author="Steve Moradel"
      authorRole=""
      lang={lang}
      hasEnglish={true}
      content={enContent || undefined}
      toggleUrl={toggleUrl}
    >
      <div className="soara-article">

        {/* SOURCE NYT */}
        <div style={{
          background: "#F5F0E8", borderLeft: "4px solid #1A2744",
          padding: "20px 28px", marginBottom: "48px",
          fontFamily: "Georgia, serif", fontSize: "15px",
          lineHeight: "1.65", color: "#4a4540"
        }}>
          <strong style={{ color: "#1A2744", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Source</strong>
          Le 7 avril 2026, le <em>New York Times</em> publiait une enquête de Jonathan Swan et Maggie Haberman :
          {" "}<strong>«&nbsp;How Trump Took the U.S. to War With Iran&nbsp;»</strong>,
          tirée du livre <em>Regime Change&nbsp;: Inside the Imperial Presidency of Donald Trump</em>
          {" "}(Simon &amp; Schuster, juin 2026).
          Ce texte part de cette scène, et va là où le <em>New York Times</em> n&apos;est pas allé.{" "}
          <a href="https://www.nytimes.com/2026/04/07/us/politics/trump-iran-war-netanyahu.html"
            target="_blank" rel="noopener noreferrer"
            style={{ color: "#B8860B", textDecoration: "underline" }}>
            Lire l&apos;enquête originale →
          </a>
        </div>

        {/* OUVERTURE */}
        <p><strong>Ce n&apos;est pas une image de guerre.</strong> Pas de fumée sur Téhéran, pas de conférence de presse, pas de missile en vol. C&apos;est une image d&apos;intérieur, presque intime dans sa géographie de pouvoir.</p>

        <p>Le SUV noir transportant le Premier ministre Benjamin Netanyahu arriva à la Maison-Blanche juste avant 11 heures du matin, le 11 février. Le dirigeant israélien, qui pressait depuis des mois les États-Unis d&apos;accepter une offensive majeure contre l&apos;Iran, fut introduit à l&apos;intérieur sans cérémonie, hors de vue des journalistes.</p>

        <p>Les officiels américains et israéliens se réunirent d&apos;abord dans le Cabinet Room, adjacent au Bureau ovale. Puis Netanyahu descendit pour l&apos;événement principal&nbsp;: une présentation hautement classifiée sur l&apos;Iran destinée au président Trump et son équipe dans le Situation Room, une salle rarement utilisée pour des réunions en personne avec des dirigeants étrangers.</p>

        <p>Trump s&apos;assit, mais pas à sa place habituelle en tête de la table en acajou. Il prit un siège sur le côté, face aux grands écrans montés le long du mur. Netanyahu s&apos;assit de l&apos;autre côté, directement en face du président. Sur les écrans derrière lui apparaissait David Barnea, directeur du Mossad, ainsi que des militaires israéliens, créant l&apos;image d&apos;un dirigeant de guerre entouré de son équipe.</p>

        <p>Dix-sept jours plus tard, le 28 février, les États-Unis entraient en guerre contre l&apos;Iran.</p>

        {/* IMAGE I — Situation Room */}
        <figure style={{ margin: "56px -40px" }}>
          <picture>
            <source srcSet="/grands-formats/chambre-situation-room.avif" type="image/avif" />
            <img src="/grands-formats/chambre-situation-room.jpg"
              alt="Le Situation Room, 11 février 2026, illustration éditoriale"
              style={{ width: "100%", height: "auto", display: "block" }} />
          </picture>
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            Le Situation Room, 11 février 2026. Scène reconstituée par le <em>New York Times</em> à partir de témoignages de responsables américains. © Soara.
          </figcaption>
        </figure>

        <h2>I. La scène</h2>

        <p>Netanyahu fit sa présentation en «&nbsp;monotone confiant&nbsp;», selon le <em>New York Times</em>. Sa thèse&nbsp;: l&apos;Iran était mûr pour un changement de régime. Il exposait quatre conditions décrites comme annonçant une victoire quasi certaine&nbsp;: le programme balistique iranien détruit en quelques semaines&nbsp;; le régime trop affaibli pour fermer le détroit d&apos;Ormuz&nbsp;; les représailles contre les intérêts américains jugées minimales&nbsp;; et les renseignements du Mossad indiquant que des protestations reprendraient à l&apos;intérieur de l&apos;Iran, permettant à l&apos;opposition de renverser le régime.</p>

        <p>À un moment, les Israéliens projetèrent une courte vidéo, un montage de dirigeants potentiels pour un Iran post-islamiste. Parmi eux, Reza Pahlavi&nbsp;: fils en exil du dernier Shah, dissident basé à Washington.</p>

        <div className="pull-quote">
          <p>«&nbsp;Sounds good to me.&nbsp;»
            <br /><span style={{ fontSize: "13px", fontStyle: "normal", opacity: 0.9, color: "#8a7f72" }}>Donald Trump, répondant à Netanyahu. Situation Room, 11 février 2026. Source&nbsp;: <em>New York Times</em></span>
          </p>
        </div>

        <p>Le lendemain, dans une réunion réservée aux seuls officiels américains, les services de renseignement livrèrent leur verdict. Les deux premiers objectifs, décapiter le régime et démanteler les capacités militaires iraniennes, étaient réalisables. Le soulèvement populaire et le changement de régime étaient «&nbsp;détachés de la réalité.&nbsp;»</p>

        <ScrollReveal>
          <blockquote style={{ margin: "40px 0", padding: "24px 32px 24px 28px", background: "#F7F4EF", borderLeft: "4px solid #1a1a1a", fontFamily: "Georgia, serif", fontSize: "16px", fontStyle: "italic", lineHeight: "1.85", color: "#1a1a1a" }}>
            «&nbsp;Farcical.&nbsp;»<br />
            <span style={{ fontSize: "13px", color: "#555", fontStyle: "normal" }}>John Ratcliffe, directeur de la CIA.</span>
            <br /><br />
            «&nbsp;In other words, it&apos;s bullshit.&nbsp;»<br />
            <span style={{ fontSize: "13px", color: "#555", fontStyle: "normal" }}>Marco Rubio, Secrétaire d&apos;État.</span>
            <br /><br />
            «&nbsp;Sir, this is, in my experience, standard operating procedure for the Israelis. They oversell, and their plans are not always well-developed. They know they need us, and that&apos;s why they&apos;re hard-selling.&nbsp;»<br />
            <span style={{ fontSize: "13px", color: "#555", fontStyle: "normal" }}>Général Dan Caine, chef d&apos;état-major interarmées.</span>
            <br /><br />
            «&nbsp;If our goal is regime change or an uprising, we shouldn&apos;t do it. But if the goal is to destroy Iran&apos;s missile program, that&apos;s a goal we can achieve.&nbsp;»<br />
            <span style={{ fontSize: "13px", color: "#555", fontStyle: "normal" }}>Marco Rubio, réunion finale du 26 février.</span>
            <span style={{ display: "block", marginTop: "16px", fontStyle: "normal", fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8a7f72" }}>
              Source&nbsp;: New York Times, Haberman &amp; Swan, 7 avril 2026
            </span>
          </blockquote>
        </ScrollReveal>

        <p>Tucker Carlson était venu au Bureau ovale plusieurs fois pour avertir Trump qu&apos;une guerre avec l&apos;Iran détruirait sa présidence. Quelques semaines avant le début des hostilités, Trump le rassura par téléphone&nbsp;: «&nbsp;I know you&apos;re worried about it, but it&apos;s going to be OK.&nbsp;» Carlson demanda comment il le savait. «&nbsp;Because it always is.&nbsp;»</p>

        <p>Le 26 février, réunion finale. Vance&nbsp;: «&nbsp;You know I think this is a bad idea, but if you want to do it, I&apos;ll support you.&nbsp;» Hegseth, seul enthousiaste&nbsp;: «&nbsp;We&apos;re going to have to take care of the Iranians eventually, so we might as well do it now.&nbsp;» Chacun formula ses réserves. Chacun se rangea.</p>

        <ScrollReveal>
          <blockquote style={{ margin: "40px 0", padding: "24px 32px 24px 28px", background: "#F7F4EF", borderLeft: "4px solid #1a1a1a", fontFamily: "Georgia, serif", fontSize: "16px", fontStyle: "italic", lineHeight: "1.85", color: "#1a1a1a" }}>
            «&nbsp;I think we need to do it.&nbsp;»<br />
            <span style={{ fontSize: "13px", color: "#555", fontStyle: "normal" }}>Donald Trump, réunion finale du Situation Room, 26 février 2026.</span>
            <br /><br />
            «&nbsp;Operation Epic Fury is approved. No aborts. Good luck.&nbsp;»<br />
            <span style={{ fontSize: "13px", color: "#555", fontStyle: "normal" }}>Ordre transmis depuis Air Force One, 27 février, 22 minutes avant la deadline fixée par le général Caine.</span>
            <span style={{ display: "block", marginTop: "16px", fontStyle: "normal", fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8a7f72" }}>
              Source&nbsp;: New York Times, Haberman &amp; Swan, 7 avril 2026
            </span>
          </blockquote>
        </ScrollReveal>

        <p>Le <em>New York Times</em> conclut&nbsp;: «&nbsp;The U.S. decision to strike Iran was a victory for Mr. Netanyahu.&nbsp;»</p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        <h2>II. Treize jours</h2>

        {/* IMAGE II — Kennedy */}
        <figure style={{ margin: "48px -40px 56px" }}>
          <picture>
            <source srcSet="/grands-formats/chambre-kennedy.avif" type="image/avif" />
            <img src="/grands-formats/chambre-kennedy.jpg"
              alt="Kennedy seul, octobre 1962, illustration éditoriale"
              style={{ width: "100%", height: "auto", display: "block" }} />
          </picture>
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            Octobre 1962. Kennedy seul avec les photos U-2 et <em>The Guns of August</em> de Barbara Tuchman. © Soara.
          </figcaption>
        </figure>

        <p>Soixante-quatre ans plus tôt, même ville, même bâtiment. Le 16 octobre 1962, McGeorge Bundy réveilla Kennedy à 9 heures du matin. Un avion espion U-2 avait photographié des sites de lancement de missiles soviétiques à Cuba.</p>

        <p>Kennedy réunit quatorze conseillers, l&apos;ExComm. Dès la première réunion, il pose une question que personne d&apos;autre ne pose&nbsp;: «&nbsp;We ought to think of why the Russians did this.&nbsp;» Comprendre la logique de l&apos;adversaire avant de décider comment répondre. Ce réflexe avait été forgé par la Baie des Cochons, en 1961, où il avait fait confiance aveuglément à la CIA et aux généraux. Il avait dit après&nbsp;: «&nbsp;How could I have been so stupid?&nbsp;» Il n&apos;avait pas oublié.</p>

        <p>Il lisait aussi. <em>The Guns of August</em> de Barbara Tuchman, l&apos;histoire de comment les dirigeants européens avaient glissé dans la Première Guerre mondiale sans jamais vraiment décider de la vouloir. Le général Curtis LeMay lui disait que refuser de frapper Cuba immédiatement, c&apos;était l&apos;équivalent de Munich. Kennedy tenait.</p>

        <p>Le jour le plus dangereux fut le samedi 27 octobre, le «&nbsp;Black Saturday.&nbsp;» Un U-2 américain avait été abattu au-dessus de Cuba. Et Khrouchtchev venait d&apos;envoyer une deuxième lettre publique, plus dure que la première&nbsp;: retrait des missiles américains de Turquie contre retrait des missiles soviétiques de Cuba. L&apos;ExComm au complet voulait ignorer cette lettre. Tout le monde&nbsp;: McNamara, Bundy, Rusk, Thompson, Robert Kennedy lui-même. Cela ferait paraître l&apos;Amérique faible. Cela compromettrait l&apos;OTAN.</p>

        <p>Kennedy écouta. Puis agit autrement. Publiquement, il répondit à la lettre du vendredi, c&apos;est ce que ses conseillers voulaient. Mais ce soir-là, il envoya Robert Kennedy rencontrer secrètement l&apos;ambassadeur soviétique Dobrynin. Message&nbsp;: les missiles Jupiter seraient retirés de Turquie dans les six mois. Deal secret. C&apos;était le vrai compromis, celui que Kennedy avait voulu dès le début, obtenu par le côté, sans le dire.</p>

        <div className="pull-quote">
          <p>«&nbsp;Ces généraux ont un grand avantage&nbsp;: si nous les écoutons et faisons ce qu&apos;ils veulent, aucun de nous ne sera en vie plus tard pour leur dire qu&apos;ils avaient tort.&nbsp;»
            <br /><span style={{ fontSize: "13px", fontStyle: "normal", opacity: 0.9, color: "#8a7f72" }}>John F. Kennedy, à son aide Dave Powers. Octobre 1962.</span>
          </p>
        </div>

        <p>La crise se dénoua. Le monde ne brûla pas. Et pendant ces treize jours, aucun dirigeant étranger ne franchit la porte du Situation Room pour convaincre Kennedy de quoi que ce soit.</p>

        {/* CHARNIÈRE */}
        <ScrollReveal>
          <div style={{ background: "#F5F0E8", borderLeft: "3px solid #1A2744", padding: "24px 28px", margin: "48px 0", fontFamily: "Georgia, serif", fontSize: "15px", fontStyle: "italic", lineHeight: "1.75", color: "#1A2744" }}>
            <p style={{ margin: "0 0 12px" }}>En 1962, Kennedy est le président le plus enclin à la diplomatie dans une pièce pleine de faucons. Ses instincts le poussent vers le compromis, contre l&apos;avis de ses propres institutions. Il gagne.</p>
            <p style={{ margin: "0 0 12px" }}>En 2026, Trump est le président le plus enclin à la guerre dans une pièce où tous ses conseillers lui disent que le plan est «&nbsp;farcical&nbsp;». Ses instincts le poussent vers le conflit, contre l&apos;avis de ses propres institutions. Il gagne aussi.</p>
            <p style={{ margin: 0 }}>La direction de la résistance est exactement inversée. Le résultat institutionnel est identique&nbsp;: le président passe outre. Ce que cela révèle n&apos;est pas une question de personnalité, c&apos;est une question de système.</p>
          </div>
        </ScrollReveal>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        <h2>III. Washington comme chambre de ratification</h2>

        {/* Tableau comparatif */}
        <ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "#DDD9D2", margin: "48px 0", border: "1px solid #DDD9D2" }}>
            <div style={{ background: "#F5F0E8", padding: "28px 24px" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "52px", fontWeight: 900, color: "#DDD9D2", lineHeight: 1, marginBottom: "8px" }}>1962</div>
              <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8860B", marginBottom: "16px" }}>Cuba, Kennedy</div>
              <p style={{ fontSize: "14px", lineHeight: "1.65", margin: 0 }}>Instincts du président&nbsp;: vers la diplomatie. Pression de l&apos;institution&nbsp;: vers la frappe. Kennedy résiste à ses généraux. Aucun dirigeant étranger dans la pièce. Issue&nbsp;: pas de guerre.</p>
            </div>
            <div style={{ background: "#F5F0E8", padding: "28px 24px" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "52px", fontWeight: 900, color: "#DDD9D2", lineHeight: 1, marginBottom: "8px" }}>2026</div>
              <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8860B", marginBottom: "16px" }}>Iran, Trump</div>
              <p style={{ fontSize: "14px", lineHeight: "1.65", margin: 0 }}>Instincts du président&nbsp;: vers la guerre. CIA, état-major, vice-président disent «&nbsp;farcical&nbsp;». Trump passe outre. Un dirigeant étranger a cadré la décision. Issue&nbsp;: Epic Fury.</p>
            </div>
          </div>
        </ScrollReveal>

        <p>En 1962, la menace est établie par les services américains, délibérée entre Américains, résolue par un président qui résistait à ses propres faucons.</p>

        <p>En 2026, la menace a été définie, cadrée et vendue par un dirigeant étranger. Les faucons qui poussent à la guerre ne sont pas les généraux américains, ce sont eux qui disent «&nbsp;farcical&nbsp;» et «&nbsp;bullshit&nbsp;». Et pourtant, la guerre a lieu.</p>

        <p>Le général Caine posait constamment la question&nbsp;: «&nbsp;And then what?&nbsp;» Mais Trump, note le <em>New York Times</em>, «&nbsp;seemingly heard only what he wanted to hear.&nbsp;» Ce n&apos;est pas une défaillance individuelle. C&apos;est la description d&apos;un système où la délibération a été remplacée par la déférence.</p>

        <p>En 1962, le président était le filtre entre les impulsions belliqueuses de ses institutions et la décision finale. En 2026, ce filtre a disparu. La CIA dit toujours «&nbsp;farcical&nbsp;» quand un plan est farcesque. Les généraux calculent toujours les risques. Ce qui a changé, c&apos;est ce que le président choisit d&apos;entendre.</p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        <h2>IV. La boucle de soixante-dix ans</h2>

        {/* IMAGE III — Téhéran */}
        <figure style={{ margin: "48px -40px 56px" }}>
          <picture>
            <source srcSet="/grands-formats/chambre-tehran.avif" type="image/avif" />
            <img src="/grands-formats/chambre-tehran.jpg"
              alt="Téhéran, août 1953, illustration éditoriale"
              style={{ width: "100%", height: "auto", display: "block" }} />
          </picture>
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            Téhéran, août 1953. L&apos;opération Ajax renverse Mohammad Mossadegh. La boucle commence. © Soara.
          </figcaption>
        </figure>

        <p>Dans la présentation du 11 février, un détail que la presse a presque entièrement ignoré&nbsp;: parmi les visages de la vidéo projetée sur les écrans du Situation Room, il y avait <strong>Reza Pahlavi</strong>, «&nbsp;the exiled son of Iran&apos;s last shah, now a Washington-based dissident who had tried to position himself as a secular leader who could shepherd Iran toward a post-theocratic government&nbsp;», selon le <em>New York Times</em>.</p>

        <p>Soixante-dix ans après que la CIA avait installé son père au pouvoir à Téhéran, le fils apparaissait sur les mêmes écrans, dans la même ville, présenté comme la solution à un problème que son père avait lui-même engendré.</p>

        <p>Le 19 août 1953, l&apos;opération Ajax renversait Mohammad Mossadegh, premier ministre démocratiquement élu, qui avait osé nationaliser le pétrole iranien. Kermit Roosevelt arriva à Téhéran avec des valises d&apos;argent pour acheter des foules, corrompre des journaux, fabriquer une opposition. Le Shah fut remis sur son trône. Il régna vingt-six ans avec la SAVAK, police secrète formée par la CIA, comme instrument de terreur. En 1979, la révolution islamique produisit exactement ce que l&apos;Amérique craignait le plus. Khamenei en avait tiré une leçon formulée sans détour&nbsp;: «&nbsp;Nous ne sommes pas des libéraux comme Allende et Mossadegh, que la CIA peut étouffer.&nbsp;»</p>

        {/* IMAGE IV — La boucle */}
        <figure style={{ margin: "48px -40px 56px" }}>
          <picture>
            <source srcSet="/grands-formats/chambre-boucle.avif" type="image/avif" />
            <img src="/grands-formats/chambre-boucle.jpg"
              alt="La boucle 1953-2026, illustration éditoriale"
              style={{ width: "100%", height: "auto", display: "block" }} />
          </picture>
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            1953-2026. Le Shah et son fils. Le coup d&apos;État de la CIA et la présentation du Mossad. Soixante-dix ans du même film. © Soara.
          </figcaption>
        </figure>

        <div className="pull-quote">
          <p>1953 crée le Shah. Le Shah crée la Révolution. La Révolution crée la République islamique. La République islamique crée le programme nucléaire. Le programme nucléaire crée la menace que Netanyahu vend à Trump en 2026. Et sur les écrans du Situation Room apparaît Reza Pahlavi, fils du régime fabriqué par la CIA, proposé comme remède à la maladie que ce régime a lui-même engendrée.</p>
        </div>

        <p>Répéter les mêmes actes en espérant des résultats différents, c&apos;est de la folie stratégique. Répéter les mêmes actes en ayant <strong>oublié qu&apos;on les avait déjà faits</strong>, c&apos;est autre chose.</p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        <h2>V. Le spectacle et la décision</h2>

        <p>En 1962, Kennedy recevait des photos en noir et blanc prises par un avion espion. Images froides, techniques, sans narration. Il devait construire lui-même l&apos;interprétation, projeter lui-même les conséquences. C&apos;est ce travail, nourri par la lecture de Tuchman, informé par l&apos;échec de la Baie des Cochons, qui lui permit de résister à ses généraux.</p>

        <p>En 2026, Trump a reçu une production. Grands écrans. Directeur du Mossad en visioconférence depuis Tel Aviv. Officiers israéliens en arrière-plan. Une vidéo, des visages, des noms, une promesse de futur. «&nbsp;It seemed to land well with the most important person in the room,&nbsp;» écrit le <em>New York Times</em>. Le Situation Room était devenu une salle de projection.</p>

        <p>Netanyahu n&apos;a pas vendu un plan de guerre. Il a vendu un <strong>film de guerre</strong>, exposition claire, action crédible, dénouement heureux. Que l&apos;Iran lance des missiles chaque jour depuis six semaines, que le détroit d&apos;Ormuz soit fermé, que le soulèvement populaire n&apos;ait pas eu lieu, le film avait déjà accompli son travail.</p>

        <p>Le <em>New York Times</em> rapporte que les conseillers de Trump le voyaient comme «&nbsp;un grand homme de l&apos;histoire&nbsp;» avec une confiance presque superstitieuse en ses instincts, et que sa décision «&nbsp;was not driven by intelligence assessments or a strategic consensus among his advisers, which did not exist.&nbsp;» Kennedy se méfiait de ses instincts. Il les soumettait à l&apos;épreuve des faits, de l&apos;histoire, de la logique de l&apos;adversaire. Ce n&apos;est pas un trait de caractère&nbsp;: c&apos;est une méthode. Et la méthode fait la différence entre une délibération et un film.</p>

        {/* ÉPILOGUE */}
        <ScrollReveal>
          <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: "40px", marginTop: "56px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#B8860B", marginBottom: "24px" }}>Épilogue</div>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontStyle: "italic", lineHeight: "1.75", color: "#2a2a2a", marginBottom: "1.4em" }}>
              Le cessez-le-feu a été annoncé. L&apos;Iran dit que le détroit est fermé. Netanyahu dit que le doigt est sur la gâchette. L&apos;uranium enrichi n&apos;a pas été retiré. Et Reza Pahlavi est toujours à Washington.
            </p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontStyle: "italic", lineHeight: "1.75", color: "#2a2a2a", marginBottom: "2em" }}>
              Soixante-dix ans après que son père fut installé au pouvoir par la CIA, le fils attend dans les coulisses d&apos;une histoire qui se répète, sans même se donner la peine de changer de titre.
            </p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "21px", fontWeight: 700, fontStyle: "italic", lineHeight: "1.55", color: "#1a1a1a", borderTop: "1px solid #DDD9D2", paddingTop: "28px", marginBottom: 0 }}>
              Si Washington est devenu une chambre de ratification, la question suivante est immédiate&nbsp;: ratification de quoi, et par qui, la prochaine fois&nbsp;?
            </p>
          </div>
        </ScrollReveal>

        {/* SOURCES */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "2px solid #DDD9D2" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8a7f72", marginBottom: "12px" }}>Sources</div>
          <p style={{ fontSize: "13px", color: "#8a7f72", lineHeight: "1.6" }}>
            <strong>Source principale&nbsp;:</strong> Jonathan Swan &amp; Maggie Haberman, «&nbsp;How Trump Took the U.S. to War With Iran&nbsp;», <em>New York Times</em>, 7 avril 2026. Extrait du livre <em>Regime Change&nbsp;: Inside the Imperial Presidency of Donald Trump</em>, Simon &amp; Schuster, juin 2026.
          </p>
          <p style={{ fontSize: "13px", color: "#8a7f72", lineHeight: "1.6" }}>
            <strong>1962&nbsp;:</strong> JFK Library (archives ExComm, podcast Atomic Gambit, Black Saturday), Miller Center, History State Department, CFR, HISTORY.com.
          </p>
          <p style={{ fontSize: "13px", color: "#8a7f72", lineHeight: "1.6" }}>
            <strong>1953&nbsp;:</strong> Encyclopædia Britannica, Foreign Policy, RFE/RL, PBS NewsHour, Lapham&apos;s Quarterly, CIA documents déclassifiés (2013, 2017), Stephen Kinzer, <em>All the Shah&apos;s Men</em>.
          </p>
        </div>

      </div>
    </GrandFormatLayout>
  );
}
