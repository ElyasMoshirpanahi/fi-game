# Gamification, wide pass 2: non-game apps that use game mechanics

Date: 2026-11-14

## Method

Question: what can FI Roadmap learn from apps that are not games but use game mechanics? Areas covered: fitness, habit trackers, meditation, reading, coding practice, saving and investing apps, virtual pets, and "grow or build something" metaphors.

This note does not repeat the first pass (`gamification-mechanics.md`). Streaks, freezes, quests, chests, badges, leaderboards and review surfacing are covered there. Where an idea here touches one of them, it says what is new.

How sources were read. This matters:

- Every study below was read through web search summaries of the abstract or of the paper. I did not open any full text in this pass. Numbers come from those summaries. Re-check a number before it carries a decision.
- **Study**: a peer-reviewed paper or a formal evaluation. **Meta-analysis**: a pooled result from many studies.
- **Marketing or anecdote**: a company page, an app store page, a review, or an opinion piece. No measured effect.
- **Unverified**: stated from my own memory of the product or paper. Not checked in this pass.
- **Inference**: my own reasoning, not a source's finding.

Product descriptions (what an app does) are mostly from memory and are marked unverified unless a source is given. Apps change often.

Game constraints used for the "fits" line: one player, no account, no server, no push notifications, state in localStorage.

## Summary table

| # | Idea | Best evidence | Fits solo, no server |
|---|---|---|---|
| 1 | Garden as a glanceable progress display | Study (small field experiment) | Yes |
| 2 | Companion pet that grows with the habit | Study (small), with a clear warning | Yes |
| 3 | Staked session: a tree that dies if you quit | Anecdote, qualitative study | Yes |
| 4 | Town built from logged acts | Marketing only | Yes |
| 5 | Meet your future self | Study (four experiments) | Yes |
| 6 | Named goal pots with a picture | Studies (field experiments) | Yes |
| 7 | If-then rules and plans | Meta-analysis | Yes |
| 8 | Round-ups: tiny automatic amounts | Marketing only | Yes |
| 9 | Step-up agreed in advance | Study (field) | Yes |
| 10 | Commitment lock | Study (RCT) | Yes |
| 11 | Prize-linked savings | Studies (mixed) | Yes, with care |
| 12 | Paper portfolio simulator | Study (sponsor-funded RCT) | Yes |
| 13 | Story wrapper around the task | Study (null result) | Yes |
| 14 | Period in review | Marketing only | Yes |
| 15 | Activity heatmap with no streak number | Study (natural experiment) | Yes |
| 16 | Fresh-start points | Study (three field studies) | Yes |
| 17 | Log one real number | Meta-analysis | Yes |
| 18 | Static benchmark ("people like you") | Study (large RCTs) | Yes, with baked-in data |
| 19 | Graded plan with a fixed end | Anecdote | Yes |
| 20 | Power-ups, bad guys, allies | Study (RCT, high dropout) | Mostly |
| 21 | Skill rank by difficulty | Company docs only | Yes |
| 22 | Dated calendar of puzzles | Anecdote | Yes |
| 23 | Lifetime totals in place of a streak | Marketing and anecdote | Yes |

## Ideas

### 1. Garden as a glanceable progress display

What it is: a small picture that grows as you do the target behaviour. It sits where you see it often, not behind a menu. Each kind of activity adds a different flower. Reaching the weekly goal adds a butterfly.

Where used: UbiFit Garden (University of Washington and Intel research system, phone wallpaper). Unverified: Plant Nanny, Apple Fitness rings on the watch face.

Evidence: Consolvo et al. (UbiComp 2008, "Flowers or a robot army?"). 28 participants, three conditions, three months over the winter holidays. People with the garden display kept their activity level. People without it dropped significantly. **Study, small sample.** https://unpaywall.org/10.1145%2F1409635.1409644 and https://www.consolvo.org/ubifit

Fits solo, no server: yes. The game cannot be a wallpaper. Inference: the nearest place is the first screen the player sees, before any tap.

FI fit: the garden is a natural picture of capital. Each Lesson type plants a different thing. A Review waters. The garden shows the week at a glance. In UbiFit the garden reset each week, which gave a fresh start (see idea 16).

Risks: a display that only decorates adds work and no meaning. UbiFit never showed a dead or wilted garden. Keep that rule.

### 2. Companion pet that grows with the habit

What it is: a creature that grows, changes or gains things when you do the habit. You care for it by caring for yourself.

