# Gamification evidence: what the science says

Date: 2026-11-14

## Method

Question: what do peer-reviewed studies and meta-analyses say about gamification in learning and behaviour change, and what follows for this game?

This is the second research pass. The first pass is `gamification-mechanics.md`. It covered each mechanic and the Duolingo data. This note does not repeat it. Where a paper from the first pass appears again, it is because I could now read more of it.

The game: one player, no account, no server, no push notifications, progress in localStorage. Already built: Coins per right answer with a Combo, a chest at the end of a Lesson, a day streak with a freeze bought with Coins, three daily quests, spaced Review, a Recap per Section.

How I read each source is marked:

- **Full text**: I read the paper or a working-paper copy of it.
- **Abstract**: I read the publisher's abstract through OpenAlex, Crossref or Semantic Scholar metadata.
- **Summary only**: the abstract was not served to me. I saw it only through search-result summaries. Treat as unverified until re-checked.
- **Unverified**: a claim from memory or from commentary that I could not confirm. Do not let it carry a decision.

Evidence strength is marked per finding: meta-analysis, review, single study, small sample.

A note on effect sizes. g and d are standardised mean differences. Roughly: 0.2 is small, 0.5 is medium, 0.8 is large. In field trials of education, 0.2 is already a good result (Kaiser et al. 2022 use this scale).

## 1. Short answer

Gamification of learning works on average, with a small to medium effect. The effect is biggest in the first week and shrinks over months. It is weaker for adults learning online than for school children in class. That is the exact setting of this game, so expectations should be modest.

Three things in the evidence are solid enough to design on:

1. Feedback that tells the player how good they are raises motivation. Rewards that are expected, loosely tied to performance and given for a task the player already likes can lower it.
2. Game features can be built to feed the sense of competence and of choice. Those two needs predict enjoyment and return in single-player games.
3. Financial education changes knowledge by about 0.2 SD and behaviour by about 0.1 SD. Knowledge fades within six months unless it is used. Teaching close to a real decision and teaching simple rules work better than teaching more content.

Three things are weaker than the industry believes:

1. Variable rewards. The one controlled app trial I could read found no difference from fixed rewards.
2. Loss framing. It worked in one good trial and stopped working when the incentive ended. A review argues loss aversion is not a general law.
3. Narrative. It raises motivation in some studies and does nothing for learning in others. It works when the story and the content are the same thing.

## 2. Findings

### A. Does gamification of learning work, and how much?

**Finding 1. The average effect on learning is positive, small to medium.**
- Evidence: five meta-analyses. Sailer and Homner (2020): g = .49 for cognitive outcomes (first pass, full text). Huang et al. (2020): g = .464, CI [.244, .684], 30 studies, N = 3,083. Bai, Hew and Huang (2020): g = 0.504, CI [0.284, 0.723], 30 interventions, 3,202 participants. Zeng et al. (2024): g = 0.782, 22 studies. Li, Ma and Shi (2023): g = 0.822, 49 samples.
- Strength: meta-analysis, several. The stricter pools give about 0.5. The two newest give about 0.8, and I trust them less. The Li table includes one study with g = 35.2 and a design-element row of g = -3.16 from one study. Those are not believable values. Sailer and Homner found only the cognitive effect stable in high-rigor studies.
- Design: game elements are worth having. Plan for a small gain, not a large one. No single element will rescue weak content.

**Finding 2. The effect on behaviour and feelings is also positive, and less stable.**
- Evidence: Ritzhaupt et al. (2021): affective g = 0.574 (19 studies, N = 1,974), behavioural g = 0.740 (13 studies, N = 1,596). Kim and Castelli (2021): d = 0.48, CI [0.33, 0.62], on behaviour change. Looyestyn et al. (2017), adults in online programs: 12 of 15 studies found a significant positive effect on engagement, 10,499 participants.
- Strength: meta-analysis and systematic review. Ritzhaupt read as summary only. The others as abstract.
- Design: expect game elements to raise how much the player does more surely than how well they learn. Check that the extra activity is retrieval, not tapping.

**Finding 3. Adults learning online gain least.**
- Evidence: Li, Ma and Shi (2023), moderator tables. Higher education g = 0.014, CI [-0.263, 0.291], k = 8. Secondary school g = 0.869. Elementary g = 1.293. Online learning g = 0.340, CI [-0.131, 0.812], not significant. Hybrid g = 0.863. Kim and Castelli report the opposite direction for adults (0.95 against 0.92 for K-12), on behaviour, not learning.
- Strength: meta-analysis, moderator analysis, small k, two reviews disagree. The Li paper's text and table also disagree with each other on which group got which value. Low confidence.
- Design: do not assume results from classrooms and children carry over. An adult alone with a browser tab is the hardest case. Keep sessions short and the first Lesson strong.

**Finding 4. Single elements work on their own. More elements do not simply add up.**
- Evidence: Mazarakis and Brauer (2022), online experiment, 505 people, up to 190 multiple-choice questions, told to stop when it stopped being fun. Progress bar, narrative, feedback and badges each raised the number of questions answered. Not every combination added more.
- Strength: single study, good sample. The task is very close to this game: voluntary quiz questions.
- Design: the game already has many elements. Before adding one, ask what the last one added. A clear progress bar and answer feedback do much of the work.

**Finding 5. Each element feeds a different need.**
- Evidence: Sailer et al. (2017), randomised study in an online simulation. Badges, leaderboards and performance graphs raised competence satisfaction and felt task meaning. Avatars, a meaningful story and (simulated) teammates raised relatedness. No element raised felt freedom of decision. Xi and Hamari (2019), survey of 824 users: achievement features were the strongest predictor of both competence and autonomy satisfaction.
- Strength: one RCT, one survey. Sample size of the RCT not in the abstract.
- Design: a performance graph is a competence tool that needs no other players. Show the player's own curve: first-try accuracy per Section, Cards moved up the Review ladder.

