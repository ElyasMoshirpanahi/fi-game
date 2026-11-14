# Gamification, wide pass 1: mechanics and progression models from games

Date: 2026-11-14

## Method

Question: which mechanics and whole progression models from games (idle, puzzle, merge, roguelite, collection, card, builder, tycoon) could wrap this learning game, given one player, no account, no server, no push, and progress in localStorage.

This note does not repeat the first pass (`gamification-mechanics.md`). Streaks, freezes, quests, badges, leaderboards, chests, progress rings and notifications are covered there. Findings from that note are used here only by reference.

Sources are developer talks and articles, peer-reviewed papers, and a few press interviews with designers. Each finding carries a strength label:

- **Meta-analysis**: a quantitative synthesis of many studies.
- **Single study**: one paper or experiment.
- **Practitioner claim**: a designer's stated reason or description. No measured effect.
- **Anecdote**: press or community commentary. Weakest.

How each source was read is listed in the Sources section. "Opened" means I read the page or the PDF text. "Search summary" means I read only a search engine's summary of the page, so the claim should be re-checked before it carries a decision. Product examples with no source next to them are named from general knowledge and are **unverified** in this pass. Sentences marked "Inference" are mine, not a source's.

One general warning. Most evidence for game mechanics is practitioner claim. Game studios rarely publish experiments. Where research evidence exists, it usually tests the psychological effect behind the mechanic (set completion, resumption of interrupted tasks, interleaved practice), not the mechanic inside a learning game.

## 1. Short answer

Three things from games fit this product better than more Duolingo-style layers.

1. **A compounding engine.** Idle games are, in their math, compound-growth simulators. The game teaches compounding, and people are measurably bad at feeling exponential growth. An engine where correct answers buy "assets" that pay Coins over time lets the player live the lesson. This is the strongest theme fit in this note.
2. **A run structure for Review.** Roguelites pack mixed content into a short, self-contained run and make failure pay something. Mixed (interleaved) practice has meta-analytic support. The existing Review can become "a run" with almost no new content.
3. **A place that fills up.** Collection books, bundles and a home base that is restored piece by piece give long-term goals that do not depend on a daily visit. Set completion has experimental support.

