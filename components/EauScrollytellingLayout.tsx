import EauVizClient from './EauVizClient'
import eauData from '../lib/eau-data.json'
import styles from './EauScrollytellingLayout.module.css'

type ArticleProps = {
  article: {
    title: string
    description: string
    image?: string
    date?: string
    author?: string
    authorRole?: string
  }
  showPaywall?: boolean
  lang?: string
  hasEnglish?: boolean
}

export default function EauScrollytellingLayout({ article }: ArticleProps) {
  const chapitres = eauData.chapitres

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.tags}>
          <span className={styles.tag}>Environnement</span>
          <span className={styles.tagOutline}>Géopolitique</span>
          <span className={styles.tagFormat}>Grand format</span>
          <span className={styles.tagDate}>Avril 2026</span>
        </div>
        <h1 className={styles.title}>
          L&apos;eau : la prochaine grande<br />
          <em>fracture géopolitique</em>
        </h1>
        <p className={styles.chapeau}>{article.description}</p>
        <div className={styles.byline}>
          <div className={styles.avatar}>SM</div>
          <div>
            <div className={styles.bylineName}>{article.author || 'Steve Moradel'}</div>
            <div className={styles.bylineRole}>{article.authorRole || 'Environnement & Ressources'}</div>
          </div>
        </div>
      </header>

      <section className={styles.essentiel}>
        <div className={styles.essentielHeader}>
          <span className={styles.essentielLabel}>L&apos;essentiel</span>
          <span className={styles.essentielSub}>3 points</span>
        </div>
        <ul className={styles.essentielList}>
          <li className={styles.essentielItem}>
            <span className={styles.essentielNum}>1</span>
            <span>4 milliards de personnes subissent une pénurie d&apos;eau au moins un mois par an. La demande mondiale augmentera de 20 à 30% d&apos;ici 2050, sans que le stock global ne croisse.</span>
          </li>
          <li className={styles.essentielItem}>
            <span className={styles.essentielNum}>2</span>
            <span>Les conflits de l&apos;eau sont lents, diffus, souvent habillés en crises humanitaires. Mais ils structurent déjà les rapports de force entre États riverains de mêmes bassins.</span>
          </li>
          <li className={styles.essentielItem}>
            <span className={styles.essentielNum}>3</span>
            <span>Contrôler les sources, c&apos;est contrôler les États en aval. Le Grand Barrage de la Renaissance éthiopien et les barrages chinois sur le Mékong ne sont pas des projets hydrauliques, ce sont des instruments de domination.</span>
          </li>
        </ul>
      </section>

      <div className={styles.chapters}>
        {chapitres.map((ch, i) => (
          <ChapterFrame key={ch.id} chapter={ch} idx={i}>
            {renderChapterNarrative(ch.id)}
          </ChapterFrame>
        ))}
      </div>

      <section className={styles.outro}>
        <h3 className={styles.outroH3}>
          La guerre invisible <em>de l&apos;eau</em>
        </h3>
        <p>
          Les conflits hydriques ne ressemblent pas aux guerres classiques. Il n&apos;y a pas de déclarations, pas de fronts, pas de traités de paix. Ils prennent des formes diffuses : sabotage d&apos;infrastructures hydrauliques, manipulation des débits pour affaiblir un adversaire en aval, diplomatie coercitive qui conditionne le partage des eaux à des concessions politiques, pression économique sur les États dépendants.
        </p>
        <p>
          Le Pacific Institute, l&apos;organisation qui fait la référence en matière de recension des conflits liés à l&apos;eau, a documenté plus de 400 événements violents liés à l&apos;eau en une seule année récente. Ces événements vont du sabotage de canaux d&apos;irrigation dans des conflits ruraux locaux aux attaques contre des stations de pompage dans des guerres civiles, en passant par les utilisations des barrages comme armes de guerre.<sup>9</sup> En Syrie, le contrôle du barrage de Tabqa sur l&apos;Euphrate a été un objectif militaire explicite pour l&apos;État islamique, puis pour les forces kurdes et américaines. En Ukraine, le barrage de Kakhovka sur le Dniepr a été détruit en 2023, privant d&apos;eau potable des centaines de milliers de personnes.
        </p>
        <p>
          Cette hydro-guerre froide se double d&apos;une compétition silencieuse pour les aquifères souterrains, ces nappes phréatiques fossiles qui s&apos;accumulent sur des millénaires et se vident en décennies. L&apos;Arabie Saoudite a épuisé une large partie de ses réserves fossiles pour produire du blé dans les années 1980-2000, avant d&apos;abandonner cette politique. Le Pakistan pompe ses aquifères à un rythme qui, selon les projections du Pakistan Council of Research in Water Resources, conduira à leur épuisement dans plusieurs régions du Punjab d&apos;ici 2025-2030.
        </p>

        <h3 className={styles.outroH3}>
          Les nouvelles puissances hydriques, <em>et ce qui arrive aux autres</em>
        </h3>
        <p>
          Face à ces pressions, certains États ont développé une maîtrise de l&apos;eau qui constitue un avantage stratégique réel. Israël est le cas le plus documenté : confronté depuis sa fondation à une pénurie structurelle, il a développé un écosystème technologique et institutionnel qui fait de lui une puissance hydrique malgré son aridité. Le pays recycle environ 90% de ses eaux usées pour l&apos;irrigation agricole, un taux sans équivalent mondial. Il a perfectionné le dessalement à grande échelle, l&apos;irrigation goutte-à-goutte, et la modélisation hydrologique de précision.<sup>10</sup>
        </p>
        <p>
          Singapour, île de 730 km² sans aquifère ni fleuve, produit aujourd&apos;hui une partie de son eau à partir de la pluie, du recyclage des eaux usées (la NEWater) et du dessalement. Cette stratégie des quatre robinets lui a permis de réduire sa dépendance à la Malaisie, dont les traités de fourniture d&apos;eau constituaient historiquement une vulnérabilité géopolitique. Les Pays-Bas, dont une large partie du territoire est sous le niveau de la mer, ont développé une expertise mondiale en gestion des eaux qui est devenue une exportation économique et diplomatique.
        </p>
        <p>
          Ces réussites ont un point commun : elles supposent des investissements publics massifs sur le long terme, une gouvernance institutionnelle robuste, et une culture politique capable de traiter l&apos;eau comme un bien commun stratégique plutôt que comme une commodité. Ce sont ces capacités qui manquent aux États les plus exposés au stress hydrique. Le concept de <em>water bankruptcy</em>, un état où la demande dépasse durablement la ressource disponible, sans mécanisme d&apos;ajustement, ne menace pas les États qui ont su anticiper. Il menace ceux qui n&apos;en ont pas eu les moyens, le temps ou la volonté politique.
        </p>
        <p>
          Les projections les plus documentées identifient plusieurs bassins candidats à cet effondrement dans les décennies à venir : l&apos;Indus pakistanais, le Jourdain, les aquifères de l&apos;Inde du Nord, le Colorado aux États-Unis, et plusieurs régions du Maghreb. Dans chacun de ces cas, la <em>water bankruptcy</em> n&apos;est pas un événement, c&apos;est un processus, lent, d&apos;abord invisible, puis soudainement irréversible.
        </p>

        <div className={styles.prospectif}>
          <div className={styles.prospectifLabel}>Prospective, ce qui vient</div>
          <h4 className={styles.prospectifTitle}>Trois dynamiques pour les décennies à venir</h4>
          <p>
            <strong>La militarisation de l&apos;eau.</strong> Les infrastructures hydrauliques, barrages, stations de pompage, réseaux d&apos;irrigation, deviendront des cibles militaires de plus en plus explicites dans les conflits régionaux. La destruction du barrage de Kakhovka en 2023 a posé un précédent. L&apos;absence d&apos;un cadre juridique international contraignant sur la protection de ces infrastructures en temps de guerre est une lacune que les acteurs malveillants continueront d&apos;exploiter.
          </p>
          <p>
            <strong>La water diplomacy comme outil de puissance.</strong> Les États qui contrôlent les sources des grands fleuves transfrontaliers disposent d&apos;un levier que leurs voisins en aval ne peuvent pas ignorer. Cette asymétrie structurelle va s&apos;approfondir à mesure que le changement climatique rend les ressources hydriques plus variables et plus précieuses. La Chine, la Turquie et l&apos;Éthiopie sont les acteurs qui maîtrisent le mieux cet instrument.
          </p>
          <p>
            <strong>L&apos;eau comme déclencheur de migrations.</strong> Les modèles du Haut-Commissariat aux réfugiés et de l&apos;Organisation internationale pour les migrations projettent que le stress hydrique sera l&apos;un des principaux facteurs des grandes migrations de la deuxième moitié du siècle. Pas parce que les gens fuiront l&apos;eau : parce que sans eau, l&apos;agriculture s&apos;effondre, les villes deviennent inhabitables, et les États perdent leur capacité à gouverner.
          </p>
        </div>

        <p>
          Le XXIe siècle ne sera probablement pas dominé par des guerres directes pour l&apos;eau, les conflits ouverts pour une ressource partagée sont rares dans l&apos;histoire, même si les tensions qu&apos;elle génère peuvent alimenter d&apos;autres conflits. Mais l&apos;eau deviendra le fil invisible reliant plusieurs des grandes crises du siècle : alimentaire, climatique, migratoire, politique. La géopolitique mondiale ne se jouera plus seulement autour des détroits et des pipelines. Elle se jouera aussi autour des glaciers, des barrages et des nappes phréatiques, là où la puissance se construit en silence, et où son effondrement peut être soudain.
        </p>
      </section>

      <section className={styles.notes}>
        <div className={styles.notesTitle}>Notes et sources</div>
        <ol className={styles.notesList}>
          <li className={styles.notesItem}><span className={styles.notesNum}>1</span><span>UNESCO, World Water Development Report 2023 : Partnerships and Cooperation for Water, UN Water, 2023.</span></li>
          <li className={styles.notesItem}><span className={styles.notesNum}>2</span><span>Aaron Wolf et al., International River Basins of the World, International Journal of Water Resources Development, 1999 ; données mises à jour par l&apos;UNEP, 2022.</span></li>
          <li className={styles.notesItem}><span className={styles.notesNum}>3</span><span>Hugonnet et al., Accelerated global glacier mass loss in the early twenty-first century, Nature, 2021. Krishnan et al., State of Himalayan Glaciers, Science, 2023.</span></li>
          <li className={styles.notesItem}><span className={styles.notesNum}>4</span><span>Brian Eyler, Courtney Weatherby, New Evidence : How China Turned Off the Mekong&apos;s Tap, Stimson Center, avril 2020.</span></li>
          <li className={styles.notesItem}><span className={styles.notesNum}>5</span><span>Daanish Mustafa, The Indus Waters Treaty and the Socio-Politics of Water in Pakistan, Third World Quarterly, 2020. Pakistan&apos;s position papers, Permanent Court of Arbitration, 2023.</span></li>
          <li className={styles.notesItem}><span className={styles.notesNum}>6</span><span>Stockholm International Peace Research Institute, Water and Security in the Middle East, 2022. Gal Luft, Energy Security Challenges for the 21st Century, Praeger, 2009, sur la vulnérabilité des installations de dessalement.</span></li>
          <li className={styles.notesItem}><span className={styles.notesNum}>7</span><span>Alan Nicol, Musa Amdihun, The Grand Ethiopian Renaissance Dam and the politics of Nile water, Water International, 2022. Nil Commission trilatérale, comptes-rendus de négociation, 2020-2023.</span></li>
          <li className={styles.notesItem}><span className={styles.notesNum}>8</span><span>CILSS / ECOWAS, Lake Chad Basin : Climate and Security, 2022. Wolfram Lacher, Organized Crime and Conflict in the Sahel-Sahara Region, Carnegie Endowment, 2012.</span></li>
          <li className={styles.notesItem}><span className={styles.notesNum}>9</span><span>Pacific Institute, Water Conflict Chronology, mise à jour annuelle, base de données recensant les conflits liés à l&apos;eau depuis 3000 av. J.-C.</span></li>
          <li className={styles.notesItem}><span className={styles.notesNum}>10</span><span>Alon Tal, The Land is Full : Addressing Overpopulation in Israel, Yale University Press, 2016. Yossi Yaacoby, Israel&apos;s Water Sector, Israel Water Authority, 2022.</span></li>
          <li className={styles.notesItem}><span className={styles.notesNum}>11</span><span>UN-Water, Sustainable Development Goal 6 : Synthesis Report, 2023. Organisation internationale pour les migrations, World Migration Report 2024, projections sur les migrations climatiques liées à l&apos;eau.</span></li>
        </ol>
      </section>
    </article>
  )
}

