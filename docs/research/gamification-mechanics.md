# Gamification mechanics: what to prototype next

Date: 2026-11-13

## Method

Question: which gamification mechanics should this game prototype next, given no account, no server, no other players, and progress in localStorage.

Sources are primary only: peer-reviewed papers and meta-analyses, Duolingo's own blog and research papers, a first-person account by Duolingo's former product chief, Khan Academy's and Brilliant's own pages, and MDN, WebKit and Chrome documentation for platform facts. Each finding is marked with its strength:

- **Meta-analysis**: a quantitative synthesis of many studies.
- **Single study**: one paper, experiment or field study.
- **Company self-report**: a number a company published about its own product. Not independently checked. Duolingo reports relative changes from A/B tests on a very large user base, so small percentages are real for them and may not transfer to a small solo game.
- **Practitioner claim**: a stated reason with no number behind it.

How each source was read is listed in the Sources section. Where only the abstract was read, or the source could not be opened, the text says so. Where a sentence is my own inference and not a source's finding, it is labelled "Inference".

## 1. Answer

Prototype the mechanics that make the player return to do retrieval practice, and keep rewards informational. The strongest evidence in this whole field is for the learning methods the game already has: testing beats rereading (Roediger and Karpicke 2006) and spaced review beats massed review (Cepeda et al. 2006). So the first job of any new mechanic is to bring the player back on the day the Review is due and get the Fare and the Review done. A forgiving streak with a freeze is the best-evidenced return mechanic that works without a server (Duolingo self-reports; Silverman and Barasch 2023; Sharif and Shu 2017), and the freeze gives Coins something to buy. A Lesson-end summary, visible progress toward the next Badge, and personal bests are cheap, fit a solo offline game, and carry little risk. Do not build hearts, leaderboards, random chests, or loss-framed nagging: the evidence for them is weak or negative for learning, and several need other players or a server. Scheduled notifications are not possible on the web without a push server, so the game must do its reminding on screen when the player opens it.

## 2. Summary table

| Mechanic | Evidence strength | Helps return | Helps learning | Main risk | Fits a no-account offline game |
|---|---|---|---|---|---|
| Streak | Single studies plus company self-report | Yes (self-report, correlational and A/B) | Indirect only | Streak becomes the goal; a break lowers engagement | Yes |
| Streak freeze / repair | Single studies plus company self-report | Yes | Indirect | Too much slack empties the streak of meaning | Yes |
| Daily goal / XP target | Company self-report; goal-setting literature | Mixed: a high goal hurt streaks at Duolingo | Unknown | A hard goal breaks the habit it is meant to build | Yes |
| Hearts / lives | Company self-report (negative) | No evidence for | Negative for beginners | Punishes mistakes, which learning needs | Yes, but not advised |
| Levels and XP curves | Single study | Raises quantity of work | No effect on quality or intrinsic motivation found | Extrinsic incentive only | Yes |
| Quests / daily challenges | Company self-report | Not measured in sources opened | Depends on what the quest asks | Grinding easy content | Yes |
| Chests / variable rewards | No primary evidence opened for learning apps | Unknown | Unknown | Expected tangible rewards undermine interest (meta-analysis) | Yes, but not advised |
| Currency sink for Coins | Single study (slack with a cost) plus self-report | Through streak freeze | None direct | Hints for Coins would tax the weakest players | Yes |
| Perfect-Lesson and Combo bonuses | No direct evidence | Unknown | Risk of avoiding hard items | Rewards low error rate over learning | Yes |
| Mastery levels, decaying skills | Single study (Duolingo, mixed) | Mixed | Yes if it drives spaced retrieval | Players practise "to keep it gold", not what they need | Yes |
| Spaced-repetition surfacing | Meta-analysis plus single studies | Yes (Duolingo A/B) | Yes, strong | Review debt piling up | Yes |
| Progress visualisation | Single studies | Yes (goal gradient) | Indirect | Fake progress is a dark pattern if overdone | Yes |
| Badges / achievements | Single studies, mixed | Yes in some field studies | One RCT: yes, through more self-testing | Novelty wears off; no effect for many users | Yes |
| Leagues / leaderboards | Single studies plus company self-report | Yes at Duolingo | Negative in one classroom study | Social comparison lowers motivation; XP grinding | No (needs other players) |
| Personal bests, past-self ghost | Single study (chess) | Plausible | Unknown | Quitting after a new best | Yes |
| Session-end summary | Meta-analysis (positive feedback); no direct test | Unknown | Plausible, via accurate self-knowledge | Praise that is not informative | Yes |
| Sound, haptics, animation | Single study | Unknown | None shown | Cost without effect; haptics missing on iOS | Partly |
| Loss-aversion framing | Single studies | Short term yes | Unknown | Anxiety, guilt, distrust | Yes, but use sparingly |
| Notifications | Company self-report | Yes at Duolingo | Indirect | Not available without a server | No |

## 3. Findings per mechanic

### 3.0 The base rate: does gamification of learning work at all?

