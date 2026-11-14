# Gamification, wide pass 4: theme, world and feel

Date: 2026-11-14

## Method

Question: which ideas about theme, world, game feel and question formats could make FI Roadmap more fun, given one player, no account, no server, no push, localStorage, and one HTML file with inline SVG and Web Audio.

This note follows `gamification-mechanics.md` and does not repeat it. Streaks, freezes, quests, badges, hearts, leaderboards and notifications are covered there.

Evidence labels used here:

- **Meta-analysis**: a pooled result from many studies.
- **Single study**: one paper. Unless I say "full text", I read the abstract only (through OpenAlex).
- **Practitioner**: a designer's talk or writing. Opinion, with no measured effect.
- **Product**: a named product does this. That shows it can be built. It does not show it works.
- **Unverified**: I state it from memory or from a search summary and did not open a primary source. Check it before it carries a decision.
- **Inference**: my own reasoning, not a source's finding.

"Fits" means: works for one player with no account and no server, inside one HTML file.

Count of ideas: 24. Part A has 7, part B has 5, part C has 6, part D has 6.

## Short answer

Three findings matter most.

1. The strongest result in this pass is about integration. A learning game where the play mechanic is the subject itself beat the same game with the subject bolted on. Children learned more and chose to play it 7 times longer (Habgood and Ainsworth 2011). For this game that means: Coins should behave like money. They should be invested, earn, and compound, so that the reward system teaches the lesson.
2. People underestimate compound growth, and showing them the curve changes what they do. Explaining compound interest raised pension payments by about 40% in a field experiment (Song 2020). Showing exponential growth made people want to save more (McKenzie and Liersch 2011). A game that lets the player feel their own Coins compound is aimed at the right mistake.
3. Juice helps in a medium dose and hurts at both ends. In a study with 3018 players, no juice and extreme juice both cut play time, enjoyment, motivation and performance, compared with medium and high juice (Kao 2020). So do a juice pass, keep it moderate, and give an off switch.

## Part A. Progress metaphors and a world the player owns

### A1. One owned thing that grows

What it is: the player owns one visible object that grows with their work. It can be a machine, a plant, a town or a snowball. It is on screen at the start of every visit, and it never shrinks.

Where it is used: Forest (a tree grows while you stay focused). Fish'n'Steps (a fish grows with your step count). UbiFit Garden (flowers appear for exercise). Fortune City (a town grows as you log spending). Product descriptions for Forest and Fortune City are from memory: unverified.

Evidence:
- Fish'n'Steps: 19 people, 14 weeks. The game encouraged exercise and improved attitudes. Enthusiasm fell after the first two weeks. **Single study**, not opened; from search summaries of the abstract. https://doi.org/10.1007/11853565_16
- UbiFit Garden: 12 people, 3 weeks. The abstract reports on the sensing, and gives no outcome numbers. **Single study**, abstract. https://doi.org/10.1145/1357054.1357335
- The IKEA effect: people value things they built themselves more highly. The effect goes away when the thing is destroyed or left unfinished. **Single paper, four studies**, abstract. https://doi.org/10.1016/j.jcps.2011.08.002

Fits: yes. The object is inline SVG drawn from a few saved numbers.

Theme fit: strong. Financial independence is about owning something that grows. The object can be the player's capital made visible.

Risks: novelty wears off in about two weeks (Fish'n'Steps). The IKEA paper warns against destroying what the player built, so the object must not decay. A second progress display next to the Path can split attention.

### A2. Coins that work: invest Coins in assets that pay Coins

What it is: the player spends Coins on assets. Each asset pays a small Coin income over time. Income can be reinvested, so the balance curves upward. The game's own economy becomes a compounding demo.

Where it is used: Animal Crossing pays interest on a bank balance. In April 2020 Nintendo cut that rate, and the news press covered it as a central bank story. The reported figures (0.5% to about 0.05%) came from players and Kotaku, not from Nintendo. AdVenture Capitalist and Cookie Clicker are built on buying things that produce more currency. Fable II and Assassin's Creed II pay rent on owned property: unverified, from memory.

Evidence:
- People turn exponential growth into a straight line in their heads. More biased households borrow more and save less. **Single study**, abstract. Stango and Zinman 2009. https://doi.org/10.1111/j.1540-6261.2009.01518.x
- Most people expect 40 years of savings to grow in a straight line. Showing the exponential growth made students and employees want to save more. **Single paper, five experiments**, abstract. McKenzie and Liersch 2011. https://doi.org/10.1509/jmkr.48.SPL.S1
- Explaining compound interest raised pension payments by roughly 40% in rural China. **Single field experiment**, abstract. Song 2020. https://doi.org/10.1093/rfs/hhz074
- Intrinsic integration (see B4). **Single paper, two studies.**
- No study tests an in-game compounding currency in a learning app. The mechanic itself is **Product** and **Inference**.

Fits: yes. It needs a list of owned assets and a timestamp.

Theme fit: the best fit in this note. The player earns by labour (answering), then learns that owned assets earn too. That is the core idea of the subject.

