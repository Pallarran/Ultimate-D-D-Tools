export interface Build {
  id: string;
  name: string;
  level: number;
  class: string;
  subclass: string;
  abilities: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
  proficiency: number;
  feats: string[];
  features: {
    fightingStyle?: string;
    sneakAttackDice: number;
    actionSurge: number;
    extraAttack: number;
    hexbladeCurse: boolean;
  };
  profiles: AttackProfile[];
  items: Item[];
  tags: string[];
}

export interface AttackProfile {
  id: string;
  name: string;
  type: 'weapon' | 'cantrip' | 'spell';
  attackBonusFormula: string;
  damageHit: string;
  damageCrit: string;
  critRange: number;
  riders: Rider[];
}

export interface Rider {
  name: string;
  dice: string;
  oncePerTurn: boolean;
}

export interface Item {
  slot: string;
  name: string;
  bonus: number;
}

export interface Scenario {
  enemy: {
    ac: number;
    hp: number;
    resists: string[];
    immunes: string[];
  };
  advantage: 'normal' | 'advantage' | 'disadvantage';
  cover: number;
  rangeBracket: 'normal' | 'long';
  buffs: {
    Bless?: string;
    FaerieFire?: boolean;
  };
  terrain: string;
  policies: {
    ss: 'auto' | 'always' | 'off';
    gwm: 'auto' | 'always' | 'off';
    actionSurgeRound: number;
    smite: 'never' | 'firstHit' | 'critOnly' | 'threshold';
    bonusAction: string;
    reaction: {
      sentinelChance: number;
    };
    concentrationUptime: 'compute' | number;
  };
  mode: 'nova' | 'typical' | 'attrition';
}

export interface Party {
  members: PartyMember[];
  concentrationConflicts: string[];
}

export interface PartyMember {
  role: string;
  auraOfProtection?: number;
  buffs?: string[];
}