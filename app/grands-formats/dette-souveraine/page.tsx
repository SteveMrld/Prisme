import Header from "../../../components/Header";
import DetteClient from "./DetteClient";
import styles from "./dette.module.css";

export const metadata = {
  title: "L'État insolvable — Prisme",
  description: "La dette souveraine mondiale a franchi 100 000 milliards de dollars. Ce n'est pas la dette qui inquiète. C'est ce qu'elle révèle.",
};

export default function DettePage() {
  return (
    <div className={styles.page}>
      <Header />

      {/* ── COVER ── */}
      <div style={{ width:"100%", maxHeight:"480px", overflow:"hidden", lineHeight:0 }}>
        <img
          src="/dette-souveraine-cover.jpg"
          alt="L'État insolvable — illustration"
          style={{ width:"100%", height:"480px", objectFit:"cover", objectPosition:"center 30%", display:"block" }}
        />
      </div>

      {/* ── HERO ── */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Grand Format · Économie politique</span>
          <h1 className={styles.title}>
            L'État <em>insolvable</em>
          </h1>
          <p className={styles.subtitle}>
            La dette souveraine comme destin civilisationnel
          </p>
          <div className={styles.meta}>
            <span>Steve Moradel</span>
            <span>Avril 2026</span>
            <span>Lecture · 12 min</span>
          </div>
        </div>
      </div>

      {/* ── WIDGET ── */}
      <div className={styles.widgetWrap}>
        <DetteClient />
      </div>

      {/* ── ARTICLE ── */}
      <div className={styles.body}>

        <div className={styles.section}>
          <p>
            <strong>Cent mille milliards de dollars.</strong> Prenons un instant pour mesurer ce que ce chiffre représente. Pas une projection catastrophiste, pas un scénario dystopique forgé par des économistes alarmistes. La dette publique mondiale a franchi ce seuil. Elle dépasse désormais 95&nbsp;% du PIB mondial. Soit, rapporté à chaque être humain vivant sur cette planète, une ardoise d'un peu plus de douze mille dollars par personne, nouveau-nés compris. Ce n'est pas la dette qui inquiète. Ce que la dette révèle, voilà le vrai sujet&nbsp;: des sociétés qui ont systématiquement préféré emprunter au futur plutôt que de trancher dans le présent, des démocraties qui ont fait de la promesse sans le financement leur mode de gouvernement ordinaire. La facture arrive. Pas sous forme de krach spectaculaire. Sous celle, bien plus sourde, d'un État qui rétrécit, qui renonce à éduquer ses enfants, à soigner ses malades, à défendre ses frontières. La dette publique n'est pas un problème de comptabilité nationale. C'est un révélateur anthropologique.
          </p>
          <p>
            Cinq pays concentrent à eux seuls près de 70&nbsp;% de cette masse&nbsp;: les États-Unis, la Chine, le Japon, la France et l'Italie. Quatre d'entre eux appartiennent au monde dit occidental, à ces démocraties qui ont fondé leur légitimité politique sur la promesse d'une prospérité partagée. Ce qu'ils ont produit à la place, c'est une montagne de promesses reportées, transmises à des générations qui n'ont pas encore voix au chapitre. Leurs trajectoires divergent. Leur diagnostic commun est le même&nbsp;: la dette n'est plus chez eux un instrument de politique publique. Elle est devenue la contrainte qui s'est substituée à la politique.
          </p>
        </div>

        <hr className={styles.divider}/>

        <div className={styles.section}>
          <p>
            <strong>Les États-Unis ont vécu pendant un demi-siècle sous le régime de ce que Valéry Giscard d'Estaing appelait le "privilège exorbitant".</strong> Emprunter dans sa propre monnaie, dans un monde qui a érigé le dollar en actif de réserve universel. Ce privilège se fissure. Avec près de 40&nbsp;000 milliards de dollars, soit 125&nbsp;% du PIB, les États-Unis représentent à eux seuls plus d'un tiers de la dette publique mondiale. En juin 2025, lors d'une tentative de lever 119 milliards de dollars, le ratio de couverture est tombé à 2,1, son plus bas niveau depuis plus de dix ans. Les taux longs se sont envolés&nbsp;: le 10 ans à 4,4&nbsp;%, le 30 ans à 5,1&nbsp;%. Dans le même temps, Moody's abaissait la note souveraine américaine. La signature américaine, longtemps refuge sans risque, commence à perdre de sa solidité.
          </p>
          <p>
            En 2025, les paiements d'intérêts sur la dette américaine ont dépassé 1&nbsp;100 milliards de dollars, devenant le premier poste de dépenses fédérales — devant la défense, devant Medicare. L'État fédéral de la première puissance mondiale dépense désormais plus pour rémunérer ses créanciers que pour assurer la sécurité de ses citoyens. Quand le service de la dette devient le premier poste budgétaire d'un empire, c'est que l'empire travaille pour ses créanciers. Il n'est plus vraiment souverain au sens plein du terme.
          </p>
          <p>
            <strong>La Chine présente le cas le plus opaque du classement.</strong> Sa dette officielle — 77&nbsp;% du PIB — paraît raisonnable. Mais une fois intégrées les dettes des collectivités locales, dissimulées dans des véhicules de financement hors bilan créés pour contourner les règles budgétaires centrales, le chiffre réel dépasse probablement 110 à 130&nbsp;% du PIB. C'est la dette qui ne dit pas son nom. La crise de l'immobilier depuis 2021, avec l'effondrement d'Evergrande et de ses semblables, a mis à nu cette fragilité. Ce qui distingue la Chine du reste du classement, c'est qu'elle combine une dette réelle élevée, une opacité structurelle, et un régime politique qui peut imposer des solutions que les démocraties libérales ne peuvent pas. C'est à la fois sa force et son impasse&nbsp;: la gestion autoritaire de la dette évite la panique à court terme, mais elle empêche le signal de prix qui forcerait les ajustements nécessaires.
          </p>
          <p>
            <strong>Le Japon est l'anomalie statistique qui fascine les économistes depuis trente ans.</strong> À 230&nbsp;% du PIB, il est le pays le plus endetté du monde parmi les économies développées. Et pourtant&nbsp;: pas de crise de confiance, pas de prime de risque explosive. 90&nbsp;% de la dette japonaise est détenue par des résidents, et la Banque du Japon rachète 50&nbsp;% des nouvelles émissions. Ce modèle repose sur un contrat social particulier&nbsp;: une population âgée, épargnante, qui finance l'État auquel elle fait confiance. Mais ce contrat a ses propres fragilités. Le vieillissement accéléré signifie que les épargnants d'aujourd'hui deviendront les désépargnants de demain. Le Japon prouve qu'une dette à 230&nbsp;% du PIB n'est pas automatiquement létale. Il ne prouve pas qu'elle est indéfiniment soutenable.
          </p>
          <p>
            <strong>La France incarne une contradiction douloureuse.</strong> Elle a construit l'un des systèmes de protection sociale les plus généreux au monde. Et elle ne peut plus le financer sans s'endetter davantage. Avec 3&nbsp;416 milliards d'euros de dette, soit 115,6&nbsp;% du PIB à mi-2025, son besoin de financement estimé à 370 milliards d'euros fait d'elle l'État européen qui lèvera le plus de dette en 2026. En cinq ans, le montant des intérêts a doublé&nbsp;: de 52,9 milliards d'euros en 2023 à 60,2 milliards en 2024. Et la structure de détention aggrave l'exposition&nbsp;: près d'un titre de dette sur deux est dans les mains d'investisseurs non résidents.
          </p>
          <p>
            <strong>L'Italie est le malade chronique</strong> de la zone euro, avec 137&nbsp;% du PIB — mais contrairement à la France, elle vit sous ce fardeau depuis un quart de siècle. Ce n'est plus une crise, c'est un état permanent. Ensemble, la France et l'Italie représentent près de la moitié de la dette publique totale de la zone euro. L'Italie illustre ce que les économistes nomment la stagnation séculaire&nbsp;: vingt-cinq ans de dette élevée, vingt-cinq ans de croissance quasi nulle.
          </p>
        </div>

        <hr className={styles.divider}/>

        <div className={styles.section}>
          <p>
            <strong>La question la plus importante que pose la dette souveraine n'est pas celle de sa soutenabilité. C'est celle de ce qu'elle empêche.</strong> En France, la charge annuelle de la dette est comparable au budget entier de l'Éducation nationale — 63 milliards d'euros dans le PLF 2025. Argent qui ne forme personne. Argent qui ne construit rien. Argent qui part rémunérer des créanciers sans contrepartie productive pour les générations à venir.
          </p>
          <p>
            Cette éviction se mesure dans le classement de Shanghai, où les universités françaises reculent depuis vingt ans. Elle se mesure dans les salaires des chercheurs français, parmi les plus bas d'Europe occidentale à niveau de qualification équivalent, produisant un exode silencieux vers Londres, Boston, Singapour. Quand un État doit choisir entre payer ses intérêts et former sa jeunesse, il choisit ses intérêts. Les marchés financiers n'attendent pas. Les enfants des banlieues, eux, peuvent attendre.
          </p>

          <div className={styles.pullQuote}>
            <p>En 2025, le poids des intérêts de la dette française dépassait celui du budget de la Défense nationale. Une puissance nucléaire, membre permanent du Conseil de sécurité, consacre plus d'argent à rémunérer ses créanciers qu'à financer sa propre sécurité militaire.</p>
          </div>

          <p>
            Dans un monde où la guerre est revenue sur le sol européen, où le bouclier américain se rétracte, ce n'est pas seulement un problème budgétaire. C'est une vulnérabilité géostratégique.
          </p>
        </div>

        <hr className={styles.divider}/>

        <div className={styles.section}>
          <p>
            <strong>Il y a un angle mort dans presque tous les débats sur la dette souveraine.</strong> On parle de ce que les États dépensent. On parle rarement de ce qu'ils choisissent de ne pas percevoir. Chaque année, entre 80 et 100 milliards d'euros s'évaporent des caisses publiques françaises à travers l'évasion fiscale et la fraude. Cent milliards, c'est un tiers des recettes fiscales de l'État. C'est plus que la totalité de l'impôt sur le revenu. À l'échelle mondiale, le Tax Justice Network a calculé que les pays ont perdu plus de 475 milliards de dollars en impôts sur les sociétés entre 2016 et 2021, du seul fait du transfert de bénéfices vers des paradis fiscaux.
          </p>
          <p>
            Ce qui rend cette réalité politiquement explosive, c'est ce qui se passe simultanément&nbsp;: pendant que l'État emprunte aux marchés pour combler ses déficits, il démantèle les services chargés de recouvrer ce qui lui est dû. La Direction Générale des Finances Publiques a perdu près de 34&nbsp;000 équivalents temps plein depuis sa création en 2008 — presque 30&nbsp;% de ses effectifs. On réduit les gendarmes fiscaux tout en se plaignant que les caisses sont vides. L'évasion fiscale et la dette publique ne sont pas deux problèmes séparés. Elles sont les deux faces d'un même transfert&nbsp;: des ressources qui sortent de la sphère publique pour se concentrer dans la sphère privée, le tout financé par des emprunts que les générations futures devront rembourser. C'est l'une des formes les plus élaborées de socialisation des pertes et de privatisation des gains.
          </p>
        </div>

        <hr className={styles.divider}/>

        <div className={styles.section}>
          <p>
            <strong>La question de la dette est une question de souveraineté.</strong> Une nation qui ne peut financer ses choix qu'à condition que des acteurs extérieurs lui prêtent les ressources nécessaires n'est plus tout à fait souveraine. Elle est sous tutelle. Douce, invisible, mais réelle. Quand la France doit lever 370 milliards d'euros sur les marchés en 2026, elle ne dicte pas ses conditions. Elle les négocie.
          </p>
          <p>
            De Gaulle l'avait compris avant tout le monde&nbsp;: "Nous ne pouvons avoir une politique indépendante et une défense indépendante, si nous n'avons pas une économie indépendante et des finances saines." Cinquante-cinq ans après sa mort, l'endettement public français a été multiplié par huit. L'appartenance à la zone euro ajoute une dimension supplémentaire à cette fragilité. La Grèce de 2010 en a fourni la démonstration la plus cruelle&nbsp;: un pays peut perdre sa souveraineté même au sein d'une union monétaire puissante. La France et l'Italie ne sont pas la Grèce de 2010. Mais elles partagent avec elle l'incapacité de dévaluer leur monnaie, l'impossibilité de monétiser souverainement leurs engagements, et une dépendance à une BCE dont les décisions sont conditionnées par les intérêts souvent divergents de toute une zone.
          </p>
        </div>

        <hr className={styles.divider}/>

        <div className={styles.section}>
          <p>
            <strong>Il existe une dette dont on ne parle presque jamais.</strong> Pas parce qu'elle est secrète. Parce qu'elle est invisible dans les comptes officiels&nbsp;: la dette implicite, l'ensemble des engagements futurs au titre des retraites, de la dépendance, de la santé, qui n'apparaissent dans aucun bilan parce qu'ils ne sont pas encore exigibles. En France, si l'on cumule la dette publique nette et les engagements hors bilan — dont les seules retraites des fonctionnaires représentent 1&nbsp;800 milliards d'euros — on dépasse les 7&nbsp;000 milliards d'euros. Soit plus du double de la dette comptable officielle.
          </p>
          <p>
            Ce qui rend la situation particulièrement tendue, c'est la conjonction entre une dette explicite déjà élevée et une démographie qui bascule au moment même où les besoins vont exploser. En 2025, pour la première fois depuis la fin de la Seconde Guerre mondiale, le solde naturel de la population française est devenu négatif. La base de cotisants se contracte au moment précis où le nombre de bénéficiaires atteint des sommets historiques. Il y a quelque chose d'intellectuellement malhonnête dans un débat public qui agite semaine après semaine les 3&nbsp;460 milliards de dette officielle tout en ignorant les engagements hors bilan qui en représentent le double.
          </p>
        </div>

        <hr className={styles.divider}/>

        <div className={styles.section}>
          <p>
            <strong>La dette publique est un choix.</strong> Pas la décision isolée d'un gouvernement irresponsable. L'accumulation, sur cinq décennies, de choix validés démocratiquement, qui ont tous opté pour la même solution&nbsp;: consommer aujourd'hui des ressources qui appartiennent à demain. Ce n'est pas de la corruption. C'est de la rationalité politique à courte vue. Aucun gouvernement n'a jamais gagné une élection en promettant la rigueur. Et aucun gouvernement n'a jamais perdu une élection parce que la dette avait augmenté pendant son mandat.
          </p>
          <p>
            La démocratie a un biais temporel que ses défenseurs peinent à regarder en face. Les bénéfices de la dette se récoltent immédiatement. Les coûts tombent sur des générations qui ne votent pas encore. Ce mécanisme a une limite morale évidente&nbsp;: à partir d'un certain point, il revient à transmettre en héritage non pas une société plus riche, mais une créance sur le futur travail de ceux qui n'ont pas participé à la décision.
          </p>
          <p>
            Il n'existe pas de sortie facile. La croissance serait la solution idéale, mais elle suppose précisément les investissements productifs que la dette empêche. L'austérité aveugle comprime la croissance et aggrave souvent le ratio qu'elle prétend réduire. Ce qu'il reste&nbsp;: une combinaison de consolidation budgétaire graduelle, de réorientation massive des dépenses vers l'investissement productif, d'une lutte sérieuse contre l'évasion fiscale, et d'une coordination européenne autour d'un actif commun. Ce programme suppose un accord politique entre pays aux intérêts divergents et une vision à long terme que le cycle électoral ne favorise guère.
          </p>

          <div className={styles.pullQuote}>
            <p>La souveraineté de demain se construit dans les budgets d'aujourd'hui. Si nous continuons à différer, ce ne sont pas les marchés qui nous prendront notre liberté. C'est nous-mêmes qui l'aurons hypothéquée.</p>
          </div>
        </div>

        <div className={styles.bio}>
          <p>
            L'auteur est consultant en stratégie et fondateur de Jabrilia Éditions.<br/>
            Ses analyses paraissent dans Prisme.
          </p>
        </div>

      </div>
    </div>
  );
}
