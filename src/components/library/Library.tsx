import ComingSoon from '../ui/ComingSoon';

const Library = () => {
  return (
    <ComingSoon
      title="Build Library"
      description="Save, organize, and share your character builds with advanced management features."
      icon="📚"
      features={[
        "Save unlimited builds with detailed metadata",
        "Folder organization and tagging system",
        "Search and filter by class, level, tags, or features",
        "Import/export builds in multiple formats (JSON, PDF, D&D Beyond)",
        "Version history tracking with diff comparison",
        "Community sharing and build browsing",
        "Favorites and personal ratings system"
      ]}
    />
  );
};

export default Library;