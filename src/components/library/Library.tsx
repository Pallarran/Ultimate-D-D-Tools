import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBuildStore } from '../../stores/buildStore';
import { validateBuild } from '../../utils/buildValidation';
import type { Build } from '../../types';
import './Library.css';

const Library = () => {
  const { builds, deleteBuild, duplicateBuild } = useBuildStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'class' | 'modified'>('modified');

  const filteredAndSortedBuilds = useMemo(() => {
    let filtered = builds.filter(build => {
      const matchesSearch = build.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           build.class.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = !filterClass || build.class === filterClass;
      const matchesLevel = !filterLevel || build.level.toString() === filterLevel;
      
      return matchesSearch && matchesClass && matchesLevel;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'level':
          return b.level - a.level;
        case 'class':
          return a.class.localeCompare(b.class);
        case 'modified':
        default:
          // For now, sort by creation order (newer first)
          return b.id.localeCompare(a.id);
      }
    });
  }, [builds, searchTerm, filterClass, filterLevel, sortBy]);

  const handleDelete = (buildId: string, buildName: string) => {
    if (confirm(`Are you sure you want to delete "${buildName}"?`)) {
      deleteBuild(buildId);
    }
  };

  const handleDuplicate = (buildId: string) => {
    duplicateBuild(buildId);
  };

  const handleExport = (build: Build) => {
    const dataStr = JSON.stringify(build, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${build.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_build.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedBuild = JSON.parse(e.target?.result as string);
        // Add validation and import logic here
        console.log('Import build:', importedBuild);
        alert('Import functionality will be implemented in future versions');
      } catch (error) {
        alert('Invalid build file format');
      }
    };
    reader.readAsText(file);
  };

  const uniqueClasses = [...new Set(builds.map(build => build.class))].sort();
  const uniqueLevels = [...new Set(builds.map(build => build.level))].sort((a, b) => a - b);

  if (builds.length === 0) {
    return (
      <div className="library">
        <div className="library-empty">
          <div className="empty-content">
            <div className="empty-icon">📚</div>
            <h2>Your Build Library is Empty</h2>
            <p>Start creating character builds to see them organized here.</p>
            <Link to="/build" className="create-first-build">
              Create Your First Build
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="library">
      <div className="library-header">
        <div className="header-title">
          <h1>Build Library</h1>
          <p>Manage and organize your D&D character builds</p>
        </div>
        
        <div className="header-actions">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
            id="import-file"
          />
          <label htmlFor="import-file" className="import-button">
            📥 Import
          </label>
          <Link to="/build" className="new-build-button">
            ✨ New Build
          </Link>
        </div>
      </div>

      <div className="library-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search builds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="filter-select"
          >
            <option value="">All Classes</option>
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="filter-select"
          >
            <option value="">All Levels</option>
            {uniqueLevels.map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="sort-select"
          >
            <option value="modified">Recently Modified</option>
            <option value="name">Name</option>
            <option value="class">Class</option>
            <option value="level">Level</option>
          </select>
        </div>
      </div>

      <div className="build-stats">
        <div className="stats-summary">
          <span className="stat">{builds.length} builds</span>
          <span className="stat">{filteredAndSortedBuilds.length} shown</span>
          <span className="stat">{uniqueClasses.length} classes</span>
        </div>
      </div>

      <div className="builds-grid">
        {filteredAndSortedBuilds.map((build) => {
          const validation = validateBuild(build);
          return (
            <BuildCard
              key={build.id}
              build={build}
              validation={validation}
              onEdit={() => window.location.href = `#/build/${build.id}`}
              onDelete={() => handleDelete(build.id, build.name)}
              onDuplicate={() => handleDuplicate(build.id)}
              onExport={() => handleExport(build)}
            />
          );
        })}
      </div>
    </div>
  );
};

interface BuildCardProps {
  build: Build;
  validation: any;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onExport: () => void;
}

const BuildCard = ({ build, validation, onEdit, onDelete, onDuplicate, onExport }: BuildCardProps) => {
  return (
    <div className={`build-card ${!validation.isValid ? 'has-errors' : ''}`}>
      <div className="card-header">
        <h3 className="build-name">{build.name}</h3>
        <div className="card-actions">
          <button className="action-button edit" onClick={onEdit} title="Edit">
            ✏️
          </button>
          <button className="action-button duplicate" onClick={onDuplicate} title="Duplicate">
            📋
          </button>
          <button className="action-button export" onClick={onExport} title="Export">
            📤
          </button>
          <button className="action-button delete" onClick={onDelete} title="Delete">
            🗑️
          </button>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-row">
          <span className="detail-label">Class:</span>
          <span className="detail-value">{build.class}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Subclass:</span>
          <span className="detail-value">{build.subclass}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Level:</span>
          <span className="detail-value">{build.level}</span>
        </div>
      </div>

      {build.feats.length > 0 && (
        <div className="card-feats">
          <div className="feats-label">Feats:</div>
          <div className="feats-list">
            {build.feats.slice(0, 3).map((feat, index) => (
              <span key={index} className="feat-tag">{feat}</span>
            ))}
            {build.feats.length > 3 && (
              <span className="feat-tag more">+{build.feats.length - 3}</span>
            )}
          </div>
        </div>
      )}

      <div className="card-footer">
        <div className="validation-status">
          {validation.isValid ? (
            <span className="status valid">✅ Valid</span>
          ) : (
            <span className="status invalid">
              ❌ {validation.errors.length} error{validation.errors.length === 1 ? '' : 's'}
            </span>
          )}
          {validation.warnings.length > 0 && (
            <span className="status warning">
              ⚠️ {validation.warnings.length} warning{validation.warnings.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
        
        <div className="attack-profiles-count">
          {build.profiles.length} attack{build.profiles.length === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  );
};

export default Library;