- Sailer and Homner (2020) pooled experiments on gamified learning and found small positive effects: cognitive outcomes g = .49 (k = 19, N = 1686), motivational g = .36 (k = 16, N = 2246), behavioural g = .25 (k = 9, N = 951). Only the cognitive effect was stable when restricted to high-rigor studies. Game fiction and competition combined with collaboration helped behavioural outcomes; for cognitive outcomes no moderator was clearly identified. **Meta-analysis.** https://doi.org/10.1007/s10648-019-09498-w
- Hamari, Koivisto and Sarsa (2014) reviewed empirical studies and concluded that gamification gives positive effects, but that the effects depend heavily on the context and on the users. **Literature review** (abstract read). https://doi.org/10.1109/HICSS.2014.377
- Deci, Koestner and Ryan (1999), 128 studies: rewards that are expected and contingent undermine free-choice intrinsic motivation (engagement-contingent d = -0.40, completion-contingent d = -0.36, performance-contingent d = -0.28). Positive feedback raises it (free-choice behaviour d = 0.33, self-reported interest d = 0.31). The studied rewards were mostly tangible (money, prizes). Coins and XP that buy nothing are closer to feedback than to a prize, but that is an inference, not a tested result. **Meta-analysis** (abstract read). https://doi.org/10.1037/0033-2909.125.6.627
- Ryan and Deci (2000): competence, autonomy and relatedness are the needs whose satisfaction supports self-motivation. **Theory review** (abstract read). https://doi.org/10.1037/0003-066X.55.1.68

Fit: the game is solo, so relatedness is out of reach. Mechanics should serve competence (clear, honest feedback) and autonomy (the Path already lets the player open any Unit).

### 3.1 Streaks

What it is: a count of consecutive days (or weeks) with at least one completed session.

Evidence:
- Duolingo: learners who reach a 7-day streak are 3.6 times more likely to complete their course (Mansur 2022) and 2.4 times more likely to return the next day (Yu 2020). Both are correlations; people who keep streaks differ from people who do not. **Company self-report.** https://blog.duolingo.com/how-duolingo-streak-builds-habit/ and https://blog.duolingo.com/improving-the-streak/
- Duolingo A/B test: separating the streak from the daily XP goal, so that one lesson extends the streak, gave +3.3% Day 14 retention and +1% daily active learners. A milestone animation gave +1.7% Day 7 retention for new learners. **Company self-report** (relative changes). Same two posts.
- Mazal, Duolingo's former product chief, notes that the link between a 10-day streak and lower drop-off was probably correlation and selection, and that the streak work still raised the share of daily users with a 7+ day streak to more than half. **Practitioner account.** https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth
- Silverman and Barasch (2023), seven studies: showing an intact streak raises later engagement compared with showing a broken one. The effect comes from how the log displays the behaviour, not from the behaviour itself. It is stronger when the person blames themselves for the break and weaker when the streak can be repaired. **Single paper, seven studies** (abstract read). https://doi.org/10.1093/jcr/ucac029
- Khan Academy chose a weekly streak that is extended only by getting a skill to proficient, not by merely opening a video, because that "better reflects meaningful learning". No numbers given. **Practitioner claim.** https://blog.khanacademy.org/?p=17224

Risk: the same paper that supports streaks shows the cost. A displayed broken streak lowers engagement, most of all when the player feels at fault. The player comes to treat the streak as the goal.

Fit: yes. A streak needs only a date in localStorage. Two things specific to this game: (1) the Review ladder is 1, 3, 7, 16, 35 days, so after the first weeks there is not something due every day, and a daily streak would ask for visits the learning schedule does not need; (2) the GLOSSARY reserves "streak" for a day count the game does not have, so adding one needs a glossary entry and a decision. Inference: a weekly rhythm (as Khan Academy uses) or a daily streak that a Review or one Lesson extends are both defensible; the prototype should compare them.

### 3.2 Streak freeze and repair

What it is: a held item that covers a missed day (freeze), or a way to restore a streak after a break (repair).

Evidence:
- Duolingo: letting learners hold two freezes instead of one raised daily active learners by +0.38%. **Company self-report.** https://blog.duolingo.com/how-duolingo-streak-builds-habit/
- Sharif and Shu (2017), six studies: goals with an "emergency reserve" (slack that has a cost to use) are preferred and lead to more persistence than goals with no slack, because people try not to spend the reserve. **Single paper** (abstract read, last lines of the abstract were cut off in the copy I read). https://doi.org/10.1509/jmr.15.0231
- Silverman and Barasch (2023): the drop after a broken streak is attenuated when the streak can be repaired. Same source as above.
- Brilliant holds a maximum of two Streak Charges, earned by completing a concept or practice, applied automatically on a missed day. No outcome data. **Practitioner design.** https://brilliant.org/help/using-brilliant/what-is-a-streak-charge

Risk: unlimited freezes make the streak meaningless. Both Duolingo and Brilliant cap at two.

Fit: yes, and it is the best-evidenced use for Coins (see 3.7).

### 3.3 Daily goal / daily XP target