type Chapter = (typeof eauData.chapitres)[number]

function ChapterFrame({ chapter, idx, children }: { chapter: Chapter; idx: number; children: React.ReactNode }) {
  return (
    <section
      id={`chapitre-${chapter.id}`}
      data-chapter-idx={idx}
      className={styles.chapter}
    >
      <div className={styles.chapterMap}>
        <EauVizClient chapterIdx={idx} />
      </div>
      <div className={styles.chapterBody}>
        <div className={styles.chapterTag} style={{ color: chapter.couleur }}>
          {chapter.tag}
        </div>
        <h2 className={styles.chapterTitle}>
          <ChapterTitleSplit titre={chapter.titre_court} em={chapter.titre_em} />
        </h2>
        <p className={styles.chapterHook}>{chapter.hook}</p>
        <div className={styles.chapterStat}>
          <span className={styles.chapterStatValue} style={{ color: chapter.couleur }}>
            {chapter.stat.valeur}
            {chapter.stat.suffixe}
          </span>
          <span className={styles.chapterStatLabel}>{chapter.stat.label}</span>
        </div>
        <div className={styles.chapterNarrative}>{children}</div>
      </div>
    </section>
  )
}

function ChapterTitleSplit({ titre, em }: { titre: string; em: string }) {
  const idx = titre.indexOf(em)
  if (idx === -1) return <>{titre}</>
  return (
    <>
      {titre.slice(0, idx)}
      <em>{em}</em>
      {titre.slice(idx + em.length)}
    </>
  )
}

