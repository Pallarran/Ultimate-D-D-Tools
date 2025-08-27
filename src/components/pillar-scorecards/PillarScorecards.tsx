import ComingSoon from '../ui/ComingSoon';

const PillarScorecards = () => {
  return (
    <ComingSoon
      title="Pillar Scorecards"
      description="Evaluate non-combat pillars with transparent scoring and probability-based analysis."
      icon="🎯"
      features={[
        "Social: Success probability vs DC bands with expertise/advantage",
        "Exploration: Travel speed, stealth, languages, rituals, navigation",
        "Control: 'Turns denied' estimates for key spells and abilities",
        "Mobility: Tactical repositioning options and action costs",
        "Survivability: Effective HP with AC, resistances, and reactions",
        "Customizable campaign weights for different play styles",
        "Interactive radar charts with detailed breakdowns"
      ]}
    />
  );
};

export default PillarScorecards;