import ComingSoon from '../ui/ComingSoon';

const CompareRoom = () => {
  return (
    <ComingSoon
      title="Compare Room"
      description="Compare up to 3 builds side-by-side with comprehensive analysis across all metrics."
      icon="📊"
      features={[
        "Side-by-side build comparison (up to 3 builds)",
        "Level progression curves from 1-20",
        "DPR comparison across different ACs and scenarios",
        "Pillar scorecard radar charts",
        "Toggle window analysis (SS/GWM crossover points)",
        "Snapshot diffing to see what changed",
        "Export comparison reports and charts"
      ]}
    />
  );
};

export default CompareRoom;