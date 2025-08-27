import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Scenario } from '../types';

interface ScenarioState {
  scenario: Scenario;
  updateScenario: (updates: Partial<Scenario>) => void;
  resetScenario: () => void;
}

const defaultScenario: Scenario = {
  enemy: {
    ac: 16,
    hp: 90,
    resists: [],
    immunes: [],
  },
  advantage: 'normal',
  cover: 0,
  rangeBracket: 'normal',
  buffs: {},
  terrain: 'none',
  policies: {
    ss: 'auto',
    gwm: 'auto',
    actionSurgeRound: 1,
    smite: 'critOnly',
    bonusAction: 'prefer-hex',
    reaction: {
      sentinelChance: 0.35,
    },
    concentrationUptime: 'compute',
  },
  mode: 'typical',
};

export const useScenarioStore = create<ScenarioState>()(
  devtools(
    persist(
      (set) => ({
        scenario: defaultScenario,
        
        updateScenario: (updates) =>
          set((state) => ({
            scenario: { ...state.scenario, ...updates },
          })),
        
        resetScenario: () => set({ scenario: defaultScenario }),
      }),
      {
        name: 'dnd-tools-scenario',
        version: 1,
      }
    ),
    {
      name: 'scenario-store',
    }
  )
);