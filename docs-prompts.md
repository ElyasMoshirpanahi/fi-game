# Financial Independence Roadmap Game: Playbook

*Consolidated 2026-11-09. One file for the whole project: how to build it, the prompts to use, and the video lessons behind them.*

## Contents

1. [Step-by-step instructions with the mattpocock skills](#part-1-step-by-step-instructions)
2. [Prompt sequence, Prompt 0 to Prompt 5](#part-2-prompt-sequence)
3. [Supervisor prompt for a second Claude Code session](#part-3-supervisor-prompt-for-a-second-claude-code-session)
4. [Appendix A: original single-shot prompt (v1)](#appendix-a-original-single-shot-prompt-v1)
5. [Appendix B: wisdom from "How to vibe code 3D games with Fable 5"](#appendix-b-video-wisdom)

Source content file: `financial_independence_roadmap_clean.html` on the Desktop.

---

# Part 1: Step-by-step instructions

## Source: How to turn an HTML financial learning file into a Duolingo/Brilliant-style game, using the mattpocock skills

*Saved 2026-11-09 13:26 · Updated 2026-11-09 · Financial independence roadmap, dual-language game · Goal: learning in action*

Two things get learned at once. The finance content, because every step forces you to argue about it, name it, verify it and test it. And the engineering discipline, because every step is one mattpocock skill used for real on your own project.

Inputs on the Desktop:

- `financial_independence_roadmap_clean.html` (the content)
- Part 2 of this file (Prompt 0 to Prompt 5, the build sequence)
- Appendix B of this file (the playbook: loop first, show don't tell, fair deaths, three reward horizons)

Rule from the video that applies everywhere: if a step's output misses, rerun the step, do not add more words.

---

### Step 0: Make it a repo (5 min)

The skills write `GLOSSARY.md`, `docs/adr/`, `docs/research/` and tests. They need a folder with git.

```
mkdir fi-game && cd fi-game && git init
mkdir content && cp "../financial_independence_roadmap_clean.html" content/
cp ../FI-GAME-PLAYBOOK.md docs-prompts.md
```

Open a fresh Claude Code session inside `fi-game`.

What you learn: nothing yet. This is setup.

---

### Step 1: `/grilling` the idea (30 to 45 min)

Type:

```
/grilling I want to turn content/financial_independence_roadmap_clean.html into a Duolingo/Brilliant-style dual-language (FA/EN) learning game as a single index.html. Grill me on the plan. Read docs-prompts.md for the intended build sequence.
```

Claude asks numbered questions in rounds with a recommended answer each. Answer every one yourself before reading the recommendation. Expect questions on: who the player is, why dual-language, what the core loop is, what "fun" means here, what is out of scope, how progress is stored, how the finance facts are kept honest.

Stop when Claude says the tree is settled. Ask it to write the outcome to `docs/decisions-grill.md`.

What you learn: the finance content, because you have to defend why the 25x rule, core-satellite and "what not to learn" matter enough to be a station. And how to stress-test a plan before writing code.

---

### Step 2: `/domain-modeling` the vocabulary (20 min)

Type:

```
/domain-modeling Create GLOSSARY.md and the first ADRs for this project from docs/decisions-grill.md. Include both the game terms and the finance terms the player must learn.
```

Expected result: `GLOSSARY.md` with two sections. Game terms: Station, Card, Check, Fare (end-of-station recap), Coin, XP, Badge, Milestone, Language Mode (FA, EN, Both). Finance terms, each with the Farsi and English name: 25x rule, real return, core-satellite, index ETF, DCF, cap table, vesting, Box 3, 30% ruling, tax residency. Plus ADRs in `docs/adr/` for: single self-contained HTML, `i18n` object for all copy, `localStorage` key `fi-roadmap-v1`, no external scripts.

Challenge every term. If Claude writes "level" and "station" for the same thing, make it pick one.

What you learn: the finance vocabulary in both languages, written down once and precisely. And that a shared glossary is what keeps a codebase and an AI from drifting.

---

### Step 3: `/research` the facts (runs in background, 20 min of reading later)

Type:

```
/research Verify every factual claim in content/financial_independence_roadmap_clean.html against primary sources: the 4% / 25x rule origin, historical real returns of global index funds, Dutch Box 3 rules for 2026, the 30% ruling, broker access for non-EU residents (Interactive Brokers, DEGIRO), and each book's author and year. Write findings with sources to docs/research/roadmap-facts.md. Flag anything the HTML states that the sources contradict.
```

Keep working on Step 4 while it runs. When it finishes, read `docs/research/roadmap-facts.md` end to end. Anything flagged gets fixed in the HTML or turned into a card that states the nuance.

What you learn: the actual finance, from the primary sources, not from a summary. This is the single biggest learning step.

---

### Step 4: `/prototype` the loop and the look (45 min)

Two prototypes, two questions.

First, logic:

```
/prototype Does this state model feel right? Station -> Card -> Check -> reward -> next Card -> Fare at station end -> next Station. Include wrong answers, hints after one miss, Anki-style return of a missed card later in the session, and the Both language mode. Use the terms from GLOSSARY.md.
```

You get a single HTML file with free-play buttons and guided walkthroughs. Drive it. Find the case that feels wrong (for example, what happens when a player fails the Fare). Fix the model, not the UI.

Second, UI:

```
/prototype What should the path screen and a card look like? Give me three radically different variations switchable by URL param: Duolingo path, Brilliant lesson, and a Farsi-first editorial layout. Use real content from Station 1 and Station 2.
```

Pick one. Record the choice as an ADR with `/domain-modeling`.

What you learn: that a state machine is a thing you can play before you build, and which finance content survives being made into a 2-sentence card.

---

### Step 5: `/codebase-design` the modules (15 min)

Type:

```
/codebase-design Design the modules for index.html: content (parsed from the HTML into i18n), store (state + localStorage), engine (the state machine from the logic prototype), render (DOM), audio/animation. Deep modules, small interfaces. Where are the seams so the engine is testable without a DOM?
```

Expected result: a short design note in `docs/adr/` naming each module, its interface, and what is hidden behind it. The engine must be callable from a test with no browser.

What you learn: the deep-module idea, applied to something small enough to hold in your head.

---

### Step 6: `/tdd` the engine and the content rules (60 to 90 min)

Install vitest in the repo (Claude will do this). Then:

```
/tdd Build the engine module test-first. Tests to write before code:
1. every i18n key in fa exists in en and vice versa
2. every Check's correct answer appears in a Card earlier in the same Station (the fairness rule: a fail must be the player's own fault)
3. coins increment only on a correct answer
4. a missed Card returns later in the same session
5. a Station completes only after its Fare passes
6. state round-trips through localStorage and survives storage being disabled
Use GLOSSARY.md names in test titles.
```

Watch the red-green loop. Test 2 is the one to read closely: it is the video's "unforced error" rule turned into code.

What you learn: that the hardest design rule from the video is a 15-line test, and how TDD feels on a small project.

---

### Step 7: Build with the prompt sequence (2 to 3 sessions)

Now run Part 2 (Prompt 0 to Prompt 5) in order, inside this same repo, with the engine and tests already in place:

1. Prompt 0: core loop, Stations 1 and 2 only. Run tests.
2. Play it for 5 minutes as a stranger. Write down boredom, unfair checks, long text.
3. Prompt 1 only if the look is off. Attach a screenshot or a sketch. Do not describe.
4. Prompt 2 with your play notes in the brackets.
5. Prompt 3: remaining stations, three reward horizons, progression.
6. Prompt 4: three camera moments. Optional.
7. Prompt 5: fun-first pass and checklist.

Commit after every prompt so a bad step can be rolled back.

What you learn: the remaining four stations of finance content, because you are the play-tester and you cannot judge a card you do not understand.

---

### Step 8: `/diagnosing-bugs` when something breaks

When RTL and LTR text mix badly, localStorage misbehaves, or a slider computes nonsense:

```
/diagnosing-bugs <paste the exact symptom>
```

Follow the phases. Do not let it skip to a fix.

What you learn: a diagnosis discipline that works on hard bugs, used on an easy one first.

---

### Step 9: `/code-review` against the spec (20 min)

Type:

```
/code-review since the first commit. Spec = docs/decisions-grill.md + GLOSSARY.md + docs/research/roadmap-facts.md. Standards = the ADRs in docs/adr/.
```

Two reviews come back side by side. Fix anything where the game contradicts the research file.

What you learn: that the research file is the source of truth for the finance content, and the code is checked against it.

---

### Step 10: `/pr` and ship (10 min)

Push to GitHub, enable Pages, then:

```
/pr
```

for the PR body. Merge. Open the Pages URL on your phone.

Skip `/wizard`; nothing in this project needs a human-only credential walk-through. Use it later only if you add a backend or an app-store step.

---

### Loop

After shipping, play it for a week. Every card you get wrong is finance you have not learned yet. Every stretch where you get bored is a design bug. Open a new session, start at Step 7 point 2, and repeat.


---

# Part 2: Prompt sequence

## Source: Prompt Kit: Turn the Financial Independence Roadmap into a Fun, Interactive, Dual-Language Learning Game

Built on the playbook from "How to vibe code 3D games with Fable 5": fuse proven mechanics, prompt the core loop first, show references instead of describing them, make it fun first with the learning incidental, layer rewards on short, mid and long horizons, then iterate by playing.

Do not paste this whole file at once. It is a sequence of prompts. Run Prompt 0 with the HTML attached, play the result, then run the next prompt in a fresh follow-up. If a result misses, rerun the same prompt instead of adding more words.

---

### Prompt 0: Core loop only (first message, attach `financial_independence_roadmap_clean.html`)

You are a senior front-end engineer and game designer. Attached is a Persian roadmap to financial independence. We are turning it into an interactive, dual-language (Farsi + English) learning game. Do not build the whole thing. Build only the core loop and make it feel good.

Core loop: the player moves along a path through 6 stations (Reality Check, Knowledge Roadmap, What NOT to Learn, Getting Better, Next 6 Months, Library). At each station they open cards, read one short idea in Farsi with the English directly beneath, and answer one quick check (tap the right answer, drag to order, or toggle true/false). A right answer fills a progress ring and plays a short animation. That is the entire game for now.

Fusion of mechanics (replicate, do not invent):
- Duolingo: a vertical path of nodes, one bite per node, instant feedback, a soft "correct" chime via Web Audio.
- Brilliant.org: every concept is an interactive, not a paragraph. The math station uses sliders, not text.
- Anki: a card flips Farsi to English; the learner rates "knew it / didn't" and the card returns later in the session.

Constraints:
- One self-contained `index.html`, inline CSS and JS, no frameworks, no external requests except Google Fonts (Vazirmatn, Inter).
- Every string lives in `i18n = { fa: {...}, en: {...} }`. `FA | EN | Both` toggle in the header. Farsi sets `<html lang="fa" dir="rtl">`, English sets `lang="en" dir="ltr"`, Both shows Farsi on top and English below in a muted colour. Use CSS logical properties so the layout mirrors cleanly.
- Preserve every fact, number, book, author, URL and caveat from the source. No invented financial content. The disclaimer "آموزشی است، نه توصیه خرید" / "Educational, not investment advice" is always visible.
- Persian digits in Farsi mode, Latin digits in English mode, euros everywhere.
- Mobile first at 360 px, dark theme via `prefers-color-scheme`, keyboard reachable, visible focus, `aria-live="polite"` on feedback.

Stop after the loop works for Station 1 and Station 2 with real content from the HTML. Leave stations 3 to 6 as visible but empty nodes. Return only the `index.html` in one code block.

---

### Prompt 1: Show, don't tell (attach a screenshot or sketch)

Attached is a screenshot / sketch of what I want the path screen to look like. Match this layout, spacing and mood. Keep all existing logic. Return the full updated `index.html`.

(Use this prompt whenever words fail. Attach a Duolingo path screenshot, a Brilliant interactive, or a pen sketch with an X over anything that must go.)

---

### Prompt 2: Make it fun (after playing Prompt 0 as a stranger)

I played it as a stranger would. It is a technical demo, not yet fun. Fix these, nothing else:

- Dead stretches: [list the moments where nothing happened or reading felt long]. Break any card over 2 sentences into two cards or an interactive.
- Unfair fails: [list any check where the right answer could not be known from the cards before it]. Every wrong answer must be the player's own fault; the information must have appeared earlier in the same station.
- Add short-term reward: a coin counter (+1 per correct answer) with a small count-up animation.
- Add a hint: after one wrong answer, reveal the relevant source line in both languages.
- Add secondary motion: cards lift on hover, the path node pulses before unlock, the progress ring eases in.

Keep everything else unchanged. Return the full `index.html`.

---

### Prompt 3: Reward horizons and progression

Add the remaining four stations with real content from the source, then layer rewards on three horizons:

- Short-term: coins per correct answer (already there), plus a per-station ring.
- Mid-term: each station ends with a "fare": a 3-question recap drawn from that station's cards. Completing it unlocks the next station's theme colour and a badge named from the source content (for example "25x rule", "Core-satellite", "First €100 of ownership").
- Long-term: a total XP bar across all six stations, a "Books I have read" shelf built from the Library tables with Read / Reading / To-read states, and a final milestone "First €100 of ownership income" that is unlocked only when both checklists in Station 5 are complete.

Progression lives in the content's DNA: the source already orders five knowledge stages at 2 to 3 months each and a 10-book reading order for the first 6 months. Use that order as the level order. Each station gets its own theme (palette and icon) drawn from its subject. Station 1 is the easiest with the most hints; Station 6 assumes the player knows the interface and shows fewer hints.

Station requirements:
- Station 1, Math Reality: sliders for capital (€10k to €1M) and real return (3% to 8%) computing annual income live, and an expenses slider showing the 25x target. The four source bullets sit beside the sliders.
- Station 2, Knowledge Roadmap: five stage cards with topic, resources, "2 to 3 months" chip and a Done box. Keep the BSN / broker note as a callout.
- Station 3, What NOT to Learn: 4 to 6 true/false myth-busters derived strictly from the source.
- Station 4, Getting Better: weekly habit tracker for the five habits, plus a decision-journal textarea with a 6-month review date, stored locally.
- Station 5, Next 6 Months: the two checklists exactly as written, persisted, with a completion percentage.
- Station 6, Library: all book tables as a filterable grid (by stage, ⭐ vs ○, search), then the 10-book reading order with the rule "2 books per month, one page of notes in your own language".

All state in `localStorage` under `fi-roadmap-v1`, every read and write wrapped in try/catch. Return the full `index.html`.

---

### Prompt 4: Cinematic moments (use sparingly)

Add exactly three camera-style moments, nothing more:

1. On first load: a wide establishing view of the whole path, then a slow ease-in to the current node (a "wide shot to close-up").
2. On station completion: the view pulls back to show the whole path and the newly lit node (a "pull-out" that says the world is bigger than this step).
3. On the final milestone: a slow scale and blur of the background behind the badge (a restrained "dolly zoom" that says this moment matters).

Each lasts under 800 ms, respects `prefers-reduced-motion`, and uses CSS transforms only. Return the full `index.html`.

---

### Prompt 5: Fun first, learning incidental (final pass)

Review the whole experience as a first-time player who does not care about finance. Cut anything that feels like homework. Confirm:

- All source content is present in both languages with no additions.
- RTL and LTR both render correctly, including tables and mixed-direction terms.
- Every fail is caused by the player, not the design.
- Rewards exist on short, mid and long horizons.
- Progress persists and the reset button sits behind a confirm step.
- Under 200 KB, no external scripts, disclaimer always visible.

Return the final `index.html` and a 6-line checklist with a yes or no per item.


---

# Part 3: Supervisor prompt for a second Claude Code session

Paste the block below into a fresh Claude Code session started inside an empty folder (for example `C:\Users\Retrotech\Desktop\fi-game`). It executes Part 1 end to end, stops for the decisions only a human can make, tests the result with vitest, and plays the game in Chrome the way a stranger would.

```
You are the supervisor and executor for the project described in
C:\Users\Retrotech\Desktop\FI-GAME-PLAYBOOK.md (if it is not there, look in
C:\Users\Retrotech\Desktop\FILES and its subfolders). Read the whole file first.
The content source is financial_independence_roadmap_clean.html in the same place.

Your job has three roles. Keep them separate and say which one you are in.

ROLE 1, EXECUTOR. Run Part 1, Step 0 to Step 10, in order, in this folder.
- Use the named mattpocock skill at each step exactly as the playbook says
  (/grilling, /domain-modeling, /research, /prototype, /codebase-design, /tdd,
  /diagnosing-bugs, /code-review, /pr). Do not substitute your own process.
- Within Step 7, run Part 2 prompts in order: Prompt 0, play-test, Prompt 1 only
  if needed, Prompt 2, Prompt 3, Prompt 4, Prompt 5. Treat each prompt as the
  spec for that iteration of index.html.
- Commit after every step and after every prompt with a message naming the step.
- If a step's output misses, rerun the step once with the same prompt. Do not
  add more words. If it misses twice, stop and show me both results.
- Keep a running log in docs/SUPERVISOR-LOG.md: step, start time, what was
  produced, test results, open questions. Append, never rewrite.

ROLE 2, FACE-TO-FACE. Some decisions are mine, not yours. Stop and ask me with
clickable options whenever one comes up. Never invent my answer. These are mine:
- every /grilling question (ask me, wait, then continue)
- the choice between the three UI prototypes
- any finance fact where docs/research/roadmap-facts.md contradicts the HTML
  (show me both, let me decide what the card says)
- anything that would delete or overwrite content from the HTML
- the verdict after each play-test (I may overrule your diary)
Everything else, decide yourself and note the decision in the log.

ROLE 3, OBSERVER. After Prompt 0, Prompt 2, Prompt 3 and Prompt 5, play the game
like a stranger who does not care about finance. Use Claude in Chrome on the
built index.html served over http (python -m http.server), never file://.
For each play-test:
- Record a GIF of the full session, named playtest-<prompt>-<lang>.gif.
- Play once in FA, once in EN, once in Both. Phone width 360 px and desktop.
  Light and dark theme.
- Deliberately answer wrong at least three times. Check: did a hint appear,
  did the hint quote the source line, was the right answer shown in an
  earlier card in the same station. Any "no" is a fairness bug.
- Reload mid-station. Progress must survive. Open DevTools Application tab
  and confirm the key is fi-roadmap-v1. Clear storage and confirm the game
  still runs.
- Read the console. Any error is a bug.
- Time yourself. Any screen where you read for more than 20 seconds without
  an interaction, write it down as a boredom point.
- Check RTL: mixed Farsi text with Latin terms (VWCE, DCF, Box 3) must not
  break direction. Tables must mirror. Progress bars must fill from the
  correct side.
Write a diary in docs/playtests/<prompt>.md in first person, with timestamps:
where I got bored, where I got confused, where I got it wrong and whose fault
it was, what I enjoyed, what I remembered about finance five minutes later.
Then turn the diary into the bracketed lists for Prompt 2, and into concrete
fix requests after Prompt 3 and Prompt 5.

TESTING. Vitest must be green before every commit. The six tests from Step 6
are mandatory; add one more for every bug a play-test finds. Never delete a
failing test to go green.

FINISH. When Step 10 is done, write docs/FINAL-REPORT.md with: what was built,
the test count and status, the four play-test diaries summarised in one
paragraph each, every finance fact that was changed because of research and
why, the GitHub Pages URL, and a list of what a human should still check
by hand. Then show me the report and stop.

Constraints: no external scripts in index.html, disclaimer always visible,
every string in i18n for both fa and en, all source facts preserved unless
research proved them wrong and I approved the change. Ask before anything
irreversible. If you are blocked on something only I can do, say exactly what
and wait.
```

---

# Appendix A: Original single-shot prompt (v1)

Kept for reference. Use Part 2 instead; this one asks for the whole app in one message, which the video warns produces slop.

## Source: Prompt: Convert the Financial Independence Roadmap into a Fun, Interactive, Dual-Language Learning App

Paste everything below this line into the model, followed by the full contents of `financial_independence_roadmap_clean.html`.

---

You are a senior front-end engineer and learning-experience designer. Convert the attached HTML document (a Persian/Farsi "Roadmap to Financial Independence with Capital and Knowledge") into a single self-contained, interactive, dual-language (Farsi + English) learning web app. Output one `index.html` file only, with all CSS and JavaScript inline. No build step, no frameworks, no external requests except Google Fonts (Vazirmatn for Farsi, Inter for English).

### 1. Content rules (non-negotiable)

- Preserve every fact, number, book, author, URL, caveat and ordering from the source. Do not add financial advice. Keep the disclaimer "آموزشی است، نه توصیه خرید" / "Educational, not investment advice" visible on every screen.
- Produce a faithful English translation of every Farsi string. Keep book titles, tickers (VWCE, IWDA), institutions (Interactive Brokers, DEGIRO, belastingdienst.nl, ind.nl), and terms like cap table, term sheet, DCF, Box 3, 30% ruling in English in both languages.
- Store all copy in one JavaScript object: `i18n = { fa: {...}, en: {...} }` keyed by stable IDs. No hard-coded text in the markup.
- Persian digits in Farsi mode (۱۲۳), Latin digits in English mode. Currency stays in euros (€).

### 2. Dual-language behaviour

- A language toggle in the header: `FA | EN`. Switching is instant, no reload, and re-renders every string.
- Farsi mode sets `<html lang="fa" dir="rtl">`, English sets `lang="en" dir="ltr"`. Layout, icons, progress bars and tables must mirror correctly in both directions. Use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`).
- A third mode, `Both`, shows each item with Farsi on top and English directly beneath in a muted colour, so the reader can learn finance vocabulary in both languages at once.
- Any English term inside Farsi text keeps `direction: ltr; unicode-bidi: isolate`.
- Remember the chosen language in `localStorage` and fall back to Farsi.

### 3. Structure: turn the document into a journey

Map the six source sections onto a game-like "quest" layout:

1. **Home / Map screen.** A vertical path with six stations (Reality Check, Knowledge Roadmap, What NOT to Learn, Getting Better, Next 6 Months, Library), each with an icon, a progress ring and an estimated time. Locked-looking but never actually locked, so the user can jump anywhere.
2. **Station 1, The Math Reality.** Make the numbers tangible. Add an interactive slider: capital (€10k to €1M) and real return (3% to 8%) that live-computes annual income, and a second slider for annual expenses that shows the "25x rule" target. The source's four bullets become the explanation beside the sliders.
3. **Station 2, Knowledge Roadmap.** The five stages become swipeable or clickable cards. Each card: stage number, topic, resources, a "2-3 months" chip, and a Done checkbox. Keep the green note about Iranian citizenship, BSN and brokers as a highlighted callout.
4. **Station 3, What NOT to Learn.** A short "myth-buster" quiz: 4 to 6 true/false statements derived strictly from the source (forex, signals, day trading, leverage, "the industry that sells hope to engineers"). Instant feedback that quotes the source line.
5. **Station 4, Getting Better.** The five habits become a weekly habit tracker with checkboxes (1 h/day reading, decision journal, quarterly net-worth log, mentor, sleep/body). Add a small "decision journal" textarea stored in `localStorage` with a 6-month review reminder date.
6. **Station 5, Next 6 Months.** Two checklists exactly as in the source: "Before the Netherlands" and "After BSN". Checked items persist. Show overall completion percentage.
7. **Station 6, Library.** All six book tables as a filterable grid: filter by stage, by ⭐ must-read vs ○ optional, and a search box. Each book card shows title, author, the "why" line in both languages, and a Read / Reading / To-read status. Below it, the "first 6 months reading order" list rendered as a numbered reading plan with the rule "2 books per month, one page of notes per book in your own language".

Global: a sticky header with the language toggle, a total-progress bar, and a "reset progress" button behind a confirm step.

### 4. Fun, but restrained

- Micro-interactions: cards lift on hover, checkboxes animate with a soft tick, stations fill their ring when all their tasks are done, a small confetti burst (pure CSS or tiny canvas, no library) when a station reaches 100%.
- A light "XP" counter that increments per completed item, with milestone labels taken from the content ("First €100 of ownership income" is the final milestone). No streaks, no dark patterns, no pressure.
- Tone: warm and plain. No emoji in body copy. Icons are inline SVG.

### 5. Visual and technical requirements

- Keep the source palette as the base (`--accent: #0f766e`, soft green callouts, amber disclaimer) and add a dark theme that respects `prefers-color-scheme` with a manual override.
- Mobile-first, works at 360 px width, no horizontal scroll. Tables collapse into cards on narrow screens.
- Accessible: semantic HTML, every control keyboard-reachable, visible focus, `aria-pressed` on toggles, `aria-live="polite"` for the XP counter and slider output, colour contrast at least 4.5:1.
- All progress state in `localStorage` under one key, `fi-roadmap-v1`, as JSON. Wrap every read and write in try/catch so the page works with storage disabled.
- Under 200 KB total. No images except inline SVG.
- Code quality: one `render()` function driven by `state` and `lang`, event delegation on the main container, no globals besides `state`, `i18n` and `render`.

### 6. Deliverable

Return only the complete `index.html` in a single code block. After the code block, add a 5-line checklist confirming: all source content present in both languages, RTL and LTR verified, progress persists, no external scripts, disclaimer always visible.


---

# Appendix B: Video wisdom

## Source: Extract Wisdom: "How to vibe code 3D games with Fable 5"

Source: https://www.youtube.com/watch?v=LpI-XCMXHuo
Speaker: an indie consumer-app developer who shipped El Taxico, a 3D Spanish-learning driving game, in one week with Fable 5 without writing code.

### SUMMARY

The speaker built and shipped a 3D educational arcade game in a week by prompting Fable 5, and lays out a repeatable playbook: fuse existing mechanics, prototype only the core loop, show the model references instead of describing them, tune rewards and difficulty by actually playing, and monetize like an app, not like a game.

### IDEAS

- Fable 5 is the first model that takes a complex, open-ended build like a 3D game and fills the gaps itself; Opus needed hand-holding at every step.
- Models are weak at inventing new game ideas but strong at replicating mechanics that already exist.
- Novelty comes from fusion: combine three existing mechanics (Subway Surfers lanes, Crazy Taxi fares, a toy's three-lane traffic) into one game.
- Dumping the entire game spec (menus, power-ups, game-over screens) into the first prompt produces "technically impressive slop".
- The first prompt should describe only the smallest, most important thing: the core game loop.
- A casual game lives or dies on a core mechanic a player understands within a moment of playing.
- The same prompt run twice produced one unusable game and one that nailed the feel; variance is high, so rerun rather than over-explain.
- Fable picks a direction and runs with it; sometimes wrong, sometimes inspired. Opus needs you to be prescriptive about everything.
- The first working build is a technical demo, not a game. The real work starts after it runs.
- Builders think their game is fun because they built it; judge it as a stranger would.
- Boredom is the enemy. A learning game is not allowed to be boring; fun first, learning incidental.
- Showing beats telling: a video of a toy, a hand sketch of a bad spawn pattern, a named film shot all worked better than paragraphs.
- A sketch with an X over the offending car fixed a procedurally generated traffic pattern that was impossible to describe in text.
- Game over should only ever come from the player's own unforced error, never from the design boxing them in.
- Rewards must exist on three horizons: short-term (coins), mid-term (fares/learning), long-term (high score, levels, unlocks).
- The difference between slop and a real game is in small details: car suspension and lean, exaggerated crashes, dynamic camera.
- Exaggerated physical feedback (a crash you feel in your stomach) creates emotional connection to surviving.
- Talk to the model like a film director; camera work creates immersion that gameplay alone cannot.
- Three camera moments carry the game: wide-to-close on load, pull-out on turbo, dolly zoom at the decision point.
- Each camera move says something: wide = you are small in a big world; pull-out = speed; dolly zoom = this moment matters.
- Use cinematic moves sparingly; they only land because they are rare.
- Two progression models: Flappy Bird (one mechanic gets faster) or Super Mario (level design ramps across the game).
- A one-mechanic reaction game cannot carry a 20-level progression system; pick progression that is already in the game's DNA.
- For a language game, progression is Duolingo-style word packs, with each level themed (marketplace, beach, city) and a creeping start speed.
- Ad-funded games need millions of daily users; a currency converter built in an afternoon out-earns a game built over years.
- Viral spikes die; organic search is what lasts. Target a keyword people already search for.
- Nobody searches "fun arcade driving game"; people search "learn Spanish". Build the game people are already searching for.
- Charge like an app (free first level, subscription with free trial), not like a game (coins, gems, skins).
- Piano Paws, a note-recognition game disguised as fun, made $500 in two weeks, the speaker's best game launch.
- El Taxico had 204 downloads and 4 trial sign-ups in its first 14 hours; the real test is organic search for "learn Spanish".

### INSIGHTS

- Creativity with a model comes from recombining proven parts, not from asking it to invent.
- Scope of the first prompt determines quality; the smaller the ask, the better the foundation.
- The model's output is where the designer's job begins, not where it ends.
- Visual and physical references transfer intent with far less loss than prose.
- "Feel" is engineered through secondary motion and camera, not through more features.
- Reward design across time horizons is what turns a mechanic into a habit.
- Fairness (deaths only from player error) is a prerequisite for players to blame themselves and retry.
- Progression should be discovered inside the game's premise, not bolted on.
- Distribution is a search problem; pick a demand that already exists and wrap the fun around it.
- Pricing follows user intent: someone searching to learn will pay like an app customer, not a gamer.

### QUOTES

- "Vibe coded in a week with Fable 5. I didn't write a single line of code."
- "Fable 5 just isn't very good at inventing something new, but it is good at replicating game mechanics that already exist."
- "Fusion, baby."
- "If you dump too much information at the beginning... you get slop. Like, really technically impressive slop."
- "A casual game lives or dies on a core mechanic so simple that you can just get it within a moment of playing."
- "It fills the empty gaps for you. It makes an assumption and builds on that assumption."
- "Your actual job starts now. Making the game loop fun."
- "Boredom is the enemy of any game."
- "I want it to be fun first. The learning has to be incidental."
- "When the player dies, it should be their own fault."
- "Less about the words and more about just showing it the thing."
- "I talked to Fable like I'm a film director."
- "All of these camera angles are subtle, and I use them sparingly. Each one is saying something unique."
- "You don't actually need to know how to code to build a game anymore, but it does help to know the cinematic director terminology."
- "Nobody's searching for fun arcade driving game, but people are searching for learn Spanish."
- "Charge for it the same way apps charge, not the way that games charge."

### HABITS

- Start every project from a real-world reference (a toy on the dining table).
- Build a bare prototype of the loop first and play it before adding anything.
- Rerun the same prompt when the first result misses, instead of over-specifying.
- Play the game repeatedly as a stranger would and write down where boredom sets in.
- Put the keyboard down and sketch when words fail to describe a mechanic.
- Watch films and note the names of camera shots that grab attention, then reuse them in prompts.
- Target an App Store keyword with real search volume before building.
- Check early metrics (downloads, trial sign-ups) and judge by organic search traffic, not launch spikes.

### FACTS

- El Taxico was built in one week with Fable 5; all assets except the logo, app icon and splash page were generated by code.
- Crazy Taxi is a Sega arcade game from 1999.
- The dolly zoom was used by Alfred Hitchcock in Vertigo in 1958.
- Camera terms: pan (horizontal rotation), tilt (vertical rotation), dolly (moving the camera through space), tracking shot (following a subject), wide / medium / close-up for composition.
- Piano Paws earned $500 in its first two weeks.
- El Taxico had 204 downloads and 4 trial sign-ups after 14 hours live.
- The speaker's next project is a 2D game where Fable generates its own image assets via image generation over MCP.

### REFERENCES

- Fable 5, Opus, GPT-5.6 Soul (mentioned, untested)
- Subway Surfers, Crazy Taxi (Sega, 1999), Flappy Bird, Super Mario World, Duolingo
- Vertigo (Hitchcock, 1958), Spielberg as a reference for director-style prompting
- Speaker's apps: El Taxico, Swipe the Cat, Flappy Note, Piano Paws
- SwiftUI, App Store, MCP

### ONE-SENTENCE TAKEAWAY

Fuse proven mechanics, prompt only the core loop, show the model references instead of describing them, then earn the fun through play-testing and monetize like an app.

### RECOMMENDATIONS

- Fuse two or three existing mechanics instead of asking the model for an original game.
- Make the first prompt describe only the core loop; defer menus, power-ups and progression.
- Attach a photo, video or sketch of the reference instead of a paragraph of description.
- Rerun a prompt that misses rather than adding more words to it.
- Treat the first working build as a demo and start the real work of making it fun.
- Play-test as a stranger and remove every stretch where nothing happens.
- Make every death the player's own fault; sketch and remove unfair patterns.
- Layer rewards on short, mid and long horizons.
- Add secondary motion (lean, suspension, exaggerated crash) to make the world feel alive.
- Script three or four camera moments in director language and use them sparingly.
- Choose a progression model that already lives in the premise and theme each level.
- Build what people already search for, make it fun first and the learning incidental.
- Monetize with a free first level and a subscription trial, not with coins and gems.