function renderChapterNarrative(id: string): React.ReactNode {
  switch (id) {
    case 'monde':
      return (
        <>
          <p>
            En 2021, des images satellites révèlent que le lac Poopó, deuxième plus grand lac de Bolivie, a pratiquement disparu. Là où quelques décennies plus tôt des pêcheurs vivaient de leurs filets, il ne reste plus que des étendues de sel blanc et des villages abandonnés. À dix mille kilomètres de là, la même année, le barrage de la Renaissance en Éthiopie achève son deuxième remplissage, réduisant le débit du Nil Bleu d&apos;une fraction suffisante pour inquiéter Le Caire. Deux événements sans lien apparent. Un seul fil conducteur : l&apos;eau, ressource que nos civilisations ont toujours considérée comme un bien naturel, devient un enjeu de puissance.
          </p>
          <p>
            Pendant des millénaires, les sociétés humaines se sont construites autour des fleuves. Le Nil a fait l&apos;Égypte. Le Tigre et l&apos;Euphrate ont fait la Mésopotamie. L&apos;Indus a fait l&apos;une des premières civilisations urbaines de l&apos;histoire. Ces fleuves nourrissaient, transportaient, délimitaient. Ils donnaient. La relation s&apos;inverse au XXIe siècle : ce sont les sociétés qui épuisent leurs fleuves.
          </p>

          <h3 className={styles.narrativeH3}>
            Le siècle de l&apos;eau, <em>la thèse</em>
          </h3>
          <p>
            Trois forces convergentes rendent l&apos;eau stratégique à une échelle sans précédent. La croissance démographique d&apos;abord : nous serons dix milliards en 2050, et chaque habitant supplémentaire est un consommateur d&apos;eau, directement, par la boisson et l&apos;hygiène, et indirectement, par l&apos;alimentation. L&apos;agriculture représente 70% des prélèvements d&apos;eau douce mondiaux ; nourrir deux milliards d&apos;humains supplémentaires suppose d&apos;en prélever davantage.<sup>1</sup>
          </p>
          <p>
            Le changement climatique ensuite, qui redistribue l&apos;eau plus qu&apos;il n&apos;en crée ou n&apos;en détruit. Certaines régions reçoivent davantage de précipitations, mais sous forme d&apos;événements extrêmes, difficilement captables. D&apos;autres s&apos;assèchent durablement. Les glaciers, qui fonctionnent comme des châteaux d&apos;eau naturels en stockant l&apos;eau l&apos;hiver pour la restituer progressivement l&apos;été, reculent à des vitesses documentées. Et l&apos;intensification agricole et industrielle, enfin, qui multiplie les usages compétitifs d&apos;une ressource dont le stock global ne croît pas.
          </p>
          <p>
            Le résultat est quantifiable. Quatre milliards de personnes subissent une pénurie d&apos;eau au moins un mois par an. La demande mondiale devrait augmenter de 20 à 30% d&apos;ici 2050. Mais ces chiffres agrégés masquent ce qui est en réalité la nature du problème : l&apos;eau n&apos;est pas rare en moyenne, elle est mal distribuée. Et cette distribution est, de plus en plus, une question politique.
          </p>

          <div className={styles.statsRow}>
            <div className={styles.statsCell}>
              <div className={styles.statsNum}>4 Mds</div>
              <div className={styles.statsLabel}>de personnes subissent une pénurie d&apos;eau au moins un mois par an, dont 500 millions toute l&apos;année</div>
            </div>
            <div className={styles.statsCell}>
              <div className={styles.statsNum}>310</div>
              <div className={styles.statsLabel}>bassins fluviaux transfrontaliers dans le monde, impliquant 153 États</div>
            </div>
            <div className={styles.statsCell}>
              <div className={styles.statsNum}>70%</div>
              <div className={styles.statsLabel}>des prélèvements d&apos;eau douce mondiaux sont attribuables à l&apos;agriculture</div>
            </div>
          </div>

          <h3 className={styles.narrativeH3}>
            Les bassins transfrontaliers, <em>la nouvelle géographie du pouvoir</em>
          </h3>
          <p>
            Le monde compte 310 bassins fluviaux transfrontaliers, impliquant 153 États. Ces bassins sont le terrain des tensions hydriques les plus structurelles, parce qu&apos;ils créent une dépendance géographique irréductible : l&apos;État situé en amont contrôle le robinet de l&apos;État situé en aval. Ce rapport de force n&apos;a pas attendu le XXIe siècle pour exister, mais il s&apos;est intensifié à mesure que les États en amont ont acquis les capacités techniques de le mobiliser.
          </p>
          <p>
            L&apos;architecture de ces dépendances est souvent contre-intuitive. La Turquie contrôle les sources du Tigre et de l&apos;Euphrate, dont dépend une large partie de l&apos;agriculture irakienne et syrienne. La Chine contrôle les plateaux d&apos;où partent l&apos;Indus, le Brahmapoutre, le Mékong, le Yangtsé et le Fleuve Jaune, soit les sources d&apos;eau de près de deux milliards de personnes réparties entre l&apos;Inde, le Bangladesh, le Pakistan, la Birmanie, la Thaïlande, le Cambodge et le Vietnam. L&apos;Éthiopie contrôle 85% du débit du Nil Bleu, qui constitue la principale source d&apos;eau de l&apos;Égypte.<sup>2</sup>
          </p>
          <p>
            Dans chacun de ces cas, la géopolitique de l&apos;eau suit la même logique : l&apos;amont investit dans des barrages, présente cela comme un droit souverain au développement, et l&apos;aval vit cette décision comme une menace existentielle. Les traités de partage des eaux, quand ils existent, ont été négociés dans des contextes climatiques et démographiques qui ne sont plus ceux d&apos;aujourd&apos;hui.
          </p>
        </>
      )

    case 'himalaya':
      return (
        <>
          <p>
            Les glaciers de l&apos;Himalaya et du plateau tibétain constituent le plus grand réservoir d&apos;eau douce du monde en dehors des pôles. Ils alimentent cinq des grands fleuves d&apos;Asie, l&apos;Indus, le Gange, le Brahmapoutre, le Yangtsé et le Mékong, qui soutiennent directement ou indirectement près de deux milliards de personnes. Ces glaciers fonctionnent comme des régulateurs naturels : ils stockent les précipitations hivernales sous forme de glace et les restituent progressivement en été, lissant les variations saisonnières.
          </p>
          <p>
            Le réchauffement climatique dégrade ce mécanisme de régulation. Une étude publiée dans <em>Science</em> en 2023 établit que les glaciers himalayens perdent de la masse à une vitesse dix fois supérieure à celle mesurée au début du XXe siècle.<sup>3</sup> À court terme, cette fonte accélérée produit des crues et une abondance trompeuse. À moyen terme, quand les glaciers seront significativement réduits, les débits estivaux s&apos;effondreront, précisément au moment où les besoins agricoles sont les plus élevés.
          </p>
          <p>
            La Chine contrôle une grande partie du plateau tibétain depuis 1951. Cette position géographique lui confère un avantage hydrologique structurel que certains analystes qualifient d&apos;empire hydraulique, la capacité d&apos;affecter le cycle de l&apos;eau d&apos;une dizaine d&apos;États en décidant où construire des barrages sur ses propres rivières. Pékin a construit sur le Mékong supérieur un chapelet de onze barrages dont les effets sur les débits en aval ont été documentés par le Stimson Center : entre 2019 et 2020, une sécheresse sévère en Thaïlande, au Laos et au Cambodge a coïncidé avec des niveaux anormalement élevés dans les retenues chinoises.<sup>4</sup>
          </p>
        </>
      )

    case 'indus':
      return (
        <>
          <p>
            Le traité de l&apos;Indus signé en 1960 entre l&apos;Inde et le Pakistan est souvent présenté comme un modèle de diplomatie de l&apos;eau : il a survécu à trois guerres, plusieurs crises militaires majeures et des décennies de tension. Négocié sous l&apos;égide de la Banque mondiale, il partage les eaux de six rivières entre les deux pays selon une logique géographique, les fleuves orientaux à l&apos;Inde, les fleuves occidentaux au Pakistan.
          </p>
          <p>
            Mais ce traité, conçu pour un autre contexte climatique et démographique, montre ses limites. L&apos;Inde a multiplié les projets de barrages sur les rivières attribuées au Pakistan, que ce dernier interprète comme des violations de l&apos;esprit du traité. Le changement climatique modifie les débits en dehors des hypothèses sur lesquelles le partage avait été calculé. Et la relation politique entre les deux pays est régulièrement tendue au point où les eaux de l&apos;Indus deviennent un instrument de pression diplomatique.<sup>5</sup>
          </p>
          <p>
            L&apos;enjeu dépasse la question bilatérale. Si le traité de l&apos;Indus, le plus solide des accords de partage des eaux transfrontalières, venait à s&apos;effondrer, ce serait un signal majeur pour la gouvernance mondiale de l&apos;eau : il signifierait que même les accords les mieux construits ne résistent pas aux pressions combinées du changement climatique et de la compétition géopolitique.
          </p>
        </>
      )

    case 'nil':
      return (
        <>
          <p>
            Le Grand Barrage de la Renaissance éthiopienne (GERD) est la plus grande centrale hydroélectrique d&apos;Afrique. Sa construction, commencée en 2011 et achevée en 2020, est présentée par Addis-Abeba comme un acte de souveraineté économique : l&apos;Éthiopie, l&apos;un des pays les plus pauvres du monde, entend utiliser son avantage hydrologique pour s&apos;électrifier et se développer. Le Nil est son fleuve. Elle a le droit de le barrager.
          </p>
          <p>
            L&apos;Égypte voit les choses différemment. 90% de son eau provient du Nil. L&apos;agriculture nilotique nourrit une population de plus de cent millions de personnes dans un pays dont 95% du territoire est désertique. Le remplissage du GERD, même partiellement ralenti, est perçu au Caire comme une menace existentielle. Le président Abdel Fattah el-Sissi a déclaré publiquement que l&apos;eau du Nil était une ligne rouge. Les négociations trilatérales Éthiopie-Égypte-Soudan n&apos;ont à ce jour produit aucun accord contraignant.<sup>7</sup>
          </p>
          <p>
            À l&apos;Ouest du continent, le lac Tchad illustre un autre mécanisme. En cinquante ans, sa surface a diminué de 90% sous l&apos;effet conjugué du changement climatique et des prélèvements agricoles. Cette disparition progressive a bouleversé les économies pastorales et agricoles de quatre pays, Tchad, Niger, Nigeria, Cameroun, qui dépendaient de ses ressources. Les chercheurs du réseau ECOWAS documentent une corrélation directe entre le rétrécissement du lac, les migrations internes, et l&apos;instabilité qui a permis l&apos;expansion de Boko Haram dans la région.<sup>8</sup> L&apos;eau n&apos;a pas causé le jihadisme. Mais sa disparition a créé les conditions de sa propagation.
          </p>
        </>
      )

    case 'mena':
      return (
        <>
          <div className={styles.pullQuote}>
            <p>Les prochaines guerres ne se feront pas pour le pétrole mais pour l&apos;eau.</p>
            <cite>Boutros Boutros-Ghali, ancien secrétaire général de l&apos;ONU</cite>
          </div>
          <p>
            La Jordanie dispose d&apos;environ 60 mètres cubes d&apos;eau douce renouvelable par habitant et par an. Le seuil de pénurie absolue défini par les Nations Unies est de 500 mètres cubes. Ce rapport, un huitième du minimum, place la Jordanie parmi les pays les plus pauvres en eau du monde, dans une région qui concentre plusieurs des situations les plus critiques de la planète.
          </p>
          <p>
            Les pays du Golfe ont répondu à cette contrainte par une technologie à grande échelle : le dessalement de l&apos;eau de mer. L&apos;Arabie Saoudite, les Émirats arabes unis et le Koweït produisent aujourd&apos;hui une part significative de leur eau potable à partir de la mer. Ces installations représentent un investissement stratégique considérable, mais elles sont énergivores, concentrées sur les côtes, et vulnérables. Une frappe ciblée sur les grandes unités de dessalement saoudiennes ou émiraties priverait des millions de personnes d&apos;eau potable dans des délais de quelques heures. Cette vulnérabilité n&apos;est pas théorique : elle est documentée dans les analyses de risque militaire de la région.<sup>6</sup>
          </p>
          <p>
            Le conflit israélo-palestinien comporte une dimension hydrique systématiquement sous-estimée dans les analyses géopolitiques conventionnelles. L&apos;accès à l&apos;eau en Cisjordanie est régulé par des accords qui datent des Accords d&apos;Oslo, accords dont les mécanismes de révision n&apos;ont jamais été activés. La nappe phréatique de la montagne, partagée entre Israël et les Territoires palestiniens, fait l&apos;objet d&apos;une compétition documentée par plusieurs rapports du Programme des Nations Unies pour l&apos;environnement.
          </p>
        </>
      )
    default:
      return null
  }
}