Risks: runaway growth makes Coins worthless, so prices must rise as well. It can pull attention from Lessons to shop management. The first note says Coins bought only a freeze. This adds a second, larger sink and needs a glossary decision. Do not add random returns that look like gambling.

### A3. "While you were away": passive income on return

What it is: when the player opens the game, a short screen shows what their assets earned since the last visit. The amount counts up and is added to the balance.

Where it is used: AdVenture Capitalist, Cookie Clicker and most idle games.

Evidence:
- Anthony Pecorella (Kongregate) says of idle games: "You don't have to be constantly playing; there's constant positive growth and feedback." He says the longer a player is away, the stronger the pull to return. He calls retention "amazing" and gives no percentages. The same article credits AdVenture Capitalist with making offline progress common. **Practitioner**, read through a Game Developer report of his GDC 2015 talk. https://gamedeveloper.com/design/the-rise-of-games-you-mostly-don-t-play
- A taxonomy of 66 idle games says they move the player "from playing to planning". It measures no outcomes. **Single study**, abstract. Alharthi et al. 2018. https://doi.org/10.1145/3173574.3174195

Fits: yes. Income is the time since the saved timestamp, times the rate. The device clock can be changed to cheat. With one player that harms nobody. A cap removes the incentive.

Theme fit: it is passive income, shown literally. It also replaces the missing push notification with a reason to open the game.

Risks: it pays for staying away. That is an engagement-contingent reward, the kind the first note warns about (Deci et al. 1999). Two guards: cap the away income at a few days, and let only learning acts raise the rate (for example a finished Review keeps the assets "maintained"). Animal Crossing had to cut its rate, reportedly because players moved the clock: unverified reason.

### A4. The freedom meter: passive income against cost of living

What it is: one gauge shows the player's in-game passive income per day against an in-game daily cost. The goal is the crossover, where income covers the cost. After that, the streak freeze could be paid by income instead of by labour.

Where it is used: the board game Cashflow ends its first phase when passive income passes expenses. The book "Your Money or Your Life" uses a wall chart with a "crossover point". Both are from memory: unverified.

Evidence:
- People judge the same wealth differently as a lump sum and as a monthly income. Format changes how adequate it feels. **Single paper, three experiments**, abstract. Goldstein, Hershfield and Benartzi 2016. https://doi.org/10.1509/jmr.14.0652
- The goal gradient: effort rises near a goal (Kivetz et al. 2006, in the first note).
- No study of a crossover gauge in a game was found.

Fits: yes. Two numbers and one SVG gauge.

Theme fit: it is the definition of financial independence, turned into the win state. Showing income per day, not only a total, follows the Goldstein finding.

Risks: the gauge needs an in-game cost, which is a new idea to explain. If the crossover comes too early, the goal is spent. If it comes too late, it reads as out of reach.

### A5. A journey story with a light frame

What it is: the Path gets a thin story. A traveller starts in a named place (for example the Paycheck Flats) and walks toward Freedom. Each Section is a region with its own look. A guide character speaks one or two lines at Section starts and ends.

Where it is used: Duolingo uses recurring characters. Zombies, Run! wraps running in a story: unverified, from memory.

Evidence:
- Game fiction helped behavioural outcomes in the meta-analysis in the first note (Sailer and Homner 2020).
- A meta-analysis of digital learning games found that effects differ by "visual and narrative characteristics". The abstract does not say in which direction. **Meta-analysis**, abstract. Clark, Tanner-Smith and Killingsworth 2016. https://doi.org/10.3102/0034654315582065
- Interesting but irrelevant details lower recall of the main ideas and lower transfer. Putting them at the start made it worse. Putting them at the end reduced the harm. **Single paper, four experiments**, abstract. Harp and Mayer 1998. https://doi.org/10.1037/0022-0663.90.3.414

Fits: yes. Text and SVG only.

Theme fit: a road to freedom is already the game's metaphor. Regions can mirror the books.

Risks: story text that is not about money is a "seductive detail" and can hurt learning. Keep story lines short, tie each to the Section's idea, and place them at Section ends, not starts.

### A6. Future-self postcards and time jumps

What it is: at a Section end, the game jumps ahead ("20 years later") and shows what the choices taught in that Section would have built. A short postcard from the player's future self states the result in numbers.

Where it is used: Build Your Stax (Next Gen Personal Finance) lets the player "see the results of 20 years in about 20 minutes". Source: NGPF Arcade page. https://www.ngpf.org/arcade/

Evidence:
- People who interacted with aged images of themselves chose later money rewards over immediate ones, in four studies. The studies used virtual reality and realistic renderings. A text postcard is a much weaker version. **Single paper**, abstract. Hershfield et al. 2011. https://doi.org/10.1509/jmkr.48.SPL.S23

Fits: yes. It is a computed card with numbers.

Theme fit: financial independence trades now for later. A time jump makes "later" concrete, and gives the Recap a story role.

Risks: the evidence is for vivid images of one's own face, not text. Numbers must come from honest, stated assumptions (rate, years), or it becomes a false promise.

### A7. Permanent purchases on the map

