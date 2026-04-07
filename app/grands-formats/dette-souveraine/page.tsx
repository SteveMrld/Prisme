import GrandFormatLayout from "../../../components/GrandFormatLayout";
import DetteClient from "./DetteClient";

export const metadata = {
  title: "L'État insolvable — Prisme",
  description: "La dette publique mondiale a franchi 100 000 milliards de dollars. Ce n'est pas la dette qui inquiète. C'est ce qu'elle révèle.",
};

export default function DettePage() {
  return (
    <GrandFormatLayout slug="dette-souveraine" author="Steve Moradel" authorRole="Fondateur · Prisme">
      <div style={{ margin:"0 -40px 48px", borderTop:"1.5px solid #DDD9D2", borderBottom:"1.5px solid #DDD9D2" }}>
        <DetteClient />
      </div>
      <div className="confins-article">
        <p><strong>Cent mille milliards de dollars.</strong> Prenons un instant pour mesurer ce que ce chiffre représente. Pas une projection catastrophiste, pas un scénario dystopique forgé par des économistes alarmistes. La dette publique mondiale a franchi ce seuil. Elle dépasse désormais 95&nbsp;% du PIB mondial. Ce n'est pas la dette qui inquiète. Ce que la dette révèle, voilà le vrai sujet&nbsp;: des sociétés qui ont systématiquement préféré emprunter au futur plutôt que de trancher dans le présent. La facture arrive. Pas sous forme de krach spectaculaire. Sous celle, bien plus sourde, d'un État qui rétrécit, qui renonce à éduquer ses enfants, à soigner ses malades, à défendre ses frontières. La dette publique n'est pas un problème de comptabilité nationale. C'est un révélateur anthropologique.</p>
        <p>Cinq pays concentrent à eux seuls près de 70&nbsp;% de cette masse&nbsp;: les États-Unis, la Chine, le Japon, la France et l'Italie. Leurs trajectoires divergent. Leur diagnostic commun est le même&nbsp;: la dette n'est plus chez eux un instrument de politique publique. Elle est devenue la contrainte qui s'est substituée à la politique.</p>

        <h2>L'empire qui travaille pour ses créanciers</h2>
        <p><strong>Les États-Unis ont vécu pendant un demi-siècle sous le régime de ce que Valéry Giscard d'Estaing appelait le "privilège exorbitant".</strong> Emprunter dans sa propre monnaie, dans un monde qui a érigé le dollar en actif de réserve universel. Ce privilège se fissure. En 2025, les paiements d'intérêts ont dépassé 1&nbsp;100 milliards de dollars, devenant le premier poste de dépenses fédérales — devant la défense, devant Medicare. Quand le service de la dette devient le premier poste budgétaire d'un empire, c'est que l'empire travaille pour ses créanciers. Il n'est plus vraiment souverain au sens plein du terme.</p>
        <p><strong>La Chine présente le cas le plus opaque du classement.</strong> Sa dette officielle — 77&nbsp;% du PIB — paraît raisonnable. Mais une fois intégrées les dettes des collectivités locales, dissimulées dans des véhicules de financement hors bilan, le chiffre réel dépasse probablement 110 à 130&nbsp;% du PIB. La crise de l'immobilier depuis 2021, avec l'effondrement d'Evergrande, a mis à nu cette fragilité. La gestion autoritaire de la dette évite la panique à court terme, mais elle empêche le signal de prix qui forcerait les ajustements nécessaires.</p>
        <p><strong>Le Japon est l'anomalie statistique</strong> qui fascine les économistes depuis trente ans. À 230&nbsp;% du PIB, pas de crise de confiance. 90&nbsp;% de la dette est détenue par des résidents. Mais le vieillissement accéléré signifie que les épargnants d'aujourd'hui deviendront les désépargnants de demain. Le Japon prouve qu'une dette à 230&nbsp;% du PIB n'est pas automatiquement létale. Il ne prouve pas qu'elle est indéfiniment soutenable.</p>
        <p><strong>La France incarne une contradiction douloureuse.</strong> Elle a construit l'un des systèmes de protection sociale les plus généreux au monde. Et elle ne peut plus le financer sans s'endetter davantage. En cinq ans, les intérêts ont doublé&nbsp;: de 52,9 milliards d'euros en 2023 à 60,2 milliards en 2024. Près d'un titre de dette sur deux est dans les mains d'investisseurs non résidents.</p>
        <p><strong>L'Italie est le malade chronique</strong> de la zone euro, avec 137&nbsp;% du PIB depuis un quart de siècle. Ce n'est plus une crise, c'est un état permanent. Ensemble, France et Italie représentent près de la moitié de la dette publique totale de la zone euro.</p>

        <h2>Ce que la dette empêche</h2>
        <p>La charge annuelle de la dette française est comparable au budget entier de l'Éducation nationale — 63 milliards d'euros. Argent qui ne forme personne. Argent qui ne construit rien. Cette éviction se mesure dans le classement de Shanghai, dans l'exode des chercheurs vers Londres, Boston, Singapour. Quand un État doit choisir entre payer ses intérêts et former sa jeunesse, il choisit ses intérêts. Les marchés financiers n'attendent pas. Les enfants des banlieues, eux, peuvent attendre.</p>
        <div className="pull-quote"><p>En 2025, le poids des intérêts de la dette française dépassait celui du budget de la Défense nationale. Une puissance nucléaire, membre permanent du Conseil de sécurité, consacre plus d'argent à rémunérer ses créanciers qu'à financer sa propre sécurité militaire.</p></div>

        <h2>L'angle mort&nbsp;: ce qu'on choisit de ne pas percevoir</h2>
        <p>Chaque année, entre 80 et 100 milliards d'euros s'évaporent des caisses publiques françaises à travers l'évasion fiscale. C'est plus que la totalité de l'impôt sur le revenu. Pendant ce temps, la Direction Générale des Finances Publiques a perdu près de 34&nbsp;000 équivalents temps plein depuis 2008. On réduit les gendarmes fiscaux tout en se plaignant que les caisses sont vides. L'évasion fiscale et la dette publique sont les deux faces d'un même transfert&nbsp;: l'une des formes les plus élaborées de socialisation des pertes et de privatisation des gains.</p>

        <h2>Une question de souveraineté</h2>
        <p>Une nation qui ne peut financer ses choix qu'à condition que des acteurs extérieurs lui prêtent les ressources nécessaires n'est plus tout à fait souveraine. Elle est sous tutelle. Douce, invisible, mais réelle. De Gaulle l'avait compris avant tout le monde&nbsp;: <em>"Nous ne pouvons avoir une politique indépendante et une défense indépendante, si nous n'avons pas une économie indépendante et des finances saines."</em> Cinquante-cinq ans après sa mort, l'endettement public français a été multiplié par huit.</p>

        <h2>La dette invisible</h2>
        <p>Il existe une dette dont on ne parle presque jamais. En France, si l'on cumule la dette publique nette et les engagements hors bilan — dont les seules retraites des fonctionnaires représentent 1&nbsp;800 milliards d'euros — on dépasse les 7&nbsp;000 milliards d'euros. Soit plus du double de la dette comptable officielle. En 2025, pour la première fois depuis la fin de la Seconde Guerre mondiale, le solde naturel de la population française est devenu négatif. Il y a quelque chose d'intellectuellement malhonnête dans un débat public qui agite les 3&nbsp;460 milliards de dette officielle tout en ignorant les engagements hors bilan qui en représentent le double.</p>

        <h2>Un choix, pas une fatalité</h2>
        <p><strong>La dette publique est un choix.</strong> L'accumulation, sur cinq décennies, de choix validés démocratiquement, qui ont tous opté pour la même solution&nbsp;: consommer aujourd'hui des ressources qui appartiennent à demain. Ce n'est pas de la corruption. C'est de la rationalité politique à courte vue. Aucun gouvernement n'a jamais gagné une élection en promettant la rigueur.</p>
        <div className="pull-quote"><p>La souveraineté de demain se construit dans les budgets d'aujourd'hui. Si nous continuons à différer, ce ne sont pas les marchés qui nous prendront notre liberté. C'est nous-mêmes qui l'aurons hypothéquée.</p></div>
      </div>
    </GrandFormatLayout>
  );
}