Where used: Fish'n'Steps (research system). Finch (self-care pet). Unverified: Habitica pets, Pokemon Sleep, Pikmin Bloom, Tamagotchi-style habit apps.

Evidence:
- Lin et al. (UbiComp 2006), Fish'n'Steps. 19 participants, 14 weeks. A fish grew with daily step count. The authors report it worked as a catalyst for exercise and better attitudes. Enthusiasm for the game fell after the first two weeks, yet new routines stayed. **Study, small.** https://unpaywall.org/10.1007%2F11853565_16
- A later paper discussing this design notes a risk that people avoid the system when the character looks unhappy. I could not confirm the detail in the original paper. **Unverified detail.**
- Finch: no controlled study found. Reviews are mixed. Some users say the pet brings them back. Some say pet care becomes one more task. **Marketing or anecdote.** https://yourstory.com/2022/06/app-review-self-care-pet-finch-gamifies-mental-wellbeing

Fits solo, no server: yes. A pet is local state. It gives a solo game a little of the "relatedness" that the first pass said was out of reach. Inference.

FI fit: the pet should not be a mascot only. It could be the thing that owns the capital: a small creature whose home improves as the player's knowledge grows. Or a seedling that becomes the "money tree" the book teaches.

Risks: the sad pet. A pet that suffers when the player is away is guilt by design, and the one study hints that people then stay away. Rule: the pet can grow or wait. It never starves, shrinks or dies.

### 3. Staked session: a tree that dies if you quit

What it is: before a short session, the player plants a tree. If they finish, the tree joins their forest. If they leave early, the tree dies and stays in the forest as a dead tree.

Where used: Forest (focus timer). Unverified: Flora, Focus Plant.

Evidence: no controlled trial of Forest was found. A JMIR 2023 review of 13 phone-use apps lists Forest as a gamified app and says app-based limits can reduce phone use, but asks for more research. A 2026 interview study found users felt it helped with unplanned phone use, with limited wider effect. **Qualitative study and review. No measured effect of the tree mechanic.** https://jmir.org/2023/1/e42541/PDF

Fits solo, no server: yes.

FI fit: a Lesson is 10 to 15 minutes. "Plant, then finish" maps onto "invest, then hold". Quitting early is like selling early. Inference: this gives a direct feel for patience, which is a core idea in the content.

Risks: this is a loss frame. The dead tree is a lasting mark of failure. The first pass found that a displayed failure lowers engagement. A softer version: an unfinished tree stays a seed and can be finished later.

### 4. Town built from logged acts

What it is: each logged act places a building. The kind of act decides the kind of building. Over months a town appears that mirrors what you did.

Where used: Fortune City (expense tracker by Fourdesire, now Sparkful). Each expense or income entry adds a building by category.

Evidence: none measured. Red Dot Design Award 2018. One reviewer says it made them return and even spend more to unlock buildings. **Marketing and anecdote.** https://sparkful.app/fortune-city and https://www.red-dot.org/project/fortune-city-25920

Fits solo, no server: yes. Needs art. That is the real cost.

FI fit: strong. A town reads as "assets you own". Each Section could be a district. Each Lesson lit adds a building of that Section's kind: a workshop for earning, a bank for saving, a mill for compounding. The town is a second view of the Path.

Risks: the review above is the warning. If buildings reward volume, players grind. Tie a building to a Lesson lit once, never to repeats. Complexity is high for a single-file game.

### 5. Meet your future self

What it is: the app shows a concrete picture of you in the future, then asks for a choice now. People who feel close to their future self give more to it.

Where used: research tools. Unverified: Merrill Edge "Face Retirement", FutureMe (letters to your future self), some pension dashboards.

Evidence: Hershfield et al. (2011), Journal of Marketing Research, four studies. People who saw an aged image of themselves put more toward retirement in hypothetical allocation tasks. One summary reports about twice as much in one study. A US Department of Labor clearinghouse rates the causal evidence high. The outcomes were allocation choices in a lab, not real long-term saving. **Study.** https://clear.dol.gov/study/increasing-saving-behavior-through-age-progressed-renderings-future-self-hershfield-et-al-2011

Fits solo, no server: yes, without photos. Inference: a text version works offline. Ask the player's age and one line about the life they want at a chosen later age. Show that line back at milestones.

FI fit: direct. The whole theme is giving to a future self. A "letter from you at 55" that grows a sentence per Section is cheap to build. A compounding chart with the player's own age on the axis is the same idea in numbers.

Risks: asks for personal data. Keep it optional and local. Do not show ageing or death imagery. Do not promise outcomes: the game teaches, it does not advise.