What it is: Coins buy things that stay. Examples: a landmark beside a finished Section, a lamp that lights a stretch of road, or a tool such as a compound-interest calculator that stays in the player's kit.

Where it is used: Animal Crossing (house and island). Fortune City (buildings): unverified.

Evidence: the IKEA effect (A1) supports valuing what you built. The first note found no evidence for or against cosmetics. Everything else is **Practitioner** or **Inference**.

Fits: yes. Each item is a saved flag and an SVG group.

Theme fit: it teaches the difference between spending on things that are used up and buying things that last. A tool purchase also gives the player something useful outside the game.

Risks: many SVG landmarks make the single file larger. Purely decorative items can feel empty to an adult audience. Never sell Hints or content (first note).

## Part B. Finance-themed games and simulators

### B1. Time-compressed investing run

What it is: a short simulation. The player makes a few allocation choices, then years pass in seconds and the result is shown against a simple baseline such as "buy the whole market and wait".

Where it is used: Build Your Stax (20 years in about 20 minutes). The Stock Market Game (teams trade a virtual portfolio over weeks).

Evidence:
- A 2009 randomised study of the Stock Market Game by Learning Point Associates, paid for by the FINRA foundation, reported that players scored higher than non-players on maths and investor knowledge tests. **Single study, not opened**: both PDF copies failed to load. Figures are from search summaries, and those summaries disagree on duration. https://finrafoundation.org/sites/finrafoundation/files/the_stock_market_game_1_0.pdf
- Productive failure: trying a problem before being taught beats being taught first, g = 0.36 over 53 studies. The effect was reversed for young children. **Meta-analysis**, abstract. Sinha and Kapur 2021. https://doi.org/10.3102/00346543211019105

Fits: yes. A seeded random walk and an SVG line chart need no assets.

Theme fit: direct. The run can show fees, panic selling and patience.

Risks: a contest over a few weeks rewards risk taking and luck, which is the opposite of the lesson. This is a common criticism of stock games: unverified, no source opened. Use long horizons and compare with the boring baseline. A lucky reckless run teaches the wrong thing, so show many runs, not one.

### B2. Scarcity dilemma stories

What it is: a chain of hard choices on a tight budget. Each choice has a cost and a consequence a few steps later.

Where it is used: SPENT ("make it through the month while living paycheck to paycheck"). The Uber Game. Payback (decisions to get through college). Source for the descriptions: NGPF Arcade page.

Evidence:
- Playing a poverty game did not change attitudes toward the poor. Watching someone else play did. In the second study, some players became less positive, because the game made poverty feel personally controllable. **Single paper, two studies**, abstract. Roussos and Dovidio 2016. https://doi.org/10.5817/CP2016-2-3

Fits: yes. A branching text scene with a few variables.

Theme fit: good for the early Sections (the trap of trading time for money). Weak for the later ones.

Risks: the study is a warning. The lesson a player takes from a mechanic can differ from the one intended. Giving the player control implies that outcomes are only about choices. Test what players actually conclude.

### B3. Play the other side

What it is: the player takes the role of the seller of a bad deal, such as a lender or a dealer. They learn the tricks by using them, then meet the same tricks as a buyer.

Where it is used: Shady Sam (the player is a loan shark who maximises profit). Shady Sam's Slick Wheels (a car dealer). Source: NGPF Arcade page.

Evidence: none found for these games. A related line of research is "inoculation" games such as Bad News (Roozenbeek and van der Linden 2019): **unverified**, not opened in this pass.

Fits: yes. It is a question format with a role switch.

Theme fit: fits Lessons on debt, fees and inflation, where someone else earns from the player's mistake.

Risks: it can read as cynical. It needs the second half (the player as buyer), or the point is lost.

### B4. Make the mechanic the lesson (intrinsic integration)

What it is: a design rule, not a feature. The core action of the game should be the thing being taught. A quiz with a money skin is the "sugar coating" approach.

Where it is used: Zombie Division, the research game in the study below. DragonBox for algebra: unverified, from memory.

Evidence:
- Children learned more from the version where the maths was the fight mechanic, and when free to choose they played it 7 times longer than the version where the maths was a quiz between fights. 58 children in study 1, 16 in study 2. **Single paper, two small studies**, abstract. Habgood and Ainsworth 2011. https://doi.org/10.1080/10508406.2010.508029
- Serious games beat conventional teaching on learning (d = 0.29) and retention (d = 0.36). They were not more motivating. **Meta-analysis**, abstract. Wouters et al. 2013. https://doi.org/10.1037/a0031311
- Digital games beat non-game teaching (0.33), and better-designed games beat plain ones (0.34). The authors stress "the key role of design beyond medium". **Meta-analysis**, abstract. Clark et al. 2016.

Fits: yes. It is a rule for choosing among the other ideas.

Theme fit: this explains why many finance games are dull. Wouters found learning games are on average not more motivating than a class. For FI Roadmap the integrated options are A2, A3, A4, B1 and the Part D formats, where the action is a money decision.

Risks: the key study is small and used children and maths. Integration costs more design work per Lesson than multiple choice.

### B5. One real action per Section

What it is: each Section ends with one small real-world step the player can take today. For example: write down your savings rate. The game records only that the player ticked it.

