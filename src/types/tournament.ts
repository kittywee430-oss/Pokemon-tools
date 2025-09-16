export type TournamentType =
  | 'regional'
  | 'cup'
  | 'local'
  | 'challenge'
  | 'international'
  | 'worlds'
  | 'other';

export type TournamentFormat = 'bo1' | 'bo3';

export type RoundResult = 'win' | 'lose' | 'tie' | 'no_show' | 'bye';

export interface TournamentRound {
  id: string;
  tournamentId: string;
  enemyPokemon: string[];  // Only enemy Pokemon changes per round
  result: RoundResult;
  createdAt: string;
  updatedAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  format: TournamentFormat;
  location?: string;
  date: string;
  deck: string[];  // The Pokemon deck/archetype being played
  rounds: TournamentRound[];
  createdAt: string;
  updatedAt: string;
}

export interface TournamentStanding {
  wins: number;
  losses: number;
  ties: number;
  totalRounds: number;
  winRate: number;
}