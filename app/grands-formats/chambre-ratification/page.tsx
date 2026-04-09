import GrandFormatLayout from "../../../components/GrandFormatLayout";

export const metadata = {
  title: "La chambre de ratification — Prisme",
  description: "Comment Benjamin Netanyahu a décidé une guerre américaine. Une enquête en miroir : le Situation Room en 2026, le Situation Room en 1962, et soixante-dix ans d'une boucle qui ne se referme pas.",
};

export default function ChambreRatificationPage() {
  return (
    <GrandFormatLayout
      slug="chambre-ratification"
      author="Steve Moradel"
      authorRole="Fondateur · Prisme"
    >
      <div className="soara-article">

        {/* ── SOURCE NYT ── */}
        <div style={{
          background: "#F5F0E8",
          borderLeft: "4px solid #1A2744",
          padding: "20px 28px",
          marginBottom: "48px",
          fontFamily: "Georgia, serif",
          fontSize: "15px",
          lineHeight: "1.65",
          color: "#4a4540"
        }}>
          <strong style={{ color: "#1A2744", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Source</strong>
          Le 7 avril 2026, le <em>New York Times</em> publiait une enquête de Maggie Haberman et Jonathan Swan :
          {" "}<strong>«&nbsp;How Trump Took the U.S. to War With Iran&nbsp;»</strong>. Tirée du matériau de leur prochain livre
          {" "}<em>Regime Change : Inside the Imperial Presidency of Donald Trump</em>, elle reconstituait,
          témoignage après témoignage, la scène qui mit les États-Unis en guerre contre l'Iran.
          Ce texte part de cette scène — et va là où le <em>New York Times</em> n&apos;est pas allé.{" "}
          <a
            href="https://www.nytimes.com/2026/04/07/us/politics/trump-iran-war-netanyahu.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#B8860B", textDecoration: "underline" }}
          >
            Lire l&apos;enquête originale →
          </a>
        </div>

        {/* ── OUVERTURE ── */}
        <p>
          <strong>Ce n&apos;est pas une image de guerre.</strong> Pas de fumée sur Téhéran, pas de conférence de presse,
          pas de missile en vol. C&apos;est une image d&apos;intérieur — presque intime dans sa géographie de pouvoir.
        </p>
        <p>
          Le 11 février 2026, dans le Situation Room de la Maison-Blanche, Donald Trump ne s&apos;est pas assis
          à la tête de la table en acajou. Il s&apos;est assis sur le côté. En face de lui, Benjamin Netanyahu.
          Derrière le Premier ministre israélien, sur les grands écrans montés le long du mur, apparaissait
          en visioconférence depuis Tel Aviv le directeur du Mossad, David Barnea, encadré d&apos;officiers
          supérieurs en tenue. La scénographie était celle d&apos;un état-major en guerre. La réunion était
          censée être une consultation. Elle était, en réalité, une présentation de vente.
        </p>
        <p>Dix-sept jours plus tard, le 28 février, les États-Unis entraient en guerre contre l&apos;Iran.</p>

        {/* ── IMAGE 1 ── */}
        <figure style={{ margin: "56px -40px", display: "block" }}>
          <div style={{
            width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, #0d1b2e 0%, #1a2744 40%, #1e3a5f 70%, #0d1b2e 100%)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {/* Remplacer par <img src="/grands-formats/chambre-illustration-1.jpg" alt="..." /> quand David livre */}
            <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", textAlign: "center" }}>
              Illustration I — Le Situation Room, 11 février 2026
            </span>
          </div>
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            Le Situation Room, 11 février 2026. Scène reconstituée par le <em>New York Times</em> à partir de témoignages
            de responsables américains. Trump assis sur le côté. Netanyahu en face. Le directeur du Mossad sur les écrans.
            Illustration éditoriale — David [NOM], pour Prisme.
          </figcaption>
        </figure>

        {/* ── SECTION I ── */}
        <h2>I. La scène</h2>

        <p>
          Netanyahu a parlé pendant trois heures. Il était, selon le <em>New York Times</em>,
          {" "}<em>«&nbsp;déterminé à maintenir le président américain sur le chemin de la guerre.&nbsp;»</em>
          Sa thèse tenait en quatre points : tuer le Guide suprême Ali Khamenei, détruire le programme
          balistique iranien, déclencher un soulèvement populaire, installer un nouveau régime.
          Pour chacun, il avait une réponse, une carte, un chiffre.
        </p>
        <p>
          Le programme de missiles iraniens serait anéanti en quelques semaines. L&apos;Iran serait trop
          affaibli pour fermer le détroit d&apos;Ormuz. Le Mossad, opérant depuis l&apos;intérieur, ferait le reste.
          Puis les écrans ont changé. Des visages — des candidats possibles à la direction d&apos;un Iran
          post-islamiste. Parmi eux, Reza Pahlavi : le fils de l&apos;ancien Shah, dont le père avait été
          installé au pouvoir par la CIA en 1953, avant que l&apos;histoire ne le rattrape vingt-six ans plus tard.
        </p>

        <div className="pull-quote">
          <p>
            «&nbsp;Sounds good to me.&nbsp;»
            <br />
            <span style={{ fontSize: "13px", fontStyle: "normal", opacity: 0.7 }}>
              — Donald Trump, répondant à Netanyahu. Situation Room, 11 février 2026. Source : <em>New York Times</em>
            </span>
          </p>
        </div>

        <p>
          Le lendemain, sans l&apos;équipe israélienne, les responsables américains se réunirent seuls.
          Le directeur de la CIA John Ratcliffe décrivit les scénarios de changement de régime en un mot :
          {" "}<strong><em>«&nbsp;farcical.&nbsp;»</em></strong> Le Secrétaire d&apos;État Marco Rubio traduisit :
          {" "}<strong><em>«&nbsp;In other words, it&apos;s bullshit.&nbsp;»</em></strong> Le général Dan Caine,
          chef d&apos;état-major interarmées, dit au Président une chose qui ressemble à un aveu institutionnel :
        </p>

        <blockquote style={{
          margin: "40px 0", padding: "24px 32px", background: "#1A2744", color: "#c8bfaa",
          fontFamily: "Georgia, serif", fontSize: "16px", fontStyle: "italic", lineHeight: "1.75", borderRadius: "2px"
        }}>
          «&nbsp;Sir, c&apos;est, dans mon expérience, la procédure opérationnelle standard des Israéliens.
          Ils survendent, et leurs plans ne sont pas toujours bien développés.
          Ils savent qu&apos;ils ont besoin de nous, et c&apos;est pourquoi ils font une vente forcée.&nbsp;»
          <span style={{ display: "block", marginTop: "12px", fontStyle: "normal", fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6355" }}>
            Général Dan Caine, chef d&apos;état-major — source : New York Times
          </span>
        </blockquote>

        <p>
          JD Vance avait averti que la guerre contre l&apos;Iran pourrait provoquer un chaos régional et
          des pertes incalculables. Tucker Carlson, l&apos;un des rares à avoir directement lobbié contre
          la guerre, avait dit au Président qu&apos;il ne devrait pas
          {" "}<em>«&nbsp;être mis dans une boîte par Israël&nbsp;»</em> — que le désir israélien d&apos;attaquer
          l&apos;Iran était <em>«&nbsp;la seule raison pour laquelle les États-Unis envisageaient même une frappe.&nbsp;»</em>
        </p>
        <p>
          Le 26 février, réunion finale. Trump fit le tour de la table. Chacun formula ses réserves —
          puis se rangea. Le lendemain, à bord d&apos;Air Force One, il donna l&apos;autorisation finale.
          L&apos;opération s&apos;appelait Epic Fury.
        </p>
        <p>
          Le <em>New York Times</em> résuma ainsi :{" "}
          <em>«&nbsp;La décision américaine de frapper l&apos;Iran était une victoire pour M. Netanyahu.&nbsp;»</em>
        </p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        {/* ── SECTION II ── */}
        <h2>II. Treize jours</h2>

        {/* ── IMAGE 2 ── */}
        <figure style={{ margin: "48px -40px 56px" }}>
          <div style={{
            width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, #1a1208 0%, #2d1f0a 40%, #3d2b10 60%, #1a1208 100%)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", textAlign: "center" }}>
              Illustration II — Kennedy seul, octobre 1962
            </span>
          </div>
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            Octobre 1962. Entre deux réunions de l&apos;ExComm, Kennedy seul avec les photos U-2
            et <em>The Guns of August</em> de Barbara Tuchman. Illustration éditoriale — David [NOM], pour Prisme.
          </figcaption>
        </figure>

        <p>
          Soixante-quatre ans plus tôt, même ville, même bâtiment. Le 16 octobre 1962, McGeorge Bundy
          réveilla Kennedy à 9 heures du matin. Un avion espion U-2 avait photographié des sites de lancement
          de missiles soviétiques à Cuba. Le monde était à quatre-vingt-dix miles d&apos;une apocalypse nucléaire.
        </p>
        <p>
          Kennedy réunit quatorze conseillers — l&apos;ExComm. Treize jours de délibérations intenses.
          Toutes les options examinées : ne rien faire, négocier, blocus naval, frappes aériennes chirurgicales,
          invasion totale. Le général Curtis LeMay poussait avec une intensité que les historiens décrivent
          encore comme alarmante. Le blocus, lui disait-il, c&apos;était Munich. Il fallait frapper.
          Kennedy lui-même penchait d&apos;abord vers les frappes aériennes.
        </p>
        <p>
          Mais Kennedy lisait. <em>The Guns of August</em> de Barbara Tuchman — l&apos;histoire de comment
          les dirigeants européens avaient glissé dans la Première Guerre mondiale sans jamais vraiment
          décider de la vouloir. Par inertie, par orgueil, par refus d&apos;imaginer la suite. Il ne
          voulait pas être ce président-là.
        </p>

        <div className="pull-quote">
          <p>
            «&nbsp;Ces généraux ont un grand avantage : si nous les écoutons et faisons ce qu&apos;ils veulent,
            aucun de nous ne sera en vie plus tard pour leur dire qu&apos;ils avaient tort.&nbsp;»
            <br />
            <span style={{ fontSize: "13px", fontStyle: "normal", opacity: 0.7 }}>
              — John F. Kennedy, à son aide Dave Powers. Octobre 1962.
            </span>
          </p>
        </div>

        <p>
          Il tint bon contre ses généraux. Contre son frère Robert, qui fut faucon jusqu&apos;au bout.
          Contre la quasi-totalité de son ExComm. Le 27 octobre — le jour le plus dangereux —
          quand l&apos;URSS proposa de démanteler ses missiles à Cuba contre le retrait des missiles
          américains en Turquie, Kennedy voulut accepter. Tout le monde dans la pièce s&apos;y opposa :
          ce serait perçu comme une faiblesse, dirent-ils. Kennedy répondit :
          {" "}<em>«&nbsp;C&apos;est une offre publique. Nous ne pouvons pas la rejeter.&nbsp;»</em>
        </p>
        <p>
          La crise se dénoua. Le monde ne brûla pas. Et pendant ces treize jours, aucun dirigeant
          étranger ne franchit la porte du Situation Room pour convaincre Kennedy de quoi que ce soit.
        </p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        {/* ── SECTION III ── */}
        <h2>III. Washington comme chambre de ratification</h2>

        {/* Tableau comparatif */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px",
          background: "#DDD9D2", margin: "48px 0", border: "1px solid #DDD9D2"
        }}>
          <div style={{ background: "#F5F0E8", padding: "28px 24px" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "52px", fontWeight: 900, color: "#DDD9D2", lineHeight: 1, marginBottom: "8px" }}>1962</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8860B", marginBottom: "16px" }}>Cuba — Kennedy</div>
            <p style={{ fontSize: "14px", lineHeight: "1.65", margin: 0 }}>
              La menace est découverte par des avions espions américains. Délibération intérieure, 13 jours.
              Les faucons sont les propres généraux américains. Kennedy résiste à ses généraux.
              Aucun dirigeant étranger dans la pièce.
            </p>
          </div>
          <div style={{ background: "#F5F0E8", padding: "28px 24px" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "52px", fontWeight: 900, color: "#DDD9D2", lineHeight: 1, marginBottom: "8px" }}>2026</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8860B", marginBottom: "16px" }}>Iran — Trump</div>
            <p style={{ fontSize: "14px", lineHeight: "1.65", margin: 0 }}>
              La menace est cadrée et vendue par un dirigeant étranger. Les généraux américains disent
              &quot;farcical&quot;. La résistance vient de l&apos;intérieur de l&apos;administration.
              La décision repose sur un gut feeling et une présentation de trois heures.
            </p>
          </div>
        </div>

        <p>
          En 1962, la menace que découvre l&apos;Amérique est la sienne propre. Des avions espions américains
          photographient des missiles sur une île à quatre-vingt-dix miles de ses côtes. Personne n&apos;est
          venu définir la menace à Washington — elle a été établie par les services américains, délibérée
          entre Américains, résolue par un président américain qui résistait à ses propres faucons.
        </p>
        <p>
          En 2026, la menace a été définie, cadrée et vendue par un dirigeant étranger. Les faucons
          qui poussent à la guerre ne sont pas les généraux américains — ce sont eux, précisément,
          qui disent <em>farcical</em> et <em>bullshit</em>. Et pourtant, la guerre a lieu.
        </p>
        <p>
          Ce n&apos;est pas une question morale sur Trump ou Netanyahu. C&apos;est une question institutionnelle :
          à quel moment le premier appareil militaire du monde est-il devenu une force à louer ?
          Le général Caine l&apos;a formulé sans détour : <em>«&nbsp;Ils savent qu&apos;ils ont besoin de nous,
          et c&apos;est pourquoi ils font une vente forcée.&nbsp;»</em> Ce sont les mots d&apos;un homme
          qui décrit une transaction — pas une alliance.
        </p>
        <p>
          Regardez la progression sur soixante ans. En 1962 : délibération américaine sur information
          américaine. En 2003 : fabrication américaine d&apos;une menace — fraude interne, mais nominalement
          américaine. En 2026 : un Premier ministre étranger arrive avec ses propres écrans, son propre
          directeur du Mossad en visioconférence, sa propre vidéo de candidats au pouvoir. La décision
          est prise en trois heures.
        </p>
        <p>
          Tucker Carlson avait averti Trump qu&apos;il ne devrait pas être
          {" "}<em>«&nbsp;mis dans une boîte par Israël.&nbsp;»</em> Ces mots n&apos;auraient eu aucun sens
          dans la bouche d&apos;un conseiller de Kennedy en 1962. Non parce que l&apos;Amérique de 1962 était
          plus pure — mais parce que la question ne se posait pas. Il était évident que c&apos;était
          Washington qui décidait.
        </p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        {/* ── SECTION IV ── */}
        <h2>IV. La boucle de soixante-dix ans</h2>

        {/* ── IMAGE 3 ── */}
        <figure style={{ margin: "48px -40px 56px" }}>
          <div style={{
            width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, #1a0e06 0%, #3b2106 40%, #5c3409 60%, #2a1506 100%)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", textAlign: "center" }}>
              Illustration III — Téhéran, août 1953
            </span>
          </div>
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            Téhéran, août 1953. L&apos;opération Ajax renverse Mohammad Mossadegh, premier ministre
            démocratiquement élu. Le Shah est réinstallé. La boucle commence.
            Illustration éditoriale — David [NOM], pour Prisme.
          </figcaption>
        </figure>

        <p>
          Dans la présentation de Netanyahu du 11 février, un détail que la presse a presque
          entièrement ignoré : parmi les visages projetés sur les écrans du Situation Room comme
          candidats à diriger un Iran post-islamiste, il y avait <strong>Reza Pahlavi</strong>.
        </p>
        <p>
          Soixante-dix ans après que la CIA avait installé son père au pouvoir à Téhéran, le fils
          apparaissait sur les mêmes écrans, dans la même ville, présenté comme la solution à un
          problème que son père avait lui-même engendré.
        </p>
        <p>
          Le 19 août 1953, l&apos;opération Ajax renversait Mohammad Mossadegh — premier ministre
          démocratiquement élu, nationaliste, homme qui avait osé revendiquer pour l&apos;Iran le
          contrôle de son pétrole. La Grande-Bretagne avait convaincu Washington que Mossadegh était
          une porte d&apos;entrée pour les Soviétiques. Eisenhower avait signé. Kermit Roosevelt,
          petit-fils de Theodore, arriva à Téhéran avec des valises d&apos;argent pour acheter des foules,
          corrompre des journaux, fabriquer une opposition. Le Shah Mohammad Reza Pahlavi fut remis sur son trône.
        </p>

        {/* ── IMAGE 4 ── */}
        <figure style={{ margin: "48px -40px 56px" }}>
          <div style={{
            width: "100%", aspectRatio: "16/9", background: "linear-gradient(90deg, #2d1f0a 0%, #1a1208 45%, #1a2744 55%, #0d1b2e 100%)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", textAlign: "center" }}>
              Illustration IV — La boucle fermée : 1953 / 2026
            </span>
          </div>
          <figcaption style={{ padding: "12px 0 0", fontFamily: "monospace", fontSize: "10.5px", letterSpacing: "0.08em", color: "#8a7f72", borderTop: "1px solid #DDD9D2" }}>
            1953 — 2026. Le Shah et son fils. Le coup d&apos;État de la CIA et la présentation du Mossad.
            Soixante-dix ans du même film. Illustration éditoriale — David [NOM], pour Prisme.
          </figcaption>
        </figure>

        <p>
          Le Shah régna vingt-six ans, de plus en plus brutal, avec la SAVAK — police secrète formée
          par la CIA — comme instrument de terreur. En 1979, la révolution islamique produisit exactement
          ce que l&apos;Amérique craignait le plus : un régime anti-occidental, nucléarisé, déterminé
          à ne jamais se laisser prendre comme Mossadegh. Khamenei lui-même avait une formule pour
          exprimer cette leçon :
          {" "}<em>«&nbsp;Nous ne sommes pas des libéraux comme Allende et Mossadegh, que la CIA peut étouffer.&nbsp;»</em>
        </p>

        <div className="pull-quote">
          <p>
            1953 crée le Shah. Le Shah crée la Révolution. La Révolution crée la République islamique.
            La République islamique crée le programme nucléaire. Le programme nucléaire crée la menace
            que Netanyahu vend à Trump en 2026. Et sur les écrans du Situation Room apparaît Reza Pahlavi —
            fils du régime fabriqué par la CIA, proposé comme remède à la maladie que ce régime a lui-même engendrée.
          </p>
        </div>

        <p>
          La définition de la folie stratégique, dit-on, c&apos;est de répéter les mêmes actes en espérant
          des résultats différents. Mais il y a quelque chose de plus grave : répéter les mêmes actes
          en ayant oublié qu&apos;on les avait déjà faits.
        </p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        {/* ── SECTION V ── */}
        <h2>V. Le spectacle et la décision</h2>

        <p>
          En 1962, Kennedy recevait des photos en noir et blanc prises par un avion espion.
          Images froides, techniques, sans narration. Il devait construire lui-même l&apos;interprétation,
          projeter lui-même les conséquences. C&apos;est ce travail — nourri par la lecture de Tuchman —
          qui lui permit de tenir contre ses propres généraux.
        </p>
        <p>
          En 2026, Trump a reçu une production. Grands écrans. Directeur du Mossad en visioconférence.
          Officiers israéliens en arrière-plan. Et une vidéo — des visages, des noms, une promesse
          de futur. Le Situation Room était devenu une salle de projection.
        </p>
        <p>
          Ce glissement n&apos;est pas anodin. Quand l&apos;argument est performé plutôt que démontré,
          la décision change de nature. Netanyahu n&apos;a pas vendu un plan de guerre.
          Il a vendu un <strong>film de guerre</strong> — exposition claire, action crédible, dénouement heureux.
          Que l&apos;Iran ait lancé chaque jour des missiles balistiques depuis six semaines, que le détroit
          d&apos;Ormuz soit fermé, que le soulèvement populaire n&apos;ait pas eu lieu — c&apos;est une autre histoire.
          Le film avait déjà accompli son travail.
        </p>
        <p>
          Le <em>New York Times</em> note que les conseillers de Trump le voyaient comme
          {" "}<em>«&nbsp;un grand homme de l&apos;histoire&nbsp;»</em> avec une confiance presque superstitieuse
          en ses instincts. Kennedy se méfiait de ses instincts. Il lisait, délibérait, cherchait
          à comprendre <em>pourquoi</em> les Soviétiques avaient fait ce qu&apos;ils avaient fait avant
          de décider comment répondre. Trump était convaincu que la guerre serait courte. Il avait
          vu un film de victoire.
        </p>

        <hr style={{ margin: "56px 0", border: "none", borderTop: "1px solid #DDD9D2" }} />

        {/* ── ÉPILOGUE ── */}
        <div style={{
          background: "#1A2744", color: "#c8bfaa", padding: "48px 40px", margin: "0 -40px"
        }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#B8860B", marginBottom: "20px" }}>
            Épilogue
          </div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontStyle: "italic", lineHeight: "1.7", color: "#c8bfaa", marginBottom: "1.4em" }}>
            Le cessez-le-feu a été annoncé. L&apos;Iran dit que le détroit est fermé.
            Netanyahu dit que le doigt est sur la gâchette. L&apos;uranium enrichi n&apos;a pas été retiré.
            Et Reza Pahlavi est toujours à Washington.
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontStyle: "italic", lineHeight: "1.7", color: "#c8bfaa", marginBottom: "1.4em" }}>
            Soixante-dix ans après que son père fut installé au pouvoir par la CIA, le fils attend
            dans les coulisses d&apos;une histoire qui se répète — sans même se donner la peine de changer de titre.
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 700, fontStyle: "italic", lineHeight: "1.5", color: "#f5f0e8", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "28px", marginTop: "28px", marginBottom: 0 }}>
            Si Washington est devenu une chambre de ratification, la question suivante est immédiate :
            ratification de quoi, et par qui, la prochaine fois ?
          </p>
        </div>

        {/* ── SOURCES ── */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "2px solid #DDD9D2" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8a7f72", marginBottom: "12px" }}>
            Sources
          </div>
          <p style={{ fontSize: "13px", color: "#8a7f72", lineHeight: "1.6" }}>
            <strong>2026 :</strong> New York Times — Maggie Haberman & Jonathan Swan, 7 avril 2026.
            Times of Israel, Haaretz, Jerusalem Post, Ynet News, Antiwar.com, Middle East Monitor.
          </p>
          <p style={{ fontSize: "13px", color: "#8a7f72", lineHeight: "1.6" }}>
            <strong>1962 :</strong> JFK Library, Miller Center, National Archives, HISTORY.com,
            Time Magazine — «&nbsp;Inside JFK&apos;s Decisionmaking During the Cuban Missile Crisis&nbsp;», James Blight.
          </p>
          <p style={{ fontSize: "13px", color: "#8a7f72", lineHeight: "1.6" }}>
            <strong>1953 :</strong> Encyclopædia Britannica, Foreign Policy, RFE/RL, PBS NewsHour,
            Lapham&apos;s Quarterly — Stephen Kinzer, <em>All the Shah&apos;s Men</em>.
          </p>
        </div>

      </div>
    </GrandFormatLayout>
  );
}