Where it is used: no named product checked. **Inference** from the research below.

Evidence:
- Financial education explained 0.1% of the variance in financial behaviour across 201 studies. The effect fades, and is negligible 20 months on. The authors argue for "just-in-time" education tied to a specific behaviour. **Meta-analysis**, abstract. Fernandes, Lynch and Netemeyer 2014. https://doi.org/10.1287/mnsc.2013.1849
- A later meta-analysis of 76 randomised experiments, with over 160,000 people, found positive effects on knowledge and behaviour, at least three times larger than earlier work reported. **Meta-analysis, not opened**: from the working-paper abstract in search results. Kaiser, Lusardi, Menkhoff and Urban 2022. https://doi.org/10.1016/j.jfineco.2021.09.022

Fits: yes. One checkbox per Section. No data leaves the device.

Theme fit: the game's purpose is a change in real behaviour, and the two meta-analyses disagree on how far teaching alone gets there.

Risks: the game must not give personal financial advice. Steps should be observations ("find out what you pay in fees"), not instructions to buy something. A self-reported tick can be faked, which is fine for one player.

## Part C. Game feel (juice)

### C1. Layered feedback on a right answer, in a medium dose

What it is: one right answer triggers several small reactions at once. The button squashes and springs back, a ring of sparks pops, a short tone plays, and the Coin counter ticks. Each reaction repeats the same message.

Where it is used: the talk "Juice It or Lose It" (Jonasson and Purho, GDC Europe 2012) adds such effects one by one to a plain Breakout clone. Peggle. Duolingo.

Evidence:
- The talk promises "the neat little tricks you can apply to any game to make it more satisfying to play". **Practitioner.** GDC Vault page opened; the video was not watched. https://gdcvault.com/play/1016487/Juice-It-or-Lose
- 3018 players, four versions of one action game. No juice and extreme juice both gave less play time, lower player experience, lower intrinsic motivation and worse performance than medium and high. **Single large study**, abstract. Kao 2020. https://doi.org/10.1016/j.entcom.2020.100359
- Two versions of one game. Players rated the juicy one higher on average and performed worse in it. **Single study (poster)**, abstract summary. Juul and Begy 2016. https://adk.elsevierpure.com/en/publications/good-feedback-for-bad-players-a-preliminary-study-of-juicy-interf
- Visual embellishments raised visual appeal in every game tested, and raised felt competence only in some cases (Hicks et al. 2019, in the first note).

Fits: yes. See "What CSS, SVG and Web Audio can do" below.

Theme fit: neutral. The neon look suits glow and sparks.

Risks: too much juice is as bad as none (Kao). Effects that delay the next question slow down retrieval practice. Keep each effect under about half a second: that number is my guess, not a finding.

### C2. Count-ups and Coins that fly to the balance

What it is: a reward is never added in one step. Coins fly from the answer to the counter, and the counter rolls up to the new value with ticking sounds that speed up and then stop.

Where it is used: common in casual and idle games, and in Duolingo's Lesson end. **Product**, from memory.

Evidence: none found. This is **Practitioner** convention. I found no study that isolates a count-up.

Fits: yes. A `requestAnimationFrame` loop changes the number. CSS transforms move the Coins. Web Audio plays the ticks.

Theme fit: good. A count-up makes growth visible, and can show income arriving from assets (A3) differently from Coins earned by answering.

Risks: a long count-up on every screen becomes a wait. Let a tap skip it.

### C3. A Combo sound that climbs in pitch

What it is: each right answer in a row plays the same short tone one step higher on a musical scale. A wrong answer resets it quietly, with no harsh sound.

Where it is used: Peggle. Reviewers describe the peg sound rising in pitch with each hit in one shot.

Evidence: reviewer descriptions only. I found no statement from the Peggle team on why they did it, and no study. **Practitioner**, weak.

Fits: yes, and it is cheap. One `OscillatorNode` and one `GainNode` per note. Pitch is a multiplication of the base frequency.

Theme fit: the Combo already exists. The rising scale lets the player hear a run of right answers build, which mirrors compounding.

Risks: a reset sound that feels like punishment works against the "mistakes are fine" stance in the first note. Sound must have a switch, and the game must be complete with sound off.

### C4. One big finish per Lesson: anticipation, then release

What it is: the last question of a Lesson gets a short build-up, such as a slowed beat and a drum roll. Then one big release follows: a fanfare, a burst and the chest. The big effect is saved for this one moment.

Where it is used: Peggle's "Extreme Fever": a zoom and slow motion on the last peg, then "Ode to Joy". Search summaries of a PC Gamer feature say the music began as a placeholder joke and was kept because players loved it. **Not opened**: the page did not load. https://pcgamer.com/the-making-of-peggle/2

Evidence:
- People judge a past episode mostly by its worst moment and its end, and length matters little. **Single study**, abstract. The study was about pain (cold water), so applying it to a pleasant Lesson end is **Inference**. Kahneman et al. 1993. https://doi.org/10.1111/j.1467-9280.1993.tb00589.x
- Duolingo's milestone animation result is in the first note (company self-report).

