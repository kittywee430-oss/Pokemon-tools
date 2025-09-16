'use client';

import { useState } from 'react';
import PokemonSelector from './PokemonSelector';
import { Tournament, TournamentType, TournamentFormat } from '@/types/tournament';

interface TournamentFormProps {
  onCreateTournament: (tournament: Tournament) => void;
  onCancel: () => void;
}

export default function TournamentForm({ onCreateTournament, onCancel }: TournamentFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<TournamentType>('regional');
  const [format, setFormat] = useState<TournamentFormat>('bo3');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [deck, setDeck] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const tournamentTypes: { value: TournamentType; label: string }[] = [
    { value: 'regional', label: 'Regional Championship' },
    { value: 'cup', label: 'Cup Tournament' },
    { value: 'local', label: 'Local Tournament' },
    { value: 'challenge', label: 'Challenge Cup' },
    { value: 'international', label: 'International Championship' },
    { value: 'worlds', label: 'World Championship' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Tournament name is required');
      return;
    }

    const newTournament: Tournament = {
      id: Date.now().toString(),
      name: name.trim(),
      type,
      format,
      location: location.trim() || undefined,
      date,
      deck,
      rounds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateTournament(newTournament);

    // Reset form
    setName('');
    setType('regional');
    setFormat('bo3');
    setLocation('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Create New Tournament</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tournament Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g., Regional Championship 2024"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tournament Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TournamentType)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {tournamentTypes.map((tournamentType) => (
              <option key={tournamentType.value} value={tournamentType.value}>
                {tournamentType.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as TournamentFormat)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="bo1">BO1 (Best of 1)</option>
            <option value="bo3">BO3 (Best of 3)</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Optional)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g., New York, NY"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Pokemon Team *
          </label>
          <PokemonSelector selected={deck} onSelect={setDeck} />
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Tournament
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}