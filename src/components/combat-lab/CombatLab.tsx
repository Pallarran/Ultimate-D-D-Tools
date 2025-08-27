import ComingSoon from '../ui/ComingSoon';

const CombatLab = () => {
  return (
    <ComingSoon
      title="Combat Lab"
      description="Analyze DPR and combat performance with detailed scenario simulation."
      icon="⚡"
      features={[
        "3-Round DPR calculations with realistic policies",
        "DPR vs AC charts with Sharpshooter/GWM toggle windows",
        "Time-to-Kill analysis against various HP pools",
        "Concentration uptime modeling with save probabilities",
        "Scenario presets (boss fights, trash waves, ambushes)",
        "Action economy optimization (Action Surge, Bonus Actions)",
        "Interactive explanation drawers for all calculations"
      ]}
    />
  );
};

export default CombatLab;