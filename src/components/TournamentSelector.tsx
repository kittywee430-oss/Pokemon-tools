'use client';

import { Tournament } from '@/types/tournament';

interface TournamentSelectorProps {
  tournaments: Tournament[];
  selectedTournamentId: string | null;
  pokemonMap: Record<string, string>;
  onSelectTournament: (tournamentId: string) => void;
  onCreateNew: () => void;
  onDeleteTournament: (tournamentId: string) => void;
}

export default function TournamentSelector({
  tournaments,
  selectedTournamentId,
  pokemonMap,
  onSelectTournament,
  onCreateNew,
  onDeleteTournament,
}: TournamentSelectorProps) {
  const getTournamentTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      regional: '🏆',
      cup: '🥤',
      local: '🏠',
      challenge: '⚔️',
      international: '🌍',
      worlds: '🌟',
      other: '🎯'
    };
    return icons[type] || '🎯';
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Select Tournament</h2>
        <button
          onClick={onCreateNew}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + New Tournament
        </button>
      </div>

      {tournaments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No tournaments yet. Create your first tournament to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedTournamentId === tournament.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectTournament(tournament.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTournamentTypeIcon(tournament.type)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{tournament.name}</h3>
                      {tournament.deck.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600">with</span>
                          <div className="flex gap-1">
                            {tournament.deck.slice(0, 3).map((pokemon, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={pokemonMap[pokemon] || '/placeholder.png'}
                                  alt={pokemon}
                                  className="w-8 h-8 rounded"
                                  title={pokemon}
                                />
                              </div>
                            ))}
                            {tournament.deck.length > 3 && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                                +{tournament.deck.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)} • {tournament.format.toUpperCase()} • {new Date(tournament.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <p><strong>Type:</strong> {tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)}</p>
                <p><strong>Format:</strong> {tournament.format.toUpperCase()}</p>
                <p><strong>Date:</strong> {new Date(tournament.date).toLocaleDateString()}</p>
                {tournament.location && <p><strong>Location:</strong> {tournament.location}</p>}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {tournament.rounds.length} rounds
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTournament(tournament.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                  title="Delete tournament"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}