Evidence:
- Duolingo found that learners on the highest daily goal were the least likely to hold a streak: almost 40% of learners who were active two days running with no streak had the "intense" goal. After the streak was decoupled from the goal, retention rose but fewer learners reached their daily goal. **Company self-report.** https://blog.duolingo.com/improving-the-streak/
- Goal-setting theory (Locke and Latham 2002) summarises 35 years of research in which specific, difficult goals outperform "do your best". **Review** (abstract read; the abstract does not state the effect sizes). https://doi.org/10.1037/0003-066X.57.9.705
- Duolingo's quality metric aims at learners spending at least 15 minutes a day, and found that total sessions and total time were poor proxies for learning. **Company self-report.** https://blog.duolingo.com/time-spent-learning-well/

Risk: the two findings pull apart. A harder goal may produce more work per day and fewer days.

Fit: yes. Inference: a Lesson here is 10 to 15 Points at about a minute each, so "one Lesson or the day's Review" is already a 10 to 15 minute goal. A separate XP target adds little.

### 3.4 Hearts or lives vs. no penalty

Evidence:
- Duolingo replaced Hearts (a mistake costs a heart) with Energy in 2025 and said Hearts were "not the most effective way to support learning", that beginners were twice as likely to run out mid-lesson, and that "mistakes are a natural part of learning". It says Energy helps more learners complete lessons, without a number. **Company self-report.** https://blog.duolingo.com/duolingo-energy/ (The Q2 2025 shareholder letter that reports the Energy results could not be opened: HTTP 403.)
- Mazal: a "moves counter" copied from a casual game took months to build and changed neither retention nor daily users. **Practitioner account.** Lenny's Newsletter link above.
- Karpicke and Roediger (2008): repeated testing after first success produced a large gain in delayed recall, and repeated study did not. A mechanic that ends the session on errors removes test trials. **Single study** (abstract read). https://doi.org/10.1126/science.1152408

Fit: technically easy, and not advised. The game's current design (wrong answer shows the Hint, missed Cards Return, a failed Fare redraws) already turns errors into more retrieval. Keep no penalty.

### 3.5 Levels and XP curves

Evidence:
- Mekler et al. (2017), online experiment (84 men and 178 women), image-tagging task: points, levels and leaderboards raised the number of tags but did not change intrinsic motivation, competence or tag quality. The authors conclude these elements worked as extrinsic incentives and did not harm intrinsic motivation in a short task. **Single study** (full text read). https://doi.org/10.1016/j.chb.2015.08.048
- Khan Academy added levels to split a course into smaller milestones, citing that chunked goals feel more achievable. No numbers. **Practitioner claim.** https://blog.khanacademy.org/?p=17224