**Finding 6. Full learning games help learning a little and do not beat normal teaching on motivation.**
- Evidence: Wouters et al. (2013): serious games against conventional instruction, learning d = 0.29, retention d = 0.36, motivation d = 0.26 and not significant (77 learning comparisons, N = 5,547). Games did better with several sessions and when paired with other instruction. Clark, Tanner-Smith and Killingsworth (2016): g = 0.33 for games against non-game conditions, and g = 0.34 for a better-designed game against a plain game. Sitzmann (2011): simulation games gave 9% to 14% higher knowledge and retention, with strong evidence of publication bias. They worked when the material was active, when access was unlimited, and when the game was a supplement.
- Strength: three meta-analyses, abstracts read.
- Design: design quality matters as much as the choice to use a game at all. Keep retrieval active on every screen. Many short sessions beat one long one, which fits spaced Review.

### B. Self-determination theory in a single-player app

**Finding 7. In single-player games, competence and autonomy predict enjoyment and wanting to play again.**
- Evidence: Ryan, Rigby and Przybylski (2006), four studies. Studies 1 to 3 had people play 1, 2 and 4 games. Felt competence and autonomy went with enjoyment, preference and a rise in well-being. Relatedness was tested only in study 4, a survey of a multiplayer community. Przybylski, Rigby and Ryan (2010) review later work on the same model.
- Strength: single paper with four studies, plus a review. First page of full text read; sample sizes not on it.
- Design: a solo game can still meet two of the three needs. Put the effort there. Do not fake the third with invented opponents.

**Finding 8. Features built for competence and autonomy cause those feelings, and those feelings cause the motivation.**
- Evidence: Peng et al. (2012), 2 x 2 experiment on a game with autonomy features on or off and competence features on or off. Each feature set raised its own need satisfaction. Need satisfaction mediated enjoyment, motivation for future play and effort.
- Strength: single experiment. Abstract read. The game was an exercise game, not a learning game.
- Design: competence features are clear goals, feedback matched to skill, and difficulty that adapts. Autonomy features are real choices. The open Path and a choice of what to review are autonomy features. Keep them.

**Finding 9. Choice raises intrinsic motivation, even when the choice does not matter for learning.**
- Evidence: Patall, Cooper and Robinson (2008), meta-analysis of 41 studies. Choice raised intrinsic motivation, effort, performance and felt competence. The effect was strongest for choices that were not about the instruction, for 2 to 4 choices in a row, and when no reward followed the choice. It was stronger for children than adults.
- Strength: meta-analysis. Abstract read.
- Design: give a few small choices: a theme, which Section to open next, which quest to take. Two to four options, not a long menu. Do not attach a Coin payout to the act of choosing.

**Finding 10. Reward-driven motivation does not predict performance or persistence. Personal value does.**
- Evidence: Howard et al. (2021), meta-analysis, 344 samples, 223,209 students. Intrinsic motivation went with success and well-being. Identified regulation (I do this because it matters to me) was the type most strongly tied to persistence. Introjected motives (guilt, ego) went with persistence but also with ill-being. External regulation (to get rewards, to avoid punishment) was not tied to performance or persistence and went with lower well-being.
- Strength: large meta-analysis of correlations. Students, not adult self-learners. Abstract read.
- Design: this is the central finding for a game about financial independence. The player came with a personal reason. Keep that reason on screen. A streak kept from guilt is the introjected kind: it holds people and makes them feel worse.

**Finding 11. Outside pressure lowers need satisfaction unless the person has made the goal their own.**
- Evidence: Mitchell, Schuster and Jin (2020), survey of 291 employees using workplace gamification.
- Strength: single survey, correlational, work setting. Weak.
- Design: supports Finding 10. Say why each Lesson matters for the player's own money.

### C. The overjustification effect: when rewards harm

**Finding 12. An expected reward for doing something enjoyable lowers later interest. An unexpected one does not.**
- Evidence: Lepper, Greene and Nisbett (1973), field experiment with preschool children who liked drawing. Children promised an award later chose to draw less than children given a surprise award or none.
- Strength: single classic study with children. Abstract read. Sample size not in the abstract.
- Design: the chest at the end of every Lesson is an expected reward. A reward the player did not see coming is the safer kind. Use surprise for praise, sparingly.

**Finding 13. Both sides of the long dispute agree on where the harm sits.**
- Evidence: Deci, Koestner and Ryan (1999, 2001) found tangible rewards undermine intrinsic motivation. Cameron, Banko and Pierce (2001) re-ran the meta-analysis and found no general harm. But Cameron et al. also found negative effects on high-interest tasks when rewards are tangible, expected and loosely tied to level of performance. They found verbal rewards help, rewards on low-interest tasks help, and rewards tied to level of performance do not harm.
- Strength: competing meta-analyses of more than 100 experiments. Abstracts read.
- Design: tie Coins tightly to correct answers, as now. Never pay for just showing up. Use praise that names what the player did. For dull but needed work, such as a long Review, a reward is safe.