Fits: yes. CSS scale and blur for the build-up, a short Web Audio arpeggio for the release.

Theme fit: neutral to good. The first note advises against random chest payouts. The finish can keep its drama with a fixed, earned reward.

Risks: if every Lesson ends at full volume, it stops feeling special. A big party after a poor Lesson feels false. Scale the finish to the result.

### C5. Haptic taps where the device allows

What it is: a short vibration on a right answer, and a longer pattern on the finish.

Where it is used: native mobile games and apps.

Evidence:
- Haptic feedback that repeats visual feedback can raise enjoyment, appeal, immersion and meaning. **Single paper, two studies**, abstract. Singhal and Schneider 2021. https://doi.org/10.1145/3411764.3445463

Fits: partly. `navigator.vibrate()` works in Chrome on Android after a user gesture, and not in Safari (first note). A workaround for iPhone toggles a hidden `<input type="checkbox" switch>` to make the system tick. Sources disagree on when it started (Safari 17.4 or iOS 18), and one library says Apple removed it in iOS 26.5. **Unverified.** Treat it as unreliable.

Theme fit: neutral.

Risks: uneven support. It must be optional and must fail silently.

### C6. A juice budget and an off switch

What it is: a rule. Rank the moments (answer, Combo step, Lesson end, Section end) and give each a fixed size of effect. Respect the device's reduced-motion setting. Keep one switch each for sound and for motion.

Where it is used: `prefers-reduced-motion` is a standard CSS media feature.

Evidence:
- Kao 2020: extreme juice hurts.
- MDN: `prefers-reduced-motion` detects that the user "prefers an interface that removes, reduces, or replaces motion-based animations". It has been available across browsers since January 2020. **Platform documentation**, opened. https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

Fits: yes. One media query and two saved flags.

Theme fit: neutral.

Risks: none of note. Skipping it is the risk.

### What CSS, SVG and Web Audio can do without assets

Checked on MDN in this pass:
- An `AudioContext` created outside a user gesture starts "suspended". Create or resume it inside a click handler. Sound can be made with an `OscillatorNode`, or by filling a buffer with your own data. https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- `prefers-reduced-motion` (see C6).

From my own knowledge of the platform, not re-checked in this pass:
- **Squash and stretch, pop, shake**: CSS `transform` with `@keyframes`, or the Web Animations API (`element.animate`). Transform and opacity changes are cheap to animate.
- **Springy easing**: `cubic-bezier` curves that overshoot.
- **Line drawing**: animate `stroke-dashoffset` on an SVG path. This can draw the road, a growth curve or a tick mark.
- **Neon glow**: SVG `feGaussianBlur` filters or CSS `drop-shadow`. Blur filters are costly on phones when many are animated at once.
- **Particles**: 10 to 30 small SVG circles or divs, each with its own transform animation, removed when done.
- **Count-ups**: `requestAnimationFrame` with an ease-out curve.
- **Tones**: an oscillator into a gain node, with the gain ramped down quickly, gives a pluck or a blip. A fast pitch slide gives a "coin" sound. A buffer of random numbers through a filter gives noise for a whoosh or a chest thud. Several notes scheduled on the audio clock give a fanfare.

## Part D. Question formats beyond multiple choice

### D1. Guess first with a slider, then reveal

What it is: before a Card teaches a number, the player sets a slider to their guess. For example: "100 a month for 30 years at 7%. How much at the end?" The true value then counts up next to the guess, and the gap is shown.

Where it is used: Brilliant uses numeric input and sliders: unverified, from memory.

Evidence:
- Being asked before reading improved later test scores more than extra reading time, in all five experiments, even though only wrongly answered items were counted. **Single paper**, abstract. Richland, Kornell and Kao 2009. https://doi.org/10.1037/a0016496
- Most people guess linear growth and far too low (McKenzie and Liersch 2011, in A2).

Fits: yes. `<input type="range">` and a count-up.

Theme fit: very strong. The player's own wrong guess is the proof of exponential growth bias. The surprise is the lesson.

Risks: a slider's range and start position hint at the answer. Use a wide or log scale and a neutral start. Guesses on new material should not cost Coins or break a Combo.

### D2. Draw the line

What it is: the player drags to draw how they think a chart continues. For example: the value of an untouched investment over 40 years. Then the real line draws over theirs.

Where it is used: The New York Times "You Draw It" pieces (2015 on): not opened, from memory.

Evidence:
- People asked to predict data by drawing it, and then shown the gap, recalled and understood the data better than a control group. The effect held for people with little prior knowledge. **Single paper, controlled experiments**, abstract. Kim, Reinecke and Hullman 2017. https://doi.org/10.1145/3025453.3025592

Fits: yes. Pointer events on an SVG, storing one y value per x step, and `stroke-dashoffset` for the reveal.

Theme fit: compounding, inflation and the cost of fees are all curve shapes that people get wrong.

Risks: drawing with a finger on a small screen is fiddly. Five to eight snap points work better than a free line. It needs a keyboard alternative.

### D3. Sort the cards into buckets

