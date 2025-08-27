# Ultimate D&D Tools — Comprehensive Product Spec (Pre-2024 Rules)

## 0) Mission & Scope
**Mission:** Be the definitive lab for D&D character optimization: model builds, simulate combat across realistic scenarios, compare power curves 1–20, and evaluate non-combat pillars with transparent math.

**Rules scope:** D&D 5e (2014 core + allowed expansions). Per-table variant toggles. No 2024 content.

---

## 1) User Stories (condensed)
- As an optimizer, I can enter a build and immediately see **3-round DPR** vs a chosen AC, with **Sharpshooter/GWM window**.
- As a planner, I can view **DPR across levels 1–20** and compare up to **3 builds**.
- As a tactician, I can set **scenario policies** (Action Surge, Smites, BA conflicts, Concentration) and see the **impact**.
- As a teammate, I can add **party auras/buffs** and **enemy presets**, then forecast **adventuring day** outcomes.
- As a table host, I can score **non-combat pillars** with a clear, explainable rubric.
- As a builder, I can **optimize** feat/ASI/multiclass paths to targets and run **sensitivity** analysis to see what really matters.

---

## 2) Information Architecture (top-level nav)
1. **Library** – save/load builds; tag and duplicate.
2. **Build Editor** – class/subclass/level, abilities, feats, features, profiles (weapons/spells), items.
3. **Combat Lab** – scenario controls, policies, 3-round DPR, DPR vs AC, time-to-kill, explanation drawer.
4. **Compare Room** – choose up to 3 builds, view 3-round comparison, level curves, pillar radar, toggle windows table, snapshot diffs.
5. **Pillar Scorecards** – Social, Exploration, Control, Mobility, Survivability; weights + probability curves.
6. **Party & Day Planner** – party aura/buff sandbox, enemy presets, terrain presets, adventuring-day resource burn.
7. **Leveling Planner** – branching level paths, milestone spikes, itemization toggles.
8. **Optimize & Analyze** – auto-optimizer, sensitivity (tornado) charts.
9. **Settings** – rules toggles, rounding, AC-by-level table, house rules, content packs, exports.

**Sticky bars:**  
A) **Scenario** (AC, advantage, cover/presets) · B) **Policy** (SS/GWM, Action Surge round, Smite policy, BA allocation, concentration) · C) **Assumptions** (flanking on, gritty rests, etc.)

---

## 3) Feature Breakdown

### 3.1 Build Editor (data, not vibes)
- **Basics:** Class, Subclass, Level (1–20), Background tags (for pillar scoring).
- **Abilities & Proficiency:** Scores, PB, expertise flags, saves.
- **Feats & Fighting Styles:** SS/GWM/PAM/XBE/Elven Accuracy, Archery, Dueling, etc.
- **Features & Riders:** Sneak Attack progression, Rage, Smite rules, Hex/Hunter’s Mark, Hunter features, Battlemaster dice, Hexblade’s Curse, Extra Attack scaling, crit range modifiers.
- **Profiles:** Weapon attacks, cantrips, spells (save DCs), summoned/companion stat blocks (lightweight).
- **Items:** +X gear, ammo types, consumables; rarity presets and manual overrides.
- **Validation:** Conflicts (e.g., Hex and Hunter’s Mark together), missing ability mods, illegal combos.

### 3.2 Combat Lab (from calculator to lab)
- **AC & Advantage:** Single AC or range; advantage/disadvantage; Elven Accuracy; cover/range brackets; Bless/Bane dice.
- **Policies (per-scenario):**  
  - SS/GWM: **auto** (compute best per-AC) | **always on** | **off**  
  - **Action Surge** round; **Smite policy** (never/first hit/crit only/threshold); **BA conflicts** resolution; **Reaction** fishing (PAM/Sentinel OA chance); **Ready** usage; **Reload/Draw** friction.
  - **Concentration uptime:** compute break chance (Con saves, War Caster, Resilient Con, temp HP).
- **Enemies & Terrain:** Presets (brute/caster/knight/legendary), resist/immune/vulnerable mixes; terrain presets (darkness, difficult terrain, underwater, webs/chokepoints).
- **Outputs:**
  - **3-Round DPR** (mean; crit rate; rider usage)  
  - **DPR vs AC chart** with **toggle windows** shaded  
  - **Time-to-Kill (TTK)** vs a target HP pool  
  - **Once-per-turn** allocation (Sneak Attack etc.) correctness badge
  - **Explanation drawer:** why SS flips at AC N, where crit chains pay off, what assumptions apply
- **Modes:** **Nova** (alpha strike), **Typical** (single encounter), **Attrition** (adventuring day with rest rules).

### 3.3 Leveling Planner (1–20 power curve)
- Show DPR per level using a default enemy AC table (overrideable).
- Milestone markers for feats, subclass features, Extra Attack, ASIs.
- Branching path preview (e.g., EK11/Chrono9 vs EK11/Scout9) with quick compare.