**Finding 14. Incentives buy quantity. Intrinsic motivation buys quality.**
- Evidence: Cerasoli, Nicklin and Ford (2014), meta-analysis, 183 samples, N = 212,468. Intrinsic motivation predicted performance with or without incentives. It mattered less when incentives were tied directly to performance, a crowding-out pattern. Intrinsic motivation explained more of quality. Incentives explained more of quantity.
- Strength: meta-analysis. Abstract read.
- Design: learning is a quality task. Coins and the Combo will raise the number of Checks answered. They will not raise care. Quests should ask for quality acts (pass a Fare first try, clear Review), not counts.

**Finding 15. The undermining effect has been shown in the brain, and incentive effects fade when the incentive stops.**
- Evidence: Murayama et al. (2010), lab study with brain imaging: people paid for performance chose the task less often afterwards, and reward-related brain activity fell. Gneezy, Meier and Rey-Biel (2011), review: incentives can work in the short term and still weaken the motive later. Patel et al. (2016): steps fell in every incentive group once payment stopped.
- Strength: one small lab study (sample size not in the abstract), one narrative review, one RCT.
- Design: never remove a reward the player has come to expect without a reason. Changing the Coin rate downward is a hidden reward removal.

### D. Variable versus fixed rewards

**Finding 16. An uncertain reward can motivate more than a sure one, while the person is working toward it.**
- Evidence: Shen, Fishbach and Hsee (2015), four studies with real rewards. People worked harder for a 50/50 chance of $2 or $1 than for a sure $2. The effect appeared only when people focused on the process, not on the outcome.
- Strength: single paper, four lab studies, money rewards. Abstract read.
- Design: uncertainty adds a little excitement during the Lesson. It is not a reason to make rewards random in value. If the chest varies, vary what kind of thing is in it, not how much the player is paid.

**Finding 17. The one controlled app trial found no difference between fixed and variable schedules.**
- Evidence: Nuijten et al. (2021), six-week, three-arm randomised trial of a health app, N = 61. Fixed rewards, variable rewards with immediate payout and variable rewards with delayed payout gave similar engagement.
- Strength: single study, small sample, real money rewards. Abstract read.
- Design: do not expect a random chest to raise return visits. The common claim that variable-ratio rewards are far more engaging rests on animal and gambling research that I did not open. **Unverified** for learning apps.

**Finding 18. Paid random rewards are linked to problem gambling.**
- Evidence: Zendle and Cairns (2018), survey of 7,422 gamers. Spending on loot boxes was linked to problem gambling severity (eta squared = 0.054). The link was much weaker for other paid in-game items (0.004). Direction of cause unknown.
- Strength: large survey, correlational. Abstract read. It concerns real-money purchases.
- Design: the chest here is free and earned, which is a different case. Two lines never to cross: never sell a random reward, and never let the player wager Coins on chance. A game that teaches people not to gamble with money should not model it.

### E. Loss aversion: streaks, hearts, lives

**Finding 19. A loss-framed incentive beat a gain-framed one in a good trial. The effect ended when the incentive ended.**
- Evidence: Patel et al. (2016), RCT, 281 adults, 13 weeks, goal of 7,000 steps a day. Share of days the goal was met: control 0.30, gain incentive 0.35, lottery 0.36, loss incentive 0.45. Only the loss group beat control (adjusted difference 0.16, P = 0.001). In the 13 weeks after, steps fell in all groups and did not differ from control.
- Strength: single RCT, one employer, real money. Abstract read.
- Design: this supports the freeze as something held and at risk. It does not support streak anxiety as a long-term engine. The lottery arm (a variable reward) did no better than the plain gain.

**Finding 20. Loss aversion is not a general law.**
- Evidence: Gal and Rucker (2018), review. They conclude that current evidence does not support that losses are, on balance, more impactful than gains. The effect depends on context.
- Strength: critical review, contested in the field. Abstract read.
- Design: do not build a mechanic on the belief that fear of loss always beats hope of gain. Test it or leave it.

**Finding 21. Asking for consecutive work raises persistence.**
- Evidence: Mehr, Silverman, Sharif, Barasch and Milkman (2025), six pre-registered studies, total N = 4,493. People did more work for smaller payments that rose with consecutive tasks than for larger flat payments. The cause was the requirement of consecutive completion, not the rising amount. It raised commitment to the goal.
- Strength: single paper, six pre-registered studies, paid work tasks. Abstract read.
- Design: the Combo is a within-Lesson streak and has support here. The day streak works through commitment to a goal. Make the goal the player's own (Finding 10).

**Finding 22. Punishing game elements cause the opposite of what they intend.**
- Evidence: Diefenbach and Mussig (2019), Habitica task manager. Study 1: one user, interviews. Study 2: 45 users, two weeks. Every participant saw some counterproductive effect. The most common was being punished in productive times because tasks were not ticked off in time. Some users relabelled tasks to dodge punishment. How unfair the reward system felt predicted the change in motivation.
- Strength: single paper, small sample, two weeks. Abstract read. The first pass could not open it.
- Design: a streak that breaks on a day the player was busy living well is this exact failure. Keep the freeze cheap and automatic. Never show a punishment message.

**Finding 23. In one classroom, a leaderboard and badges lowered motivation and exam scores.**
- Evidence: Hanus and Fox (2015), two courses, 16 weeks, four measurement points. The gamified course ended with less motivation, satisfaction and empowerment and lower final exam scores. Lower intrinsic motivation mediated the exam result. Search summaries give 71 students.
- Strength: single quasi-experiment, small sample. **Summary only**: the abstract was not served to me.
- Design: forced comparison with others is the harmful part here. The game has none. Do not add simulated rivals.

**Finding 24. No peer-reviewed test of hearts or lives in a learning app was found.**
- Evidence: I searched and found none. The only data is Duolingo's own report in the first pass.
- Strength: a gap.
- Design: hearts stay out. Nothing supports them, and Findings 14 and 22 warn against them.

