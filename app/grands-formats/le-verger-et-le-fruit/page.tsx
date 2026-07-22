import GrandFormatLayout from "../../../components/GrandFormatLayout";
import { Filiation, Rattrapage, Asymetrie } from "./VergerClient";

export const metadata = {
  title: "Le verger et le fruit",
  description:
    "En 1998, Microsoft offrait à la Chine un laboratoire qui allait former ses futurs champions de l'intelligence artificielle. Un quart de siècle plus tard, Pékin tend le même geste vers l'Afrique.",
  alternates: {
    canonical: "https://soara.fr/grands-formats/le-verger-et-le-fruit",
  },
};

export default function Page() {
  return (
    <GrandFormatLayout
      slug="le-verger-et-le-fruit"
      author="Steve Moradel"
      authorRole=""
    >
      <div className="soara-article">
        <p>
          En juillet 2026, à la tribune de la World Artificial Intelligence
          Conference de Shanghai, le président chinois Xi Jinping propose au
          monde en développement de partager l&rsquo;intelligence artificielle.
          Le vocabulaire est celui du don. Il parle de bien public
          international, annonce cinq mille places de formation destinées aux
          pays en développement sur les cinq années à venir, promet des centres
          de coopération applicative avec l&rsquo;Union africaine, la Ligue
          arabe, l&rsquo;Association des nations de l&rsquo;Asie du Sud-Est et
          plusieurs autres ensembles régionaux, ouvre à une trentaine
          d&rsquo;États un système d&rsquo;alerte météorologique baptisé Mazu.
          Il annonce surtout la naissance à Shanghai d&rsquo;une Organisation
          mondiale de coopération sur l&rsquo;intelligence artificielle,
          présentée comme la réponse à l&rsquo;appel du Sud global. Sur les
          stands, des modèles parmi les plus puissants de la planète se
          téléchargent librement, sans facture ni licence propriétaire.
          L&rsquo;image est limpide, celle d&rsquo;une puissance qui tend la
          main plutôt que de fermer le poing. Elle mérite qu&rsquo;on s&rsquo;y
          attarde, car la générosité technologique n&rsquo;existe jamais à
          l&rsquo;état pur, et pour saisir ce qui se trame réellement à Shanghai
          il faut remonter à un autre cadeau, celui que la Chine a reçu
          elle-même un quart de siècle plus tôt.
        </p>

        <h2>
          Un cadeau qui <em>changea de mains</em>
        </h2>

        <p>
          En novembre 1998, Bill Gates confie à un ingénieur né à Taïwan,
          Kai-Fu Lee, la mission d&rsquo;ouvrir à Pékin le premier laboratoire
          de recherche de Microsoft en Asie. L&rsquo;équipe tient d&rsquo;abord
          dans une poignée de bureaux, six personnes tout au plus. Quelques
          années suffisent pourtant à en faire, selon une revue technologique
          américaine réputée, le laboratoire informatique le plus bouillonnant
          du monde. À l&rsquo;époque, la presse et les officiels décrivent
          volontiers l&rsquo;institution comme un présent offert à la Chine, une
          façon pour l&rsquo;américain d&rsquo;aider un pays encore périphérique
          à hisser son industrie logicielle. Personne, ou presque, ne mesure
          alors ce que ce présent va produire.
        </p>

        <p>
          Ce laboratoire est devenu la matrice de l&rsquo;intelligence
          artificielle chinoise. La majeure partie des dirigeants qui pèsent
          aujourd&rsquo;hui dans le secteur y ont appris leur métier. Le
          responsable du groupe de vision par ordinateur y a jeté les bases de
          ce qui deviendrait SenseTime, l&rsquo;un des géants mondiaux de la
          reconnaissance faciale, et les fondateurs de Megvii, de Yitu ou de
          Horizon Robotics sont sortis des mêmes couloirs. D&rsquo;autres
          anciens ont pris la tête de la recherche chez Baidu ou bâti
          l&rsquo;informatique en nuage d&rsquo;Alibaba. Le fondateur lui-même,
          après avoir dirigé la filiale chinoise de Google, est devenu l&rsquo;un
          des investisseurs les plus influents de la tech chinoise avant de
          lancer sa propre entreprise de modèles. Un donateur croyait
          s&rsquo;implanter sur un marché immense, il formait en réalité la
          génération qui allait le concurrencer.
        </p>
      </div>

      <Filiation />

      <div className="soara-article">
        <p>
          L&rsquo;épisode vaut mieux qu&rsquo;une anecdote, car il éclaire une
          mécanique que l&rsquo;on nomme rarement. Le laboratoire de Pékin ne
          distribuait pas des produits finis, il transmettait des personnes
          formées, une manière d&rsquo;aborder les problèmes, un réseau de
          relations et de réputations. C&rsquo;est ce transfert d&rsquo;hommes
          et de méthodes qui a rendu le cadeau fécond, et la Chine l&rsquo;a
          parfaitement saisi. Recevoir de quoi produire n&rsquo;a rien de
          comparable avec recevoir de quoi consommer. On peut appeler
          l&rsquo;un le verger et l&rsquo;autre le fruit. Microsoft a offert un
          verger sans en avoir formé le projet, et la question qui traverse tout
          ce qui suit se love dans cette image, tous les dons technologiques ne
          se ressemblent pas, même lorsqu&rsquo;ils portent le même nom.
        </p>

        <h2>
          Encore fallait-il <em>savoir digérer</em>
        </h2>

        <p>
          Encore fallait-il savoir digérer le présent, et rien ne garantissait
          que la Chine y parvienne. Un pays ne comble pas un retard
          technologique en achetant des marchandises sophistiquées, il le comble
          en rapatriant des cerveaux et en reconstruisant chez lui la chaîne
          complète qui va de la recherche fondamentale à l&rsquo;usine. Pékin
          s&rsquo;y est employé avec méthode, en misant sur ses universités, sur
          une politique industrielle soutenue par l&rsquo;État, sur le retour
          organisé des talents partis se former à l&rsquo;étranger. La courbe
          qui en résulte se lit comme un récit d&rsquo;intention. Les meilleurs
          modèles chinois accusaient en 2023 un retard de dix-sept à trente et
          un points selon les tests de référence. Le rapport annuel de
          l&rsquo;institut de Stanford consacré à l&rsquo;intelligence
          artificielle ramène cet écart à 2,7&nbsp;% au début de 2026, après
          plusieurs alternances en tête depuis qu&rsquo;un modèle de
          raisonnement chinois a rejoint pour la première fois le meilleur
          système américain. Une progression aussi régulière ne doit rien au
          hasard, elle traduit une volonté patiente de convertir un savoir
          importé en capacité autonome.
        </p>
      </div>

      <Rattrapage />

      <div className="soara-article">
        <p>
          C&rsquo;est cette Chine devenue autonome qui se présente
          aujourd&rsquo;hui à Shanghai en distributrice de générosité. Elle
          domine désormais un pan entier de l&rsquo;intelligence artificielle,
          celui des modèles dits ouverts, dont chacun peut récupérer les
          paramètres pour les faire tourner sur ses propres machines. Trois noms
          mènent la danse, DeepSeek, qui a secoué le secteur avec un système à
          très bas coût, Qwen, adossé à Alibaba, et Kimi, sorti de la jeune
          entreprise pékinoise Moonshot. Ce dernier a dévoilé, quelques jours
          avant le sommet, un modèle de deux mille huit cents milliards de
          paramètres, le plus vaste jamais publié en accès ouvert, dont les
          résultats rivalisent avec les meilleurs systèmes fermés américains.
          Sur cette base, le discours de Shanghai déploie son offre au Sud,
          enveloppée dans l&rsquo;idée d&rsquo;un bien commun planétaire.
        </p>

        <h2>
          Ce qui descend <em>vers le Sud</em>
        </h2>

        <p>
          Ce qui descend ainsi vers l&rsquo;Afrique et vers d&rsquo;autres
          régions, ce sont des poids de modèles, autrement dit le fruit déjà
          mûr. Télécharger un système entraîné ne donne accès ni aux processeurs
          spécialisés qui l&rsquo;ont fait naître, ni à l&rsquo;énergie et aux
          centres de données qu&rsquo;exige son fonctionnement, encore moins à
          la filière humaine capable de concevoir la version suivante. Le
          paradoxe saute alors aux yeux. Le don d&rsquo;aujourd&rsquo;hui a
          toutes les apparences d&rsquo;une plus grande générosité que celui de
          1998, puisqu&rsquo;il est gratuit et dépourvu de contrepartie visible,
          alors qu&rsquo;il transmet peut-être beaucoup moins de ce qui avait
          rendu le laboratoire de Pékin si transformateur. Microsoft avait
          légué, à son corps défendant, les moyens de bâtir. Une part de ce que
          la Chine propose au Sud ressemble davantage à une récolte qu&rsquo;à
          un verger.
        </p>

        <div className="pull-quote">
          <p>
            Recevoir de quoi produire n&rsquo;a rien de comparable avec recevoir
            de quoi consommer. On peut appeler l&rsquo;un le verger et
            l&rsquo;autre le fruit.
          </p>
        </div>

        <p>
          Une objection sérieuse se lève ici. Des poids ouverts ne sont pas une
          marchandise inerte, ils s&rsquo;affinent sur des langues locales, se
          distillent en versions plus légères, se démontent pour en comprendre
          l&rsquo;architecture, se réentraînent sur des données propres. Ce
          serait donc une graine plutôt qu&rsquo;un fruit. L&rsquo;objection
          porte, à condition d&rsquo;admettre qu&rsquo;une graine réclame un
          sol. Le modèle brandi à Shanghai compte deux mille huit cents
          milliards de paramètres, échelle qui place son installation privée
          hors de portée de la quasi-totalité des institutions du continent.
          L&rsquo;Afrique héberge 0,6&nbsp;% de la capacité mondiale de centres
          de données, trois cent soixante mégawatts en service, quand certaines
          régions subissent jusqu&rsquo;à trente-trois coupures de courant par
          mois. Pouvoir télécharger n&rsquo;équivaut pas à pouvoir faire
          tourner. Le calcul se dessine alors à mesure que l&rsquo;on descend
          d&rsquo;un étage. Banaliser la couche des modèles ruine le modèle
          économique des laboratoires américains qui la facturent, et déplace la
          valeur vers le matériel, l&rsquo;électricité, les centres de données
          et les applications, étages où les entreprises chinoises construisent
          déjà sur place.
        </p>
      </div>

      <Asymetrie />

      <div className="soara-article">
        <h2>
          Une leçon qui ne se transpose <em>qu&rsquo;à son échelle</em>
        </h2>

        <p>
          Reste à savoir comment l&rsquo;Afrique elle-même se situe dans cette
          partie, et c&rsquo;est ici que le cadrage dominant mérite d&rsquo;être
          défait. On lui présente d&rsquo;ordinaire un choix simple,
          l&rsquo;intelligence artificielle fermée de Washington ou
          l&rsquo;intelligence artificielle ouverte de Pékin, comme s&rsquo;il
          ne s&rsquo;agissait que de désigner un fournisseur. Or ce cadrage
          assigne d&rsquo;emblée au continent le rôle de bénéficiaire dans une
          rivalité qui se joue ailleurs et sans lui. L&rsquo;histoire du
          laboratoire de Pékin suggère une autre ligne de partage, plus juste et
          plus exigeante que celle qu&rsquo;on nous propose, celle qui sépare le
          fruit que l&rsquo;on consomme du verger que l&rsquo;on cultive. Un
          bénéficiaire ne devient l&rsquo;égal de son bienfaiteur qu&rsquo;en
          captant les compétences et en rebâtissant la filière sur son propre
          sol, ce que la Chine a accompli par l&rsquo;État, par ses universités
          et par le rappel de ses talents.
        </p>

        <p>
          Reste que la trajectoire chinoise s&rsquo;est jouée sur un terrain
          sans équivalent. Pékin disposait en 1998 d&rsquo;un marché intérieur
          unifié, d&rsquo;un État capable d&rsquo;imposer une politique
          industrielle sur vingt ans, d&rsquo;universités installées au sommet
          de sa hiérarchie scientifique, d&rsquo;une base manufacturière et
          d&rsquo;une diaspora qu&rsquo;il pouvait rappeler par décret
          budgétaire. L&rsquo;Afrique aborde la même question avec cinquante-
          quatre États, autant de réglementations et des marchés que la zone de
          libre-échange continentale commence à peine à relier. Cette
          fragmentation n&rsquo;a rien d&rsquo;un détail d&rsquo;exécution, elle
          est le cœur du problème, puisqu&rsquo;elle transforme chaque
          négociation avec Pékin en discussion bilatérale au rapport de force
          écrasant. Aucun pays du continent, pris isolément, ne pèse ce que
          pesait la Chine face à Microsoft. La leçon de 1998 ne se transpose
          qu&rsquo;à l&rsquo;échelle où elle a été apprise, celle d&rsquo;un
          ensemble assez vaste pour poser ses conditions.
        </p>

        <p>
          Nommer les choses sans complaisance impose de reconnaître ce qui
          manque encore pour digérer au lieu de consommer, une base
          industrielle, une puissance de calcul souveraine, des cursus capables
          de retenir les meilleurs au lieu de les voir partir. Le tableau
          n&rsquo;a pourtant rien d&rsquo;écrit d&rsquo;avance. Une communauté
          de recherche s&rsquo;est constituée sur le continent sans attendre
          l&rsquo;autorisation de quiconque. Le principal rassemblement africain
          consacré à l&rsquo;apprentissage automatique réunit plus d&rsquo;un
          millier de participants venus de plus de quarante-cinq pays, et il a
          tenu son édition de Lagos sous le mot d&rsquo;ordre de
          l&rsquo;intelligence souveraine, entendue comme la capacité du
          continent à diriger ses propres systèmes et son avenir scientifique.
          Le réseau Masakhane y a installé son pôle consacré aux langues
          africaines, bâti précisément sur des modèles venus de
          l&rsquo;extérieur et retournés vers des usages que personne
          d&rsquo;autre ne prendra en charge. Voilà ce que cultiver le verger
          veut dire à partir du fruit reçu, et ce travail ne demande
          l&rsquo;autorisation d&rsquo;aucune capitale.
        </p>

        <p>
          Le sommet de Shanghai ne se comprend qu&rsquo;à la lumière de novembre
          1998. La Chine connaît mieux que quiconque le pouvoir d&rsquo;un
          cadeau technologique, puisqu&rsquo;elle en a reçu un, l&rsquo;a
          patiemment digéré, puis l&rsquo;a retourné contre celui qui le lui
          avait offert, au point que le donateur d&rsquo;hier s&rsquo;interroge
          désormais sur l&rsquo;opportunité d&rsquo;avoir jamais ouvert ce
          laboratoire. Cette mémoire éclaire d&rsquo;une lumière crue
          l&rsquo;offre faite aujourd&rsquo;hui au Sud. La générosité s&rsquo;y
          mêle au calcul, comme toujours, et l&rsquo;essentiel se déplace vers
          celui qui reçoit. Le présent chinois deviendra pour l&rsquo;Afrique un
          verger ou un fruit selon l&rsquo;usage qu&rsquo;elle saura en faire,
          et cette décision, personne à Shanghai ni à Washington ne peut la
          prendre à sa place. Ce qui se joue derrière les annonces de
          coopération et les modèles offerts, c&rsquo;est la carte du pouvoir
          des prochaines décennies, en train d&rsquo;être redessinée par la
          manière dont circulent, ou dont refusent de circuler, les moyens réels
          de bâtir.
        </p>

        <div className="notes-section">
          <div className="notes-header">
            <div className="notes-title">Notes et sources</div>
          </div>
          <ul className="notes-list">
            <li>
              <span>1</span>
              <span>
                Microsoft, communiqué officiel «&nbsp;Microsoft Announces
                Beijing as Site for Its First Asian Research Lab&nbsp;», novembre
                1998.
              </span>
            </li>
            <li>
              <span>2</span>
              <span>
                CommonWealth Magazine, «&nbsp;What Must Microsoft Research Asia
                Do to Survive?&nbsp;», mai 2024&nbsp;: le laboratoire décrit
                comme un cadeau à la Chine, les fondateurs de SenseTime, Megvii,
                Yitu et Horizon Robotics issus de ses rangs, et les
                délibérations de Microsoft sur son avenir, d&rsquo;après une
                enquête du New York Times de janvier 2024.
              </span>
            </li>
            <li>
              <span>3</span>
              <span>
                Ministère chinois des Affaires étrangères et agence Xinhua,
                texte intégral du discours de Xi Jinping à l&rsquo;ouverture de
                la World Artificial Intelligence Conference et de la réunion de
                haut niveau sur la gouvernance mondiale de
                l&rsquo;intelligence artificielle, Shanghai, 17 juillet
                2026&nbsp;: cinq mille places de formation sur cinq ans, centres
                de coopération applicative avec l&rsquo;Union africaine, la
                Ligue arabe, l&rsquo;ASEAN, la CELAC, l&rsquo;Organisation de
                coopération de Shanghai et les BRICS, système d&rsquo;alerte
                météorologique Mazu ouvert à trente pays, création de
                l&rsquo;Organisation mondiale de coopération sur
                l&rsquo;intelligence artificielle.
              </span>
            </li>
            <li>
              <span>4</span>
              <span>
                NPR, couverture du discours et du contexte des restrictions
                américaines à l&rsquo;accès chinois aux technologies avancées,
                17 juillet 2026.
              </span>
            </li>
            <li>
              <span>5</span>
              <span>
                VentureBeat et South China Morning Post, sur Kimi K3 de Moonshot
                AI, deux mille huit cents milliards de paramètres, présenté
                comme le plus vaste modèle ouvert publié à ce jour et positionné
                face aux meilleurs systèmes propriétaires américains, juillet
                2026.
              </span>
            </li>
            <li>
              <span>6</span>
              <span>
                Stanford Institute for Human-Centered Artificial Intelligence,
                AI Index Report 2026, avril 2026&nbsp;: écart de performance
                entre meilleurs modèles américains et chinois ramené à
                2,7&nbsp;% en mars 2026, contre dix-sept à trente et un points
                de pourcentage selon les tests en mai 2023.
              </span>
            </li>
            <li>
              <span>7</span>
              <span>
                Africa Data Centres Association, rapport économique 2026 sur les
                centres de données en Afrique&nbsp;: 0,6&nbsp;% de la capacité
                mondiale, trois cent soixante mégawatts en service, deux cent
                trente-huit en construction, six cent cinquante-six planifiés.
              </span>
            </li>
            <li>
              <span>8</span>
              <span>
                Opérateurs de centres de données du continent, sur
                l&rsquo;instabilité d&rsquo;alimentation et le recours combiné
                au réseau public, aux producteurs indépendants et aux
                générateurs captifs.
              </span>
            </li>
            <li>
              <span>9</span>
              <span>
                Deep Learning Indaba, édition 2026 à Lagos sur le thème
                «&nbsp;Sovereign Intelligence&nbsp;», et lancement du pôle
                Masakhane consacré aux langues africaines.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </GrandFormatLayout>
  );
}
