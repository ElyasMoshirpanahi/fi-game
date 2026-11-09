# FI Roadmap Game

A single-page, dual-language (Farsi and English) learning game built from one Farsi roadmap to financial independence. The player walks a path of six stations, reads one idea at a time, answers checks, and earns rewards. The glossary has two halves: the words of the game, and the finance words the player is there to learn.

## Game language

**Path**:
The vertical sequence of six Stations shown on the home screen. Any Station can be opened from the Path at any time.
_Avoid_: map, journey, course, tree

**Station**:
One of the six stops on the Path, each built from one section of the source roadmap: Reality Check, Knowledge Roadmap, What NOT to Learn, Getting Better, Next 6 Months, Library. A Station holds Cards, Checks and one Fare.
_Avoid_: level, lesson, unit, chapter, module, section (reserved for the source HTML)

**Lit Station**:
A Station whose Fare has been passed. A Lit Station shows its Badge and theme colour on the Path and counts toward XP.
_Avoid_: completed, unlocked, done

**Card**:
One idea from the source, shown in the active Language Mode, at most two sentences per language. Every Card traces to a line of the source HTML.
_Avoid_: slide, page, tip, fact

**Check**:
One question that follows a Card or a group of Cards. Three kinds exist: Tap-one (pick one of several answers), True/false, and Order (place items in sequence). A Check is only fair when its answer appeared in a Card earlier in the same Station.
_Avoid_: quiz, question, exercise, test

**Hint**:
The source line, in both languages, revealed after one wrong answer on a Check.
_Avoid_: explanation, clue, tip

**Rating**:
The player's self-judgement on a flipped Card: "knew it" or "didn't know". A "didn't know" Rating causes a Return.
_Avoid_: score, grade, confidence

**Return**:
A Card re-entering the queue later in the same session because of a "didn't know" Rating or a missed Fare question. Returns happen before the Fare. Nothing about a Return survives a reload.
_Avoid_: review, repeat, spaced repetition

**Fare**:
The three-question recap that closes a Station, drawn only from that Station's Cards. Passing all three turns the Station into a Lit Station. Failing any shows the missed Cards again and draws a fresh Fare.
_Avoid_: final, boss, exam, recap quiz

**Coin**:
The short-term reward. One Coin per correct Check answer. Coins never decrease.
_Avoid_: point, gem, star

**Ring**:
The circular progress indicator on a Station, filled by correct answers within that Station.
_Avoid_: progress bar (reserved for XP), circle, meter

**Badge**:
The mid-term reward earned when a Station becomes Lit. Each Badge is named from the Station's source content.
_Avoid_: achievement, trophy, medal

**XP**:
The long-term total across all Stations, shown as one bar in the header.
_Avoid_: score, total, level

**Milestone**:
The single final reward, "First €100 of ownership income", granted only when both Checklists in the Next 6 Months Station are complete.
_Avoid_: ending, final badge, win

**Checklist**:
One of the two persisted to-do lists in the Next 6 Months Station: Before the Netherlands, and After BSN. Taken verbatim from the source.
_Avoid_: tasks, todo

**Shelf**:
The Library Station's view of all 30 books, each with a reading state: To-read, Reading, Read.
_Avoid_: bookshelf, list, grid

**Language Mode**:
One of FA, EN or Both. FA shows Farsi with Persian digits in a right-to-left page. EN shows English with Latin digits in a left-to-right page. Both shows English on top and Farsi beneath in a left-to-right page. The default is EN.
_Avoid_: locale, language setting, translation toggle

**Disclaimer**:
The always-visible line "آموزشی است، نه توصیه خرید" / "Educational, not investment advice".

## Finance language

Each term carries the Farsi form the source uses, then the English. Terms the source keeps in English inside Farsi text stay in English in both modes.

**25x rule** (قاعده ۲۵ برابر):
Capital of at least 25 times annual expenses, the amount the source says lets you live from "money from money".
_Avoid_: 4% rule (the same idea from the withdrawal side; use only when quoting a source), FIRE number

**Real return** (بازده واقعی):
Investment return after inflation. The source quotes 5 to 8 percent as the working range.
_Avoid_: nominal return, yield, interest

