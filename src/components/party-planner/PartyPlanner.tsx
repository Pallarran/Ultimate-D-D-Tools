import ComingSoon from '../ui/ComingSoon';

const PartyPlanner = () => {
  return (
    <ComingSoon
      title="Party & Day Planner"
      description="Optimize party composition and plan adventuring days with comprehensive rest mechanics."
      icon="👥"
      features={[
        "Ideal party size and composition analysis",
        "Role coverage gaps identification (tank, healer, control, damage)",
        "Initiative order optimization and tactics coordination",
        "Spell slot economy across 6-8 encounters per day",
        "Short vs long rest cadence optimization",
        "Resource attrition modeling (HP, spell slots, abilities)",
        "Synergy detection between party members' abilities"
      ]}
    />
  );
};

export default PartyPlanner;