'use client';

import { useState } from 'react';
import PokemonSelector from './PokemonSelector';
import { RoundResult } from '@/types/tournament';

interface TournamentRoundFormProps {
  tournamentId: string;
  enemyPokemon: string[];
  result: RoundResult;
  editingId: string | null;
  errorMessage: string;
  tournamentFormat: 'bo1' | 'bo3';
  recentPokemon: string[];
  onEnemyPokemonChange: (pokemon: string[]) => void;
  onResultChange: (result: RoundResult) => void;
  onAddRound: () => void;
  onCancelEdit: () => void;
  onBackToSelection?: () => void;
  onCompleteTournament?: () => void;
}

export default function TournamentRoundForm({
  tournamentId,
  enemyPokemon,
  result,
  editingId,
  errorMessage,
  tournamentFormat,
  recentPokemon,
  onEnemyPokemonChange,
  onResultChange,
  onAddRound,
  onCancelEdit,
  onBackToSelection,
  onCompleteTournament,
}: TournamentRoundFormProps) {

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBackToSelection && (
              <button
                onClick={onBackToSelection}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                ← Select Tournament
              </button>
            )}
            <h2 className="text-xl font-semibold">{editingId ? 'Edit Round' : 'Add New Round'}</h2>
          </div>
          {onCompleteTournament && (
            <button
              onClick={onCompleteTournament}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              ✅ Complete Tournament
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Enemy Pokemon</label>
        <PokemonSelector selected={enemyPokemon} onSelect={onEnemyPokemonChange} recentPokemon={recentPokemon} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Round Result
        </label>
        <select
          value={result}
          onChange={(e) => onResultChange(e.target.value as RoundResult)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="win">Win</option>
          <option value="lose">Lose</option>
          <option value="tie">Tie</option>
          <option value="no_show">No Show (Auto Win)</option>
          <option value="bye">Bye (Auto Win)</option>
        </select>
      </div>


      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onAddRound}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? 'Update Round' : 'Add Round'}
        </button>
        {editingId && (
          <button
            onClick={onCancelEdit}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}