**Ownership** (مالکیت):
Holding a share of something that produces value: startup equity, a product, a business. The source says wealth is built by Ownership and made permanent by investing.
_Avoid_: equity (use for the specific instrument), assets

**Ownership income** (درآمد مالکیتی):
Money earned from something you own rather than from hours worked. The source's first target is €100 of it.

**Compounding** (مرکب شدن):
Returns earning returns over time. First topic of Knowledge Stage 1.
_Avoid_: compound interest

**Diversification** (تنوع):
Spreading capital across assets so one failure does not sink the whole.

**Liquidity** (نقدشوندگی):
How quickly an asset turns into cash without losing value.

**Index ETF** (ETF شاخصی):
An exchange-traded fund that tracks a market index. The source names VWCE (Vanguard FTSE All-World) and IWDA (iShares Core MSCI World).
_Avoid_: index fund (fine in prose, but the source means the ETF form), tracker

**Core-satellite** (core-satellite):
A portfolio shape: a large core of index ETFs, a small satellite of deliberate bets. The source gives 80 percent core, 20 percent satellite.
_Avoid_: 80/20 portfolio

**Asset class** (طبقه دارایی):
A broad category of investment: equities, bonds, REITs, gold, crypto.

**REIT** (REIT):
Real estate investment trust, a listed vehicle holding property.

**DCF** (DCF):
Discounted cash flow, a valuation method that prices a business by its future cash flows brought to today's value.
_Avoid_: valuation (the broader activity)

**Unit economics** (unit economics):
The revenue and cost of one unit of a business, one customer or one sale.

**Tax residency** (اقامت مالیاتی):
The country whose tax law applies to you, determined by where you live and your ties, not by citizenship.
_Avoid_: domicile, residence permit

**Box 3** (Box 3):
The Dutch income tax category for savings and investments.
_Avoid_: wealth tax, capital gains tax

**30% ruling** (30% ruling):
The Dutch tax facility for qualifying expatriate employees that exempts part of salary from tax for a limited period.
_Avoid_: expat ruling, tax break

**Tax treaty** (معاهده مالیاتی):
An agreement between two countries on which one taxes what, to avoid double taxation.

**BSN** (BSN):
Burgerservicenummer, the Dutch citizen service number issued on registration. The source treats it as the gate to opening a broker account.

**Broker** (کارگزار):
The firm through which you buy and hold ETFs and shares. The source names Interactive Brokers and DEGIRO.
_Avoid_: exchange, bank, platform

**Cap table** (cap table):
The record of who owns what share of a company.

**Term sheet** (term sheet):
The non-binding summary of an investment deal's terms, signed before the full contract.

**Vesting** (vesting):
Equity earned over time rather than granted at once.

**Angel investing** (سرمایه‌گذاری فرشته):
An individual investing their own money in early-stage startups.

**Idea validation** (اعتبارسنجی ایده):
Testing whether people want a product before building it. The source points to The Mom Test.

**Decision journal** (دفتر تصمیم):
A written record of each financial decision and its reason, re-read six months later.

**Feynman method** (روش فاینمن):
Learning by explaining the idea in your own words, in your own language.

**Net worth** (دارایی خالص):
Assets minus debts, logged every three months in the source's plan.

**Knowledge Stage** (مرحله):
One of the five source stages of the knowledge roadmap, each 2 to 3 months: Foundations, Asset classes and portfolio, Valuation, Tax and geography, Ownership. The Library adds a sixth table, Getting better. A Knowledge Stage is source content; a Station is a game stop. They are not the same thing.
_Avoid_: level, phase, step, station

**Must-read** (⭐ حتماً بخوان):
A book marked ⭐ in the source Library. Only Must-reads appear in the Reading Order.
_Avoid_: essential, required

**Optional** (○ اختیاری):
A book marked ○ in the source Library, for later.

**Reading Order** (ترتیب خواندن):
The source's numbered list of ten Must-reads for the first six months, with the rule "2 books per month, one page of notes in your own language".
_Avoid_: reading plan, syllabus