What it is: the player drags or taps items into two or three buckets. For example: "asset" or "liability", or "pays you" or "costs you". Items from different Lessons are mixed.

Where it is used: matching and sorting tasks appear in Duolingo and Brilliant: unverified, from memory.

Evidence:
- Mixing examples of different categories improved category learning, compared with showing each category in a block. Learners still believed the blocked order worked better. **Single paper**, abstract. The material was paintings by different artists. Kornell and Bjork 2008. https://doi.org/10.1111/j.1467-9280.2008.02127.x

Fits: yes. Tap an item, then tap a bucket. That avoids drag and drop problems on touch screens.

Theme fit: the subject's central distinction is a sorting task: does this thing put money in your pocket or take it out?

Risks: with two buckets a guess is right half the time. Use three buckets, or ask for a reason on some items. Real items can belong to either bucket depending on use (a house, a car). Use that as a teaching point, not a trick.

### D4. Tweak the inputs and watch the result

What it is: a small live model inside a Card. The player moves two or three sliders (savings rate, return, years) and a chart redraws at once. A question follows that can only be answered by playing with it.

Where it is used: Bret Victor's "Explorable Explanations". Nicky Case's explorables. PhET science simulations.

Evidence:
- Victor: a reactive document "allows the reader to play with the author's assumptions and analyses". He says the model should be woven into a guided explanation, not offered as a bare sandbox. **Practitioner**, opened. https://worrydream.com/ExplorableExplanations/
- Case: start with a question, begin with something concrete and hands-on, add one idea at a time, and end with an open question or a sandbox. **Practitioner**, opened. https://blog.ncase.me/how-i-make-an-explorable-explanation/
- PhET: a summary of research on interactive simulations and student motivation. The abstract gives no numbers. **Review**, abstract. Wieman, Adams and Perkins 2008. https://doi.org/10.1126/science.1161948
- An online interactive visual tool about spreading risk was one of four formats tested. All four raised confidence, and several improved financial literacy. The abstract does not say which. **Single study**, abstract. Lusardi et al. 2017. https://doi.org/10.1017/S1474747215000323

Fits: yes. The maths is a few lines. The chart is an SVG path.

Theme fit: the key relations in the subject (savings rate against years to independence, fees against final wealth) are models with two or three inputs.

