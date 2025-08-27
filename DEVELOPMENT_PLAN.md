# Ultimate D&D Tools - Complete Development Plan

## Project Overview
A comprehensive D&D 5e character optimization tool for modeling builds, simulating combat scenarios, comparing power curves across levels 1-20, and evaluating non-combat pillars with transparent mathematical calculations.

## ✅ Phase 1: Foundation (COMPLETED)

### Project Infrastructure ✅
- TypeScript + React (Vite) project setup
- Development environment (ESLint, Prettier, Vitest)
- Dependencies installed (Zustand, Recharts)
- Complete folder structure aligned with spec sections

### Core Math Engine ✅
- **Probability Module**: Hit/crit calculations, advantage/disadvantage, Elven Accuracy, modifier dice
- **Damage Module**: Average damage, GWF rerolls, SS/GWM optimization
- **Combat Module**: 3-round DPR, DPR vs AC, time-to-kill foundations
- **Pillars Module**: Non-combat scoring (social, exploration, control, mobility, survivability)
- **Test Suite**: 21 comprehensive unit tests covering all math functions

### Type System ✅
- Complete TypeScript definitions for builds, scenarios, combat results
- Data models matching specification requirements

---

## 🎯 Phase 2: MVP Implementation (Current Phase)

### 2.1 Core Application Shell
- **Main Layout Component**: Top-level navigation, sticky scenario/policy bars
- **Routing Setup**: Navigation between major sections (Library, Build Editor, Combat Lab, etc.)
- **Global State Management**: Zustand stores for builds, scenarios, and application state

### 2.2 Build Editor (MVP Version)
- **Basic Build Form**: Class/subclass selection, level input, ability scores
- **Feat Selection**: Sharpshooter, GWM, PAM, Elven Accuracy, etc.
- **Attack Profiles**: Weapon attacks with damage formulas
- **Validation System**: Conflict detection, illegal combination warnings
- **Save/Load Functionality**: Local storage persistence

### 2.3 Combat Lab (Core Features)
- **Scenario Controls**: AC input, advantage toggle, enemy presets
- **Policy Settings**: SS/GWM auto/on/off, Action Surge round, Smite policy
- **DPR Calculations**: 3-round DPR display with explanation
- **DPR vs AC Chart**: Interactive chart showing crossover points
- **Toggle Windows**: Shaded regions showing SS/GWM optimal ranges

### 2.4 Library System
- **Build Management**: Save, load, duplicate, delete builds
- **Build List**: Searchable list with tags and filters
- **Export/Import**: JSON export for sharing builds

### 2.5 Compare Room (Basic)
- **Build Selection**: Choose up to 3 builds for comparison
- **Side-by-Side DPR**: Bar charts showing 3-round DPR comparison
- **Basic Level Curves**: Line chart showing DPR across levels 1-20

---

## 🚀 Phase 3: Enhanced Features

### 3.1 Advanced Combat Mechanics
- **Concentration Uptime**: Calculate break chances with Con saves, War Caster, etc.
- **Bonus Action Policies**: Resource allocation and conflict resolution
- **Reaction Timing**: PAM/Sentinel opportunity attacks, Ready actions
- **Enemy Presets**: Brute/caster/knight templates with resistances
- **Terrain Effects**: Darkness, difficult terrain, underwater modifiers

### 3.2 Pillar Scorecards
- **Social Scoring**: Success probability vs DC bands with expertise/advantage
- **Exploration Metrics**: Travel speed, stealth, languages, rituals
- **Control Evaluation**: "Turns denied" estimates for key spells
- **Mobility Assessment**: Tactical repositioning options
- **Survivability Analysis**: Effective HP with AC, resistances, reactions
- **Radar Chart Visualization**: Interactive pillar comparison charts

### 3.3 Advanced Visualization
- **Explanation Drawers**: "Why?" explanations for all calculations
- **Sensitivity Analysis**: Tornado charts showing marginal gains
- **Snapshot Diffing**: Before/after highlighting for changes
- **Interactive Charts**: Hover tooltips, zoom, filtering

---

## 🎯 Phase 4: Optimization & Planning Tools

### 4.1 Leveling Planner
- **Branching Paths**: Visual tree of multiclass options
- **Milestone Markers**: Feat/ASI/subclass feature indicators
- **Power Spike Analysis**: Identify key breakpoints
- **Itemization Toggles**: Magic item assumption controls

### 4.2 Auto-Optimizer
- **Constraint System**: Define build requirements (ranged, no concentration, etc.)
- **Search Algorithm**: Explore ASI/feat/multiclass combinations
- **Scoring Function**: Weighted combat + pillar optimization
- **Top Candidates**: Return best builds with explanations

