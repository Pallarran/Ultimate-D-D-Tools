import ComingSoon from '../ui/ComingSoon';

const LevelingPlanner = () => {
  return (
    <ComingSoon
      title="Leveling Planner"
      description="Plan character progression across levels 1-20 with branching multiclass paths and power spike analysis."
      icon="📈"
      features={[
        "Interactive level progression tree (1-20)",
        "Branching multiclass path visualization",
        "Power spike identification and analysis",
        "Feat vs ASI decision points with impact analysis",
        "Milestone markers for key class features",
        "DPR progression curves with breakpoint highlighting",
        "Itemization planning with magic item assumptions"
      ]}
    />
  );
};

export default LevelingPlanner;