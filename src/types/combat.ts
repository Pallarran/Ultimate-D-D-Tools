export interface CombatResult {
  threeRoundDPR: number;
  critRate: number;
  riderUsage: number;
  explanation?: string;
}

export interface DPRvsACPoint {
  ac: number;
  dpr: number;
  ssActive: boolean;
  gwmActive: boolean;
}

export interface TimeToKillResult {
  expectedRounds: number;
  probability95: number;
  probability99: number;
}

export interface PillarScore {
  social: number;
  exploration: number;
  control: number;
  mobility: number;
  survivability: number;
}

export interface PillarWeights {
  social: number;
  exploration: number;
  control: number;
  mobility: number;
  survivability: number;
}