# Ultimate D&D Tools 🎲

**The definitive lab for D&D 5e character optimization**

A comprehensive web application for modeling builds, simulating combat across realistic scenarios, comparing power curves levels 1–20, and evaluating non-combat pillars with transparent mathematical calculations.

## ✨ Features

### 🏗️ **Build Editor**
- **Comprehensive Character Creation**: Classes, subclasses, abilities, feats, fighting styles
- **Smart Validation**: Point-buy calculator, proficiency bonus automation, conflict detection
- **Attack Profiles**: Weapon attacks, spell attacks, damage riders (Sneak Attack, Hex, etc.)
- **Real-time Feedback**: Instant calculations and validation as you build

### ⚡ **Combat Analysis** (Coming Soon)
- **3-Round DPR Calculations**: Realistic damage per round with policies
- **DPR vs AC Charts**: Visualize Sharpshooter/GWM toggle windows
- **Scenario Simulation**: Advantage, cover, buffs, terrain effects
- **Time-to-Kill Analysis**: Expected rounds to defeat HP pools

### 📊 **Comparison Tools** (Coming Soon)
- **Multi-Build Analysis**: Compare up to 3 builds side-by-side
- **Level Progression Curves**: Power scaling from levels 1-20
- **Pillar Scorecards**: Social, exploration, control, mobility, survivability

## 🚀 Live Demo

**[Try it now on GitHub Pages!](https://pallarran.github.io/Ultimate-D-D-Tools/)**

## 💻 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone https://github.com/Pallarran/Ultimate-D-D-Tools.git
cd Ultimate-D-D-Tools

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Testing
- **21 comprehensive unit tests** covering D&D 5e mathematical calculations
- Probability calculations (advantage, crits, Elven Accuracy)
- Damage calculations (GWF rerolls, SS/GWM optimization)
- Run tests with `npm test`

## 🏗️ Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **State Management**: Zustand with persistence
- **Charts**: Recharts for data visualization  
- **Styling**: CSS Variables with dark mode support
- **Testing**: Vitest + Testing Library
- **Deployment**: GitHub Actions → GitHub Pages

## 📋 Development Roadmap

### ✅ **Phase 1: Foundation (Complete)**
- Project setup with TypeScript + React + Vite
- Comprehensive math engine with full test coverage
- Type-safe data models and interfaces

### ✅ **Phase 2: MVP (Complete)**
- Complete Build Editor with tabbed interface
- Navigation and routing system
- Responsive design with professional UI

### 🔄 **Phase 3: Combat Analysis (In Progress)**
- DPR calculations with scenario policies
- Interactive charts and visualizations
- Build comparison tools

### 🎯 **Phase 4: Advanced Features (Planned)**
- Pillar scorecards with radar charts
- Auto-optimizer and sensitivity analysis
- Party planning and adventuring day simulation

## 🤝 Contributing

This project follows semantic versioning and conventional commits. Feel free to:
- Report bugs and request features via GitHub Issues
- Submit pull requests for improvements
- Share feedback and suggestions

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🎯 Design Philosophy

**"Transparent math, no black boxes"**

Every calculation includes:
- Clear explanations of why decisions were made
- Transparent mathematical formulas
- Configurable assumptions and house rules
- Audit trails for complex scenarios

Built for optimizers, by optimizers, with a focus on mathematical accuracy and user understanding.

---

*🤖 Proudly built with [Claude Code](https://claude.ai/code)*