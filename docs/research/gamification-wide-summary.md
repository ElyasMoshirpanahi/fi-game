# Gamification, wide pass: summary and prototype plan

Date: 2026-11-15. For issue #36.

## What this file is

The owner asked for "a wide range of gamification possibilities", then "dozens of prototypes to find a model that is easy to understand, very fun, interactive, and engaging".

This file joins four research notes into one list, a small set of whole models, and a plan for prototypes. It adds no new research.

Notes used, with the short keys used below:

| Key | Note |
|---|---|
| W1 | `gamification-wide-1-games.md` (mechanics from games) |
| W2 | `gamification-wide-2-apps.md` (apps that are not games) |
| W3 | `gamification-wide-3-evidence.md` (what the science says) |
| W4 | `gamification-wide-4-theme-feel.md` (theme, feel, Check formats) |
| FP | `gamification-mechanics.md` (the first pass) |

Also used: `docs/prototypes/gamification-verdict.md` (what the owner chose) and `docs/specs/14-gamification.md` (what is built).

Limits that every idea must meet: one player, no account, no server, no push. Every count shown is true. No invented opponents. The engine stays pure. A model that fits the subject (building capital, Compounding, Ownership) is worth more than a generic one.

## How far to trust the evidence

Read this before the tables.

- Most studies were read as an abstract or as a search summary only. W2 opened no full text at all. W1 read most papers as search summaries. W3 and W4 read mostly abstracts.
- A number in this file is the number the note gave. Re-check it against the paper before it carries a decision.
- "unverified" is carried over wherever the note used it.
- Almost no study tests these mechanics inside a learning game. Most evidence tests the psychology behind a mechanic. The table marks this as "indirect".
- No study in the notes tests a gamified finance game with adults and measures what they later do with money (W3).

Evidence labels in the long list:

- **meta-analysis**: a pooled result from many studies.
- **study**: one paper, experiment or field study.
- **practitioner**: a designer's or a company's own claim, with no measured effect.
- **none**: nothing found, or the fit is the note's own inference.

Words: this file uses the glossary's terms. Where the glossary lists a word under Avoid for a game term, that word is not used for that term. New words here ("asset", "machine", "gauge", "pot", "town") are proposals. Each needs a glossary decision before a build.

## 1. Long list

68 ideas, with duplicates across the notes merged. "Built" compares the idea with spec 14.

### Coins that behave like money

