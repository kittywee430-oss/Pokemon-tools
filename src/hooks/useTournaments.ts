import { useState, useEffect } from 'react';
import { Tournament, TournamentRound, TournamentStanding, RoundResult } from '@/types/tournament';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('tournaments');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setTournaments(data);
      } catch (error) {
        console.error('Failed to parse stored tournaments', error);
      }
    }
    setLoading(false);
  }, []);

  const saveToStorage = (data: Tournament[]) => {
    localStorage.setItem('tournaments', JSON.stringify(data));
  };

  const addTournament = (tournament: Tournament) => {
    const updatedTournaments = [...tournaments, tournament];
    setTournaments(updatedTournaments);
    saveToStorage(updatedTournaments);
  };

  const updateTournament = (id: string, updatedTournament: Partial<Tournament>) => {
    const updatedTournaments = tournaments.map(t =>
      t.id === id ? { ...t, ...updatedTournament } : t
    );
    setTournaments(updatedTournaments);
    saveToStorage(updatedTournaments);
  };

  const deleteTournament = (id: string) => {
    const updatedTournaments = tournaments.filter(t => t.id !== id);
    setTournaments(updatedTournaments);
    saveToStorage(updatedTournaments);
  };

  const addRoundToTournament = (tournamentId: string, round: TournamentRound) => {
    const updatedTournaments = tournaments.map(t =>
      t.id === tournamentId
        ? { ...t, rounds: [...t.rounds, round] }
        : t
    );
    setTournaments(updatedTournaments);
    saveToStorage(updatedTournaments);
  };

  const updateRoundInTournament = (tournamentId: string, roundId: string, updatedRound: Partial<TournamentRound>) => {
    const updatedTournaments = tournaments.map(t =>
      t.id === tournamentId
        ? {
            ...t,
            rounds: t.rounds.map(r =>
              r.id === roundId ? { ...r, ...updatedRound } : r
            )
          }
        : t
    );
    setTournaments(updatedTournaments);
    saveToStorage(updatedTournaments);
  };

  const deleteRoundFromTournament = (tournamentId: string, roundId: string) => {
    const updatedTournaments = tournaments.map(t =>
      t.id === tournamentId
        ? { ...t, rounds: t.rounds.filter(r => r.id !== roundId) }
        : t
    );
    setTournaments(updatedTournaments);
    saveToStorage(updatedTournaments);
  };

  const calculateRoundResult = (wins: number, losses: number, ties: number, format: 'bo1' | 'bo3'): RoundResult => {
    if (format === 'bo1') {
      if (wins === 1) return 'win';
      if (losses === 1) return 'lose';
      if (ties === 1) return 'tie';
      return 'tie'; // fallback
    } else { // bo3
      // Calculate total games played
      const totalGames = wins + losses + ties;

      // If only one game played
      if (totalGames === 1) {
        if (wins === 1) return 'win';
        if (losses === 1) return 'lose';
        if (ties === 1) return 'tie';
      }

      // Check for definitive outcomes (2+ wins or 2+ losses)
      if (wins >= 2) return 'win';
      if (losses >= 2) return 'lose';

      // Check for mixed outcomes that determine the result
      if (wins === 1 && losses === 1) return 'tie'; // 1-1-0 or 1-1-1, set not decided
      if (wins === 1 && ties === 1) return 'win'; // 1-0-1, you won 2 games
      if (losses === 1 && ties === 1) return 'lose'; // 0-1-1, you lost 2 games

      // If we have 3 games and it's 1-1-1, it's a tie
      if (wins === 1 && losses === 1 && ties === 1) return 'tie';

      return 'tie'; // fallback for undecided sets
    }
  };


  const getTournamentStanding = (tournamentId: string): TournamentStanding => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) {
      return { wins: 0, losses: 0, ties: 0, totalRounds: 0, winRate: 0 };
    }

    // Auto wins and byes count as wins in tournament standings
    const wins = tournament.rounds.filter(r =>
      r.result === 'win' || r.result === 'no_show' || r.result === 'bye'
    ).length;
    const losses = tournament.rounds.filter(r => r.result === 'lose').length;
    const ties = tournament.rounds.filter(r => r.result === 'tie').length;
    const totalRounds = tournament.rounds.length;
    const winRate = totalRounds > 0 ? (wins / totalRounds) * 100 : 0;

    return { wins, losses, ties, totalRounds, winRate };
  };

  return {
    tournaments,
    loading,
    addTournament,
    updateTournament,
    deleteTournament,
    addRoundToTournament,
    updateRoundInTournament,
    deleteRoundFromTournament,
    calculateRoundResult,
    getTournamentStanding,
  };
}