Risk: more volume, same quality. Players may grind the cheapest XP. Duolingo saw this and had to re-weight XP toward new content (https://blog.duolingo.com/time-spent-learning-well/).

Fit: yes, low value. The game already chunks by Section, Circle and Lesson, and XP is paid only for lighting them. A level number on top repeats what the Path shows. GLOSSARY lists "level" as a word to avoid.

### 3.6 Quests / daily challenges

Evidence:
- Duolingo moved its Monthly Challenge from an XP total to quests because learners were "gaming the system to earn XP in bulk" at the end of the month. **Company self-report.** https://blog.duolingo.com/time-spent-learning-well/
- No experiment on the effect of daily quests on retention or learning was found in the sources opened.

Risk: a quest pays for whatever it names. "Earn 50 XP" invites grinding. "Clear today's Review" or "pass one Fare" pays for retrieval.

Fit: yes. A quest list is local state. It also needs a reward to pay, which today means Coins that buy nothing (see 3.7).

### 3.7 Chests and variable rewards

Evidence: I found no primary study of random reward chests in a learning product among the sources I could open. The common claim that variable-ratio rewards drive engagement rests on operant conditioning research that I did not open for this note, so it is not cited here. The nearest opened evidence is Deci, Koestner and Ryan (1999): expected rewards contingent on engaging or completing lower intrinsic interest.

Risk: a random payout is the element most associated with gambling-style design. In a game about financial independence, a slot-machine reward also contradicts the content.

Fit: possible offline, not advised. If a prototype wants surprise, an unannounced Card of praise or a short quote from the book at a milestone gives surprise without a randomised currency payout.

### 3.8 A currency sink for Coins

Coins are paid once per correct Check and once per Review step, and never decrease. Options and evidence:

- **Streak freeze.** Supported by Sharif and Shu (2017) and Duolingo's self-report (see 3.2). Duolingo sells a freeze refill for its own currency (a screenshot in the Mansur post shows 400 gems). This is the only sink with evidence behind it.
- **Cosmetics and themes.** No evidence opened for or against. They cost nothing in learning terms. Inference: a theme the player chooses serves autonomy without touching the learning loop.
- **Hints.** The Hint is currently free after one wrong answer. Charging Coins for it would put a price on feedback, and players with the fewest Coins are the ones who miss the most. Not advised. Inference.
- **Skipping or unlocking content.** The Path is already open. Nothing to sell.

Risk: because Coins never decrease and each is paid once, a sink turns a lifetime tally into a spendable balance. That changes the GLOSSARY definition ("Coins never decrease") and needs two numbers: earned and held.

### 3.9 Perfect-Lesson and Combo bonuses

Evidence: no study of perfect-lesson bonuses was found. Related evidence points both ways. Positive feedback on competence raises interest (Deci et al. 1999). But a reward for zero errors is a reward for avoiding difficulty, and retrieval that is hard is where the testing effect comes from (Roediger and Karpicke 2006). Duolingo's Energy system refills after correct answers in a row (https://blog.duolingo.com/duolingo-energy/), so it does use an in-a-row mechanic, with no published effect.

Risk: players may replay Lessons they already know to collect a perfect mark. The game's rule that a Coin is paid once per Check already blocks this for Coins.

Fit: yes, as feedback only. The Combo is already feedback only. A "first-try perfect" mark on a Lesson, paid once, is consistent with that.

### 3.10 Mastery levels, legendary levels, cracked or decaying skills

Evidence:
- Settles and Meeder (2016): Duolingo showed "strength meters" that decay over time on each skill. In a six-week experiment with just under 1 million students, a better memory model slightly raised overall activity and lowered practice sessions by 7.3%. The paper reports that students practised "just to keep the tree gold" even when practice did not target what they needed. A second experiment (3.3 million students, two weeks) raised daily retention by 12% for any activity, 1.7% for new lessons and 9.5% for practice. **Single study by the company's researchers** (full text read). https://aclanthology.org/P16-1174/
- Duolingo later removed cracked skills: on the path redesign, "practice is built into your path (so you won't have to worry about jumping around or going back to 'cracked' skills)". No outcome data given. **Practitioner claim.** https://blog.duolingo.com/new-duolingo-home-screen-design/

Risk: a decay display creates a chore ("keep it gold") that can crowd out new material, and the decay shown must be accurate or players stop trusting it.

Fit: yes, cautiously. The Deck already knows which Cards are on which step of the ladder. Inference: a Circle could show a quiet "Review due" mark derived from its Cards in the Deck, without ever un-lighting a Lit Station. Un-lighting would be a loss frame applied to earned progress.

### 3.11 Spaced-repetition surfacing

Evidence:
- Cepeda et al. (2006): a meta-analysis of 317 experiments. Spaced practice beats massed practice, and the best gap grows with the retention interval. **Meta-analysis** (abstract read). https://doi.org/10.1037/0033-2909.132.3.354
- Cepeda et al. (2008): over 1,350 participants, gaps up to 3.5 months, tests up to a year later. The optimal gap grows with the test delay, and shrinks as a proportion of it. **Single large study** (abstract read). https://doi.org/10.1111/j.1467-9280.2008.02209.x
- Roediger and Karpicke (2006): taking a test improved delayed retention more than restudying, although restudying made students more confident. **Single paper, two experiments** (abstract read). https://doi.org/10.1111/j.1467-9280.2006.01693.x
- Settles and Meeder (2016): better scheduling raised daily retention (numbers in 3.10).

Risk: a large due count is discouraging. The game caps Review at 20 a day, which limits this.

Fit: yes, and the highest-value item. The mechanism exists; what is missing is surfacing. Today nothing on the device tells the player a Review is due unless they open the game. See section 5 for what the platform allows.

### 3.12 Progress visualisation (Ring, Path, Section counts)

Evidence:
- Kivetz, Urminsky and Zheng (2006): people speed up as they near a reward (coffee cards, a song-rating site). A 12-stamp card with 2 stamps pre-filled was completed faster than a 10-stamp card. **Single paper, several field studies** (abstract read). https://doi.org/10.1509/jmkr.43.1.39
- Nunes and Dreze (2006): the "endowed progress effect". Reframing an 8-step task as a 10-step task with 2 steps done raises completion and shortens completion time. **Single paper** (abstract read). https://doi.org/10.1086/500480
- Duolingo's milestone animation (+1.7% Day 7 retention for new learners) is a progress-visualisation result. **Company self-report.**

Risk: artificial progress is a manipulation if the head start is fake. Showing true remaining distance ("2 Lessons to this book's Badge") uses the goal gradient honestly.

Fit: yes. Ring, Section progress count and Path exist. The gap is the "distance to next reward" cue at the moment of choosing whether to continue.

### 3.13 Achievements / Badges

Evidence:
- Denny et al. (2018), randomised experiment, n = 701: a badge system raised voluntary self-testing, and the extra activity produced a significant gain in exam scores. Points alone did not. The effect was concentrated in a relatively small group of students. **Single RCT** (abstract read). https://doi.org/10.1145/3173574.3173885
- Hamari (2017): a two-year field experiment on a trading service found users were more active after badges were introduced. **Single study. Not opened** (publisher page blocked); cited via search-result summaries of the abstract. https://doi.org/10.1016/j.chb.2015.03.036
- Duolingo redesigned achievements in 2023 because the old ones were "badges buried in the profile page", and added "personal record" achievements. No numbers. **Practitioner claim.** https://blog.duolingo.com/achievement-badges/

Risk: badges move a minority. A Badge per book rewards finishing, which is the right behaviour here.

Fit: yes, already present. The evidence favours badges for self-testing behaviour (for example a Badge tied to Review steps climbed) over badges for volume.

### 3.14 Leagues and leaderboards, and solo substitutes

Evidence:
- Mazal: leaderboards raised overall learning time at Duolingo by 17% and tripled the number of highly engaged learners. **Practitioner account of company data.**
- Duolingo later reported that XP grinding on leaderboards made competition feel "unfair" to learners working on content. **Company self-report.** https://blog.duolingo.com/time-spent-learning-well/
- Hanus and Fox (2015): in a 16-week classroom study, the course with a leaderboard and badges ended with lower motivation, satisfaction and empowerment, and lower final exam scores, than the same course without them. **Single study. Not opened** (publisher returned HTTP 403); cited via library-catalogue copies of the abstract surfaced by search. Sample size not verified by me. https://doi.org/10.1016/j.compedu.2014.08.019
- Landers, Bauer and Callan (2017): a leaderboard on a brainstorming task worked like a difficult goal. **Single study. Not opened**; cited via search-result summaries. https://doi.org/10.1016/j.chb.2015.08.008
- Sailer and Homner (2020): competition combined with collaboration beat no social interaction for behavioural outcomes.

Solo substitute:
- Anderson and Green (2018): in 133 million online chess games, players exert effort to set a new personal best rating and tend to quit once they have set one. Personal bests act as reference points, in a way consistent with loss aversion. **Single study** (abstract read). https://doi.org/10.1073/pnas.1706530115
- Duolingo added "personal record" achievements (most XP in a day, longest streak). No outcome data.

Fit: a real leaderboard needs other players and a server: no. Fake opponents would be a deception. Personal bests fit fully. The chess finding carries a warning: a new best is also a natural stopping point.

### 3.15 Session-end celebration and summary screens

Evidence: no experiment isolating an end-of-lesson summary screen was found. Supporting findings:
- Positive, informative feedback raises intrinsic motivation (Deci et al. 1999, d = 0.33 on free-choice behaviour).
- Students' predictions of their own recall were uncorrelated with their actual recall (Karpicke and Roediger 2008), and restudy raises confidence more than it raises retention (Roediger and Karpicke 2006). A summary that states what was missed and when it returns corrects the player's self-estimate. Inference from those two findings.
- Duolingo's streak milestone animation is a session-end celebration with a measured effect (+1.7% Day 7 retention, new learners). **Company self-report.**

Fit: yes. The Lesson end is where the game already pays 10 XP. A summary can say: first-try right answers, Cards added to the Deck, the date the Review is next due, and distance to the next Badge.

### 3.16 Sound, haptics, animation ("juice")

Evidence:
- Hicks et al. (2019), two studies (40 and 32 participants): visual embellishments improved the visual appeal of all games tested, and affected felt competence only under specific circumstances. The authors note that empirical support for "juiciness" was lacking. **Single paper** (abstract read). https://doi.org/10.1145/3311350.3347171

Platform: `navigator.vibrate()` needs a user gesture in Chrome, is disabled in Firefox for Android, and is not supported in Safari, so there are no web haptics on iPhone (MDN compat data, see section 5).

Fit: partly. Sound exists and has a switch in Profile. Animation is cheap. Haptics reach Android Chrome only.

### 3.17 Loss-aversion framing

Evidence:
- Levitt, List, Neckermann and Sadoff (2016): in school field experiments, immediate rewards raised test effort; there was "suggestive evidence" that rewards framed as losses beat rewards framed as gains; all effect vanished when the reward was delayed. **Single paper** (abstract read). https://doi.org/10.1257/pol.20130358
- Anderson and Green (2018): effort around personal bests fits loss aversion.
- Silverman and Barasch (2023): a broken streak attributed to oneself lowers engagement most.
- Yancey and Settles (2020) list a "streak wager reminder" among Duolingo's notification templates, so Duolingo does use loss-framed reminders. The paper does not report the effect of loss framing by itself.

Risk: the evidence for loss framing is "suggestive" at best, and the evidence for harm after a loss is direct. Loss framing is the main source of streak guilt.

Fit: possible, use sparingly. One honest line on the day a streak would end is information. Repeated warnings are pressure.

### 3.18 Notifications

Evidence:
- Yancey and Settles (2020): optimising the wording of daily reminder notifications gave +0.5% daily active users and +2% new-user retention over a strong baseline. They also found that a template loses effect when repeated and recovers when rested. **Single study by company researchers** (full text read). https://research.duolingo.com/papers/yancey.kdd20.pdf
- Mazal describes notification work as "dozens of small- and medium-size wins" and warns that overuse destroys the channel.

Fit: no, for scheduled reminders. Details in section 5.

## 4. What backfires

1. **Expected rewards for merely showing up.** Engagement-contingent rewards lower free-choice interest (d = -0.40) and completion-contingent ones do too (d = -0.36) (Deci, Koestner and Ryan 1999, meta-analysis). The classic field experiment is Lepper, Greene and Nisbett (1973) on children's drawing; I did not open it beyond the first line of its abstract. Design reading: pay for correct retrieval and finished Lessons, as the game does now, and avoid login bonuses.
2. **Leaderboards and badges in a class.** Lower motivation and lower exam scores over 16 weeks (Hanus and Fox 2015, single study, not opened by me).
3. **More quantity, same quality.** Points, levels and leaderboards raised output count and nothing else (Mekler et al. 2017).
4. **Gaming the metric.** Duolingo's learners bulk-earned XP for monthly challenges and leaderboards; shorter lessons raised lesson counts and lowered the learning metric (Duolingo, Time Spent Learning Well post). Students practised "just to keep the tree gold" (Settles and Meeder 2016).
5. **Penalising mistakes.** Beginners ran out of Hearts twice as often; Duolingo dropped the system (Duolingo Energy post).
6. **Goals set too high.** The "intense" daily goal went with losing the streak (Yu 2020).
7. **Broken streaks.** A displayed break lowers later engagement, most when self-blamed (Silverman and Barasch 2023).
8. **Reward systems that feel wrong.** In a two-week field study of the gamified task manager Habitica, participants reported counterproductive effects, and how inappropriate they found the reward system predicted their change in motivation (Diefenbach and Mussig 2019, single study, **not opened**: the university repository refused the connection; cited via search-result summaries). https://doi.org/10.1016/j.ijhcs.2018.09.004
9. **Novelty and wear-out.** Reminder wording loses effect with repetition (Yancey and Settles 2020). Sailer and Homner found motivational and behavioural effects less stable than cognitive ones.
10. **Copying a mechanic without its reason.** The moves counter cost months and changed nothing (Mazal 2023).

On anxiety and dark patterns: I found no primary study that measures anxiety caused by streaks in a learning app. The claim is common in commentary, which this note does not cite. The nearest primary evidence is items 7 and 8.

## 5. What the web platform allows without a server

| Capability | Status | What it means here | Source |
|---|---|---|---|
| Show a notification now | `ServiceWorkerRegistration.showNotification()` is widely available. It shows the notification immediately when called. MDN lists no option to schedule one. On iOS the `Notification` interface exists only in a web app saved to the home screen (16.4+). | The game can notify only while its own code is running, which is when the player is already there. | https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification ; MDN browser-compat-data `api/Notification.json` |
| Notification Triggers (schedule a local notification) | Chrome's page states: "The development of Notification Triggers API, part of Google's capabilities project, has ended." Origin trial complete, launch not started. | Not available. There is no local scheduled notification on the web. | https://developer.chrome.com/docs/web-platform/notification-triggers |
| Web Push | Supported in Chrome, Firefox, Safari 16+ on macOS, and iOS 16.4+ for home-screen web apps only. Push messages are sent by a server. | Needs a push server and a subscription. Outside this game's rules. | MDN browser-compat-data `api/PushManager.json`; https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/ (I did not open the MDN Push API page itself.) |
| Periodic Background Sync | Experimental. Chrome 80+ and Edge only; not Firefox, not Safari. In Chrome the permission is granted only to an installed web app, and the browser uses the site's engagement score to decide whether and how often to fire. Fires only with network connectivity. | Could wake the service worker roughly daily on installed Chrome/Edge to refresh an app badge. Not on iPhone, not guaranteed, not offline. Whether a notification may be shown from this event is not stated by MDN and was not tested. | https://developer.mozilla.org/en-US/docs/Web/API/Web_Periodic_Background_Synchronization_API ; compat data `api/PeriodicSyncManager.json` |
| Badging API (number on the app icon) | Chrome/Edge desktop 81+ (Windows, macOS; ChromeOS 91+), Safari 17 on macOS for installed apps, iOS 16.4+ for home-screen apps. Not Chrome for Android, not Firefox. Callable from page or service worker. | The badge can only be set while game code runs. The game can set it on exit to the number of Cards due, but cannot update it tomorrow without Periodic Background Sync. | https://developer.mozilla.org/en-US/docs/Web/API/Badging_API ; compat data `api/Navigator.json` (setAppBadge) |
| Vibration | Chrome (needs a user gesture). Disabled in Firefox for Android. Not in Safari. | Haptics on Android Chrome only. | https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate ; compat data `api/Navigator.json` (vibrate) |
| Storage durability | Default storage is "best-effort". Safari deletes script-written data (localStorage included) for an origin with no user interaction in the last seven days of browser use. WebKit says home-screen web apps have their own counter and it does not expect their data to be deleted. `navigator.storage.persist()` asks for persistent storage; Chrome and Safari decide silently from interaction history, Firefox asks the user. | A streak, Coins and the Deck all live in localStorage. A Safari-tab player who stays away 7 days of browser use can lose everything, not only the streak. Install, `persist()`, and the existing backup matter more once a streak exists. | https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria ; https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ ; https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist |

Consequences (inference from the table):

- Reminding has to happen inside the game: a "Review due" state on the Path, on Continue and in the Rail, and a Lesson-end screen that names the next due date. That is the substitute for push.
- The day boundary and the streak are computed from the device clock. A player can cheat by changing the clock. With no other players, nobody else is harmed.
- Any streak design must survive data loss gracefully, because the platform can delete the data. The backup file already carries progress; a streak should travel in it.
- A calendar reminder the player sets themselves is the only scheduled prompt available. That is a design idea, not a finding.

## 6. Ranked shortlist for this game

1. **Lesson-end summary.** Why: it is the cheapest place to give informative feedback, which is the one reward type the meta-analysis shows raising interest. Design question: does naming the missed Cards and the next Review date on this screen raise the share of players who start the next due Review?
2. **Review surfacing.** Why: spacing and testing have the strongest evidence in this note, and the game has the mechanism without a way to call the player back. Design question: which on-screen cue (Path banner, Continue pointing at Review first, app-icon badge where supported) gets due Reviews done on the due day?
3. **Forgiving streak.** Why: the best-evidenced return mechanic that needs no server. Design question: does a weekly rhythm fit the 1/3/7/16/35 ladder better than a daily count, and what should extend it: a passed Fare, a finished Review, or either?
4. **Streak freeze bought with Coins.** Why: slack with a cost raises persistence, repair softens the damage of a break, and Coins get a purpose. Design question: what price and cap (two held, as Duolingo and Brilliant use) keep the freeze valued without making the streak unbreakable?
5. **Distance-to-reward cues.** Why: effort rises near a goal, and the game has Badges and Rings to point at. Design question: does "2 Lessons to this Badge" on the Lesson pop-up and summary raise Section completion, using true distances only?
6. **Personal bests.** Why: the only solo substitute for a leaderboard with evidence behind it. Design question: which records reward learning (longest Combo, most Review steps climbed in a week, first-try Fare passes) without rewarding replay of easy Lessons?
7. **Review-due mark on Circles.** Why: it ties mastery display to the Deck without un-lighting earned progress. Design question: can a quiet due mark prompt Review without recreating the "keep it gold" chore Duolingo reported?
8. **One daily goal equal to the streak condition.** Why: Duolingo's data says a small goal sustains a habit and a large one breaks it. Design question: is "one Lesson or today's Review" enough, or does a second optional stretch goal help without lowering return days?
9. **Badges for retrieval behaviour.** Why: the one RCT linking badges to exam scores worked through more self-testing. Design question: do Badges for Review milestones (for example 25 Cards graduated from the Deck) increase Reviews done, compared with book Badges alone?
10. **First-try perfect mark on a Lesson.** Why: it makes the existing Combo and Coin rules visible at Lesson level at almost no cost. Design question: does a once-only perfect mark motivate care, or does it make players avoid Lessons they expect to fail?
11. **Quests that name learning acts.** Why: quests direct effort to whatever they name, so they can aim at Review and Fares. Design question: do two or three quests a day add return visits beyond the streak, or only add clutter?
12. **Juice pass on Fare pass and Badge.** Why: it improves appeal reliably and little else, so it belongs last. Design question: do sound and animation at these two moments change anything measurable in a playtest diary, given no haptics on iPhone?

Not recommended: hearts or any mistake penalty, leaderboards or simulated opponents, random chests, selling Hints, un-lighting Lit Stations, and any plan that depends on scheduled notifications.

## 7. Sources

"Full text" means I read the paper or page. "Abstract" means I read the publisher's abstract through Crossref, OpenAlex or Europe PMC metadata, because the publisher page blocked automated reading. "Not opened" means the claim rests on search-result summaries of the abstract and should be re-checked before it carries a decision.

| Source | URL | Opened |
|---|---|---|
| Sailer and Homner (2020), The Gamification of Learning: a Meta-analysis, Educational Psychology Review 32 | https://doi.org/10.1007/s10648-019-09498-w | Full text (PDF) |
| Hamari, Koivisto and Sarsa (2014), Does Gamification Work?, HICSS | https://doi.org/10.1109/HICSS.2014.377 | Abstract |
| Deci, Koestner and Ryan (1999), Psychological Bulletin 125(6) | https://doi.org/10.1037/0033-2909.125.6.627 | Abstract |
| Ryan and Deci (2000), American Psychologist 55(1) | https://doi.org/10.1037/0003-066X.55.1.68 | Abstract (as summarised by the fetch tool from Europe PMC) |
| Lepper, Greene and Nisbett (1973), J. Personality and Social Psychology | https://doi.org/10.1037/h0035519 | Not opened (first line of abstract only) |
| Hanus and Fox (2015), Computers and Education 80 | https://doi.org/10.1016/j.compedu.2014.08.019 | Not opened (HTTP 403); via search summaries |
| Mekler, Bruhlmann, Tuch and Opwis (2017), Computers in Human Behavior 71 | https://doi.org/10.1016/j.chb.2015.08.048 | Full text (author copy PDF) |
| Landers, Bauer and Callan (2017), Computers in Human Behavior 71 | https://doi.org/10.1016/j.chb.2015.08.008 | Not opened; via search summaries |
| Hamari (2017), Do badges increase user activity?, Computers in Human Behavior 71 | https://doi.org/10.1016/j.chb.2015.03.036 | Not opened; via search summaries |
| Denny, McDonald, Empson, Kelly and Petersen (2018), CHI | https://doi.org/10.1145/3173574.3173885 | Abstract |
| Diefenbach and Mussig (2019), Int. J. Human-Computer Studies 127 | https://doi.org/10.1016/j.ijhcs.2018.09.004 | Not opened (connection refused); via search summaries |
| Settles and Meeder (2016), A Trainable Spaced Repetition Model for Language Learning, ACL | https://aclanthology.org/P16-1174/ | Full text (PDF) |
| Yancey and Settles (2020), A Sleeping, Recovering Bandit Algorithm for Optimizing Recurring Notifications, KDD | https://research.duolingo.com/papers/yancey.kdd20.pdf | Full text (PDF; abstract and results tables read) |
| Cepeda, Pashler, Vul, Wixted and Rohrer (2006), Psychological Bulletin 132(3) | https://doi.org/10.1037/0033-2909.132.3.354 | Abstract (summarised from Europe PMC) |
| Cepeda, Vul, Rohrer, Wixted and Pashler (2008), Psychological Science 19(11) | https://doi.org/10.1111/j.1467-9280.2008.02209.x | Abstract (summarised from Europe PMC) |
| Roediger and Karpicke (2006), Psychological Science 17(3) | https://doi.org/10.1111/j.1467-9280.2006.01693.x | Abstract (summarised from Europe PMC) |
| Karpicke and Roediger (2008), Science 319 | https://doi.org/10.1126/science.1152408 | Abstract |
| Silverman and Barasch (2023), J. Consumer Research 49(6) | https://doi.org/10.1093/jcr/ucac029 | Abstract |
| Sharif and Shu (2017), J. Marketing Research | https://doi.org/10.1509/jmr.15.0231 | Abstract (end truncated) |
| Kivetz, Urminsky and Zheng (2006), J. Marketing Research 43(1) | https://doi.org/10.1509/jmkr.43.1.39 | Abstract |
| Nunes and Dreze (2006), J. Consumer Research | https://doi.org/10.1086/500480 | Abstract |
| Anderson and Green (2018), PNAS | https://doi.org/10.1073/pnas.1706530115 | Abstract |
| Levitt, List, Neckermann and Sadoff (2016), AEJ: Economic Policy | https://doi.org/10.1257/pol.20130358 | Abstract |
| Locke and Latham (2002), American Psychologist 57(9) | https://doi.org/10.1037/0003-066X.57.9.705 | Abstract |
| Hicks, Gerling, Dickinson and Vanden Abeele (2019), Juicy Game Design, CHI PLAY | https://doi.org/10.1145/3311350.3347171 | Abstract |
| Duolingo blog, Mansur (2022), The habit-building research behind your Duolingo streak | https://blog.duolingo.com/how-duolingo-streak-builds-habit/ | Opened |
| Duolingo blog, Yu (2020), Improving the streak | https://blog.duolingo.com/improving-the-streak/ | Opened |
| Duolingo blog (2025), Why Duolingo switched to Energy | https://blog.duolingo.com/duolingo-energy/ | Opened |
| Duolingo blog, Munson et al. (2022), home screen redesign | https://blog.duolingo.com/new-duolingo-home-screen-design/ | Opened |
| Duolingo blog, Salvador (2024), Time Spent Learning Well | https://blog.duolingo.com/time-spent-learning-well/ | Opened |
| Duolingo blog, Shuttleworth (2023), Achievements | https://blog.duolingo.com/achievement-badges/ | Opened |
| Duolingo blog, Shuttleworth (2024), 5 product lessons from Friend Streak | https://blog.duolingo.com/product-lessons-friend-streak/ | Opened; not used (social feature) |
| Duolingo Q2 2025 shareholder letter | https://investors.duolingo.com/static-files/0b55110c-2eb9-466d-8549-5459e0851290 | Not opened (HTTP 403); no claim rests on it |
| Mazal (2023), How Duolingo reignited user growth (first-person account by Duolingo's former CPO, published on Lenny's Newsletter) | https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth | Opened |
| Khan Academy blog, De Angulo (2024), streaks and levels | https://blog.khanacademy.org/?p=17224 | Opened |
| Brilliant help, What is a Streak Charge? | https://brilliant.org/help/using-brilliant/what-is-a-streak-charge | Opened. No Brilliant post on design rationale or results was found. |
| MDN, showNotification() | https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification | Opened |
| MDN, Web Periodic Background Synchronization API | https://developer.mozilla.org/en-US/docs/Web/API/Web_Periodic_Background_Synchronization_API | Opened |
| MDN, Badging API | https://developer.mozilla.org/en-US/docs/Web/API/Badging_API | Opened |
| MDN, Navigator.vibrate() | https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate | Opened |
| MDN, StorageManager.persist() | https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist | Opened |
| MDN, Storage quotas and eviction criteria | https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria | Opened |
| MDN browser-compat-data (PeriodicSyncManager, Navigator, Notification, PushManager) | https://github.com/mdn/browser-compat-data/tree/main/api | Opened (raw JSON, read 2026-11-13) |
| Chrome for Developers, Notification Triggers | https://developer.chrome.com/docs/web-platform/notification-triggers | Opened |
| WebKit blog, Web Push for Web Apps on iOS and iPadOS | https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/ | Opened |
| WebKit blog, Full Third-Party Cookie Blocking and More (7-day storage cap) | https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ | Opened |

Gaps: no primary evidence was found for chests or variable rewards in learning products, for perfect-lesson bonuses, for session-end summary screens in isolation, or for streak-caused anxiety. Brilliant has published feature descriptions and no results. Four papers (Hanus and Fox, Landers et al., Hamari 2017, Diefenbach and Mussig) could not be opened and are marked as such where cited.