| # | Idea | What it is | Source | Evidence | One player, no server | Theme fit | Built |
|---|---|---|---|---|---|---|---|
| 1 | Compounding engine | Coins buy assets that pay Coins over time. Income is reinvested. | W1 3.1, W4 A2, W3 F30 | study (indirect: people misjudge Compounding; a mechanic that is the lesson beat a bolted-on one in two small studies with children). No study of the mechanic itself. | yes | high | no |
| 2 | Away income | On return, a short screen shows what the assets earned while the game was closed, up to a cap. | W1 3.2, W4 A3 | practitioner (retention called "amazing", no numbers) | yes | high | no |
| 3 | Freedom gauge | One gauge shows asset income per day against an in-game daily cost. The goal is the day income covers cost. | W4 A4, W1 3.1 | study (indirect: format changes how wealth is judged). No study of a gauge. | yes | high | no |
| 4 | Maturing deposits | Each Card in the Deck is shown as a deposit that matures on its Review date. A late Review pays the same. | W1 3.3 | none (inference). One paper warns that a late penalty makes it a dark pattern. | yes | high | partly (the Review ladder and the Lesson end's return dates exist) |
| 5 | Prestige reset | The player resets the engine only, for a lasting bonus. The Deck, Lit Stations and Badges never reset. | W1 3.4 | practitioner | yes | medium | no |
| 6 | Round-up share | A small share of every payout goes to a pot that cannot be spent and grows on each day played. | W2 8 | none (company pages only) | yes | high | no |
| 7 | Named pots | The player names two or three pots for Coins and gives each a purpose. | W2 6 | study (field experiments with real money) | yes | medium | no |
| 8 | Step-up agreed in advance | The player agrees now that a rate or a daily goal rises after each Section. | W2 9 | study (field, not randomised) | yes | medium | no |
| 9 | Coin lock | The player locks Coins until a Section is done and gets them back with a stated bonus. A missed goal returns the Coins with no bonus. | W2 10 | study (RCT with real savings; only 28% chose the lock) | yes | high | no |
| 10 | Chest odds from Coins held | The Chest's chance rises with Coins held. Nothing is ever lost. | W2 11 | study (mixed; one bank, observational) | yes, with care | low | partly (a Chest exists; its odds do not depend on Coins held) |
| 11 | Lasting purchases on the Path | Coins buy things that stay: a landmark by a finished Section, a calculator kept in Tools. | W4 A7 | practitioner. Study (indirect: people value what they built). | yes | medium | partly (Path colours from Shards) |
| 12 | Pick one of three | At the Lesson end the player picks one of three rewards in place of a random payout. | W1 3.10, W3 F9 | meta-analysis (indirect: choice raises motivation, most when no reward follows the choice). No study of drafting. | yes | medium | no |
| 13 | Principle cards | The player holds up to three cards. Each applies the rule it names, such as "Pay yourself first". | W1 3.11 | practitioner | yes | high | no |

### A thing or a place that grows

| # | Idea | What it is | Source | Evidence | One player, no server | Theme fit | Built |
|---|---|---|---|---|---|---|---|
| 14 | One owned object | One object (a machine, a plant, a snowball) is on the first screen. It grows with the player's work and never shrinks. | W4 A1, W2 1 | study (small: 28 people, three months; novelty fell after two weeks in another small study) | yes | high | no |
| 15 | Companion | A creature or seedling grows with the habit. It waits when the player is away. It never suffers. | W2 2 | study (small: 19 people). A sad-pet risk is reported; that detail is unverified. | yes | medium | no |
| 16 | Town from Lessons lit | Each Lesson lit adds one building of its Section's kind. Nothing decays. | W2 4 | none (award and one review only) | yes | high | no |
| 17 | Free builder | The player places and arranges their own buildings. | W1 3.16 | study (indirect: the IKEA effect, which needs the build to be finished) | yes | medium | no |
| 18 | Restored scene | One fixed scene of the player's own situation is restored part by part as Sections are lit. | W1 3.15 | practitioner (no numbers) | yes | medium | no |
| 19 | Collection book | A book with a slot per concept. A slot fills when its Card has climbed the whole Review ladder. | W1 3.13 | study (set completion; read as a search summary) | yes | medium | partly (Badges and the Shelf) |
| 20 | Bundles across Sections | A small set of Cards from several Sections. Completing it restores something. | W1 3.14 | study (indirect: set completion) | yes | medium | no |
| 21 | Plant, then finish | The player plants a seed before a Lesson. Finishing grows it. Leaving early keeps it a seed. | W2 3 | none (no trial of the mechanic; a displayed failure is a known risk) | yes | medium | no |
| 22 | Unfolding interface | Panels appear only when the player reaches them. The Path stays visible. | W1 3.5 | practitioner (design commentary) | yes | medium | no |
| 23 | Concept web | A second view shows which ideas build on which. It is a view, never a lock. | W1 3.19 | practitioner | yes | medium | no |
| 24 | Merge learned Cards | Two fully learned Cards merge into one Card that joins both ideas. | W1 3.12 | none (no source opened) | yes | medium | no |

### Review, replay and daily shape

| # | Idea | What it is | Source | Evidence | One player, no server | Theme fit | Built |
|---|---|---|---|---|---|---|---|
| 25 | Review as "one working year" | The day's Review is framed as a year: due Cards from all Sections, two or three event Cards, a year-end statement. | W1 3.6 | meta-analysis (indirect: mixing topics, g = 0.42, weakest for text; read as a search summary) | yes | medium | partly (Review already draws from every Section) |
| 26 | Failure that pays forward | A failed Fare pays a kept note or an optional assist. It never pays Coins. | W1 3.7 | practitioner | yes | medium | no |
| 27 | Harder terms by choice | A lit Lesson can be replayed with no Hint, with free recall, or with a crash Card. Never a gate. | W1 3.8 | practitioner. Study (indirect: felt competence predicts enjoyment). | yes | medium | no |
| 28 | Decision of the day | One short dated scenario a day, with one best answer and a worked reason. | W1 3.9 | practitioner | partly (the shared, social part is lost) | medium | partly (Quests give each day a shape) |
| 29 | Dated season | A short yearly season. One Card set opens each day. Past days stay open. | W2 22 | none | yes | medium | no |
| 30 | Suggested 21-day route | A short route inside the Path with a clear last day and no clock. | W2 19 | none | yes | medium | no |
| 31 | Solve, then improve | After reaching the goal in a simulator, the player is marked on three measures against fixed marks and their own best. | W1 3.18 | practitioner (the histogram claim is unverified) | yes, with fixed marks | medium | no |

### Story and people

| # | Idea | What it is | Source | Evidence | One player, no server | Theme fit | Built |
|---|---|---|---|---|---|---|---|
| 32 | Road story with a guide | A thin story along the Path. One or two lines at Section ends. | W4 A5, W2 13, W3 F28, F31 | mixed. Meta-analysis: game fiction helped behaviour. Study: one trial of a story app found nothing. Study: a story theme added no learning. | yes | medium | no |
| 33 | Recurring characters as cases | Two or three people (deep in debt, invested early, chases hot offers) whose short arcs move when a Section is finished. | W1 3.20, W3 F32 | study (a soap-opera debt story changed borrowing; read as a search summary, unverified) | yes | high | no |
| 34 | Named enemies | Fees, lifestyle creep and panic selling are named. The player "defeats" each by passing its Card several times in Review. | W2 20 | study (RCT, high dropout, self-selected sample) | mostly | medium | no |
| 35 | Play the other side | The player acts as the seller of a bad deal, then meets the same deal as the buyer. | W4 B3 | none (a related line of research is unverified) | yes | medium | no |
| 36 | Tight-budget dilemmas | A chain of hard choices where each has a cost a few steps later. | W4 B2 | study (a warning: players took away a different lesson from the one intended) | yes | medium | no |

### Simulators

| # | Idea | What it is | Source | Evidence | One player, no server | Theme fit | Built |
|---|---|---|---|---|---|---|---|
| 37 | Forty working years | A 40-turn simulator. Each turn the player sets a savings rate and a mix. Review Cards answered that turn nudge the year. | W1 3.17 | study (an industry-funded RCT of a classroom relative). Meta-analysis (indirect: financial education works, with small effects). | yes | high | no |
| 38 | Years pass in seconds | The player picks a mix once. Years pass fast. The result is shown beside "buy the whole market and wait". | W2 12, W4 B1 | study (sponsor-funded RCT, not opened; the criticism that such games reward short-term trading is unverified) | yes | high | no |
| 39 | Draw ten possible years | The player presses a button and samples outcomes. | W3 F40 | study (two lab experiments) | yes | high | no |

### New kinds of Check

| # | Idea | What it is | Source | Evidence | One player, no server | Theme fit | Built |
|---|---|---|---|---|---|---|---|
| 40 | Guess first, then reveal | The player sets a slider to a guess. The true value counts up beside it. A guess costs nothing. | W4 D1, W3 F39 | study (asking before teaching beat extra reading in five experiments) | yes | high | no |
| 41 | Draw the line | The player drags a chart's future. The real line draws over theirs. | W4 D2 | study (controlled experiments) | yes | high | no |
| 42 | Sort into buckets | The player taps items into two or three buckets, mixed across Lessons. | W4 D3 | study (indirect: the material was paintings) | yes | high | no |
| 43 | Tweak the inputs | A small live model in a Card. A Check follows that needs the model. | W4 D4 | practitioner. Study (an interactive tool was one of four formats that raised confidence). | yes | high | partly (the Tools have sliders) |
| 44 | Build it, then run it | The player builds a budget or a portfolio from blocks and presses Run to see ten years. | W4 D5 | study (indirect: a framework and a meta-analysis on trying before being taught, g = 0.36) | yes | high | no |
| 45 | Say how sure you are | The player marks "sure" or "not sure". Sure and right pays a small bonus. Sure and wrong costs nothing. | W4 D6 | study | yes | medium | no |

### A bridge to real money

| # | Idea | What it is | Source | Evidence | One player, no server | Theme fit | Built |
|---|---|---|---|---|---|---|---|
| 46 | If-then plan | The player writes "when X, I do Y" for when they will play. The line is shown back. | W2 7 | meta-analysis (use the smaller figures, d = 0.15 to 0.35) | yes | medium | no |
| 47 | Own rule set | Across the Sections the player collects money rules of their own and can export them. | W2 7, W3 F38 | study (rules of thumb beat full instruction in one field RCT) | yes | high | no |
| 48 | One rule per Lesson | Each Lesson leaves one rule in one sentence. The Recap asks about rules. | W3 F38 | study (one field RCT, business owners) | yes | high | no |
| 49 | One real action | A Lesson or Section ends with one small real step to tick, such as "find out what you pay in fees". | W4 B5, W3 F37 | meta-analysis (indirect: teaching close to a decision works better; two meta-analyses partly disagree) | yes | high | partly (the two Checklists and the Milestone) |
| 50 | Log one real number | Once a month the player records one figure, such as savings rate. A line shows the trend. Optional and local. | W2 17 | meta-analysis (d = 0.40; mostly health studies) | yes | high | no |
| 51 | Sourced benchmark | A public median, with source and date, is shown beside the player's number. | W2 18 | study (large RCTs on energy use; people above the norm may relax) | yes, with data shipped in the file | medium | no |
| 52 | Future-self letter and time jump | A letter from the player at a later age grows by a line per Section. A Section end jumps "20 years later". | W2 5, W4 A6 | study (the studies used aged photos, not text; a text version is much weaker) | yes | high | no |
| 53 | Own reason on screen | The game asks once why the player wants financial independence and shows that line on the Path. | W3 F10 | meta-analysis (large, correlational, students) | yes | high | no |
| 54 | Own numbers in examples | The player enters age and monthly saving. Cards use them. | W3 F29 | study (children; unverified for adults) | yes | high | no |
| 55 | Knowledge check, twice | A short set of Checks at the start and again weeks later, to see if anything stuck. | W3 F41 | none (a way to measure, not a tested mechanic) | yes | medium | no |

### Seeing the habit

| # | Idea | What it is | Source | Evidence | One player, no server | Theme fit | Built |
|---|---|---|---|---|---|---|---|
| 56 | Activity heatmap | A calendar grid shaded by Cards answered. No number that can break. | W2 15 | study (natural experiment; a grid pulls less than a counter) | yes | medium | partly (the Streak's week of dots) |
| 57 | Lifetime counts, Streak can be hidden | Counts that only go up, and a switch to hide the Streak. | W2 23 | none | yes | medium | partly (Coins earned and XP; no switch) |
| 58 | Fresh-start greeting | A new week or month opens with a clean frame. Nothing earned is reset. | W2 16 | study (three field studies) | yes | medium | partly (week against last week) |
| 59 | Month in review | At month end the game builds a few cards from real counts. | W2 14 | none (reach figures only) | yes | medium | no |
| 60 | Own performance graph | The player's own curve: first-try accuracy per Section, Cards moved up the ladder. | W3 F5 | study (one RCT, one survey) | yes | medium | partly (week against last week, Records) |
| 61 | Skill title apart from Coins | A second title that moves only on first-try answers to harder Cards. | W2 21 | none (company docs only) | yes | low | partly (Levels come from XP, which counts volume) |
| 62 | The smaller number | "3 done" in the first half, "2 to go" in the second half. | W3 F25 | study | yes | low | no |
| 63 | Small choices, no payout | Two to four real choices: which Section next, which Quest. | W3 F9 | meta-analysis | yes | low | partly (the open Path) |
| 64 | Surprise in place of an expected reward | Now and then, praise or a book quote the player did not see coming. | W3 F12, FP 3.7 | study (one classic study with children) | yes | low | no |
| 65 | Something held back for weeks 4 to 8 | One small new thing appears in the slump window. | W3 F34 | study (three studies, none randomised) | yes | low | no |

### Feel

| # | Idea | What it is | Source | Evidence | One player, no server | Theme fit | Built |
|---|---|---|---|---|---|---|---|
| 66 | Layered feedback, medium dose | A right answer triggers several small reactions at once. Not none, not extreme. | W4 C1 | study (3018 players: no juice and extreme juice both did worse) | yes | low | partly (sounds and motion exist) |
| 67 | Count-ups, flying Coins, climbing Combo pitch | Rewards roll up. Coins fly to the balance. Each right answer in a row sounds one step higher. | W4 C2, C3 | none (convention and reviewers only) | yes | medium | partly (the scoreboard reveals numbers one at a time) |
| 68 | One big finish, scaled, with off switches | A build-up and one release at the Lesson end, sized to how the Lesson went. Sound and motion switches. Haptics where the phone allows. | W4 C4, C5, C6 | study (indirect: a pain study on endings; a haptics study). The iPhone haptics workaround is unverified. | partly (haptics are uneven) | low | partly (Lesson end with gold or plain Chest; Sound switch; reduced motion) |

## 2. Whole models

The notes propose 15 named models (five each in W1, W2 and W4). Several are the same idea from two sides. They merge into eight.

Built mechanics, for the "keeps, replaces, drops" lines: Combo pay, Lesson end with Chest, Streak with Freeze, Quests, Hearts, seven Levels, week against last week, Records, a Chest per finished Circle, Path colours from Shards.

### Model 1. The Money Machine

Merged from: W1 Model A (Compounding Engine), W4 Money Machine, W4 Freedom Meter, part of W1 Model D (Principle Deck).

The idea: Coins are wages. The player buys assets that pay Coins over time. One gauge shows asset income per day against a daily cost.

- **In 3 minutes.** Open the game. See what the machine earned since the last visit. Do a Review or a Lesson for wages. Spend Coins on one new part. Watch the gauge move.
- **Over weeks.** The machine gains parts, one type per Section. Asset income climbs toward the daily cost. After the crossing, income pays for the Freeze by itself.
- **Keeps.** Combo pay (as wages), Streak with Freeze, Quests, Review first on Continue, Records.
- **Replaces.** The random Coin amount in the Chest can become "pick one of three" (a part, a principle card, a collection slot). Levels can become stages of the machine.
- **Drops.** Nothing must go. Hearts and Freeze get a second buyer for Coins, so prices need new tuning.
- **Evidence for.** People misjudge Compounding, and showing it changed saving (Stango and Zinman 2009; McKenzie and Liersch 2011; Song 2020: about 40% higher pension payments). A mechanic that is the lesson beat a bolted-on one (Habgood and Ainsworth 2011; small, children, maths). All read as abstracts.
- **Evidence against.** No study tests an in-game Compounding currency. One study found a graph alone did not fix the bias (Levy and Tasoff, search summary). Away income pays for absence, which is the reward type FP warns about (Deci et al. 1999).
- **Main risk.** Tending the machine becomes more interesting than Lessons. Asset income must stay below wages for a long time, and only learning acts may raise the rate.
- **Build size.** Medium. A list of assets, a timestamp, one gauge, one return screen. The engine needs the app to send the time, as Hearts already do.

### Model 2. The Snowball

Merged from: W4 Snowball, W2 Holding.

The idea: one object, one number, no shop. A share of every payout goes into one pot that cannot be spent. The pot grows at a shown rate.

- **In 3 minutes.** Answer Checks. Watch a share of each payout fly into the ball. See the ball's size and its curve.
- **Over weeks.** The ball's size curve is a live Compounding chart the player made. The share steps up after each Section, if the player agreed. The player can name the pot and lock Coins for a stated bonus.
- **Keeps.** Everything built. It sits beside the current Coins.
- **Replaces.** Nothing.
- **Drops.** Nothing.
- **Evidence for.** Same Compounding studies as Model 1. Named, split pots raised real saving (Soman and Cheema 2011). A step-up agreed in advance raised saving rates (Thaler and Benartzi 2004, not randomised). A lock raised balances (Ashraf, Karlan and Yin 2006). All read as search summaries.
- **Evidence against.** Round-ups have no measured evidence. The saving studies used real money, not game Coins. Growth tied to days away would reward not playing (W2).
- **Main risk.** Thinness. There is little to decide, so the fun must come from elsewhere. A second Coin number adds a thing to explain.
- **Build size.** Small.

### Model 3. The Town

Merged from: W2 Town, W4 Road Town, W1 Model C (Estate).

The idea: the Path becomes a place the player owns. Every Lesson lit or Section finished leaves something that stays.

- **In 3 minutes.** Finish a Lesson. See one building rise beside the road. Scroll back to look at what is already there.
- **Over weeks.** A town or a restored scene fills in, one district per Section. A collection book fills with concepts that climbed the whole Review ladder. Bundles across Sections restore extra parts. Nothing ever decays.
- **Keeps.** Lit Stations, Badges, Circle Chests (as chest stops in the town), Path colours, Records, week against last week.
- **Replaces.** Levels could become stages of the town. The Streak could sit beside a heatmap and lifetime counts.
- **Drops.** Nothing must go. This model is all gain frames, so Hearts fit it least.
- **Evidence for.** People value what they built (Norton, Mochon and Ariely 2012). Set completion pulls people to finish (Barasz et al. 2017, search summary). A small study found a growing garden display kept activity up over three months (Consolvo et al. 2008, 28 people).
- **Evidence against.** Town building has marketing evidence only. A grid or a picture pulls less than a Streak counter (Moldon et al. 2021). The IKEA effect needs a finished build, so a town that never ends may not help (W1).
- **Main risk.** Art cost and file size in a single HTML file. A scene that shows wealth as a big house contradicts the content on frugality.
- **Build size.** Large.

### Model 4. The Companion

Merged from: W2 Companion, the characters from W1 Model C, the story parts of W4 Road Town.

The idea: warmth for a solo game. One creature or seedling, and two or three recurring people whose short stories are cases from the content.

- **In 3 minutes.** Open the game. The companion has one line. Do the Review. It grows a little. A character's story moves one beat.
- **Over weeks.** The companion grows with Review steps climbed, not with volume. Each character's arc ends when a Section ends. The named enemies (fees, lifestyle creep, panic) are beaten one by one in Review.
- **Keeps.** Review first on Continue, Quests, Records, Lesson end.
- **Replaces.** The Streak's break message can become a fresh-start greeting.
- **Drops.** Nothing must go. Any guilt frame fights this model, so a Streak shown as broken and an out-of-Hearts screen need soft wording.
- **Evidence for.** Story raised the number of Checks answered in one experiment close to this game (Mazarakis and Brauer 2022). A story with a character people cared about changed borrowing (Berg and Zia 2017, search summary, unverified). A small study found a growing fish worked as a catalyst (Lin et al. 2006, 19 people).
- **Evidence against.** A story theme added no learning in a strict test (Adams et al. 2012). One trial of a story app found no effect (Direito et al. 2015, 51 teenagers). Story text that is not about the content lowers recall (Harp and Mayer 1998). Enthusiasm for the fish fell after two weeks.
- **Main risk.** Writing cost, and guilt if the "never suffers" rule slips. Characters that moralise are skipped.
- **Build size.** Medium. Little code. The cost is writing in two languages and one drawn creature.

### Model 5. The Working Year

Merged from: W1 Model B.

The idea: change how existing content feels. Review becomes "one working year". Failure pays something. Nothing new is taught.

- **In 3 minutes.** Tap Continue. Play one year: ten to fifteen due Cards from all Sections, with two or three event Cards (a pay rise, a surprise bill). Read the year-end statement.
- **Over weeks.** A count of years worked. A kept list of notes from failed Fares. Lit Lessons replayed on harder terms. A "decision of the day" on days when nothing is due.
- **Keeps.** The Review ladder, the cap of 20, Combo pay, Streak, Records.
- **Replaces.** The plain Review list. Quests and the decision of the day overlap, so one should lead.
- **Drops.** Hearts fit badly. A growing assist after failure and a cost per wrong answer pull in opposite directions.
- **Evidence for.** Mixing topics beat blocked order (Brunmair and Richter 2019, g = 0.42, search summary). Harder recall formats are better retrieval (W1 inference from the first pass). Review already has the strongest evidence in the whole field (Cepeda et al. 2006).
- **Evidence against.** Mixed order feels harder and players rate it lower. The effect is weakest for text-like material, which is close to this content. Every other part rests on designers' claims.
- **Main risk.** If failure pays well, players fail on purpose. Keep the payout a note or an assist, never Coins.
- **Build size.** Medium. The year frame is small. Event Cards and the harder terms are content work.

### Model 6. The Lab Bench

Merged from: W4 Lab Bench.

The idea: the Checks are the game. The Path and the rewards stay as they are.

- **In 3 minutes.** Guess a number with a slider and see the gap. Sort six items into "pays you" and "costs you". Move two sliders and answer a Check about what happened.
- **Over weeks.** A calibration line in the Recap ("sure 20 times, right 15"). A kit of small models unlocked in Tools. A build-and-run job at each Section end.
- **Keeps.** Everything built.
- **Replaces.** Some Tap-one Checks.
- **Drops.** Nothing. A guess on new material must not cost a Heart or end a Combo.
- **Evidence for.** The best learning evidence of any model. Asking before teaching (Richland, Kornell and Kao 2009). Predicting by drawing (Kim, Reinecke and Hullman 2017). Mixing categories (Kornell and Bjork 2008). Trying before being taught (Sinha and Kapur 2021, g = 0.36). Errors made when sure are corrected most (Butterfield and Metcalfe 2001). All read as abstracts.
- **Evidence against.** None of these was tested in a finance game. Free play with a model and no goal teaches little (Victor, practitioner).
- **Main risk.** Content cost per Lesson, and slower Lessons. Drawing with a finger on a small screen is fiddly.
- **Build size.** Large. The code is medium. Each new Check kind must be written into the content in two languages.

### Model 7. The Forty Years

Merged from: W1 Model E (Life Sim), W2 Paper Portfolio, W4 B1 and D5.

The idea: a simulator of a working life sits beside the Path. Each Section unlocks one more lever.

- **In 3 minutes.** Set a savings rate and a mix. Press Run. Watch ten or forty years pass. See the age at which asset income passed spending, beside "buy the whole market and wait".
- **Over weeks.** More levers (debt, fees, tax, risk). The player's own best on three measures that trade off: fewest years, smallest worst-year drop, most spending kept.
- **Keeps.** Everything built. Records gain three new entries.
- **Replaces.** It could replace or follow the Recap as the close of a Section.
- **Drops.** Nothing.
- **Evidence for.** The only model with a trial of a close relative: The Stock Market Game raised maths and financial marks in nearly 600 classrooms (industry funded; summary read, full report not opened). Sampling outcomes taught risk better than telling (Kaufmann et al. 2013; Bradbury et al. 2015). Seeing a projection of one's own account changed contributions (Goda et al., search summary).
- **Evidence against.** The trial was with school children and paid for by the sector. A dilemma game taught players a different lesson from the one intended (Roussos and Dovidio 2016). The criticism that stock games reward short-term trading is unverified.
- **Main risk.** The player learns whatever the simulator rewards. Fixed positive returns teach overconfidence. A lucky reckless result teaches the wrong thing. It must not look like advice.
- **Build size.** Large.

### Model 8. The Plan

Merged from: W2 Plan.

The idea: the game ends in something the player keeps and uses with real money.

- **In 3 minutes.** See your own reason and your if-then line on the Path. Finish a Lesson. Add its one rule to your rule set. Tick one real action.
- **Over weeks.** A rule set that can be exported. A letter from the future self, one line per Section. A line chart of one real number logged monthly, with a sourced public median beside it.
- **Keeps.** Everything built. It adds to the Checklists and the Milestone that already exist.
- **Replaces.** Nothing.
- **Drops.** Nothing.
- **Evidence for.** The strongest evidence behind its parts. If-then plans (Sheeran et al. 2024, d = 0.15 to 0.35). Monitoring progress (Harkin et al. 2016, d = 0.40). Rules of thumb (Drexler et al. 2014). Personal value, not reward, predicts persistence (Howard et al. 2021). Knowledge fades in six months unless used (Kaiser et al. 2022, full text of the working paper). The first four were read as search summaries or abstracts.
- **Evidence against.** A benchmark can make people above the norm relax (Allcott 2011). The future-self studies used aged photos, not text. None of this is a game mechanic, so it adds little fun.
- **Main risk.** It asks for real personal data. It must be optional, local and in the backup. It is the least playful model.
- **Build size.** Small.

### How the models combine

- Models 1 and 2 are two answers to one question: does the player manage their capital, or only watch it grow? Pick one.
- Models 3 and 4 are two answers to: what do I see on the first screen?
- Models 5, 6 and 7 change what the player does. They can sit under any of the first four.
- Model 8 is a thin layer that fits on top of any model.
- W3 Finding 4 warns that elements do not simply add up. The game already has ten mechanics. A new model should replace something, not only stack on it.

## 3. What the evidence says about what is already built

"Supports" and "warns" are about the research only. The owner chose these mechanics by playing, and softened the main objections (see the verdict file).

### Supported

| Built mechanic | Finding | Source |
|---|---|---|
| Review offered first on Continue | Spaced review beats massed review. Testing beats rereading. This is the strongest evidence in the field. | Cepeda et al. 2006 (meta-analysis, 317 experiments); Roediger and Karpicke 2006. Abstracts. FP 3.11. |
| Lesson end names missed Cards and the return day | Informative positive feedback raises interest (d = 0.33). People judge their own recall badly, so stating what was missed corrects them. No direct study of such a screen. | Deci, Koestner and Ryan 1999 (abstract); Karpicke and Roediger 2008. FP 3.15. |
| Combo pay | Asking for consecutive work raised persistence in six pre-registered studies. Rewards tied tightly to performance are the safe kind. | Mehr et al. 2025; Cameron, Banko and Pierce 2001. Abstracts. W3 F21, F13. |
| Freeze | Slack that costs something to use raises persistence. A break hurts less when the Streak can be saved. | Sharif and Shu 2017; Silverman and Barasch 2023. Abstracts. Duolingo's own numbers agree (company self-report). FP 3.2. |
| Quests from learning acts | A Quest pays for whatever it names, so naming retrieval is right. No experiment on daily Quests was found. | FP 3.6; W3 F14. |
| Records, week against last week | Personal bests are the one solo stand-in for a ranking with evidence. A graph of one's own performance raises felt competence. | Anderson and Green 2018; Sailer et al. 2017. Abstracts. FP 3.14, W3 F5. |
| Paid once, no reward for replay | Blocks the grinding Duolingo reported. | Duolingo, company self-report. FP 4. |
| Sound and motion switches | Extreme juice hurts as much as none. | Kao 2020 (abstract). W4 C6. |

### Warned about

| Built mechanic | Finding | Source |
|---|---|---|
| Hearts | No peer-reviewed study of Hearts in a learning game was found. Duolingo dropped Hearts in 2025: beginners were twice as likely to run out mid-lesson. Punishing elements backfired for every participant in one small study. A cost per error can remove retrieval trials. The built version softens this: Review and replay stay open, and the first three Lessons cost none. | W3 F24 (a gap); Duolingo (company self-report); Diefenbach and Mussig 2019 (45 users, two weeks, abstract); Karpicke and Roediger 2008. FP 3.4. |
| Random Coin amount in the Chest | No study of random Chests in a learning game was found. The one controlled trial of fixed against variable rewards found no difference (61 people, real money). The claim that random rewards drive return is unverified for learning. W3 advises a fixed value and a varied kind. The built Chest is free, earned, paid once and shows its range, which avoids the gambling link found for paid random rewards. | Nuijten et al. 2021; Zendle and Cairns 2018; Shen, Fishbach and Hsee 2015. Abstracts. W3 F16 to F18, FP 3.7. |
| Chest at every Lesson end | An expected reward for something enjoyable lowered later interest in a classic study with children. A surprise did not. | Lepper, Greene and Nisbett 1973 (abstract). W3 F12. |
| Streak that returns to zero, with no way back | A displayed broken Streak lowers later engagement, most when the player blames themselves. The drop is smaller when the Streak can be repaired. Loss framing worked in one good trial and stopped when the incentive stopped. A review argues loss aversion is not a general law. Guilt-driven motives hold people and go with lower well-being. | Silverman and Barasch 2023; Patel et al. 2016; Gal and Rucker 2018; Howard et al. 2021. Abstracts. W3 F10, F19, F20. |
| Freeze price of 250 Coins | W3 advises a Freeze that is cheap and applies by itself. The built Freeze applies by itself but costs about a week of normal play. Being punished on a busy day was the most common complaint in the Habitica study. | W3 rule 8; Diefenbach and Mussig 2019. |
| Daily Streak against the Review ladder | The ladder is 1, 3, 7, 16 and 35 days. After the first weeks there is not something due every day. A daily Streak asks for visits the schedule does not need. | FP 3.1 (inference). |
| Quests that count | "8 right answers" is a volume Quest. Incentives buy quantity, not quality. | Cerasoli, Nicklin and Ford 2014 (meta-analysis, abstract). W3 F14. |
| Levels from XP | Points and levels raised the amount of work and nothing else in one experiment. They did not harm motivation in a short job. | Mekler et al. 2017 (full text). FP 3.5. |
| Records for volume | "Most Lessons in a day" and "best week by XP" reward quantity. A new best is also a natural point to stop. | Cerasoli et al. 2014; Anderson and Green 2018. |
| Gold Chest for a clean Lesson | No study of a perfect-Lesson bonus was found. A reward for zero errors can reward avoiding hard items. Paying once limits this. | FP 3.9. |
| Ten mechanics at once | Single elements work alone. More elements do not simply add up. | Mazarakis and Brauer 2022 (505 people, voluntary Checks, abstract). W3 F4. |
| Judging by the first week | Effects in the first week are several times the long-term ones. A slump around weeks 4 to 8 is common. | Kim and Castelli 2021; Rodrigues et al. 2022. W3 F33, F34. |

### Not covered by the evidence

- Path colours from Shards. FP found nothing for or against cosmetics.
- The Review ladder ends at 35 days. Knowledge from financial education fades within six months (Kaiser et al. 2022). W3 advises a ladder that runs past six months for the core ideas. Changing the ladder is out of scope in spec 14.

## 4. Prototype plan

Six batches, 30 variants. Each batch asks one thing. Each variant is a throwaway page with fake data, judged in about a minute on a phone. A "skip three days" button stands in for time.

The order puts the most decisive batch first. Batch 1 picks the whole model. Later batches depend on it less and less.

### Batch 1. What do my Coins become?

The owner plays one short Lesson, then looks at the first screen.

- **A. Machine.** Coins buy parts. Each part pays Coins. A gauge shows income per day against a daily cost. (Model 1)
- **B. Snowball.** A share of each payout flies into one ball that grows at a shown rate. No shop. (Model 2)
- **C. Town.** Each Lesson lit puts one building beside the road. (Model 3)
- **D. Companion.** One creature grows with Review steps and has one line per visit. (Model 4)
- **E. Collection book.** Concepts fill slots, and a full page restores part of a scene. (Model 3, the cheap half)

A pick decides: which whole model leads, and so whether Coins need a second number, how much art the game needs, and whether a shop exists at all.

### Batch 2. What greets me when I come back?

The owner taps "three days later" and sees the first screen.

- **A. Away income.** "You were away 3 days. Your assets earned 42 Coins", with a count-up and a cap.
- **B. Gauge moved.** Only the gauge, a little closer to the crossing. No payout screen.
- **C. Deposits matured.** "5 Cards matured. Review them and they pay."
- **D. Fresh start.** "New week. Everything you built is still here. Review 4 Cards, about 2 minutes."
- **E. A line from someone.** The companion or a character says one line tied to the next Lesson.

A pick decides: whether the game may pay for time away, and what replaces the push notification it cannot send.

### Batch 3. Which new kind of Check is fun on a phone?

The owner answers one Check of each kind on the same idea (Compounding over 30 years).

- **A. Guess first.** A slider, then the true value counts up beside the guess.
- **B. Draw the line.** Five to eight snap points, then the real line draws over them.
- **C. Sort into buckets.** Tap an item, tap a bucket: "pays you", "costs you", "depends".
- **D. Tweak the inputs.** Two sliders, a live chart, one Check that needs it.
- **E. Build it, then run it.** Split a paycheck into blocks, press Run, see ten years.
- **F. Say how sure.** A Tap-one Check with a "sure" or "not sure" mark.

A pick decides: which kinds are added to the three that exist (Tap-one, True/false, Order), and so how much content must be rewritten. E also shows whether a full simulator (Model 7) is worth a batch of its own.

### Batch 4. What should a Lesson pay at the end?

The owner finishes one Lesson and passes the end screens.

- **A. As built.** A Chest with a random amount inside a shown range. (control)
- **B. Fixed value, varied kind.** The Chest always pays the same. What it shows changes: a quote, a rule, a slot in the book.
- **C. Pick one of three.** A part for the machine, a principle card, or Coins.
- **D. Straight into the pot.** No Chest. Coins fly into the ball or the machine, and it grows on screen.
- **E. Now and then.** No Chest most days. Sometimes a surprise the player did not expect.

A pick decides: whether the random Chest stays, changes shape or goes. This is the built mechanic the evidence questions most, after Hearts.

### Batch 5. What should Review feel like?

The owner plays eight due Cards.

- **A. As built.** The plain Review. (control)
- **B. One working year.** The same Cards with two event Cards and a year-end statement.
- **C. Deposits.** Each right answer "rolls the deposit into a longer term" with the next date shown.
- **D. Enemies.** Each Card belongs to a named enemy (fees, panic). Right answers wear it down.
- **E. Harder terms.** The same Cards with no options shown: think of the answer, reveal it, then rate.

A pick decides: whether Review gets a frame (Model 5), and which one. It also shows whether a frame slows Review down.

### Batch 6. How much feel on a right answer?

The owner answers ten Checks in a row with sound on.

- **A. Bare.** A colour change and nothing else.
- **B. Medium.** A small squash, a short tone, the Coin count ticks.
- **C. Medium with a climbing Combo.** As B, and each right answer in a row sounds one step higher.
- **D. High.** As C, with sparks and Coins that fly to the balance.

A pick decides: the size of the effect at each moment. Kao 2020 found that none and extreme both did worse than medium and high, so no "extreme" variant is offered.

### Not in a batch, and why

- **Hearts.** The owner already chose Hearts by playing. One minute on a prototype cannot show what four weeks will. See open question 2.
- **Model 8 (The Plan).** Its value shows over months, not in a minute. See open question 4.
- **Model 7 (The Forty Years) in full.** Too large for a throwaway. Batch 3 variant E is its smallest piece.

## 5. Open questions for the owner

Each can be answered with one choice.

1. **May Coins have a second number?** Models 1 and 2 need capital that is apart from Coins held. Choices: (a) yes, add it; (b) no, keep one Coin balance and show growth another way.
2. **Hearts.** The research still does not support them. Choices: (a) keep as built; (b) keep, and decide again after four weeks of real play; (c) remove before a new model is added.
3. **May the game pay Coins while it is closed?** Choices: (a) yes, with a cap of a few days; (b) only on days played; (c) never.
4. **May the game ask for real personal figures?** Age, a savings rate, one line about why. Always optional and local. Choices: (a) yes; (b) only the "why" line; (c) no.
5. **How much drawing can one HTML file carry?** Choices: (a) one object only (machine, ball or creature); (b) one object and a few landmarks; (c) a full town or scene.
6. **Add or replace?** The game has ten mechanics, and elements do not simply add up. Choices: (a) the new model replaces Levels and the random Chest; (b) it replaces the Chest only; (c) it sits on top of everything built.