### F. Goal gradient and endowed progress

**Finding 25. People are moved by the smaller number: what is done at the start, what is left near the end.**
- Evidence: Koo and Fishbach (2012), four studies. Early in a goal, pointing at progress made (20% done) raises adherence more than pointing at what remains (80% left). Near the end, pointing at what remains (20% left) works better. The small area creates a feeling of fast progress.
- Strength: single paper, four studies. Abstract read.
- Design: switch the wording at the halfway point. First half of a Lesson or Section: "3 done". Second half: "2 to go". Both are true numbers.

**Finding 26. Motivation dips in the middle.**
- Evidence: Bonezzi, Brendl and De Angelis (2011). Motivation can be high far from and close to the goal and low about halfway. It depends on whether the person measures from the start or from the end.
- Strength: single paper. Abstract read. Sample sizes not in the abstract.
- Design: long Sections need sub-goals so there is never a long middle. The Recap per Section and the Lesson chest already cut the path into short runs. Put a daily quest reward at the mid-point, not the end.

**Finding 27. A head start helps early. Near the end, progress must feel earned.**
- Evidence: Zhang and Huang (2010). At low progress, people ask "can I reach this?". Progress credited to their own effort signals a hard goal and lowers commitment, so progress given by the situation helps. At high progress, people ask "is this worth it?". Progress they earned themselves signals value and raises commitment.
- Strength: single paper. Abstract read.
- Design: this sharpens the endowed progress effect from the first pass. Early in the game, an easy first Lesson that fills the Ring fast is helpful. Late in a Section, the summary should say what the player did, not what the game gave.

### G. Narrative and fantasy

**Finding 28. A story theme added no learning in a strict test.**
- Evidence: Adams et al. (2012), two experiments with college students. A narrative discovery game did worse than a matched slideshow on retention (d = 1.37) and transfer (d = 0.57). Removing the detective story from a second game changed neither score (d = -0.16) nor time. The games ran under two hours.
- Strength: single paper, two experiments. Abstract read.
- Design: do not expect a storyline to teach. A story laid over the content costs reading time. Short Cards with direct questions beat exploration.

**Finding 29. Context, personalisation and choice raised both motivation and learning in children.**
- Evidence: Cordova and Lepper (1996). Children learned arithmetic rules in an abstract form or in a fantasy context, generic or personalised, with or without small choices. All three additions raised motivation, depth of engagement, amount learned and felt competence.
- Strength: single experiment with elementary school children. Abstract read.
- Design: for adults, the matching context is their own life, not a fantasy. Let the player enter their own numbers (age, monthly saving) and use them in examples. This is unverified for adults but is the cheapest test of the idea.

**Finding 30. The game mechanic must carry the content, not sit beside it.**
- Evidence: Habgood and Ainsworth (2011). A maths game where the division was the fighting mechanic (intrinsic) against the same game with a quiz between levels (extrinsic). Study 1, 58 children, 2 hours: more learning from the intrinsic version. Study 2, 16 children with free choice: 7 times longer on the intrinsic version.
- Strength: single paper, small samples, children. Abstract read.
- Design: this is the strongest design idea in this section. A compounding Lesson should have the player grow a sum by their own choices, not answer a question and then get a coin animation. Coins themselves can teach: let saved Coins earn a visible return.

**Finding 31. Story does help motivation and helps feelings of connection.**
- Evidence: Mazarakis and Brauer (2022): narrative alone raised questions answered. Sailer et al. (2017): a meaningful story raised relatedness. Sailer and Homner (2020): game fiction helped behavioural outcomes (first pass). Clark et al. (2016) report that narrative features moderated learning effects; the direction is not in the abstract and I mark it **unverified**.
- Strength: one experiment, one RCT, one meta-analytic moderator.
- Design: a light frame is enough: a guide character and a journey with a named destination. In a solo game it is also the only route to relatedness. Keep it to a line or two per Lesson.

**Finding 32. Stories with a character people care about changed real money behaviour.**
- Evidence: Berg and Zia (2017), randomised encouragement to watch a South African soap opera with a two-month debt storyline. Viewers knew more about the topics shown, were about twice as likely to borrow from formal sources, and were less likely to gamble or use hire-purchase. Focus groups pointed to the bond with the lead character. Lusardi et al. (2017): a written story, a video story and an interactive visual tool about risk diversification all raised self-efficacy, and several raised financial literacy.
- Strength: one field RCT (**summary only**: I saw the working-paper abstract through search, not the journal abstract), one online experiment (abstract read).
- Design: finance is a field where story has behaviour evidence. Use short cases about a person making a choice, and ask what they should do. That is a story and a retrieval question at once.

### H. Novelty wear-off

**Finding 33. Short interventions show big effects. Long ones show small or negative ones.**
- Evidence: Kim and Castelli (2021): under 1 week ES = 1.57, up to 20 weeks ES = 0.30, across years ES = -0.20. Li, Ma and Shi (2023): 1 week to 1 month g = 0.621, 1 to 3 months g = 0.519, 3 months to a semester g = 0.480. (Li also reports g = 3.304 for more than a semester from 5 studies, which I do not trust.)
- Strength: two meta-analyses, moderator analyses. Abstract for one, full text tables for the other.
- Design: the honest long-run effect is near 0.3 to 0.5. Judge any new mechanic after four weeks of play, not after the first day. A first-day lift is mostly novelty.