Risks: free play without a goal teaches little (Victor's own warning). Always attach a question. Sliders are slower than a tap, so use these a few times per Section.

### D5. Build it, then run it

What it is: the player builds something from parts and then runs it. For example: split a paycheck into blocks (spend, save, invest), or stack a portfolio from three block types. They press Run to see ten years pass.

Where it is used: Build Your Stax. Budget games such as Money Magic (NGPF Arcade page).

Evidence:
- The ICAP framework predicts that learning rises from passive to active to constructive to interactive tasks. The paper supports this with studies of note taking, concept mapping and self-explaining. **Theory with a review of studies**, abstract. Chi and Wylie 2014. https://doi.org/10.1080/00461520.2014.965823
- Productive failure (B1). The IKEA effect (A1).

Fits: yes. Tap to add blocks, and reuse the simulation code from B1.

Theme fit: it is intrinsic integration (B4). The action is a money decision and the feedback is its result.

Risks: the result must be read against a stated rule, or a lucky build teaches the wrong thing. Build tasks take one to three minutes, which is long for a Lesson of short Cards. They fit best as a Section finale next to the Recap.

### D6. Say how sure you are

What it is: with an answer, the player marks "sure" or "not sure". A sure and right answer pays a small bonus. A sure and wrong answer costs nothing, and gets a fuller explanation and an earlier Review.

Where it is used: confidence-based marking in medical education: unverified, from memory.

Evidence:
- Errors made with high confidence were the most likely to be corrected at a later test. **Single paper**, abstract. Butterfield and Metcalfe 2001. https://doi.org/10.1037/0278-7393.27.6.1491

Fits: yes. One extra tap and one saved flag per Card.

Theme fit: overconfidence is a money topic. A calibration score ("you were sure 20 times and right 15") is honest feedback that suits an investor.

Risks: staking Coins on an answer would look like betting, and would add a penalty for mistakes. The first note rejects both. So: bonus only, no loss. The extra tap slows every question, so use it on selected Cards.

## Whole models

**1. The Money Machine.** The player owns one neon machine at the start of the Path (A1). Coins from right answers are raw input. The player spends them on parts, and each part is an asset type from the books that produces Coins over time (A2). On return the machine shows what it made while the player was away, with a count-up (A3, C2). A gauge on the machine shows output per day against a running cost, and crossing it is the long goal (A4). Each new Section adds a part type, so the machine also records what was learned. Juice is kept for two moments: a part clicking into place, and the Lesson finish (C4, C6). This model follows the integration rule most closely (B4), because the reward loop is the lesson. Its main risk is that tending the machine becomes more attractive than doing Lessons, so the output rate should rise only through learning acts.

**2. The Road Town.** The Path stays the main screen and becomes a place to own. Each finished Section leaves a landmark beside the road, and Coins buy lasting buildings that pay a small rent (A7, A2). A light story frames the walk from a paycheck town to a free one, with one line from a guide at Section ends (A5). Each Section closes with a time jump that shows the town twenty years on (A6), and with one real action to tick (B5). This model changes the least. It reuses the Path, Stations and Recap, and adds a reason to look back down the road. Its risks are file size from many SVG landmarks, and story text that distracts from the content.

**3. The Snowball.** One object, one number. A glowing ball sits on the road and grows with every Coin kept in it (A1). It grows a little by itself between visits, at a rate the player can see (A3), so its size curve is a live compound-growth chart the player made. Lessons use the guess-first slider and draw-the-line formats, so the player keeps predicting their own snowball and being surprised (D1, D2). A Combo sound that climbs in pitch and a single finish per Lesson carry the feel (C3, C4). This is the cheapest model to build and the clearest about compounding. Its risk is thinness: there is little to decide, so the fun must come from the question formats.

**4. The Lab Bench.** The questions are the game, and the world stays as it is now. Each Section mixes sort cards, guess-first sliders and tweak-the-inputs Cards with the existing multiple choice (D3, D1, D4). Each Section ends with one build-and-run task, a time-compressed investing run scored against a simple baseline (D5, B1). A confidence mark on selected Cards feeds a calibration score in the Recap (D6). Coins unlock sandbox versions of the models the player has met, which stay in a tool kit (A7). This model has the best learning evidence behind its parts (pretesting, prediction, interleaving, productive failure) and needs no new economy. Its risks are content cost per Lesson and slower Lessons.

**5. The Freedom Meter.** A small layer that can sit on top of any of the first four. One gauge on the home screen compares passive Coin income per day with a daily cost of living (A4). Before the crossover, the streak freeze is bought with earned Coins. After it, income pays for the freeze by itself, so the player feels what "work becomes optional" means inside the game. Income is always shown per day and as a total, because format changes how wealth is judged. The return screen states the day's income in one line (A3). Its risk is tuning: the crossover should land around the middle of the Path, late enough to feel earned and early enough to enjoy.

## Gaps

- No study was found that tests an in-game compounding currency, an away-income screen, a count-up, or a rising-pitch Combo. These rest on products and designers' opinion.
- The Stock Market Game report and the Kaiser et al. meta-analysis were not opened. Their numbers are from search summaries.
- The Peggle design quotes were not opened. The Vlambeer talk "The Art of Screenshake" was found only in secondhand lists and is not cited.
- Steve Swink's book "Game Feel" (2008) is the standard reference for C1 and was not opened.
- I did not read GLOSSARY.md. Terms follow the task brief (Lesson, Card, Path, Station, Section, Coins, Combo, Review, Recap). New words here (asset, machine, freedom meter, landmark) are proposals and need a glossary decision.

## Sources

"Abstract" means the abstract was read through OpenAlex metadata. "Opened" means the page was read. "Not opened" means the claim rests on search-result summaries.

| Source | URL | Read |
|---|---|---|
| Habgood and Ainsworth (2011), Motivating Children to Learn Effectively: Intrinsic Integration, J. Learning Sciences | https://doi.org/10.1080/10508406.2010.508029 | Abstract |
| Wouters, van Nimwegen, van Oostendorp and van der Spek (2013), meta-analysis of serious games, J. Educational Psychology | https://doi.org/10.1037/a0031311 | Abstract |
| Clark, Tanner-Smith and Killingsworth (2016), Digital Games, Design, and Learning, Review of Educational Research | https://doi.org/10.3102/0034654315582065 | Abstract |
| Kao (2020), The effects of juiciness in an action RPG, Entertainment Computing | https://doi.org/10.1016/j.entcom.2020.100359 | Abstract |
| Juul and Begy (2016), Good Feedback for Bad Players?, FDG/DiGRA poster | https://adk.elsevierpure.com/en/publications/good-feedback-for-bad-players-a-preliminary-study-of-juicy-interf | Abstract summary |
| Hicks, Gerling, Dickinson and Vanden Abeele (2019), Juicy Game Design, CHI PLAY | https://doi.org/10.1145/3311350.3347171 | Abstract |
| Singhal and Schneider (2021), Juicy Haptic Design, CHI | https://doi.org/10.1145/3411764.3445463 | Abstract |
| Jonasson and Purho (2012), Juice It or Lose It, GDC Europe | https://gdcvault.com/play/1016487/Juice-It-or-Lose | Vault page opened; video not watched |
| Kahneman, Fredrickson, Schreiber and Redelmeier (1993), When More Pain Is Preferred to Less, Psychological Science | https://doi.org/10.1111/j.1467-9280.1993.tb00589.x | Abstract |
| Game Developer, The rise of games you (mostly) don't play (report of Pecorella's GDC 2015 talk) | https://gamedeveloper.com/design/the-rise-of-games-you-mostly-don-t-play | Opened |
| Pecorella (2015), Idle Games: The Mechanics and Monetization of Self-Playing Games, GDC | https://gdcvault.com/play/1022066/Idle-Games-The-Mechanics-and | Not opened |
| Alharthi, Alsaedi, Toups, Tanenbaum and Hammer (2018), Playing to Wait: A Taxonomy of Idle Games, CHI | https://doi.org/10.1145/3173574.3174195 | Abstract |
| Stango and Zinman (2009), Exponential Growth Bias and Household Finance, J. Finance | https://doi.org/10.1111/j.1540-6261.2009.01518.x | Abstract |
| McKenzie and Liersch (2011), Misunderstanding Savings Growth, J. Marketing Research | https://doi.org/10.1509/jmkr.48.SPL.S1 | Abstract |
| Song (2020), Financial Illiteracy and Pension Contributions, Review of Financial Studies | https://doi.org/10.1093/rfs/hhz074 | Abstract |
| Goldstein, Hershfield and Benartzi (2016), The Illusion of Wealth and Its Reversal, J. Marketing Research | https://doi.org/10.1509/jmr.14.0652 | Abstract |
| Hershfield et al. (2011), Increasing Saving Behavior Through Age-Progressed Renderings of the Future Self, J. Marketing Research | https://doi.org/10.1509/jmkr.48.SPL.S23 | Abstract |
| Fernandes, Lynch and Netemeyer (2014), Financial Literacy, Financial Education, and Downstream Financial Behaviors, Management Science | https://doi.org/10.1287/mnsc.2013.1849 | Abstract |
| Kaiser, Lusardi, Menkhoff and Urban (2022), Financial education affects financial knowledge and downstream behaviors, J. Financial Economics | https://doi.org/10.1016/j.jfineco.2021.09.022 | Not opened |
| Lusardi, Samek, Kapteyn, Glinert, Hung and Heinberg (2017), Visual tools and narratives, J. Pension Economics and Finance | https://doi.org/10.1017/S1474747215000323 | Abstract. Author list from memory: unverified |
| Roussos and Dovidio (2016), Playing below the poverty line, Cyberpsychology | https://doi.org/10.5817/CP2016-2-3 | Abstract |
| Hinojosa et al. (2009), The Stock Market Game Study: Final Report, Learning Point Associates | https://finrafoundation.org/sites/finrafoundation/files/the_stock_market_game_1_0.pdf | Not opened (load failed) |
| Next Gen Personal Finance, Arcade | https://www.ngpf.org/arcade/ | Opened |
| Norton, Mochon and Ariely (2012), The IKEA effect, J. Consumer Psychology | https://doi.org/10.1016/j.jcps.2011.08.002 | Abstract |
| Lin, Mamykina, Lindtner, Delajoux and Strub (2006), Fish'n'Steps, UbiComp | https://doi.org/10.1007/11853565_16 | Not opened |
| Consolvo et al. (2008), Activity sensing in the wild: a field trial of UbiFit Garden, CHI | https://doi.org/10.1145/1357054.1357335 | Abstract |
| Harp and Mayer (1998), How seductive details do their damage, J. Educational Psychology | https://doi.org/10.1037/0022-0663.90.3.414 | Abstract |
| Sinha and Kapur (2021), When Problem Solving Followed by Instruction Works, Review of Educational Research | https://doi.org/10.3102/00346543211019105 | Abstract |
| Richland, Kornell and Kao (2009), The pretesting effect, J. Experimental Psychology: Applied | https://doi.org/10.1037/a0016496 | Abstract |
| Kim, Reinecke and Hullman (2017), Explaining the Gap, CHI | https://doi.org/10.1145/3025453.3025592 | Abstract |
| Kornell and Bjork (2008), Learning Concepts and Categories, Psychological Science | https://doi.org/10.1111/j.1467-9280.2008.02127.x | Abstract |
| Chi and Wylie (2014), The ICAP Framework, Educational Psychologist | https://doi.org/10.1080/00461520.2014.965823 | Abstract |
| Butterfield and Metcalfe (2001), Errors committed with high confidence are hypercorrected, JEP: LMC | https://doi.org/10.1037/0278-7393.27.6.1491 | Abstract |
| Wieman, Adams and Perkins (2008), PhET: Simulations That Enhance Learning, Science | https://doi.org/10.1126/science.1161948 | Abstract |
| Victor (2011), Explorable Explanations | https://worrydream.com/ExplorableExplanations/ | Opened |
| Case (2017), How I Make Explorable Explanations | https://blog.ncase.me/how-i-make-an-explorable-explanation/ | Opened |
| PC Gamer, The Making of Peggle | https://pcgamer.com/the-making-of-peggle/2 | Not opened (page cut off) |
| GamesRadar, Animal Crossing: New Horizons' April update reduces the interest rate on deposits | https://gamesradar.com/animal-crossing-new-horizons-april-update-reduces-the-interest-rate-on-deposits | Not opened; via search summaries |
| MDN, Web Audio API best practices | https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices | Opened |
| MDN, prefers-reduced-motion | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion | Opened |
| WebKit bug 285120 (haptics on switch inputs) | https://bugs.webkit.org/show_bug.cgi?id=285120 | Not opened; via search summaries |
| ios-haptics README (claim that the switch trick was patched in iOS 26.5) | https://unpkg.com/ios-haptics@3.1.1/README.md | Not opened; via search summaries |