### 6. Named goal pots with a picture

What it is: money is split into named pots, each with a purpose and often a photo. Splitting and labelling makes people less willing to raid the pot.

Where used: unverified: Monzo Pots, Qapital goals, YNAB categories, Revolut Vaults, Starling Spaces.

Evidence:
- Soman and Cheema (2011), Journal of Marketing Research. Field study with low-income households in India over 14 weeks. Savings were higher when the earmarked amount was split into two envelopes than one. Envelopes carrying a photo of the family's children were spent from less, per the author's own summary. **Study.** https://www.russellsage.org/sites/default/files/u137/jmr-C-s014-s021-online.pdf
- Karlan, McConnell, Mullainathan and Zinman (2016), Management Science. Three field experiments. Monthly reminders raised saving by about 6%. In Peru, reminders that named the saver's own goal raised saving by about 16%, and reminders without the goal had no effect. Figures are from the 2010 working paper summary. **Study.** https://www.nber.org/papers/w16205

Fits solo, no server: yes.

FI fit: Coins today go into one pile. The player could name two or three pots ("freedom fund", "safety buffer") and choose where Coins go. That teaches earmarking by doing it. The named goal can then appear in on-screen reminders, which is the part with the 16% result.

Risks: more pots, more decisions, more interface. One World Bank blog title in the search results says fewer goals can lead to higher savings. I did not read it. Cap at two or three pots.

### 7. If-then rules and plans

What it is: the user writes a rule in the form "when X happens, I do Y". The app stores it and acts on it or shows it back.

Where used: Qapital Rules (for example the Guilty Pleasure rule: save a set amount each time you buy from a chosen shop). Unverified: IFTTT-style savings rules in other banks, "habit stacking" in habit trackers.

Evidence:
- Gollwitzer and Sheeran (2006), meta-analysis of 94 tests: if-then plans had a medium to large effect on reaching goals (d = .65).
- Sheeran, Listrom and Gollwitzer (2024), 642 tests: after correction for bias the effect is smaller, between d = 0.15 and d = 0.35. **Meta-analysis. Use the smaller figures.** https://cancercontrol.cancer.gov/brp/research/constructs/implementation-intentions
- Qapital's own rule pages give no outcome data. **Marketing.** https://help.qapital.com/en/articles/10245399-guilty-pleasure-rule

Fits solo, no server: yes. This is the best substitute found so far for push notifications. The first pass showed the web cannot schedule a reminder. A plan the player writes ("after my morning coffee I do the Review") puts the cue in the player's day, not in the phone.

FI fit: two uses. First, for the habit: one if-then line at setup, shown on the home screen. Second, as content: the player builds a personal rule set across the Sections ("when I get a raise, half goes to investing"). The rule set is a keepsake they can export.

Risks: low. A plan the player never sees again does nothing. Show it back.

### 8. Round-ups: tiny automatic amounts

What it is: each purchase is rounded up and the spare change is saved or invested. Saving rides on an act that already happens. No decision is needed each time.

Where used: Qapital (Round Up is the default rule, per its own blog). Unverified: Acorns, Monzo, Revolut, Chime, Bank of America "Keep the Change".

Evidence: none found beyond company pages. **Marketing only.** https://blog.qapital.com/save-your-change-round-up

Fits solo, no server: yes, as a game rule.

FI fit: inference. Each right answer already pays Coins. A round-up rule would send a small share of every payout into an "invested" pot that the player cannot spend, and that pot grows by a visible rate on each day played. The player then sees two numbers: Coins to spend and capital that compounds. That is the book's main lesson shown in the game's own economy.

Risks: a second currency adds complexity. The first pass noted that Coins "never decrease" in the glossary, so this needs a glossary decision. Growth tied to days played is fine. Growth tied to days away would reward not playing.

### 9. Step-up agreed in advance

What it is: the user agrees today that their contribution will rise later, at a set trigger. The rise then happens with no new decision. Saying yes to a future cost is easier than a cost now.

Where used: Save More Tomorrow (workplace pension plans). Unverified: auto-escalation in many pension and investing apps.

Evidence: Thaler and Benartzi (2004), Journal of Political Economy. In the first rollout, 78% of those offered joined, and their average saving rate rose from 3.5% to 13.6% over 40 months. The Department of Labor review notes that people chose to join, so the gain may partly reflect who joined. **Study, field, not randomised.** https://clear.dol.gov/study/save-more-tomorrow%E2%84%A2-using-behavioral-economics-increase-employee-saving-thaler-benartzi-2004

