'use client';

import { useState } from 'react';
import PokemonSelector from './PokemonSelector';

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

interface MatchupFormProps {
  matchups: Matchup[];
  myPokemon: string[];
  enemyPokemon: string[];
  notes: string;
  result: 'win' | 'lose';
  turnOrder: 'first' | 'second';
  editingId: string | null;
  errorMessage: string;
  exportType: 'json' | 'csv';
  darkMode: boolean;
  recentPokemon: string[];
  onMyPokemonChange: (pokemon: string[]) => void;
  onEnemyPokemonChange: (pokemon: string[]) => void;
  onNotesChange: (notes: string) => void;
  onResultChange: (result: 'win' | 'lose') => void;
  onTurnOrderChange: (turnOrder: 'first' | 'second') => void;
  onAddMatchup: () => void;
  onCancelEdit: () => void;
  onExportTypeChange: (type: 'json' | 'csv') => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDarkModeToggle: () => void;
}

export default function MatchupForm({
  matchups,
  myPokemon,
  enemyPokemon,
  notes,
  result,
  turnOrder,
  editingId,
  errorMessage,
  exportType,
  darkMode,
  recentPokemon,
  onMyPokemonChange,
  onEnemyPokemonChange,
  onNotesChange,
  onResultChange,
  onTurnOrderChange,
  onAddMatchup,
  onCancelEdit,
  onExportTypeChange,
  onExport,
  onImport,
  onDarkModeToggle,
}: MatchupFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{editingId ? 'Edit Matchup' : 'Add New Matchup'}</h2>
        <div className="flex gap-2">
          <select
            value={exportType}
            onChange={(e) => onExportTypeChange(e.target.value as 'json' | 'csv')}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
          <button
            onClick={onExport}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export Data
          </button>
          <label className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
            Import Data
            <input
              type="file"
              accept=".json,.csv"
              onChange={onImport}
              className="hidden"
            />
          </label>
          <button
            onClick={onDarkModeToggle}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Pokemon</label>
        <PokemonSelector selected={myPokemon} onSelect={onMyPokemonChange} recentPokemon={recentPokemon} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Enemy Pokemon</label>
        <PokemonSelector selected={enemyPokemon} onSelect={onEnemyPokemonChange} recentPokemon={recentPokemon} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full p-2 border border-gray-600 rounded text-gray-700"
          placeholder="e.g., Turn order, special conditions"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
        <select
          value={result}
          onChange={(e) => onResultChange(e.target.value as 'win' | 'lose')}
          className="p-2 border border-gray-600 rounded text-gray-700"
        >
          <option value="win">Win</option>
          <option value="lose">Lose</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Turn Order</label>
        <select
          value={turnOrder}
          onChange={(e) => onTurnOrderChange(e.target.value as 'first' | 'second')}
          className="p-2 border border-gray-600 rounded text-gray-700"
        >
          <option value="first">Going First</option>
          <option value="second">Going Second</option>
        </select>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onAddMatchup}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? 'Update Matchup' : 'Add Matchup'}
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