import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Library from './components/library/Library';
import BuildEditor from './components/build-editor/BuildEditor';
import CombatLab from './components/combat-lab/CombatLab';
import CompareRoom from './components/compare-room/CompareRoom';
import PillarScorecards from './components/pillar-scorecards/PillarScorecards';
import PartyPlanner from './components/party-planner/PartyPlanner';
import LevelingPlanner from './components/leveling-planner/LevelingPlanner';
import Optimizer from './components/optimizer/Optimizer';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/library" element={<Library />} />
          <Route path="/build/:id?" element={<BuildEditor />} />
          <Route path="/combat" element={<CombatLab />} />
          <Route path="/compare" element={<CompareRoom />} />
          <Route path="/pillars" element={<PillarScorecards />} />
          <Route path="/party" element={<PartyPlanner />} />
          <Route path="/leveling" element={<LevelingPlanner />} />
          <Route path="/optimizer" element={<Optimizer />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;