### 4.3 Party & Day Planner
- **Party Sandbox**: Add party members with auras/buffs
- **Buff Stacking**: Bless, Aura of Protection, Faerie Fire interactions
- **Concentration Conflicts**: Track overlapping concentration spells
- **Adventuring Day**: Resource burn across multiple encounters
- **Enemy Encounter Builder**: Custom statblocks and difficulty scaling

---

## 🏗️ Phase 5: Advanced Features & Polish

### 5.1 Monte Carlo Validation
- **Stochastic Simulation**: Variance bands for edge cases
- **Confidence Intervals**: Statistical reliability measures
- **Corner Case Testing**: Validate complex interaction scenarios

### 5.2 Content Extensibility
- **Content Packs**: JSON modules for new subclasses/feats/items
- **Rules Expression Engine**: Formula language for features
- **Version Control**: Pin builds to ruleset versions
- **Community Content**: User-generated content system

### 5.3 Advanced UX Features
- **Policy DSL**: Readable scenario scripts (e.g., "R1: ASurge; BA=Hex")
- **Audit Log**: Per-round calculation breakdown
- **Keyboard Navigation**: Full accessibility support
- **Export Options**: PDF character sheets, share links

---

## 📋 Implementation Priority Matrix

### High Priority (MVP - Phase 2)
1. **Build Editor** with basic forms and validation
2. **Combat Lab** with DPR calculations and charts
3. **Library** for save/load functionality
4. **Compare Room** for build analysis

### Medium Priority (Post-MVP - Phase 3)
1. **Pillar Scorecards** with radar visualization
2. **Advanced Combat Mechanics** (concentration, etc.)
3. **Leveling Planner** with branching paths
4. **Party & Day Planner**

### Low Priority (Future Releases - Phases 4-5)
1. **Auto-optimizer** and sensitivity analysis
2. **Monte Carlo validation**
3. **Content pack system**
4. **Advanced sharing and export features**

---

## 🎨 Technical Architecture

### Frontend Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development
- **State Management**: Zustand for global state
- **Charts**: Recharts for data visualization
- **Styling**: CSS Modules or styled-components
- **Testing**: Vitest + Testing Library

### Math Engine
- **Pure Functions**: No UI dependencies for easy testing
- **Modular Design**: Separate probability, damage, combat, pillars
- **Type Safety**: Full TypeScript coverage
- **Test Coverage**: Comprehensive unit tests for all calculations

### Data Management
- **Local Storage**: Primary persistence for builds
- **JSON Export**: Sharable build format
- **URL State**: Compressed scenario parameters
- **Validation**: Runtime type checking for data integrity

---

## 🚢 Deployment & Distribution

### Hosting
- **Platform**: GitHub Pages or Netlify
- **CI/CD**: Automated testing and deployment
- **Performance**: Code splitting and lazy loading

### Quality Assurance
- **Golden Tests**: Replicate known calculator scenarios
- **Edge Case Testing**: Advantage + Bless, save-for-half rounding
- **User Acceptance**: Match specification acceptance criteria

---

## 📂 Project Structure

```
src/
├── components/           # React components
│   ├── build-editor/    # Build creation/editing UI
│   ├── combat-lab/      # Combat scenario simulation
│   ├── compare-room/    # Build comparison tools
│   ├── library/         # Build management
│   ├── pillar-scorecards/ # Non-combat evaluation
│   ├── leveling-planner/  # Level progression tools
│   ├── party-planner/     # Party composition tools
│   ├── optimizer/         # Auto-optimization tools
│   ├── charts/           # Reusable chart components
│   └── ui/              # Common UI components
├── math/                # Pure calculation engine
│   ├── probability.ts   # Hit/crit calculations
│   ├── damage.ts        # Damage calculations
│   ├── combat.ts        # Combat simulation
│   └── pillars.ts       # Non-combat scoring
├── stores/              # Zustand state management
├── types/               # TypeScript definitions
├── utils/               # Utility functions
└── test/                # Test files
```

---

## 🎯 Next Steps

### Immediate Tasks (Current Session)
1. Create main application layout with navigation
2. Implement basic Build Editor component
3. Set up Zustand stores for state management
4. Create Combat Lab with DPR calculations
5. Build DPR vs AC chart visualization

### Short-term Goals (Next Few Sessions)
1. Complete MVP Build Editor functionality
2. Implement Library for build persistence
3. Create Compare Room for build analysis
4. Add level curve visualization
5. Polish UI/UX for core features

### Long-term Objectives (Future Development)
1. Implement all pillar scorecards
2. Add advanced combat mechanics
3. Build optimization and planning tools
4. Create content extensibility system
5. Add advanced analytics and reporting

This plan provides a comprehensive roadmap from the current foundation to a full-featured D&D optimization tool, prioritizing MVP functionality while maintaining extensibility for advanced features.