**Finding 34. The curve can be a U: a drop after about four weeks, then partial recovery.**
- Evidence: Rodrigues et al. (2022), 756 programming students, 14 weeks, gamified against non-gamified. The effect fell from week 4 for two to six weeks, then rose again between weeks 6 and 10. Van Roy and Zaman (2018), 40 students, 15 weeks: autonomous motivation fell and then rose. Tsay et al. (2020), 333 students against 175 controls over years: engagement was higher in the second year, which the authors link to making the gamified work meaningful and useful.
- Strength: three single studies, one large, one small, one multi-year. None randomised. Abstracts read.
- Design: plan for a slump in weeks 4 to 8. That is the time to change something small: a new quest type, a new Section opening, a first personal-best record. Usefulness, not novelty, is what carried students through.

### I. Adults learning personal finance

**Finding 35. Financial education works, with small effects: about 0.2 SD on knowledge and 0.1 SD on behaviour.**
- Evidence: Kaiser, Lusardi, Menkhoff and Urban (2022), meta-analysis of 76 randomised experiments, over 160,000 people. Knowledge +0.2 SD (0.204, CI 0.152 to 0.255). Behaviour +0.1 SD (0.100, CI 0.071 to 0.129). For adults over 25: behaviour 0.107, knowledge 0.200. The average program was 11.7 hours of instruction. Miller et al. (2015), 188 papers: it helps saving and record keeping, and does not reduce loan defaults.
- Strength: meta-analysis of RCTs. Full text of the working-paper version read. Strong.
- Design: a quiz game should move knowledge by about this much and behaviour by half of it. Do not promise more. Aim at behaviours that respond: saving, budgeting, record keeping.

**Finding 36. Knowledge fades within six months.**
- Evidence: Kaiser et al. (2022): knowledge effects were 0.231 SD when measured within six months and 0.141 SD after. Behaviour effects fell to 0.071 SD at six months or more, then held at 0.057 to 0.088 out to two years (few studies). Fernandes, Lynch and Netemeyer (2014), 201 studies: interventions explained 0.1% of variance in behaviour, and even long courses had negligible effects 20 months later. Kaiser et al. dispute the size of that decay and agree the long-run evidence is thin.
- Strength: two meta-analyses that partly disagree. Abstract and full text read.
- Design: this is the main argument for spaced Review. The Review ladder should run past six months for the core ideas. A learner who finishes the Path and never returns will lose much of it.

**Finding 37. Teach close to the decision.**
- Evidence: Fernandes et al. (2014) propose "just-in-time" education tied to a specific behaviour. Kaiser and Menkhoff (2017), 126 studies: success depends on intensity and on a "teachable moment". Debt behaviour is harder to change. Mandatory education tends to work less well.
- Strength: two meta-analyses. Abstracts read.
- Design: end a Lesson with one small action the player can take this week, and let them mark it done. Let the player jump to the Section that matches a decision they face now. The open Path already allows this.

**Finding 38. Simple rules beat full instruction.**
- Evidence: Drexler, Fischer and Schoar (2014), RCT with micro-entrepreneurs in the Dominican Republic. Rule-of-thumb training improved financial practices, reporting quality and revenues. Standard accounting training did less, most of all for people with lower skills.
- Strength: single field RCT. Abstract read. Business owners in a developing country, not the game's audience.
- Design: each Lesson should leave the player with one rule in one sentence. The Recap should list rules, not topics.

**Finding 39. People underestimate compounding, and correcting that changes what they do.**
- Evidence: Stango and Zinman (2009): people linearise exponential growth. Households with more of this bias borrow more and save less. Song (2020), field experiment in rural China: explaining compound interest raised pension contributions by about 40%. The effect was larger for people who underestimated it.
- Strength: one survey analysis, one field experiment. Abstracts read.
- Design: compounding is the highest-value concept in the game. Have the player guess a future value first, then show the true one. The gap between guess and truth is the lesson.

**Finding 40. Letting people sample outcomes teaches risk better than telling them.**
- Evidence: Kaufmann, Weber and Haisley (2013): experience sampling and a combined risk tool raised recall accuracy of expected return and loss probability, and people took more risk without later regret. Bradbury, Hens and Zeisberger (2015): simulated experience "considerably" improved understanding of the risk and return profile.
- Strength: two lab experiments. Abstracts read. Sample sizes not in the abstracts.
- Design: a small simulator beats a Card of text for risk and for compounding. The player presses a button and draws ten possible years. This is also intrinsic integration (Finding 30).

**Finding 41. A game-based finance course raised knowledge in a large trial. Evidence for adults is thin.**
- Evidence: Cannistra et al. (2024), RCT, 2,220 students in four countries: an online game-based tool raised financial literacy by 0.313 SD. For adults, a RAND trial of the game Farm Blitz with low-income adults exists (Maynard et al. 2012); I saw it only through a search summary and mark it **unverified**. A 2026 conference meta-analysis of 28 game-based finance studies reports a positive effect with high heterogeneity; **unverified**.
- Strength: one large RCT with students. Adult evidence unverified.
- Design: 0.3 SD is above the 0.2 average for finance teaching, so the format is promising. No study I could read shows it holds for adults or changes what they do with money. The game should measure this itself: a short knowledge check at the start and again weeks later.

## 3. Design rules for this game