Fits solo, no server: yes.

FI fit: two uses. As a habit setting: the player starts with a small daily goal and agrees it steps up after each Section. The first pass found that a high goal at the start breaks streaks, so starting small is consistent with it. As content: the round-up share in idea 8 can step up the same way, and the player watches what a rising rate does to the curve.

Risks: an automatic rise the player forgot about feels like a trick. Announce each step and let the player decline.

### 10. Commitment lock

What it is: the user locks something of value until a date or a goal is reached. They choose the lock themselves, ahead of time.

Where used: SEED accounts (Green Bank, Philippines). Beeminder (you pledge money and pay if your data crosses the line, with pledges that rise after each failure, per its blog). Unverified: stickK, fixed-term savings pots.

Evidence: Ashraf, Karlan and Yin (2006), Quarterly Journal of Economics. Randomised offer of a locked savings account to 710 bank clients. 28% took it. After 12 months, average balances for the offered group were 81 percentage points higher than the comparison group. **Study, RCT.** https://isps.yale.edu/research/publications/isps06-009 Beeminder publishes no outcome data that I found. **Marketing.** https://blog.beeminder.com/tags/commitment%20contracts

Fits solo, no server: yes, with play money only.

FI fit: a "term deposit" for Coins. The player locks Coins until they finish a Section, and gets them back with a stated bonus. It teaches the idea of giving up access for a return. It also gives Coins a second sink besides the freeze.

Risks: Beeminder's model takes real money on failure. Do not copy that. In the game, a lock should never destroy Coins. If the goal is missed, the Coins come back with no bonus. Only 28% chose the lock in the study, so make it optional.

### 11. Prize-linked savings

What it is: a savings account that pays prizes by lottery in place of interest. The saver never loses the deposit. The chance of a prize rises with the balance.

Where used: First National Bank "Million a Month Account" (South Africa). Unverified: UK Premium Bonds, Save to Win (US credit unions), Yotta, Long Game.

Evidence:
- Kearney, Tufano, Guryan and Hurst (2010), NBER overview: such products are popular, but at that time there was no evidence that they raise total household saving. https://www.nber.org/papers/w16433
- Cole, Iverson and Tufano (2022), Management Science: people who used the South African account raised total savings by about 1% of annual income, a 38% rise from the mean. It did not eat into ordinary savings and it replaced some lottery play. The sample was one bank. **Study, observational.** https://pubsonline.informs.org/doi/fpi/10.1287/mnsc.2021.4047

Fits solo, no server: yes. A local random draw is enough.

FI fit: difficult. The first pass advised against random chests because a slot-machine reward contradicts the content. Prize-linked saving is the one form of chance that rewards holding and never takes the principal. If the existing chest stays, this is a more honest shape for it: the chest's odds depend on Coins held, and nothing is ever lost. It can also be a Lesson topic in its own right.

Risks: still chance. Still the mechanic closest to gambling in this list. A game that teaches index investing and pays by lottery sends a mixed message. Treat as optional, or teach it without using it.

### 12. Paper portfolio simulator

What it is: the user invests pretend money and watches it over time. Mistakes cost nothing.

Where used: The Stock Market Game (SIFMA Foundation, schools). Unverified: Investopedia Simulator, paper trading modes in broker apps.

Evidence: Hinojosa et al. (2009), funded by the FINRA Foundation. Randomised trial in nearly 600 classrooms. Students who played scored significantly higher on maths and on investor knowledge tests. Effect sizes were not in the summaries I read. The study was paid for by a body linked to the game's sector. **Study, sponsor-funded RCT.** https://finrafoundation.org/sites/finrafoundation/files/the_stock_market_game_1_0.pdf Context: Kaiser and Menkhoff (2017), a meta-analysis of 126 studies, find financial education has a small positive effect on behaviour (0.09) and a larger one on knowledge. https://openknowledge.worldbank.org/entities/publication/eb8b7699-0d2f-5d6d-ab1e-4262122c1a9c

Fits solo, no server: yes, if it uses stored historical or generated returns. No live prices.

FI fit: direct. A small portfolio that advances one "year" per Lesson finished. The player picks a mix once, then the only choice each year is hold or sell. Inference: this can teach the cost of trading and the value of doing nothing, which a quiz cannot.

Risks: stock-picking games reward luck and short-term bets. The classroom game runs about 15 weeks, which teaches the wrong time span for this theme. Use broad funds only, long spans, and no ranking of returns. Must not look like advice.

### 13. Story wrapper around the task