### 3.4 Compare Room (up to 3 builds)
- **Tabs:** 3-Round DPR (bars) · **Level Curves** (overlay) · **Pillar Radar** · **Toggle Windows** table · **Snapshot Diff** (what changed, why outputs changed).
- Export comparison as JSON/share link/print sheet.

### 3.5 Pillar Scorecards (non-combat, measurable)
- **Social:** success probability vs DC bands (10/15/20/25) with advantage/expertise, Guidance, Enhance Ability, Help actions, reliable talent.  
- **Exploration:** travel speed, stealth group checks, languages/telepathy, rituals, navigation, encumbrance/carry, environmental access (climb/flight/teleport/underwater).  
- **Control & Mitigation:** “turns denied” estimate for key spells (hold person, web, hypnotic pattern), battlefield shaping; survivability via **effective HP** (AC, resistance, temp HP, Shield, Absorb Elements).  
- **Mobility:** average tactical reposition options and action costs.  
- **Weights:** campaign sliders (e.g., Social 2×).  
- **Outputs:** Radar + bullet rationale explaining each score.

### 3.6 Party & Day Planner
- **Party sandbox:** add party roles and auras/buffs (Bless bot, Aura of Protection, Faerie Fire source, Defender mark), with stacking rules and concentration conflicts.
- **Enemy presets:** quick set or custom statlines (AC/HP/save spreads/resists).
- **Adventuring day:** string encounters by difficulty; track resource burn, DPR drift, expected rests, and where the build shines/fades.

### 3.7 Optimize & Analyze
- **Auto-optimizer:** Given constraints/targets (ranged, no concentration, stealth priority), search ASI/feat/multiclass space to maximize a weighted score (combat + pillars). Returns top candidates with explanations.
- **Sensitivity analysis:** Tornado chart of marginal gains (e.g., +1 DEX vs Sharpshooter vs Fighting Style swap).
- **Monte Carlo validator:** Optional stochastic runs for corner cases; report variance bands next to EV.

### 3.8 Usability Power-Ups
- **Scenario presets & quick switch**: Boss opener / Trash wave / Darkness ambush / Flying foe.
- **Policy DSL (readable scripts):**  
  `R1: ASurge; BA=Hex; Smite=CritOnly; OA=Sentinel(0.35)`  
  Shareable and versioned per build.
- **Audit log:** Per-round ledger explaining what fired and why.
- **Snapshot diffing:** Before/after highlighting impact of a change.

### 3.9 Extensibility & Content Hygiene
- **Content packs:** JSON modules for new subclasses/feats/items; validator to keep math sane.
- **Rules expression engine:** Tiny formula language to encode features without hard-coding everything.
- **Versioning:** Pin builds to ruleset versions; show diffs when toggles/errata change outcomes.

---

## 4) Data Model (high-level JSON sketches)

**Build**
```json
{
  "id": "uuid",
  "name": "EK Archer",
  "level": 8,
  "class": "Fighter",
  "subclass": "Eldritch Knight",
  "abilities": {"STR":8,"DEX":18,"CON":14,"INT":16,"WIS":12,"CHA":9},
  "proficiency": 3,
  "feats": ["Sharpshooter","Elven Accuracy"],
  "features": {
    "fightingStyle":"Archery",
    "sneakAttackDice":0,
    "actionSurge":1,
    "extraAttack":1,
    "hexbladeCurse": false
  },
  "profiles": [
    {
      "id":"longbow",
      "type":"weapon",
      "attackBonusFormula":"PB + DEX + style + item",
      "damageHit":"1d8+DEX",
      "damageCrit":"2d8+DEX",
      "critRange":20,
      "riders":[{"name":"Hex","dice":"1d6","oncePerTurn":false}]
    }
  ],
  "items":[{ "slot":"weapon","name":"+1 Longbow","bonus":1 }],
  "tags":["ranged","no-concentration"]
}
```

**Scenario**
```json
{
  "enemy": {"ac":16,"hp":90,"resists":["piercing"],"immunes":[]},
  "advantage":"normal",
  "cover":0,
  "rangeBracket":"normal",
  "buffs":{"Bless":"1d4","FaerieFire":false},
  "terrain":"none",
  "policies":{
    "ss":"auto",
    "gwm":"off",
    "actionSurgeRound":1,
    "smite":"critOnly",
    "bonusAction":"prefer-hex",
    "reaction":{"sentinelChance":0.35},
    "concentrationUptime":"compute"
  },
  "mode":"typical"
}
```

**Party**
```json
{
  "members":[
    {"role":"Paladin","auraOfProtection":5},
    {"role":"Cleric","buffs":["Bless"]}
  ],
  "concentrationConflicts":["Bless","Faerie Fire"]
}
```