1. **Keep every reward informational.** Each Coin, Combo and chest should tell the player they got something right. Pay nothing for opening the app. (Findings 12, 13.)
2. **Reward quality acts, not counts.** Quests ask for "pass a Fare first try" or "clear today's Review", never "answer 30 questions". (Findings 2, 14.)
3. **Keep the player's own reason on screen.** Ask once why they want financial independence, and show that line on the Path and the Recap. (Findings 10, 11.)
4. **Give two to four real choices, with no payout for choosing.** Which Section next, which quest, which theme. (Findings 8, 9.)
5. **Show the player their own curve.** A personal performance graph feeds competence without other players. (Findings 5, 7.)
6. **Make the mechanic be the content.** Compounding is taught by growing a sum, and risk by drawing outcomes. Let saved Coins earn a visible return. (Findings 30, 39, 40.)
7. **Use the smaller number.** "3 done" in the first half, "2 to go" in the second half. Break long Sections so there is no long middle. (Findings 25, 26.)
8. **Keep the streak forgiving and silent on failure.** The freeze applies by itself and stays cheap. No message blames the player for a missed day. (Findings 19, 22.)
9. **Keep the chest free, earned and fixed in value.** Vary what it shows, not how much it pays. Never sell it and never let Coins be wagered. (Findings 16, 17, 18.)
10. **Use story as short cases about people and money.** One or two lines, ending in a question. No plot the player must read through. (Findings 28, 31, 32.)
11. **Plan for the week 4 to 8 slump.** Hold back one small new thing for that window, and judge every mechanic after four weeks. (Findings 33, 34.)
12. **End each Lesson with one rule and one action, and review past six months.** One sentence to remember, one thing to do this week, and a Review ladder long enough to beat the six-month fade. (Findings 36, 37, 38.)

## 4. Mechanics the evidence warns against

- **Login bonuses and rewards for showing up.** Expected rewards loosely tied to performance are where both sides of the reward dispute find harm. (Findings 12, 13.)
- **Hearts, lives or any penalty for a wrong answer.** No peer-reviewed support, and punishing elements backfire. (Findings 22, 24.)
- **Punishment or guilt messages on a broken streak.** Guilt-driven motives hold people and lower well-being. (Findings 10, 22.)
- **Paid or wagered random rewards.** Linked to problem gambling, and against the game's own lesson. (Finding 18.)
- **Relying on random reward size to drive return.** The one app trial found no gain over fixed rewards. (Finding 17.)
- **Leaderboards and simulated rivals.** One long classroom study found lower motivation and scores. A solo game cannot do them honestly. (Finding 23.)
- **A long storyline laid over the content.** No learning gain in a strict test, and it costs time. (Finding 28.)
- **Quests and bonuses that pay for volume.** Incentives raise quantity, not quality. (Finding 14.)
- **Cutting a reward the player expects.** Effects fade or reverse when incentives stop. (Finding 15.)
- **Stacking more elements to fix engagement.** Elements do not simply add up. (Finding 4.)
- **Judging a mechanic by its first week.** Short-run effects are several times the long-run ones. (Finding 33.)
- **More content as the answer.** Simple rules and teaching near the decision beat more hours. (Findings 37, 38.)

## 5. Gaps and things I could not confirm

- No peer-reviewed study of hearts or lives in a learning app.
- No peer-reviewed study of random chests in a learning app. The variable-ratio claim from operant research was not opened.
- No study I could read tests a gamified finance app with adults and measures later money behaviour.
- Huang et al. (2020) and Ritzhaupt et al. (2021) analysed 14 design elements each. I could not read their per-element tables. Springer redirected to a login.
- Hanus and Fox (2015): abstract seen through search summaries only.
- Berg and Zia (2017): working-paper abstract seen through search summaries only.
- Bai, Hew and Huang (2020): the abstract I received was cut off after the main effect. Its qualitative findings (students dislike gamification for lack of use, anxiety and jealousy) come from a search summary and are **unverified**.
- Clark et al. (2016): direction of the narrative moderator not confirmed.
- Koivisto and Hamari (2014), Kyewski and Kramer (2018), Heath, Larrick and Wu (1999): no abstract served. Not used for any claim.
- Maynard et al. (2012) Farm Blitz trial and the 2026 conference meta-analysis on finance games: search summaries only.
- Murayama et al. (2010), Sailer et al. (2017), Lepper et al. (1973), Bonezzi et al. (2011): sample sizes are not in the abstracts I read.

## 6. Sources

