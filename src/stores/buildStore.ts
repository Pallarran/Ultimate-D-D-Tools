import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Build } from '../types';

interface BuildState {
  builds: Build[];
  currentBuild: Build | null;
  selectedBuilds: string[]; // For compare room
  
  // Build management
  createBuild: (build: Omit<Build, 'id'>) => Build;
  updateBuild: (id: string, updates: Partial<Build>) => void;
  deleteBuild: (id: string) => void;
  duplicateBuild: (id: string) => Build;
  
  // Current build
  setCurrentBuild: (build: Build | null) => void;
  updateCurrentBuild: (updates: Partial<Build>) => void;
  
  // Selection for comparison
  selectBuildForComparison: (id: string) => void;
  deselectBuildFromComparison: (id: string) => void;
  clearSelectedBuilds: () => void;
  
  // Utility
  getBuildById: (id: string) => Build | undefined;
}

const createDefaultBuild = (name: string = 'New Build'): Omit<Build, 'id'> => ({
  name,
  level: 1,
  class: 'Fighter',
  subclass: 'Champion',
  abilities: {
    STR: 15,
    DEX: 14,
    CON: 13,
    INT: 12,
    WIS: 10,
    CHA: 8,
  },
  proficiency: 2,
  feats: [],
  features: {
    sneakAttackDice: 0,
    actionSurge: 0,
    extraAttack: 0,
    hexbladeCurse: false,
  },
  profiles: [
    {
      id: 'longsword',
      name: 'Longsword',
      type: 'weapon',
      attackBonusFormula: 'PB + STR',
      damageHit: '1d8+STR',
      damageCrit: '2d8+STR',
      critRange: 20,
      riders: [],
    },
  ],
  items: [],
  tags: [],
});

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useBuildStore = create<BuildState>()(
  devtools(
    persist(
      (set, get) => ({
        builds: [],
        currentBuild: null,
        selectedBuilds: [],
        
        createBuild: (buildData) => {
          const newBuild: Build = {
            ...buildData,
            id: generateId(),
          };
          
          set((state) => ({
            builds: [...state.builds, newBuild],
          }));
          
          return newBuild;
        },
        
        updateBuild: (id, updates) =>
          set((state) => ({
            builds: state.builds.map((build) =>
              build.id === id ? { ...build, ...updates } : build
            ),
            currentBuild:
              state.currentBuild?.id === id
                ? { ...state.currentBuild, ...updates }
                : state.currentBuild,
          })),
        
        deleteBuild: (id) =>
          set((state) => ({
            builds: state.builds.filter((build) => build.id !== id),
            currentBuild:
              state.currentBuild?.id === id ? null : state.currentBuild,
            selectedBuilds: state.selectedBuilds.filter(
              (selectedId) => selectedId !== id
            ),
          })),
        
        duplicateBuild: (id) => {
          const originalBuild = get().getBuildById(id);
          if (!originalBuild) {
            throw new Error(`Build with id ${id} not found`);
          }
          
          const duplicatedBuild = get().createBuild({
            ...originalBuild,
            name: `${originalBuild.name} (Copy)`,
          });
          
          return duplicatedBuild;
        },
        
        setCurrentBuild: (build) => set({ currentBuild: build }),
        
        updateCurrentBuild: (updates) =>
          set((state) => ({
            currentBuild: state.currentBuild
              ? { ...state.currentBuild, ...updates }
              : null,
          })),
        
        selectBuildForComparison: (id) =>
          set((state) => {
            if (state.selectedBuilds.includes(id)) return state;
            if (state.selectedBuilds.length >= 3) return state; // Max 3 builds
            
            return {
              selectedBuilds: [...state.selectedBuilds, id],
            };
          }),
        
        deselectBuildFromComparison: (id) =>
          set((state) => ({
            selectedBuilds: state.selectedBuilds.filter(
              (selectedId) => selectedId !== id
            ),
          })),
        
        clearSelectedBuilds: () => set({ selectedBuilds: [] }),
        
        getBuildById: (id) => {
          return get().builds.find((build) => build.id === id);
        },
      }),
      {
        name: 'dnd-tools-builds',
        version: 1,
      }
    ),
    {
      name: 'build-store',
    }
  )
);

// Helper function to create a new default build
export const createNewBuild = (name?: string): Build => {
  const buildData = createDefaultBuild(name);
  return {
    ...buildData,
    id: generateId(),
  };
};