What it is: the task is placed inside a story. Each session moves the plot forward. You come back to hear what happens next.

Where used: Zombies, Run! (audio story where each run is a mission). Unverified: The Walk, Marvel Move, Habitica quests.

Evidence: Direito et al. (2015), JMIR, the AIMFIT trial. 51 teenagers, eight weeks, three arms: Zombies, Run!, a plain running app, or nothing. No significant effect on fitness or on activity for either app. **Study, RCT, null result, small sample.** https://www.jmir.org/2015/8/e210/ The first pass cites Sailer and Homner (2020), who found game fiction helped behavioural outcomes across studies. So the picture is mixed.

Fits solo, no server: yes. Text only is enough.

FI fit: the Path could carry one person's story from first pay to independence, a few lines per Lesson. The Recap per Section is the natural chapter end.

Risks: writing cost is high. A weak story is worse than none. The one direct trial found nothing.

### 14. Period in review

What it is: at the end of a week, month or year the app builds a short set of cards about what you did. It is made to be looked back on and often shared.

Where used: Strava Year in Sport (5.87 million animated recaps, per a vendor case study). Unverified: Spotify Wrapped, Kindle Reading Insights, Apple Fitness monthly summaries, Goodreads Year in Books.

Evidence: reach figures only. No measured effect on return or on behaviour was found. **Marketing.** https://rive.app/blog/strava-year-in-sport-built-with-rive

Fits solo, no server: yes. Sharing can be a saved image.

FI fit: the game has a Recap per Section, keyed to content. This is keyed to time. "Your month": Cards learned, Review steps climbed, hardest Card finally passed, Coins invested and what they grew to. Inference: it also gives a lapsed player a reason to look in at month end.

Risks: low. It can turn into praise with no information. Use real counts.

### 15. Activity heatmap with no streak number

What it is: a calendar grid where each day is shaded by how much you did. It shows a pattern over months. It does not show one number that can break.

Where used: GitHub contribution graph. Unverified: Anki review heatmap add-on, Strava training log, many habit trackers.

Evidence: Moldon, Strohmaier and Wachs (2021), "How Gamification Affects Software Developers". GitHub removed streak counters from profiles in 2016 and kept the graph. After removal there were fewer long-running streaks. So the counter changed behaviour, and the graph alone pulled less. **Study, natural experiment.** https://arxiv.org/pdf/2006.02371v3.pdf GitHub's stated reason was to focus on the work, not on how long someone had been active. https://github.blog/news-insights/product-news/more-contributions-on-your-profile

Fits solo, no server: yes.

FI fit: the heatmap is a picture of regular contributions, which is how capital is built. Shade by Cards answered. It sits well next to the existing day streak as the "forgiving" view: a missed day is one pale square among many dark ones.

Risks: the study cuts both ways. A streak number moves people more than a grid. Critics said the GitHub graph punished rest days. Inference: keep the grid as memory, not as a demand.

### 16. Fresh-start points

What it is: the app marks a clean start at natural points in time: a new week, a new month, a birthday. Past misses are placed in a closed period.

Where used: UbiFit Garden (garden reset each week). Unverified: weekly goals in Strava and Apple Fitness, January challenges in most fitness apps.

Evidence: Dai, Milkman and Riis (2014), Management Science, three field studies. Searches for "diet", gym visits and new goal commitments all rise after the start of a week, month, year or term, and after birthdays. **Study, archival.** https://faculty.wharton.upenn.edu/wp-content/uploads/2014/06/Dai_Fresh_Start_2014_Mgmt_Sci.pdf

Fits solo, no server: yes. Needs only the device date.

FI fit: the first pass shows that a broken streak hurts most when shown. A fresh-start frame gives the game a kind way to greet a returning player: "New month. Your capital is still here. Here is today's Review." Money has its own landmarks too: payday, new tax year. The player could set a payday date and the game marks it.

Risks: low. Do not reset anything the player earned. Reset the frame, not the progress.

### 17. Log one real number

What it is: the user records one true figure from their life on a regular rhythm. The act of recording is the mechanic. A simple line shows the trend.

Where used: unverified: weight trackers, YNAB and other budgeting apps, net worth trackers, running logs.

Evidence: Harkin et al. (2016), Psychological Bulletin. Meta-analysis of 138 randomised studies (N = 19,951). Prompting people to monitor progress raised goal attainment (d = 0.40). Effects were larger when the record was physically written down or made public. Most studies were about health. **Meta-analysis.** https://eprints.whiterose.ac.uk/id/eprint/91437/

Fits solo, no server: yes. The number stays on the device.

