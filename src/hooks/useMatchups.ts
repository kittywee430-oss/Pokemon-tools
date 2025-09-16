import { useState, useEffect } from 'react';

interface Matchup {
  id: string;
  myPokemon: string[];
  enemyPokemon: string[];
  notes: string | null;
  result: string;
  turnOrder: string;
  createdAt: string;
  updatedAt: string;
}

export function useMatchups() {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('pokemon-matchups');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setMatchups(data);
      } catch (error) {
        console.error('Failed to parse stored matchups', error);
      }
    }
    setLoading(false);
  }, []);

  const saveToStorage = (data: Matchup[]) => {
    localStorage.setItem('pokemon-matchups', JSON.stringify(data));
  };

  const addMatchup = (matchup: Matchup) => {
    const updatedMatchups = [...matchups, matchup];
    setMatchups(updatedMatchups);
    saveToStorage(updatedMatchups);
  };

  const updateMatchup = (id: string, updatedMatchup: Partial<Matchup>) => {
    const updatedMatchups = matchups.map(m =>
      m.id === id ? { ...m, ...updatedMatchup } : m
    );
    setMatchups(updatedMatchups);
    saveToStorage(updatedMatchups);
  };

  const deleteMatchup = (id: string) => {
    const updatedMatchups = matchups.filter(m => m.id !== id);
    setMatchups(updatedMatchups);
    saveToStorage(updatedMatchups);
  };

  const bulkDelete = (ids: string[]) => {
    const updatedMatchups = matchups.filter(m => !ids.includes(m.id));
    setMatchups(updatedMatchups);
    saveToStorage(updatedMatchups);
  };

  const importMatchups = (data: Matchup[]) => {
    setMatchups(data);
    saveToStorage(data);
  };

  return {
    matchups,
    loading,
    addMatchup,
    updateMatchup,
    deleteMatchup,
    bulkDelete,
    importMatchups,
  };
}