| Source | URL or DOI | How read |
|---|---|---|
| Sailer and Homner (2020), The Gamification of Learning: a Meta-analysis, Educational Psychology Review 32 | https://doi.org/10.1007/s10648-019-09498-w | First pass (full text) |
| Huang, Ritzhaupt, Sommer, Zhu, Stephen and Valle (2020), The impact of gamification in educational settings on student learning outcomes: a meta-analysis, Educational Technology Research and Development 68(4) | https://doi.org/10.1007/s11423-020-09807-z | Abstract (university repository page) |
| Bai, Hew and Huang (2020), Does gamification improve student learning outcome?, Educational Research Review 30 | https://doi.org/10.1016/j.edurev.2020.100322 | Abstract, cut off after main effect |
| Zeng, Sun, Looi and Fan (2024), Exploring the impact of gamification on students' academic performance, British Journal of Educational Technology | https://doi.org/10.1111/bjet.13471 | Abstract |
| Li, Ma and Shi (2023), Examining the effectiveness of gamification as a tool promoting teaching and learning in educational settings: a meta-analysis, Frontiers in Psychology 14 | https://doi.org/10.3389/fpsyg.2023.1253549 | Full text (moderator tables) |
| Ritzhaupt, Huang, Sommer, Zhu, Stephen and Valle (2021), A meta-analysis on the influence of gamification in formal educational settings on affective and behavioral outcomes, Educational Technology Research and Development 69(5) | https://doi.org/10.1007/s11423-021-10036-1 | Summary only |
| Kim and Castelli (2021), Effects of Gamification on Behavioral Change in Education: A Meta-Analysis, Int. J. Environmental Research and Public Health 18(7) | https://doi.org/10.3390/ijerph18073550 | Abstract |
| Looyestyn, Kernot, Boshoff, Ryan, Edney and Maher (2017), Does gamification increase engagement with online programs? A systematic review, PLoS ONE | https://doi.org/10.1371/journal.pone.0173403 | Abstract |
| Mazarakis and Brauer (2022), Gamification is Working, but Which One Exactly?, Int. J. Human-Computer Interaction | https://doi.org/10.1080/10447318.2022.2041909 | Abstract |
| Sailer, Hense, Mayr and Mandl (2017), How gamification motivates, Computers in Human Behavior 69 | https://doi.org/10.1016/j.chb.2016.12.033 | Abstract |
| Xi and Hamari (2019), Does gamification satisfy needs?, Int. J. Information Management | https://doi.org/10.1016/j.ijinfomgt.2018.12.002 | Abstract |
| Wouters, van Nimwegen, van Oostendorp and van der Spek (2013), A meta-analysis of the cognitive and motivational effects of serious games, J. Educational Psychology 105 | https://doi.org/10.1037/a0031311 | Abstract |
| Clark, Tanner-Smith and Killingsworth (2016), Digital Games, Design, and Learning, Review of Educational Research 86 | https://doi.org/10.3102/0034654315582065 | Abstract |
| Sitzmann (2011), A meta-analytic examination of the instructional effectiveness of computer-based simulation games, Personnel Psychology 64 | https://doi.org/10.1111/j.1744-6570.2011.01190.x | Abstract |
| Ryan, Rigby and Przybylski (2006), The Motivational Pull of Video Games, Motivation and Emotion 30 | https://doi.org/10.1007/s11031-006-9051-8 (copy at https://selfdeterminationtheory.org/SDT/documents/2006_RyanRigbyPrzybylski_MandE.pdf) | Full text, first page |
| Przybylski, Rigby and Ryan (2010), A Motivational Model of Video Game Engagement, Review of General Psychology 14 | https://doi.org/10.1037/a0019440 | Abstract |
| Peng, Lin, Pfeiffer and Winn (2012), Need Satisfaction Supportive Game Features as Motivational Determinants, Media Psychology 15 | https://doi.org/10.1080/15213269.2012.673850 | Abstract |
| Patall, Cooper and Robinson (2008), The effects of choice on intrinsic motivation and related outcomes, Psychological Bulletin 134(2) | https://doi.org/10.1037/0033-2909.134.2.270 | Abstract |
| Howard, Bureau, Guay, Chong and Ryan (2021), Student Motivation and Associated Outcomes, Perspectives on Psychological Science 16 | https://doi.org/10.1177/1745691620966789 | Abstract |
| Mitchell, Schuster and Jin (2020), Gamification and the impact of extrinsic motivation on needs satisfaction, J. Business Research 106 | https://doi.org/10.1016/j.jbusres.2018.11.022 | Abstract |
| Lepper, Greene and Nisbett (1973), Undermining children's intrinsic interest with extrinsic reward, J. Personality and Social Psychology 28 | https://doi.org/10.1037/h0035519 | Abstract |
| Deci, Koestner and Ryan (2001), Extrinsic Rewards and Intrinsic Motivation in Education: Reconsidered Once Again, Review of Educational Research 71 | https://doi.org/10.3102/00346543071001001 | Abstract |
| Cameron, Banko and Pierce (2001), Pervasive negative effects of rewards on intrinsic motivation: The myth continues, The Behavior Analyst 24 | https://doi.org/10.1007/BF03392017 | Abstract |
| Cerasoli, Nicklin and Ford (2014), Intrinsic motivation and extrinsic incentives jointly predict performance, Psychological Bulletin 140 | https://doi.org/10.1037/a0035661 | Abstract |
| Murayama, Matsumoto, Izuma and Matsumoto (2010), Neural basis of the undermining effect of monetary reward on intrinsic motivation, PNAS 107 | https://doi.org/10.1073/pnas.1013305107 | Abstract |
| Gneezy, Meier and Rey-Biel (2011), When and Why Incentives (Don't) Work to Modify Behavior, J. Economic Perspectives 25(4) | https://doi.org/10.1257/jep.25.4.191 | Abstract |
| Shen, Fishbach and Hsee (2015), The Motivating-Uncertainty Effect, J. Consumer Research 41 | https://doi.org/10.1086/679418 | Abstract |
| Nuijten, Van Gorp, Khanshan, Le Blanc, Kemperman and van den Berg (2021), Health Promotion through Monetary Incentives, Electronics 10(23) | https://doi.org/10.3390/electronics10232935 | Abstract |
| Zendle and Cairns (2018), Video game loot boxes are linked to problem gambling, PLoS ONE | https://doi.org/10.1371/journal.pone.0206767 | Abstract |
| Patel, Asch, Rosin, Small, Bellamy, Heuer et al. (2016), Framing Financial Incentives to Increase Physical Activity Among Overweight and Obese Adults, Annals of Internal Medicine 164 | https://doi.org/10.7326/M15-1635 | Abstract |
| Gal and Rucker (2018), The Loss of Loss Aversion: Will It Loom Larger Than Its Gain?, J. Consumer Psychology 28 | https://doi.org/10.1002/jcpy.1047 | Abstract |
| Mehr, Silverman, Sharif, Barasch and Milkman (2025), The motivating power of streaks, Organizational Behavior and Human Decision Processes | https://doi.org/10.1016/j.obhdp.2025.104391 | Abstract |
| Diefenbach and Mussig (2019), Counterproductive effects of gamification, Int. J. Human-Computer Studies 127 | https://doi.org/10.1016/j.ijhcs.2018.09.004 | Abstract |
| Hanus and Fox (2015), Assessing the effects of gamification in the classroom, Computers and Education 80 | https://doi.org/10.1016/j.compedu.2014.08.019 | Summary only |
| Koo and Fishbach (2012), The Small-Area Hypothesis, J. Consumer Research 39 | https://doi.org/10.1086/663827 | Abstract |
| Bonezzi, Brendl and De Angelis (2011), Stuck in the Middle: The Psychophysics of Goal Pursuit, Psychological Science 22 | https://doi.org/10.1177/0956797611404899 | Abstract |
| Zhang and Huang (2010), How Endowed versus Earned Progress Affects Consumer Goal Commitment and Motivation, J. Consumer Research 37 | https://doi.org/10.1086/655417 | Abstract |
| Adams, Mayer, MacNamara, Koenig and Wainess (2012), Narrative games for learning, J. Educational Psychology 104 | https://doi.org/10.1037/a0025595 | Abstract |
| Cordova and Lepper (1996), Intrinsic motivation and the process of learning, J. Educational Psychology 88 | https://doi.org/10.1037/0022-0663.88.4.715 | Abstract |
| Habgood and Ainsworth (2011), Motivating Children to Learn Effectively, J. the Learning Sciences 20 | https://doi.org/10.1080/10508406.2010.508029 | Abstract |
| Berg and Zia (2017), Harnessing Emotional Connections to Improve Financial Decisions, J. European Economic Association 15 | https://doi.org/10.1093/jeea/jvw021 (working paper: https://ideas.repec.org/p/wbk/wbrwps/6407.html) | Summary only |
| Lusardi, Samek, Kapteyn, Glinert, Hung and Heinberg (2017), Visual tools and narratives: new ways to improve financial literacy, J. Pension Economics and Finance 16 | https://doi.org/10.1017/S1474747215000323 | Abstract |
| Rodrigues, Pereira, Toda, Palomino, Pessoa, Carvalho et al. (2022), Gamification suffers from the novelty effect but benefits from the familiarization effect, Int. J. Educational Technology in Higher Education 19 | https://doi.org/10.1186/s41239-021-00314-6 | Abstract |
| van Roy and Zaman (2018), Need-supporting gamification in education, Computers and Education 127 | https://doi.org/10.1016/j.compedu.2018.08.018 | Abstract |
| Tsay, Kofinas, Trivedi and Yang (2020), Overcoming the novelty effect in online gamified learning systems, J. Computer Assisted Learning 36 | https://doi.org/10.1111/jcal.12385 | Abstract |
| Kaiser, Lusardi, Menkhoff and Urban (2022), Financial education affects financial knowledge and downstream behaviors, J. Financial Economics 145 | https://doi.org/10.1016/j.jfineco.2021.09.022 (working paper: https://docs.iza.org/dp13178.pdf) | Full text (working paper) |
| Fernandes, Lynch and Netemeyer (2014), Financial Literacy, Financial Education, and Downstream Financial Behaviors, Management Science 60(8) | https://doi.org/10.1287/mnsc.2013.1849 | Abstract |
| Kaiser and Menkhoff (2017), Does Financial Education Impact Financial Literacy and Financial Behavior, and If So, When?, World Bank Economic Review 31 | https://doi.org/10.1093/wber/lhx018 | Abstract |
| Miller, Reichelstein, Salas and Zia (2015), Can You Help Someone Become Financially Capable?, World Bank Research Observer 30 | https://doi.org/10.1093/wbro/lkv009 | Abstract |
| Drexler, Fischer and Schoar (2014), Keeping It Simple: Financial Literacy and Rules of Thumb, American Economic Journal: Applied Economics 6(2) | https://doi.org/10.1257/app.6.2.1 | Abstract |
| Stango and Zinman (2009), Exponential Growth Bias and Household Finance, J. Finance 64 | https://doi.org/10.1111/j.1540-6261.2009.01518.x | Abstract |
| Song (2020), Financial Illiteracy and Pension Contributions: A Field Experiment on Compound Interest in China, Review of Financial Studies 33 | https://doi.org/10.1093/rfs/hhz074 | Abstract |
| Kaufmann, Weber and Haisley (2013), The Role of Experience Sampling and Graphical Displays on One's Investment Risk Appetite, Management Science 59 | https://doi.org/10.1287/mnsc.1120.1607 | Abstract |
| Bradbury, Hens and Zeisberger (2015), Improving Investment Decisions with Simulated Experience, Review of Finance 19 | https://doi.org/10.1093/rof/rfu021 | Abstract |
| Cannistra, De Beckker, Agasisti, Amagir, Poder, Vartiak and De Witte (2024), The impact of an online game-based financial education course, J. Comparative Economics 52(4) | https://doi.org/10.1016/j.jce.2024.08.001 | Abstract |
| Lusardi and Mitchell (2014), The Economic Importance of Financial Literacy, J. Economic Literature 52(1) | https://doi.org/10.1257/jel.52.1.5 | Abstract; background only, no claim rests on it |
| Maynard et al. (2012), Can games build financial capability? (RAND), as listed by the US Department of Labor CLEAR | https://clear.dol.gov/Study/Can-games-build-financial-capability-Financial-entertainment-research-overview-Maynard-et-al | Summary only; unverified |

Volume and issue numbers in this table come from metadata and from memory and were not all checked against the publisher page. The DOIs were all resolved through OpenAlex and returned the titles and authors listed.