FI fit: this is the bridge from the game to real life. Once a month the game asks for one figure, for example the player's savings rate, and draws the line. It is optional. Inference: it also answers the fair doubt about any learning game, which is whether anything changes outside it.

Risks: privacy, even if local. A falling line can shame. Never grade the number. Say plainly that it never leaves the device. Storage can be wiped by the browser (see first pass), so include it in the backup.

### 18. Static benchmark ("people like you")

What it is: the app shows where you stand against a reference group. It is one number and a short note, not a live ranking.

Where used: Opower Home Energy Reports (your use against similar homes). Unverified: Strava "compared to your age group", credit score apps.

Evidence: Allcott (2011), Journal of Public Economics. Randomised field experiments covering about 600,000 households. The reports cut energy use by 2.0% on average. Heavy users cut 6.3%. The lightest users cut 0.3%. **Study, large RCTs.** https://ceepr.mit.edu/workingpaper/social-norms-and-energy-conservation

Fits solo, no server: yes, if the reference figures ship inside the file. They would be public statistics, for example median savings rates by age band. No other players are needed.

FI fit: pairs with idea 17. After the player logs a savings rate, the game can show a published median next to it. It is also good Lesson content: most people have no idea what is normal.

Risks: the first pass found that social comparison can lower motivation. People above the norm may relax. Figures differ by country and go out of date. A wrong benchmark misleads. Source every figure and date it.

### 19. Graded plan with a fixed end

What it is: a set programme with a clear last day. Each session is a little harder than the last. The user always knows how far along they are.

Where used: unverified: Couch to 5K, Nike Run Club training plans, Headspace beginner courses, 30-day challenges in many apps.

Evidence: none found in this pass. **Anecdote.** The first pass covers the goal-gradient effect, which supports showing distance to an end.

Fits solo, no server: yes.

FI fit: the Path is open and long. A short plan inside it gives a finish line: "21 days to your first plan". It can end with a real output, such as the rule set from idea 7.

Risks: a fixed plan fights the open Path, which serves autonomy. Falling behind a schedule is one more way to fail. Make the plan a suggested route, with no clock.

### 20. Power-ups, bad guys, allies

What it is: a personal challenge is recast as a game. Small helpful acts are "power-ups". Named obstacles are "bad guys". Helpers are "allies". The user defines their own.

Where used: SuperBetter.

Evidence: Roepke et al. (2015), Games for Health Journal. RCT with 283 adults with depression symptoms, three arms. SuperBetter users improved more than the waiting list. The authors warn that the large effects should be read with care because of high dropout and a self-selected sample. **Study, RCT, with caveats.** https://www.proquest.com/docview/1687049472

Fits solo, no server: mostly. Allies need other people. Power-ups and bad guys do not.

FI fit: "bad guys" fit the content well. Lifestyle creep, fees, panic selling and impulse buys are named enemies in most FI writing. Each could be a Card the player "defeats" by passing its questions several times in Review. The player can also name their own.

Risks: the framing can feel childish for a money topic. It adds vocabulary to a game that already has a glossary.

### 21. Skill rank by difficulty

What it is: a rank that rises only when you solve harder problems. A second, separate score counts activity. Skill and effort are not mixed in one number.

Where used: Codewars (kyu and dan ranks for skill, "honor" for activity, per its docs). Unverified: chess puzzle ratings, Exercism.

Evidence: none measured. **Company docs only.** https://docs.codewars.com/gamification/ranks/

Fits solo, no server: yes.

FI fit: the first pass found that levels and XP raise volume and not quality. Splitting the two is the response. Coins stay the activity count. A separate rank moves only on first-try answers to harder Cards and on Review steps climbed.

Risks: the glossary lists "level" as a word to avoid. A rank needs graded difficulty on every Card, which is content work.

### 22. Dated calendar of puzzles

What it is: a short season in which one new puzzle opens each day. A picture fills in as you solve them. Old days stay open with no time limit.

Where used: Advent of Code (one puzzle a day in December, two stars each, a calendar image that completes with all stars. In 2025 the event moved to 12 puzzles and dropped its global leaderboard, per Wikipedia).

Evidence: none measured. **Anecdote.** https://en.wikipedia.org/wiki/Advent_of_Code

Fits solo, no server: yes. Uses the device date only.

FI fit: a short yearly season with its own theme, for example "tax year week" or "12 days of compounding". Each day opens one special Card set. The picture could be a tree gaining rings.