The main risks are the same in every genre: grind (time replaces skill), play by appointment (the game sets the player's schedule), and a meta-game that becomes more interesting than the learning.

## 2. Summary table

| # | Idea | Genre | Evidence strength | Solo, offline | Main risk |
|---|---|---|---|---|---|
| 1 | Compounding engine (generators) | Idle | Practitioner claim; single studies on the bias it targets | Yes | Number-watching replaces learning |
| 2 | Welcome-back payout (offline earnings) | Idle | Single study (taxonomy), practitioner claim | Yes (device clock) | Reward for absence, clock cheating |
| 3 | Maturing deposits tied to Review dates | Idle, farming | Single study on the dark side; inference for the fit | Yes | Play by appointment |
| 4 | Prestige reset | Idle | Practitioner claim | Yes | Erasing earned progress |
| 5 | Unfolding interface | Incremental | Anecdote | Yes | Hidden features confuse |
| 6 | Review as a run | Roguelite | Meta-analysis (interleaving); practitioner claim | Yes | Harder sessions feel worse |
| 7 | Failure that pays forward | Roguelite | Practitioner claim | Yes | Rewards losing on purpose |
| 8 | Opt-in difficulty ladder | Roguelite | Practitioner claim; single study (competence) | Yes | Only suits strong players |
| 9 | One daily seeded challenge | Puzzle, roguelite | Practitioner claim | Yes, without the social part | Scarcity pressure |
| 10 | Draft: pick one of three | Deckbuilder | Single study (autonomy); practitioner claim | Yes | Choice without meaning |
| 11 | Principle cards (passive modifiers) | Deckbuilder | Practitioner claim | Yes | Complexity, min-maxing |
| 12 | Merge mastered Cards | Merge | None found | Yes | Hides weak Cards |
| 13 | Collection book | Collection | Single study (set completion) | Yes | Completionism |
| 14 | Bundles that restore something | Farming sim | Single study (set completion); anecdote | Yes | Arbitrary sets feel manipulative |
| 15 | Restoration home base | Casual puzzle | Practitioner claim, no numbers | Yes | Art cost, shallow link to learning |
| 16 | Free builder (place your own assets) | City builder | Single study (IKEA effect) | Yes | Large build, off-topic play |
| 17 | Tycoon decision sandbox | Tycoon, sim | Single RCT (funded by industry); meta-analysis on financial education | Yes | Teaches a toy model, not reality |
| 18 | Solve, then optimise against benchmarks | Open-ended puzzle | Practitioner claim | Yes, with fixed benchmarks | Optimising replaces new learning |
| 19 | Visible skill map with dependencies | Strategy, RPG | Practitioner claim; single study (method) | Yes | Locks conflict with the open Path |
| 20 | Story beats in the hub | Narrative roguelite | Practitioner claim; meta-analysis hint (game fiction) | Yes | Writing cost |

## 3. Ideas

### 3.1 Compounding engine (generators)

**What it is.** The player buys generators that produce currency per second. Each generator's cost rises exponentially, and income is spent on more generators. The whole loop is reinvestment of returns.

**Where it is used.** AdVenture Capitalist, Cookie Clicker, Clicker Heroes, Egg, Inc., Realm Grinder (all named in Pecorella's series).

**Evidence.**
- Pecorella (Kongregate) describes the math: costs of the form base times a growth rate to the power of the count owned, giving "exponential costs with sub-exponential growth". **Practitioner claim.** Part II known through search summary only. https://www.gamedeveloper.com/game-platforms/the-math-of-idle-games-part-ii
- A 2015 write-up of his GDC talk reports that he called idle-game retention "amazing". It gives no numbers. **Practitioner claim, search summary.** https://gamedeveloper.com/design/the-rise-of-games-you-mostly-don-t-play
- GameAnalytics (2019 data, over 1.2 billion monthly players across genres) put day-1 retention of the top quarter of idle games near 42% and said idle retention was declining. **Company self-report, search summary, unverified by me.** https://gameworldobserver.com/2020/12/22/gameanalytics-names-benchmark-engagement-metrics-idle-games
- Why it matters for this theme: Stango and Zinman (2009) show that people underestimate compound growth ("exponential growth bias") and that the bias is negatively correlated with net worth. **Single study, search summary.** https://econpapers.repec.org/RePEc:bla:jfinan:v:64:y:2009:i:6:p:2807-2849
- Levy and Tasoff report that about a third of people treat compound interest as simple interest, and that the bias did not respond to a simple graphical intervention. **Single study, search summary.** https://personal.lse.ac.uk/levymr/papers/LevyTasoff.pdf
- No study was found that tests whether playing an idle game reduces exponential growth bias. That link is **Inference**.

**Solo, offline.** Yes. It is a few numbers and a timestamp.

**FI fit.** Very high. Generators are assets (index fund, bond, rental unit, small business). Coins earned from right answers are "wages". Coins spent on assets produce "capital income". A single screen can show the two income lines and the day the capital line passes the wage line. That crossing is the definition of financial independence. Lessons could unlock asset types: finish the Lesson on index funds to be allowed to buy one.

**Risks.** The engine can become the game, and the Lessons a chore that feeds it. Numbers that grow without effort are pleasant and teach nothing by themselves. Keep the only input to the engine equal to learning acts, and keep growth rates modest so the player sees a curve, not a slot machine. Note that the Levy and Tasoff result says a graph alone did not fix the bias.

### 3.2 Welcome-back payout (offline earnings)

**What it is.** While the game is closed, generators keep producing. On return the game shows what was earned in the player's absence, usually up to a cap.

**Where it is used.** Most idle games. Alharthi et al. (2018) studied 66 of them.

**Evidence.**
- Alharthi et al. (CHI 2018) analysed 66 idle games with grounded theory and built a taxonomy. A later paper quotes their finding that idle games balance rules that encourage leaving with rules that reward returning. The paper reports no retention data. **Single study, not opened (connection refused), search summary.** https://doi.org/10.1145/3173574.3174195
- Spiel et al. (2019) interviewed six designers of popular idle games about their approaches. **Single study, not opened (HTTP 403).** https://medium.com/chi-play/it-started-as-a-joke-on-the-design-of-idle-games-f4e17ad3eaf3
- The first research pass found that rewards for merely showing up lower intrinsic interest (Deci, Koestner and Ryan 1999). A welcome-back payout is a reward for being away, which is a different thing, but the same caution applies.

**Solo, offline.** Yes. Compute elapsed time from a saved timestamp on load. The device clock can be changed by the player. With no other players this harms nobody.

**FI fit.** High. "Your money worked while you slept" is the core promise of capital income. The return screen can say: "You were away 3 days. Your assets earned 42 Coins." This also replaces push notifications with a reason to open the game that is framed as a gain, not a loss.

**Risks.** It pays for absence, so it must not out-earn learning. Cap it (for example at seven days) so a long absence is neither punished nor a jackpot. Safari can delete localStorage after seven days without interaction (see the first pass), so the timestamp can vanish.

### 3.3 Maturing deposits tied to Review dates

**What it is.** The player commits a resource now and collects a larger one after a fixed real-time delay. In farming games this is planting and harvesting.

**Where it is used.** FarmVille, Animal Crossing (turnips, trees), most farming and base-building games.

**Evidence.**
- Zagal, Björk and Lewis (2013) name "playing by appointment" as a dark pattern. Their text says real-time crops are "not a bad thing per se". The pattern turns dark when a "withering" rule destroys value if the player is late, which creates "an obligation on the player to play according to the schedules the game offers". They add that the darkness "is nullified if completing appointments is not required for progression". **Single paper (conceptual analysis), opened.** https://gup.ub.gu.se/file/101018
- Deterding, Stenros and Montola (DiGRA 2020) criticise the dark-pattern concept itself. **Single paper, search summary.** https://eprints.whiterose.ac.uk/156460/1/DiGRA_2020_paper_189.pdf
- No evidence was found for the learning effect of maturing timers. The fit below is **Inference**.

**Solo, offline.** Yes.

**FI fit.** High, and it fits the existing Review ladder (1, 3, 7, 16, 35 days). Each Card in the Deck is already a deposit with a maturity date. The game can show it that way: "This Card matures in 3 days. Review it then and it pays." A correct Review at maturity pays the Coin and rolls the deposit into a longer term. This teaches delayed gratification and term structure with a mechanism the game already has. No withering: a late Review pays the same.

**Risks.** Any penalty for being late turns this into the dark pattern the paper describes. A wall of timers is noise. Show one aggregate ("5 Cards mature tomorrow").

### 3.4 Prestige reset

**What it is.** The player chooses to reset the run and start again from zero. In exchange they get a permanent currency or multiplier, so the next run goes faster and further.

**Where it is used.** AdVenture Capitalist (angel investors), Cookie Clicker (heavenly chips), Clicker Heroes, Egg, Inc., Realm Grinder (all in Pecorella Part III).

**Evidence.**
- Pecorella says prestige creates a "ladder climbing" effect, where a reset with a large boost gives a feeling of power and progress, and that it "rein[s] growth back into a more manageable number". He lists how games compute the prestige currency, for example as a square root of lifetime earnings. **Practitioner claim, opened.** https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii
- No experiment on prestige and retention was found.

**Solo, offline.** Yes.

**FI fit.** Medium. Two honest framings exist. (a) "Start over at 25 with what you know now": the player replays the engine from zero with a permanent bonus that stands for knowledge. This matches the theme that knowledge compounds too. (b) A "new generation" that inherits a small legacy. Only the engine resets. Lit Stations, Badges and the Deck must never reset.

**Risks.** Resetting learning progress would be a serious error. The first pass already advises against un-lighting anything. Prestige is also the main driver of endless grind in idle games. Limit it to a small fixed number of resets, or leave it out of a first version.

### 3.5 Unfolding interface

**What it is.** The game starts with one button or one line. New panels, currencies and systems appear only when the player reaches them. The player does not know how big the game is.

**Where it is used.** A Dark Room, Candy Box, Universal Paperclips (the last two are from general knowledge, unverified).

**Evidence.**
- An InformIT article on A Dark Room says the interface adds elements slowly so players get used to them, and that the first expansion teaches the player that the game will grow, so curiosity about what comes next becomes central. **Anecdote / design commentary, search summary.** https://informit.com/articles/article.aspx?p=2228802
- Balatro's creator describes his teaching approach as an "extended low-calorie tutorial" built on signposting, where single cards act as teachable moments. **Practitioner claim, opened.** https://gamedeveloper.com/design/balatro-creator-unveils-a-few-slick-signposting-strategies
- No measured effect found.

**Solo, offline.** Yes. It is a set of flags.

**FI fit.** Good. The Profile, the engine, the collection book and the simulator do not need to exist on day one. Section 1 shows only "earn and save". The asset panel appears after the first Lesson on investing. The reveal itself teaches the order of the roadmap: income, savings, investing, ownership.

**Risks.** Features the player cannot see cannot motivate them. A returning player who restored a backup may be confused by a changed layout. Keep the Path always visible.

### 3.6 Review as a run

**What it is.** A run is a short, self-contained session with a clear start and end, built from a random mix of content, where the player makes a few choices along the way. Each run is different. The result is a score or a distance reached.

**Where it is used.** Slay the Spire, Hades, Spelunky, Balatro.

**Evidence.**
- Brunmair and Richter (2019), meta-analysis of 59 studies, 238 effect sizes: mixing categories during practice (interleaving) beats blocked practice with Hedges' g = 0.42 overall. The effect varies by material and was small for mathematics. The authors advise caution for expository texts and words. **Meta-analysis, search summary of abstract.** https://pubmed.ncbi.nlm.nih.gov/31556629/
- Slay the Spire's designers balanced the game with metrics from every run. Their GDC 2019 talk is on design and balance, not on retention. **Practitioner claim, search summary.** https://gdconf.com/news/learn-slay-spires-successful-metrics-driven-approach-game-balancing-gdc-2019
- Koster's claim in A Theory of Fun is that fun is the feeling of learning patterns and that boredom starts when a game stops teaching. This is a theory, not a result. **Practitioner claim, search summary.** https://www.raphkoster.com/wp-content/uploads/2026/07/Theory-of-Fun-10-Years-Later.pdf

**Solo, offline.** Yes.

**FI fit.** Good. Today's Review is a queue. As a run it becomes "one working year": ten to fifteen due Cards drawn from all Sections, with two or three small events between them (a pay rise, an unexpected bill) that are themselves questions. The run ends with a year-end statement. The Review cap of 20 already bounds the length.

**Risks.** Interleaved practice feels harder and players rate it lower even when it works better. This is a known pattern for testing as well (see Roediger and Karpicke in the first pass). The benefit is weakest for text-like material, which is close to what this game teaches, so the gain may be smaller than g = 0.42.

### 3.7 Failure that pays forward

**What it is.** A failed run still gives something permanent: a resource, a story beat, or a small assist. The game is designed so that losing is the normal path, not a punishment.

**Where it is used.** Hades (permanent upgrades between escape attempts, new dialogue after each death, God Mode), Rogue Legacy (unverified, from general knowledge).

**Evidence.**
- Greg Kasavin (Supergiant): "It was an explicit goal of our early development, to take the pain out of dying and having to restart." And: "You have to be compelled to explore further and feel the time you spent wasn't a waste of your time." **Practitioner claim, opened.** https://gamedeveloper.com/design/how-supergiant-weaves-narrative-rewards-into-i-hades-i-cycle-of-perpetual-death
- Hades' God Mode gives 20% damage resistance and adds 2% after each death, up to 80%. The team wanted a boost that is felt at once and does not break the game. **Practitioner claim through a press interview, search summary.** https://inverse.com/gaming/hades-god-mode-interview
- The first pass already found that penalising mistakes hurts beginners (Duolingo dropped Hearts). No experiment on failure-forward design was found.

**Solo, offline.** Yes.

**FI fit.** Good. A failed Fare can pay a "lesson learned" note that is kept in a journal, in the spirit of "mistakes are tuition". An assist in the God Mode style could add one extra Hint or one removed wrong option per failed attempt at the same Fare, up to a cap. It should be opt-in and labelled.

**Risks.** If failure pays well, players fail on purpose. Keep the payout informational (a note, a story line, an assist), not Coins. A growing assist can let a player pass without knowing the material, so a Fare passed with heavy assist should still send its Cards to Review.

### 3.8 Opt-in difficulty ladder

**What it is.** After the first win, the player may replay with one added constraint. Each win unlocks the next constraint. The player chooses how high to climb.

**Where it is used.** Slay the Spire (Ascension, reported as 20 levels, unlocked after a first win), Hades (Pact of Punishment, unverified, from general knowledge), Balatro (stakes).

**Evidence.**
- A summary of the Slay the Spire GDC talk says Ascension served different skill levels and gave the designers balance data. **Practitioner claim, from an AI-generated summary of the talk, unverified.** The talk: https://gdcvault.com/play/1025731/
- Ryan, Rigby and Przybylski (2006): across four studies, felt competence and autonomy in a game were associated with enjoyment, and in a survey of multiplayer players they independently predicted future play. **Single paper (four studies), search summary of abstract.** https://link.springer.com/content/pdf/10.1007%2Fs11031-006-9051-8.pdf
- Balatro's designer is reported to have added stakes, unlocks and challenges to push players out of their comfort zones. **Anecdote, search summary of a third-party article.** https://engineered.at/articles/solitaire

**Solo, offline.** Yes.

**FI fit.** Medium. A lit Section can be replayed "on a lower salary", "with no Hint", "with free recall instead of multiple choice", or "with a market crash card in the run". The harder formats are also better retrieval practice. This is **Inference**, based on the testing-effect sources in the first pass.

**Risks.** It serves the strongest players only. It must stay optional and must never gate new content. Replaying known content for a ladder is the "more quantity, same quality" problem from the first pass, unless the added constraint makes retrieval harder.

### 3.9 One daily seeded challenge

**What it is.** One special puzzle or run per day, the same for everyone, playable once. It is generated from the date.

**Where it is used.** Wordle, NYT Spelling Bee, Spelunky Daily Challenge, Dead Cells (which allows retries).

**Evidence.**
- Josh Wardle said Wordle's one-a-day limit came from Spelling Bee and that it encourages spending about three minutes a day. He also said the shared daily word created the social side. **Practitioner claim, search summary of press interviews and his GDC 2022 talk.** https://www.gamedeveloper.com/marketing/josh-wardle-reflects-on-the-the-unconventional-road-to-wordle-s-success
- Spelunky gives one attempt at the same generated levels each day. Game Developer notes that designs vary and that developers do not share one view of what makes a daily run good. **Practitioner claim / commentary, search summary.** https://gamedeveloper.com/design/the-24-hour-ticket-examining-daily-runs-
- No experiment found.

**Solo, offline.** Partly. A date-seeded challenge needs no server. The shared, social part (same puzzle as friends, comparing results) is lost unless the player shares a result as text. Wardle's own view is that the social part mattered a great deal.

**FI fit.** Medium. A "decision of the day": one short scenario (a job offer, a car purchase, a windfall) with one best answer and a worked explanation. It is small enough to finish in three minutes and gives a second reason to open the game on days with no Review due.

**Risks.** Scarcity is a pressure tactic when a missed day is framed as a loss. Do not attach the streak to it. It overlaps with the three daily quests the game already has. One or the other should lead.

### 3.10 Draft: pick one of three

**What it is.** After a step, the game offers three random options and the player keeps one. Over many picks the player builds something personal.

**Where it is used.** Slay the Spire (card rewards), Hades (boons), Balatro (shop), Dominion (deck building in general, unverified, from general knowledge).

**Evidence.**
- Sid Meier's GDC 2012 talk frames good games as "a series of interesting decisions", where trade-offs and short-term versus long-term benefits make a decision interesting. **Practitioner claim, search summary.** https://gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions
- Autonomy predicts enjoyment and future play (Ryan, Rigby and Przybylski 2006, above).
- No experiment on drafting was found.

**Solo, offline.** Yes.

**FI fit.** Good as a replacement for the random chest. At the end of a Lesson the player picks one of three: an asset for the engine, a principle card (3.11), or a collection entry (3.13). The choice is itself a small lesson in opportunity cost. This answers the first pass's objection to chests: the reward is chosen, not a slot-machine payout.

**Risks.** If one option is always best, the choice is fake. If the options change learning outcomes (for example "skip a Review"), players will draft against their own interest.

### 3.11 Principle cards (passive modifiers)

**What it is.** A small set of held items that change the rules while held. The player has limited slots, so they must choose a combination. Combinations that work together are the main source of depth.

**Where it is used.** Balatro (jokers), Slay the Spire (relics), Hades (keepsakes, unverified, from general knowledge).

**Evidence.**
- Balatro's creator says single joker cards worked as "teachable moments" that showed players the game was more varied than expected. **Practitioner claim, opened.** https://gamedeveloper.com/design/balatro-creator-unveils-a-few-slick-signposting-strategies
- No measured effect found.

**Solo, offline.** Yes.

**FI fit.** High as a memory aid. Each principle card is a named idea from the content: "Pay yourself first" (10% of every Coin earned goes straight to the engine), "Emergency fund" (one failed Fare a week costs nothing), "Low fees" (assets cost a little less), "Time in the market" (a bonus that grows with days held). The rule each card applies is the principle it names, so using the card rehearses the idea.

**Risks.** This is the most complex idea in the note. Balance work is real. Min-maxing can pull attention from Lessons. Three slots and under a dozen cards is a sane ceiling for a first version.

### 3.12 Merge mastered Cards

**What it is.** Two items of the same level combine into one item of the next level. The board fills up, so merging is how the player makes room and progresses.

**Where it is used.** Merge Mansion, Merge Dragons, Triple Town, 2048 (all from general knowledge, unverified).

**Evidence.** None found. I did not open any primary source on merge games in this pass. Everything in this entry is **Inference** and should be treated as an untested idea.

**Solo, offline.** Yes.

**FI fit.** Medium. Two Cards that have both climbed the full Review ladder could merge into one "Principle" Card that asks a question joining both ideas (for example savings rate and time to FI). This keeps the Deck from growing without limit and moves Review from recall of facts toward connecting them.

**Risks.** A merged Card hides whether the player still knows each part. Authoring joined questions is content work, not code. A merge board as a separate mini-game would be pure distraction.

### 3.13 Collection book

**What it is.** A catalogue with a slot for every item in the game. Empty slots show as outlines. Filling a page or the whole book is a goal the player sets for themselves.

**Where it is used.** Animal Crossing (museum and Critterpedia), Pokémon (Pokédex), Stardew Valley (collections tab) (the last two are from general knowledge, unverified).

**Evidence.**
- Barasz, John, Keenan and Norton (2017), "Pseudo-Set Framing": grouping items into an apparent set makes people work to complete it. The effect held with no reward, at a cost, and after people were told the set was arbitrary. In a Red Cross field experiment, framing six aid items as one kit led four to seven times as many donors to give all six. The authors note it can backfire: a donor who would give seven may stop at six. **Single paper, five studies plus field data, search summary.** https://dash.harvard.edu/entities/publication/73120379-11c6-6bd4-e053-0100007fdf3b
- Ghibellini and Meier (2025), meta-analysis: people tend to resume interrupted tasks (the Ovsiankina effect). The claim that unfinished tasks are remembered better (the Zeigarnik effect) was not supported: "We found no memory advantage for unfinished tasks." **Meta-analysis, abstract opened, no effect sizes on the page read.** https://ideas.repec.org/a/pal/palcom/v12y2025i1d10.1057_s41599-025-05000-w.html
- Zagal et al. (2013) note that Animal Crossing ties some items to real dates as bonuses, and judge this not dark because progress does not depend on it. **Opened.**

**Solo, offline.** Yes.

**FI fit.** Good. The book could hold three kinds of entry: Concepts (one per Card that has climbed the ladder), Asset classes (unlocked by Lessons), and People or Books (the sources behind the content). An entry is earned by retrieval, not by luck, so it is a gacha-free collection. Each entry page can hold the short explanation, which makes the book a real reference.

**Risks.** Completionism. The Barasz result says the pull works even when people know the set is arbitrary, so the sets must be real (a Section's concepts), not invented to create pull. No time-limited entries.

### 3.14 Bundles that restore something

**What it is.** A small themed set of items from different parts of the game. Completing a bundle restores a room or opens an area. Bundles pull the player toward content they would otherwise skip.

**Where it is used.** Stardew Valley (Community Center bundles: completing a room's bundles restores it and opens areas such as the Quarry).

**Evidence.**
- Set completion: Barasz et al. (2017), above.
- Stardew's designer shared early notebook pages showing bundles were in the design from the start. He has not, in the sources found, explained the reasoning. **Anecdote, search summary.** https://www.gamesradar.com/games/simulation/if-i-made-stardew-valley-again-i-would-try-to-be-a-little-more-nuanced-eric-barone-says-the-community-center-versus-jojamart-battle-was-too-black-and-white
- No measured effect found.

**Solo, offline.** Yes.

**FI fit.** Good. A bundle crosses Sections, which a per-Section Recap cannot do. Example: "Emergency fund bundle" needs one Card each from budgeting, saving and insurance, all at Review step 3 or higher. Completing it restores a part of the home base (3.15). This rewards retention across topics, which is what a real financial plan needs.

**Risks.** Bundles that need Cards far ahead on the Path will frustrate. Too many bundles is a second quest list.

### 3.15 Restoration home base

**What it is.** Puzzle levels pay a token. Tokens are spent to restore one fixed place, step by step, in a set order. The place is the long-term goal and the puzzles are the pacing.

**Where it is used.** Gardenscapes, Homescapes, Fishdom, Royal Match.

**Evidence.**
- GameRefinery describes the pattern: Gardenscapes added "a pinch of decoration and storytelling meta game" on top of match-3, and "unlocking more story content and renovating your home town requires progression in the core game". The article gives no retention or revenue numbers. **Practitioner / analyst claim, opened.** https://www.gamerefinery.com/casual-match3-meta-layer-new-winning-formula/
- GameRefinery classes Royal Match as renovation with no choices and no story options. **Analyst claim, search summary.** https://www.gamerefinery.com/why-renovation-and-construction-elements-are-becoming-more-popular-in-casual-games/
- The first pass cites goal-gradient and endowed-progress studies, which support visible progress toward a goal in general.

**Solo, offline.** Yes.

**FI fit.** Medium to good. The place can be the player's own life drawn as a single scene: a rented room at the start, then debt paid off, a savings jar, a first share certificate on the wall, a paid-off home. Each Section restores one part. It is a picture of the roadmap that fills in.

**Risks.** Art cost in a single-file game. In the source games this layer exists to pace monetisation, and levels are tuned to block progress. None of that applies here and none should be copied. A scene that implies wealth equals a big house contradicts content about frugality.

### 3.16 Free builder (place your own assets)

**What it is.** The player places and arranges buildings on a map. The layout is theirs. The town is a visible record of everything they have done.

**Where it is used.** SimCity, Animal Crossing (island and house), Townscaper (the first and last from general knowledge, unverified).

**Evidence.**
- Norton, Mochon and Ariely (2012), "The IKEA effect": people value things they built themselves more highly. The effect needs the build to be completed. People who built and then took apart their work, or did not finish, showed no boost. **Single paper, several experiments, search summary.** https://papers.ssrn.com/abstract=1777100
- Autonomy and competence predict enjoyment (Ryan, Rigby and Przybylski 2006, above).

**Solo, offline.** Yes, but the state is larger and must go into the backup file.

**FI fit.** Medium. Assets bought in the engine (3.1) appear as buildings the player places: a small shop, a rental flat, a fund office. The town is the portfolio. Diversification becomes visible as variety on the map.

**Risks.** The largest build in this note. Players can spend whole sessions arranging and none learning. The IKEA finding says unfinished builds give no benefit, so a town that can never be finished may not help.

### 3.17 Tycoon decision sandbox

**What it is.** A simulation of a business or a life where the player sets a few levers each turn and sees the result over time. The fun is in trade-offs under uncertainty.

**Where it is used.** Game Dev Tycoon, Kairosoft games (both from general knowledge, unverified), The Stock Market Game (classroom programme).

**Evidence.**
- Learning Point Associates ran a randomised controlled trial of The Stock Market Game in nearly 600 classrooms. Students who played scored higher on financial literacy and on mathematics tests than students who did not. Example: in Grades 7 to 10, players scored on average above the 54th percentile in mathematics and non-players above the 46th. Elementary players scored above the 68th percentile in financial literacy and non-players above the 42nd. The study was funded by the FINRA Investor Education Foundation and the game is run by the SIFMA Foundation, a securities industry body. **Single RCT, industry funded, summary document opened, full report not opened.** https://www.sifma.org/wp-content/uploads/2017/05/education_sifma-foundation_learning-point-study-summary.pdf
- Kaiser, Lusardi, Menkhoff and Urban (2022), meta-analysis of 76 randomised experiments with over 160,000 people: financial education has positive causal effects on financial knowledge and on later financial behaviour. **Meta-analysis, search summary of abstract.** https://www.nber.org/papers/w27057.pdf
- Goda, Manchester and Sojourner: a field experiment that sent people projections of what their retirement account would be worth led to more changes in contributions and larger increases. The authors say anchoring may be part of the effect. **Single field experiment, search summary.** https://www.tiaa.org/public/institute/publication/2013/what-will-my-account-really-be-worth
- Meier on interesting decisions (above).

**Solo, offline.** Yes.

**FI fit.** Very high. A "life sim" of 40 turns, one per year. Each turn the player sets a savings rate, picks where savings go, and answers one or two Review Cards whose results nudge the year (a right answer on fees lowers the fund cost that year). At the end the game shows the age at which capital income passed spending. Replays with different choices teach by comparison. The Goda result suggests that seeing a projection of one's own numbers changes real behaviour, which is the outcome this product wants.

**Risks.** A simulation teaches its own model. If returns are fixed and always positive, it teaches overconfidence. If the player can win by picking single stocks, it teaches the wrong lesson. The Stock Market Game has been criticised for rewarding short-term trading, but I did not open a source for that criticism, so it is **unverified**. Random market outcomes must be framed as risk, not as a prize.

### 3.18 Solve, then optimise against benchmarks

**What it is.** A puzzle accepts any working solution. After solving, the game shows how the solution scores on two or three separate measures and how that compares with others. Players return to improve a measure they care about.

**Where it is used.** Zachtronics games: SpaceChem, Opus Magnum, TIS-100.

**Evidence.**
- Zach Barth describes the pattern in an interview: first find any working solution, then pursue "secondary optimization metrics". **Practitioner claim, search summary.** https://softwareengineeringdaily.com/2025/12/18/building-games-at-zachtronics-with-zach-barth/
- A write-up of his GDC 2019 talk says the studio ships puzzles the designers "haven't solved (or haven't optimally solved)" because "players will come up with their own unique solutions". The write-up does not mention histograms. **Practitioner claim, opened.** https://gamedeveloper.com/design/video-zachtronics-approach-to-open-ended-puzzle-design
- The claim that Zachtronics uses histograms in place of ranked leaderboards to avoid discouraging players is common but I could not confirm it in a source. **Unverified.**
- The first pass found that personal bests are the one solo substitute for leaderboards with evidence (Anderson and Green 2018).

**Solo, offline.** Yes, with fixed benchmarks. A histogram of other players needs a server. Three designer-set marks (bronze, silver, gold) plus the player's own best work offline.

**FI fit.** Good for the sandbox in 3.17 and for budget puzzles. "Reach FI" is the solve. Then three measures: fewest years, lowest worst-year drop, highest spending kept. They trade off against each other, which is the real shape of the problem. There is no single right plan.

**Risks.** Optimising one scenario many times is not learning new material. It suits the end of a Section, not the middle.

### 3.19 Visible skill map with dependencies

**What it is.** A map of all skills that shows which ones build on which. The player sees what a new skill will open before they start it.

**Where it is used.** Civilization (technology tree), Hades (Mirror of Night), most RPG skill trees (general knowledge, unverified).

**Evidence.**
- Daniel Cook, "The Chemistry of Game Design" (2007): a game is a chain of "skill atoms", each a loop of action, simulation, feedback and updated mental model, and later atoms depend on earlier ones. He names "burnout" for the point where a player stops engaging with an atom. **Practitioner claim, search summary.** https://www.gamedeveloper.com/pc/feature-the-chemistry-of-game-design-
- Horn, Cooper and Deterding (2017) note that designers usually draw assumed skill chains, not observed ones, and propose a method to find the real ones. **Single paper (method), search summary.** https://eprints.whiterose.ac.uk/120653/1/Horn_Cooper_Deterding_CTAGAMES.pdf
- No measured effect of showing a skill map was found.

**Solo, offline.** Yes.

**FI fit.** Medium. The Path is linear and already open. A second view could show concepts as a web: compounding feeds both "index funds" and "cost of debt". Its main value may be for the authors. Cook's model is a tool for checking that no Lesson needs an idea that was never taught.

**Risks.** Hard locks would conflict with the open Path, which the first pass counts as support for autonomy. Use the map as a view, not a gate.

### 3.20 Story beats in the hub

**What it is.** Between sessions the player returns to a hub where characters say something new. What they say depends on what just happened, including failure. The story is the reward for coming back.

**Where it is used.** Hades (House of Hades).

**Evidence.**
- Kasavin: "Reactivity has always been a goal of our narrative design." The article describes story events triggered by run conditions and built around the loop of dying and returning. **Practitioner claim, opened.** https://gamedeveloper.com/design/how-supergiant-weaves-narrative-rewards-into-i-hades-i-cycle-of-perpetual-death
- The first pass cites Sailer and Homner (2020), where game fiction was one of the few elements linked to better behavioural outcomes.

**Solo, offline.** Yes. It is text and flags.

**FI fit.** Good and cheap. Two or three recurring characters (a friend deep in debt, an older relative who invested early, a colleague who chases hot tips) each have a short arc that advances when the player finishes a Section or fails a Fare. Their arcs are case studies of the content. One or two lines per visit is enough.

**Risks.** Writing cost and tone. Characters that moralise will be skipped. Lines must never block the next Lesson.

## 4. What to avoid from these genres

1. **Withering.** Any rule that destroys value when the player is late. This is the exact condition Zagal et al. give for play by appointment becoming dark.
2. **Grind.** Progress that depends on time spent, not skill. Zagal et al. define it as "performing repetitive and tedious tasks" where time invested is emphasised over skill. In this game: any loop where Coins can be farmed without new retrieval.
3. **Energy and pay-to-skip.** Not relevant without payments, but the same shape appears if Coins can skip a Review. Do not sell skips.
4. **A meta-game that out-earns learning.** If idle income exceeds income from answers, the rational player stops answering.
5. **Random rewards presented as investing.** A game about financial independence must not teach that wealth comes from lucky draws. Use drafts and fixed rewards.
6. **Resets of learning state.** Prestige may reset the engine. It must never reset the Deck, Lit Stations or Badges.
7. **Fake social proof.** Histograms or rivals that pretend to be other players. Zagal et al. list impersonation as a dark pattern. Use fixed benchmarks and say so.

## 5. Whole models

**Model A: The Compounding Engine.** (Ideas 3.1, 3.2, 3.3, optional 3.4, 3.10.) Coins stop being a score and become wages. The player invests Coins in assets that pay Coins over real time, with a capped welcome-back payout on return. Each Card in the Deck is shown as a deposit that matures on its Review date. At the end of a Lesson the player picks one of three rewards instead of opening a chest. One screen shows wage income against capital income and marks the day the second passes the first. The player lives the thesis of the content, and the reason to return is a gain waiting, not a streak at risk. Smallest build of the five. Main danger: idle income must stay below earned income for a long time, or Lessons become optional.

**Model B: The Working Year.** (Ideas 3.6, 3.7, 3.8, 3.9.) Review becomes a run called a year: a mixed draw of due Cards from all Sections with a few event cards in between and a year-end statement. A failed Fare or a weak year pays a journal note and an optional assist, never a penalty. Lit Sections can be replayed on a ladder of harder terms (no Hint, free recall, a crash card). One date-seeded "decision of the day" gives a three-minute session when nothing is due. This model changes the feel of existing content and adds little new content. It leans on the best research in this note (interleaving), with the caution that mixed practice feels harder.

**Model C: The Estate.** (Ideas 3.13, 3.14, 3.15, 3.20, 3.5.) A single scene of the player's life is restored part by part as Sections are lit. A collection book records every concept that has climbed the Review ladder. Cross-Section bundles restore extra parts of the scene. Two or three characters comment when the player returns. Features appear only when reached. This model gives long-term goals that survive a missed week, which suits a Review ladder that reaches 35 days. It needs art and writing more than code. Main danger: the scene must not equate independence with luxury.

**Model D: The Principle Deck.** (Ideas 3.10, 3.11, 3.12, 3.19.) The player builds a small hand of principle cards drafted at Lesson ends. Each card applies the rule it names (pay yourself first, low fees, emergency fund). Fully learned Cards can merge into joined-concept Cards. A concept web shows how ideas depend on each other. This is the most game-like and the most complex model, and it has the weakest evidence: every part rests on practitioner claims or inference. It is best treated as a later layer on top of Model A, where the principles have an engine to act on.

**Model E: The Life Sim.** (Ideas 3.17, 3.18, 3.1, 3.6.) A 40-turn simulation of a working life sits beside the Path as the capstone of each Section. Each turn the player sets a savings rate and an allocation, and Review Cards answered that turn adjust the year. The result is the age of independence, scored on three measures against fixed benchmarks and the player's own best. Each Section unlocks one more lever (debt, fees, tax, risk). This is the only model with trial evidence for a close relative (The Stock Market Game, industry funded) and it targets behaviour, not only recall. It is also the easiest to get wrong, because the player will learn whatever the simulation rewards.

**Inference on order.** Model A is the cheapest and has the best theme fit. Model B reuses what exists. They do not conflict and could be prototyped together. Models C and E are larger. Model D should wait.

## 6. Sources

"Opened" means I read the page or the extracted PDF text. "Search summary" means only a search engine's summary was read. Claims resting on search summaries should be re-checked before they carry a decision.

| Source | URL | Read |
|---|---|---|
| Pecorella, The Math of Idle Games, Part III (Game Developer) | https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii | Opened |
| Pecorella, The Math of Idle Games, Part I | https://gamedeveloper.com/design/the-math-of-idle-games-part-i | Search summary |
| Pecorella, The Math of Idle Games, Part II | https://www.gamedeveloper.com/game-platforms/the-math-of-idle-games-part-ii | Search summary |
| Pecorella, Quest for Progress (Kongregate blog) | https://blog.kongregate.com/quest-for-progress-the-math-of-idle-games | Not opened (HTTP 404) |
| Game Developer (2015), The rise of games you (mostly) don't play | https://gamedeveloper.com/design/the-rise-of-games-you-mostly-don-t-play | Search summary |
| GameAnalytics idle benchmarks, reported by Game World Observer (2020) | https://gameworldobserver.com/2020/12/22/gameanalytics-names-benchmark-engagement-metrics-idle-games | Search summary |
| Alharthi, Alsaedi, Toups, Tanenbaum, Hammer (2018), Playing to Wait: A Taxonomy of Idle Games, CHI | https://doi.org/10.1145/3173574.3174195 | Not opened (connection refused); search summary |
| Spiel et al. (2019), "It Started as a Joke": On the Design of Idle Games, CHI PLAY | https://medium.com/chi-play/it-started-as-a-joke-on-the-design-of-idle-games-f4e17ad3eaf3 | Not opened (HTTP 403); search summary |
| Zagal, Björk, Lewis (2013), Dark Patterns in the Design of Games, FDG | https://gup.ub.gu.se/file/101018 | Opened (PDF text) |
| Deterding, Stenros, Montola (2020), Against "Dark Game Design Patterns", DiGRA | https://eprints.whiterose.ac.uk/156460/1/DiGRA_2020_paper_189.pdf | Search summary |
| Stango and Zinman (2009), Exponential Growth Bias and Household Finance, Journal of Finance 64(6) | https://econpapers.repec.org/RePEc:bla:jfinan:v:64:y:2009:i:6:p:2807-2849 | Search summary |
| Levy and Tasoff, Exponential-Growth Bias and Overconfidence | https://personal.lse.ac.uk/levymr/papers/LevyTasoff.pdf | Search summary |
| Goda, Manchester, Sojourner, What Will My Account Really Be Worth? (TIAA Institute, 2013) | https://www.tiaa.org/public/institute/publication/2013/what-will-my-account-really-be-worth | Search summary |
| Kaiser, Lusardi, Menkhoff, Urban (2022), Financial education affects financial knowledge and downstream behaviors (NBER w27057; J. Financial Economics 145) | https://www.nber.org/papers/w27057.pdf | Search summary |
| Learning Point Associates (2010), The Study of The Stock Market Game, summary | https://www.sifma.org/wp-content/uploads/2017/05/education_sifma-foundation_learning-point-study-summary.pdf | Opened (PDF text; one line cut off) |
| Learning Point Associates, The Stock Market Game Study, final report | https://finrafoundation.org/sites/finrafoundation/files/the_stock_market_game_1_0.pdf | Not opened (redirect loop) |
| Brunmair and Richter (2019), Similarity matters: a meta-analysis of interleaved learning, Psychological Bulletin | https://pubmed.ncbi.nlm.nih.gov/31556629/ | Search summary |
| Ghibellini and Meier (2025), Interruption, recall and resumption: a meta-analysis of the Zeigarnik and Ovsiankina effects, Humanities and Social Sciences Communications 12 | https://ideas.repec.org/a/pal/palcom/v12y2025i1d10.1057_s41599-025-05000-w.html | Abstract opened |
| Barasz, John, Keenan, Norton (2017), Pseudo-Set Framing, J. Experimental Psychology: General 146(10) | https://dash.harvard.edu/entities/publication/73120379-11c6-6bd4-e053-0100007fdf3b | Search summary |
| Norton, Mochon, Ariely (2012), The IKEA Effect, J. Consumer Psychology 22(3) | https://papers.ssrn.com/abstract=1777100 | Search summary |
| Ryan, Rigby, Przybylski (2006), The Motivational Pull of Video Games, Motivation and Emotion 30 | https://link.springer.com/content/pdf/10.1007%2Fs11031-006-9051-8.pdf | Search summary |
| Game Developer, How Supergiant weaves narrative rewards into Hades' cycle of perpetual death | https://gamedeveloper.com/design/how-supergiant-weaves-narrative-rewards-into-i-hades-i-cycle-of-perpetual-death | Opened |
| Inverse, Hades God Mode interview | https://inverse.com/gaming/hades-god-mode-interview | Search summary |
| GDC 2019, Slay the Spire: Metrics Driven Design and Balance (Giovannetti) | https://gdcvault.com/play/1025731/ | Search summary; details from an AI-generated talk summary, unverified |
| Game Developer, Balatro creator unveils a few slick signposting strategies | https://gamedeveloper.com/design/balatro-creator-unveils-a-few-slick-signposting-strategies | Opened |
| engineered.at, article on Balatro and solitaire design | https://engineered.at/articles/solitaire | Search summary (third-party) |
| Game Developer, Josh Wardle reflects on the unconventional road to Wordle's success (GDC 2022) | https://www.gamedeveloper.com/marketing/josh-wardle-reflects-on-the-the-unconventional-road-to-wordle-s-success | Search summary |
| Game Developer, The 24-hour ticket: examining daily runs | https://gamedeveloper.com/design/the-24-hour-ticket-examining-daily-runs- | Search summary |
| Game Developer, The understated genius of the Spelunky Daily Challenge | https://gamedeveloper.com/design/the-understated-genius-of-the-i-spelunky-i-daily-challenge | Search summary |
| Game Developer, GDC 2012: Sid Meier on how to see games as sets of interesting decisions | https://gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions | Search summary |
| GameRefinery, Casual Match3 + Meta Layer = New Winning Formula? | https://www.gamerefinery.com/casual-match3-meta-layer-new-winning-formula/ | Opened |
| GameRefinery, Why renovation and construction elements are becoming more popular in casual games | https://www.gamerefinery.com/why-renovation-and-construction-elements-are-becoming-more-popular-in-casual-games/ | Search summary |
| Game Developer, Video: Zachtronics' approach to open-ended puzzle design (GDC 2019) | https://gamedeveloper.com/design/video-zachtronics-approach-to-open-ended-puzzle-design | Opened |
| Software Engineering Daily (2025), Building games at Zachtronics with Zach Barth | https://softwareengineeringdaily.com/2025/12/18/building-games-at-zachtronics-with-zach-barth/ | Search summary |
| Cook (2007), The Chemistry of Game Design | https://www.gamedeveloper.com/pc/feature-the-chemistry-of-game-design- | Search summary |
| Horn, Cooper, Deterding (2017), Adapting Cognitive Task Analysis to Elicit the Skill Chain of a Game, CHI PLAY | https://eprints.whiterose.ac.uk/120653/1/Horn_Cooper_Deterding_CTAGAMES.pdf | Search summary |
| Koster, A Theory of Fun, 10 Years Later (slides) | https://www.raphkoster.com/wp-content/uploads/2026/07/Theory-of-Fun-10-Years-Later.pdf | Search summary |
| InformIT, Interface Lessons from "A Dark Room" | https://informit.com/articles/article.aspx?p=2228802 | Search summary |
| GamesRadar, Eric Barone on the Community Center | https://www.gamesradar.com/games/simulation/if-i-made-stardew-valley-again-i-would-try-to-be-a-little-more-nuanced-eric-barone-says-the-community-center-versus-jojamart-battle-was-too-black-and-white | Search summary |

## 7. Gaps

- No experiment was found that tests any of these mechanics inside a learning product. All learning claims are inferences from the psychology behind the mechanic.
- No primary source on merge games was opened. Idea 3.12 has no evidence.
- Retention numbers for idle games come from one analytics vendor through a news summary and were not checked.
- The histogram claim about Zachtronics and the criticism of The Stock Market Game for rewarding trading are unverified.
- Most papers were read as search summaries of abstracts, not full text. Effect sizes quoted (g = 0.42 for interleaving, the four-to-seven-times Red Cross result, the 76-experiment count) should be confirmed against the papers.
- Hades' Pact of Punishment, Rogue Legacy, the Pokédex, Dominion, Game Dev Tycoon, Kairosoft, SimCity, Townscaper, Candy Box, Universal Paperclips and the four merge games are named from general knowledge with no source opened.
