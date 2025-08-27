import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBuildStore } from '../../stores/buildStore';
import { createNewBuild } from '../../stores/buildStore';
import BasicInfoForm from './BasicInfoForm';
import AbilitiesForm from './AbilitiesForm';
import FeatsForm from './FeatsForm';
import AttackProfilesForm from './AttackProfilesForm';
import './BuildEditor.css';

const BuildEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentBuild, 
    setCurrentBuild, 
    updateCurrentBuild, 
    createBuild, 
    updateBuild, 
    getBuildById 
  } = useBuildStore();
  
  const [activeTab, setActiveTab] = useState('basic');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (id) {
      // Editing existing build
      const build = getBuildById(id);
      if (build) {
        setCurrentBuild(build);
      } else {
        // Build not found, redirect to library
        navigate('/library');
      }
    } else {
      // Creating new build
      const newBuild = createNewBuild('New Build');
      setCurrentBuild(newBuild);
    }
  }, [id, getBuildById, setCurrentBuild, navigate]);

  const handleSave = () => {
    if (!currentBuild) return;

    if (id) {
      // Update existing build
      updateBuild(currentBuild.id, currentBuild);
    } else {
      // Create new build
      createBuild(currentBuild);
      navigate(`/build/${currentBuild.id}`);
    }
    
    setHasUnsavedChanges(false);
  };

  const handleBuildChange = (updates: Partial<NonNullable<typeof currentBuild>>) => {
    updateCurrentBuild(updates);
    setHasUnsavedChanges(true);
  };

  if (!currentBuild) {
    return <div className="loading">Loading build...</div>;
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📋' },
    { id: 'abilities', label: 'Abilities', icon: '💪' },
    { id: 'feats', label: 'Feats', icon: '⭐' },
    { id: 'attacks', label: 'Attack Profiles', icon: '⚔️' },
  ];

  return (
    <div className="build-editor">
      <div className="editor-header">
        <div className="editor-title">
          <h1>{id ? 'Edit Build' : 'Create New Build'}</h1>
          <p className="build-name">{currentBuild.name}</p>
        </div>
        
        <div className="editor-actions">
          {hasUnsavedChanges && (
            <span className="unsaved-indicator">● Unsaved changes</span>
          )}
          <button onClick={handleSave} className="save-button">
            {id ? 'Update Build' : 'Save Build'}
          </button>
        </div>
      </div>

      <div className="editor-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="editor-content">
        {activeTab === 'basic' && (
          <BasicInfoForm
            build={currentBuild}
            onChange={handleBuildChange}
          />
        )}
        
        {activeTab === 'abilities' && (
          <AbilitiesForm
            build={currentBuild}
            onChange={handleBuildChange}
          />
        )}
        
        {activeTab === 'feats' && (
          <FeatsForm
            build={currentBuild}
            onChange={handleBuildChange}
          />
        )}
        
        {activeTab === 'attacks' && (
          <AttackProfilesForm
            build={currentBuild}
            onChange={handleBuildChange}
          />
        )}
      </div>
    </div>
  );
};

export default BuildEditor;