Risks: date-gated content can be opened by changing the clock, which harms nobody. Content must be written for each season. Keeping past days open, as Advent of Code does, avoids fear of missing out.

### 23. Lifetime totals in place of a streak

What it is: the app shows totals that only go up: sessions done, minutes spent. The user can hide the streak.

Where used: Headspace (run streak plus totals. The streak can be turned off from the profile, per its help page).

Evidence: none measured. Headspace's own article says the number matters less than the practice. Users disagree on whether the streak helps or presses. **Marketing and anecdote.** https://help.headspace.com/hc/en-us/articles/215730567-How-does-the-run-streak-feature-work

Fits solo, no server: yes.

FI fit: a total that never falls is the honest picture of knowledge and of invested capital. Offering a switch to hide the day streak costs almost nothing and serves autonomy.

Risks: low. Totals alone pull less than a streak (see idea 15).

## Whole models

**The Holding.** Coins split in two at the moment they are earned. Most stay spendable. A small share is rounded up into a pot the player cannot spend (idea 8), and that pot grows by a shown rate on each day played. The player names the pot and gives it a purpose (idea 6). The share starts small and steps up after each Section, agreed in advance (idea 9). Coins can also be locked until a Section is done for a stated bonus (idea 10). A chart shows the pot on an axis of the player's own age (idea 5). The game's economy then behaves like the thing it teaches. Main risk: a second currency and more screens.

**The Town.** Each Lesson lit adds one building of its Section's kind to a town on the home screen (ideas 1 and 4). Nothing in the town ever decays. A heatmap shows the days worked (idea 15) and lifetime totals sit beside it (idea 23). At month end the game builds a short review from real counts (idea 14), and each new month opens with a fresh-start greeting (idea 16). This model is all gain frames. It suits a player who dislikes pressure. Main risk: art cost, and weaker pull than a streak.

**The Companion.** One creature or seedling lives on the first screen and grows with Review steps climbed, not with volume (ideas 1 and 2). It waits when the player is away and never suffers. A short story moves forward one beat per Lesson (idea 13). The enemies in that story are the real ones: fees, lifestyle creep, panic (idea 20). A returning player gets a fresh start, not a broken number (idea 16). This model gives a solo game some warmth. Main risk: writing cost, and guilt if the "never suffers" rule slips.

**The Plan.** The game ends in something the player keeps. At setup the player writes one if-then line for when they will play (idea 7). Across the Sections they add money rules of their own, which form an exportable rule set. A suggested 21-day route gives a finish line (idea 19). Once a month they log one real number, such as savings rate (idea 17), and may see a sourced public median beside it (idea 18). A letter from their future self grows by a line per Section (idea 5). This is the model with the strongest evidence behind its parts and the least art. Main risk: it asks for real personal data, so it must be optional and local.

**The Paper Portfolio.** The player sets a simple fund mix once. Each Lesson finished advances the portfolio by one simulated year on stored returns (idea 12). The only choice is hold or sell, and holding is planted like a tree that must not be pulled up early (idea 3). A skill rank rises with first-try answers on hard Cards, apart from Coins (idea 21). Prize-linked saving is taught as a Lesson and not used as a reward (idea 11). Main risk: it can look like investment advice or reward luck. Long spans and broad funds only.

## Sources

All sources were reached through web search summaries on 2026-11-14. None was opened in full. "Unverified" items in the text have no source here.