---

## 5) Math Engine (deterministic core, later optional Monte Carlo)

**Hit & crit math**
- Exact **P(hit)**, **P(crit)** with advantage/disadvantage/Elven Accuracy and modifier dice (Bless/Bane).
- **GWF rerolls**, **Halfling Luck**, crit-range expansion handled cleanly.

**Damage EV**
- Per-attack: `EV = P(noncrit) * DPH + P(crit) * DPC`.
- Apply SS/GWM modifiers and on-hit riders straightforwardly.

**Once-per-turn allocation**
- Riders like Sneak Attack/Hex: model **P(first hit is crit)** and **P(at least one hit)** to place them correctly.

**Concentration uptime**
- Expected rounds of concentration given incoming damage profile & Con saves (War Caster/Resilient Con/temp HP).

**AoE & Saves**
- Save-for-half expected value; multi-target density presets (e.g., “3 targets packed”, “5 loose”).

**TTK & Initiative**
- Expected rounds to defeat HP pool; initiative bonuses modeled for “go first” value on nova sequences.

**Toggle windows**
- For AC in [A..B], compute **DPR(normal)** vs **DPR(-5/+10)** → record crossover points and shaded window.

**Attrition mode**
- Track resource budgets (slots, AS/Second Wind/battlemaster dice/rage) across an adventuring day profile.

**Validation**
- Golden tests replicating known calculator scenarios; edge-case unit tests (advantage with Bless, save-for-half rounding, GWF rerolls). Monte Carlo validator for hairy corners; display ±variance if enabled.

---

## 6) Non-Combat Scoring Rubric (transparent)
- **Inputs:** skill prof/expertise, tools, languages, spells/rituals, mobility modes, stealth profile, key social/control spells.
- **Outputs:**  
  - **Social:** success probability across DC bands; modifiers for language/telepathy/charm/zone of truth resistance.  
  - **Exploration:** access checklists + costs (action/time), encumbrance impacts, travel & stealth math.  
  - **Control:** expected “turns denied” for staple spells (domain library) scaled by save DCs and common enemy saves.  
  - **Mobility/Survivability:** movement options, EHP (AC, resistances, temp HP, reactions).
- **Weights & rationale:** user-set weights; expandable notes show which levers produced scores.

---

## 7) UX Notes & Components
- **Charts:** DPR vs AC (lines with shaded SS/GWM window) · Level curve (overlay) · TTK bar/line · Sensitivity tornado · Pillar radar.
- **Explainers:** Toggle a “why?” drawer on any chart; show the calculation delta that flipped a decision.
- **Audit log:** Human-readable step list per round (no black boxes).
- **Accessibility:** Keyboard nav, screen-reader labels on charts.

---

## 8) Tech & Packaging
- **Frontend:** TypeScript + React (Vite). State: Zustand or Redux Toolkit. Charts: Recharts.  
- **Math core:** Pure TS module; no UI dependencies; 100% unit-tested.  
- **Persistence:** LocalStorage + JSON import/export; shareable links (URL state compression).  
- **Deployment:** GitHub Pages/Netlify; CI with math test suite.  
- **Extensibility:** Content packs as JSON; feature formulas via a small expression language.

---

## 9) Settings & House Rules
- Variant toggles (flanking, gritty rests, crit tables, feat bans).
- Rounding behavior, damage roll style, default enemy AC-by-level table (editable).
- Content pack manager with version pins.

---

## 10) Roadmap (pragmatic)
**MVP (0.1):** Build Editor → Combat Lab basics → 3-Round DPR, DPR vs AC with SS/GWM windows → Level Curve → Compare (3 builds) → Save/Load → Assumptions banner.  
**v0.2:** Concentration uptime, BA/Reaction policies, TTK, enemy/terrain presets, explanation drawers.  
**v0.3:** Pillar Scorecards with probability curves + weights; Party sandbox.  
**v0.4:** Leveling Planner (branching), Itemization toggles, Snapshot diffing.  
**v0.5:** Optimizer + Sensitivity analysis; Scenario presets.  
**v0.6:** Adventuring Day planner (attrition), Summons/companions.  
**v1.0:** Monte Carlo validator, Policy DSL, Audit log, Content packs, Share/export polish.

---

## 11) Acceptance Criteria (selected)
- Given any single-attack build with SS on/off, the app reports **crossover AC** and shaded window in DPR vs AC.  
- A build with Concentration shows **uptime %** and changes DPR accordingly when the expected hits per round increase.  
- Party aura (Bless) increases **hit probability** in the lab and shifts SS window as expected.  
- Pillar radar changes transparently when **expertise** or **rituals** are toggled, with a note explaining the delta.  
- Optimizer returns at least **3 distinct leveling plans** satisfying constraints, each with a rationale summary.
