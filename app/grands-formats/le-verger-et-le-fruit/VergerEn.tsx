import { Filiation, Rattrapage, Asymetrie } from "./VergerClient";

/* Version anglaise du corps. Elle n'emprunte pas le chemin habituel du
   fichier lib/content/[slug]-en.html, parce que ce chemin remplace les
   enfants React par du HTML et ferait disparaître les trois
   visualisations pour le lecteur anglophone. Le corps est donc écrit en
   JSX, avec les mêmes composants passés en lang="en". */

export default function VergerEn() {
  return (
    <>
      <div className="soara-article">
        <p>
          <a
            href="/grands-formats/le-verger-et-le-fruit"
            style={{
              display: "inline-block",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#C8A96E",
              textDecoration: "none",
              borderBottom: "1.5px solid #C8A96E",
              paddingBottom: 1,
            }}
          >
            Lire en français
          </a>
        </p>

        <p>
          In July 2026, from the podium of the World Artificial Intelligence
          Conference in Shanghai, Chinese president Xi Jinping offered to share
          artificial intelligence with the developing world. The vocabulary was
          the vocabulary of the gift. He spoke of an international public good,
          announced five thousand training places for developing countries over
          the coming five years, promised applied cooperation centres with the
          African Union, the Arab League, the Association of Southeast Asian
          Nations and several other regional groupings, and opened a weather
          alert system named Mazu to some thirty states. Above all, he announced
          the founding in Shanghai of a World Artificial Intelligence
          Cooperation Organisation, presented as the answer to a call from the
          global South. On the exhibition floor, some of the most powerful
          models on the planet were being downloaded freely, with no invoice and
          no proprietary licence. The image was a clean one, a power extending
          its hand rather than closing its fist. It is worth pausing on, because
          technological generosity never exists in a pure state, and to grasp
          what is really happening in Shanghai you have to go back to another
          gift, the one China itself received a quarter of a century earlier.
        </p>

        <h2>
          A gift that <em>changed hands</em>
        </h2>

        <p>
          In November 1998, Bill Gates entrusted an engineer born in Taiwan,
          Kai-Fu Lee, with opening Microsoft&rsquo;s first Asian research
          laboratory in Beijing. The team fitted at first into a handful of
          offices, six people at most. A few years were enough to make it,
          according to a respected American technology review, the most exciting
          computer laboratory in the world. At the time, the press and officials
          readily described the institution as a present offered to China, a way
          for the American company to help a still peripheral country lift its
          software industry. Almost no one measured what that present would
          produce.
        </p>

        <p>
          That laboratory became the matrix of Chinese artificial intelligence.
          Most of the executives who carry weight in the sector today learned
          their trade there. The head of its computer vision group laid the
          groundwork for what would become SenseTime, one of the world&rsquo;s
          giants in facial recognition, and the founders of Megvii, Yitu and
          Horizon Robotics came out of the same corridors. Others went on to
          lead research at Baidu or to build Alibaba&rsquo;s cloud computing arm.
          The founder himself, after running Google&rsquo;s Chinese subsidiary,
          became one of the most influential investors in Chinese technology
          before launching his own model company. A donor believed it was
          establishing itself in an immense market, when it was in fact training
          the generation that would come to compete with it.
        </p>
      </div>

      <Filiation lang="en" />

      <div className="soara-article">
        <p>
          The episode is worth more than an anecdote, because it lights up a
          mechanism that rarely gets named. The Beijing laboratory did not hand
          out finished products, it passed on trained people, a way of
          approaching problems, a network of relationships and reputations. That
          transfer of people and methods is what made the gift fertile, and
          China understood it perfectly. Receiving the means to produce bears no
          comparison to receiving the means to consume. One may be called the
          orchard and the other the fruit. Microsoft gave away an orchard
          without ever having intended to, and the question running through
          everything that follows is folded into that image, since technological
          gifts do not all resemble one another, even when they go by the same
          name.
        </p>

        <h2>
          Digesting the present <em>was another matter</em>
        </h2>

        <p>
          Digesting the present was another matter, and nothing guaranteed that
          China would manage it. A country does not close a technological gap by
          buying sophisticated goods, it closes it by bringing minds home and
          rebuilding on its own soil the full chain that runs from fundamental
          research to the factory. Beijing went about this methodically, betting
          on its universities, on an industrial policy backed by the state, on
          the organised return of talent that had gone abroad to train. The
          resulting curve reads like a statement of intent. China&rsquo;s best
          models trailed the global frontier by seventeen to thirty-one points
          in 2023, depending on the benchmark. The annual report of
          Stanford&rsquo;s institute devoted to artificial intelligence brings
          that gap down to 2.7&nbsp;per cent by early 2026, after several changes
          of lead since a Chinese reasoning model first drew level with the best
          American system. A progression that steady owes nothing to chance, and
          reflects a patient determination to convert imported knowledge into
          autonomous capacity.
        </p>
      </div>

      <Rattrapage lang="en" />

      <div className="soara-article">
        <p>
          It is this now autonomous China that presents itself in Shanghai as a
          dispenser of generosity. It dominates an entire wing of artificial
          intelligence, the one made up of so-called open models, whose
          parameters anyone can retrieve and run on their own machines. Three
          names lead the field, DeepSeek, which shook the sector with a very
          low-cost system, Qwen, backed by Alibaba, and Kimi, out of the young
          Beijing company Moonshot. The last of these unveiled, on the eve of
          the summit&rsquo;s opening, a model of two thousand eight hundred
          billion parameters, presented as the largest ever intended for open
          access, whose results rival the best closed American systems. At the
          moment Xi Jinping speaks, that model can be reached only through a
          remote interface, the company having set the publication of its
          weights for some ten days later. On that basis, the Shanghai speech
          unfolds its offer to the South, wrapped in the idea of a planetary
          common good.
        </p>

        <h2>
          What comes down <em>toward the South</em>
        </h2>

        <p>
          What comes down toward Africa and other regions in this way is model
          weights, which is to say ripe fruit. Downloading a trained system
          gives access neither to the specialised processors that brought it
          into being, nor to the energy and data centres its operation demands,
          still less to the human pipeline capable of designing the next
          version. The paradox then leaps out. Today&rsquo;s gift has every
          appearance of greater generosity than that of 1998, being free and
          stripped of visible consideration, while transmitting perhaps far less
          of what made the Beijing laboratory so transformative. Microsoft
          bequeathed, against its own interests, the means to build. Part of
          what China is offering the South looks more like a harvest than an
          orchard.
        </p>

        <div className="pull-quote">
          <p>
            Receiving the means to produce bears no comparison to receiving the
            means to consume. One may be called the orchard and the other the
            fruit.
          </p>
        </div>

        <p>
          A serious objection arises here. Open weights are not inert
          merchandise, they can be fine-tuned on local languages, distilled into
          lighter versions, taken apart to understand their architecture,
          retrained on data of one&rsquo;s own. This would make them a seed
          rather than a fruit. The objection holds, provided one accepts that a
          seed requires soil. The model brandished in Shanghai weighs close to
          six hundred gigabytes in its full format and demands, for a simple
          experimental deployment, four to eight high-end graphics processors
          whose availability is precisely what American restrictions ration.
          Africa hosts 0.6&nbsp;per cent of the world&rsquo;s data centre
          capacity, three hundred and sixty megawatts in service, while some
          regions endure as many as thirty-three power cuts a month. Being able
          to download is not the same as being able to run. The calculation
          comes into focus as one moves down a floor. Commoditising the model
          layer ruins the business model of the American laboratories that
          charge for it, and shifts value toward hardware, electricity, data
          centres and applications, floors where Chinese companies are already
          building on the ground.
        </p>
      </div>

      <Asymetrie lang="en" />

      <div className="soara-article">
        <h2>
          A lesson that transposes <em>only at its own scale</em>
        </h2>

        <p>
          How Africa itself stands in this game remains to be seen, and this is
          where the dominant framing deserves to be taken apart. It is usually
          presented with a simple choice, Washington&rsquo;s closed artificial
          intelligence or Beijing&rsquo;s open artificial intelligence, as though
          the matter came down to designating a supplier. That framing assigns
          the continent from the outset the role of beneficiary in a rivalry
          playing out elsewhere and without it. The history of the Beijing
          laboratory suggests another dividing line, fairer and more demanding
          than the one on offer, the line separating the fruit one consumes from
          the orchard one cultivates. A beneficiary becomes the equal of its
          benefactor only by capturing skills and rebuilding the pipeline on its
          own soil, which is what China accomplished through the state, through
          its universities and through the recall of its talent.
        </p>

        <p>
          That said, the Chinese trajectory played out on ground that has no
          equivalent. In 1998 Beijing had a unified domestic market, a state
          capable of imposing an industrial policy over twenty years,
          universities placed at the summit of its scientific hierarchy, a
          manufacturing base and a diaspora it could recall by budgetary decree.
          Africa approaches the same question with fifty-four states, as many
          regulatory regimes, and markets that the continental free trade area is
          only beginning to connect. That fragmentation weighs on the outcome as
          much as the technical level does, since it turns every negotiation
          with Beijing into a bilateral discussion at a crushing imbalance of
          power. No country on the continent, taken on its own, carries the
          weight China carried against Microsoft. The lesson of 1998 transposes
          only at the scale at which it was learned, that of an entity large
          enough to set its own terms.
        </p>

        <p>
          Naming things without indulgence means acknowledging what is still
          missing if consumption is to give way to digestion, an industrial
          base, sovereign computing power, courses of study capable of holding
          on to the best rather than watching them leave. The picture is
          nonetheless not written in advance. A research community has formed on
          the continent without waiting for anyone to invite it. The main
          African gathering devoted to machine learning brings together more
          than a thousand participants each year from more than forty-five
          African countries, and its Nigerian edition takes sovereign
          intelligence as its watchword, understood as the continent&rsquo;s
          capacity to direct its own systems and its own scientific future. The
          Masakhane network works there on African languages using models that
          came from outside, redirected toward uses no one else will take on. It
          is this work of appropriation that separates the orchard from the
          fruit, and it is already under way, on a small scale, with whatever is
          at hand.
        </p>

        <p>
          The Shanghai summit makes sense only in the light of November 1998.
          China knows better than anyone the power of a technological gift,
          having received one, digested it patiently, then turned it against the
          party that had offered it, to the point that yesterday&rsquo;s donor
          now wonders whether it should ever have opened that laboratory. That
          memory casts a harsh light on the offer being made to the South today.
          Generosity is mixed in with calculation, as it always is, and what
          matters shifts toward the one who receives. The Chinese present will
          become an orchard or a fruit for Africa according to the use it
          manages to make of it, and that decision is one no one in Shanghai or
          Washington can take in its place. What is at stake behind the
          cooperation announcements and the models on offer is the map of power
          for the decades to come, being redrawn by the way the real means of
          building do, or do not, circulate.
        </p>

        <div className="notes-section">
          <div className="notes-header">
            <div className="notes-title">Notes and sources</div>
          </div>
          <ul className="notes-list">
            <li>
              <span>1</span>
              <span>
                Microsoft, official announcement, &ldquo;Microsoft Announces
                Beijing as Site for Its First Asian Research Lab&rdquo;, November
                1998.
              </span>
            </li>
            <li>
              <span>2</span>
              <span>
                CommonWealth Magazine, &ldquo;What Must Microsoft Research Asia
                Do to Survive?&rdquo;, May 2024: the laboratory described as a
                gift to China, the founders of SenseTime, Megvii, Yitu and
                Horizon Robotics drawn from its ranks, and Microsoft&rsquo;s
                deliberations over its future, drawing on a New York Times
                investigation of January 2024.
              </span>
            </li>
            <li>
              <span>3</span>
              <span>
                Chinese Ministry of Foreign Affairs and Xinhua news agency, full
                text of Xi Jinping&rsquo;s address at the opening of the World
                Artificial Intelligence Conference and the high-level meeting on
                global governance of artificial intelligence, Shanghai, 17 July
                2026: five thousand training places over five years, applied
                cooperation centres with the African Union, the Arab League,
                ASEAN, CELAC, the Shanghai Cooperation Organisation and the
                BRICS, the Mazu weather alert system opened to thirty countries,
                and the creation of a World Artificial Intelligence Cooperation
                Organisation.
              </span>
            </li>
            <li>
              <span>4</span>
              <span>
                NPR, coverage of the address and of the context of American
                restrictions on Chinese access to advanced technology, 17 July
                2026.
              </span>
            </li>
            <li>
              <span>5</span>
              <span>
                VentureBeat and South China Morning Post, on Moonshot AI&rsquo;s
                Kimi K3, two thousand eight hundred billion parameters, brought
                into service on 16 July 2026 through a remote interface and an
                application programming interface, with the company announcing
                publication of the full weights for 27 July 2026, ten days after
                the summit opened. Stated file size at native precision, roughly
                594 gigabytes, and minimum hardware cited for experimental use,
                four to eight H100 accelerators.
              </span>
            </li>
            <li>
              <span>6</span>
              <span>
                Stanford Institute for Human-Centered Artificial Intelligence, AI
                Index Report 2026, April 2026: performance gap between the best
                American and Chinese models narrowed to 2.7&nbsp;per cent in
                March 2026, against seventeen to thirty-one percentage points
                across benchmarks in May 2023.
              </span>
            </li>
            <li>
              <span>7</span>
              <span>
                Africa Data Centres Association, 2026 economic report on data
                centres in Africa: 0.6&nbsp;per cent of world capacity, three
                hundred and sixty megawatts in service, two hundred and
                thirty-eight under construction, six hundred and fifty-six
                planned.
              </span>
            </li>
            <li>
              <span>8</span>
              <span>
                Data centre operators across the continent, on supply
                instability and the combined reliance on the public grid,
                independent producers and captive generators.
              </span>
            </li>
            <li>
              <span>9</span>
              <span>
                Deep Learning Indaba, 2026 Nigerian edition held under the theme
                &ldquo;Sovereign Intelligence&rdquo;, annual attendance above one
                thousand participants from more than forty-five African
                countries, and the work of the Masakhane network on African
                languages.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