| Source | URL |
|---|---|
| Consolvo et al. (2008), Flowers or a robot army? Encouraging awareness and activity with personal, mobile displays, UbiComp | https://unpaywall.org/10.1145%2F1409635.1409644 |
| Consolvo, UbiFit project page | https://www.consolvo.org/ubifit |
| Lin, Mamykina, Lindtner, Delajoux and Strub (2006), Fish'n'Steps, UbiComp, LNCS 4206 | https://unpaywall.org/10.1007%2F11853565_16 |
| YourStory (2022), review of Finch | https://yourstory.com/2022/06/app-review-self-care-pet-finch-gamifies-mental-wellbeing |
| Rahmillah et al. (2023), review and analysis of 13 apps to reduce phone use, JMIR | https://jmir.org/2023/1/e42541/PDF |
| Sparkful, Fortune City product page | https://sparkful.app/fortune-city |
| Red Dot, Fortune City award entry | https://www.red-dot.org/project/fortune-city-25920 |
| Hershfield et al. (2011), Increasing Saving Behavior Through Age-Progressed Renderings of the Future Self, J. Marketing Research 48 (review by US DOL CLEAR) | https://clear.dol.gov/study/increasing-saving-behavior-through-age-progressed-renderings-future-self-hershfield-et-al-2011 |
| Soman and Cheema (2011), Earmarking and Partitioning, J. Marketing Research 48 | https://www.russellsage.org/sites/default/files/u137/jmr-C-s014-s021-online.pdf |
| Karlan, McConnell, Mullainathan and Zinman (2016), Getting to the Top of Mind, Management Science 62(12); working paper | https://www.nber.org/papers/w16205 |
| Gollwitzer and Sheeran (2006) and Sheeran, Listrom and Gollwitzer (2024), implementation intentions; summary page of the US National Cancer Institute | https://cancercontrol.cancer.gov/brp/research/constructs/implementation-intentions |
| Qapital help, Guilty Pleasure rule | https://help.qapital.com/en/articles/10245399-guilty-pleasure-rule |
| Qapital blog, The Round Up Rule | https://blog.qapital.com/save-your-change-round-up |
| Thaler and Benartzi (2004), Save More Tomorrow, J. Political Economy 112(S1) (review by US DOL CLEAR) | https://clear.dol.gov/study/save-more-tomorrow%E2%84%A2-using-behavioral-economics-increase-employee-saving-thaler-benartzi-2004 |
| Ashraf, Karlan and Yin (2006), Tying Odysseus to the Mast, Quarterly J. Economics 121(2) | https://isps.yale.edu/research/publications/isps06-009 |
| Beeminder blog, commitment contracts tag | https://blog.beeminder.com/tags/commitment%20contracts |
| Kearney, Tufano, Guryan and Hurst (2010), Making Savers Winners, NBER w16433 | https://www.nber.org/papers/w16433 |
| Cole, Iverson and Tufano (2022), Can Gambling Increase Savings?, Management Science 68(5) | https://pubsonline.informs.org/doi/fpi/10.1287/mnsc.2021.4047 |
| Hinojosa et al. (2009), The Stock Market Game Study: Final Report, FINRA Foundation | https://finrafoundation.org/sites/finrafoundation/files/the_stock_market_game_1_0.pdf |
| Kaiser and Menkhoff (2017), Does Financial Education Impact Financial Literacy and Financial Behavior, and If So, When?, World Bank Economic Review 31(3) | https://openknowledge.worldbank.org/entities/publication/eb8b7699-0d2f-5d6d-ab1e-4262122c1a9c |
| Direito et al. (2015), Apps for IMproving FITness (AIMFIT), JMIR 17(8) | https://www.jmir.org/2015/8/e210/ |
| Rive, Strava Year in Sport case study (vendor) | https://rive.app/blog/strava-year-in-sport-built-with-rive |
| Moldon, Strohmaier and Wachs (2021), How Gamification Affects Software Developers: Cautionary Evidence from a Natural Experiment on GitHub | https://arxiv.org/pdf/2006.02371v3.pdf |
| GitHub blog (2016), More contributions on your profile | https://github.blog/news-insights/product-news/more-contributions-on-your-profile |
| Dai, Milkman and Riis (2014), The Fresh Start Effect, Management Science 60(10) | https://faculty.wharton.upenn.edu/wp-content/uploads/2014/06/Dai_Fresh_Start_2014_Mgmt_Sci.pdf |
| Harkin et al. (2016), Does Monitoring Goal Progress Promote Goal Attainment?, Psychological Bulletin | https://eprints.whiterose.ac.uk/id/eprint/91437/ |
| Allcott (2011), Social Norms and Energy Conservation, J. Public Economics 95 | https://ceepr.mit.edu/workingpaper/social-norms-and-energy-conservation |
| Roepke et al. (2015), Randomized Controlled Trial of SuperBetter, Games for Health Journal 4(3) | https://www.proquest.com/docview/1687049472 |
| Codewars docs, Ranks | https://docs.codewars.com/gamification/ranks/ |
| Wikipedia, Advent of Code | https://en.wikipedia.org/wiki/Advent_of_Code |
| Headspace help, How does the run streak feature work | https://help.headspace.com/hc/en-us/articles/215730567-How-does-the-run-streak-feature-work |

Gaps: no measured evidence was found for town building, round-ups, period-in-review cards, graded plans, skill ranks, dated puzzle calendars or lifetime totals. No controlled study was found for Forest or Finch. No independent study of Apple activity rings was found. Only an Apple press release turned up, and it is not used. Strava publishes no design reasoning for its weekly streak that I could find. Calm, Goodreads, Kindle, Monzo, Acorns, Habitica and Exercism were not checked and appear only as unverified examples.
