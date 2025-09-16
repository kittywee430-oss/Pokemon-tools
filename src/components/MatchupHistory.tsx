'use client';

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

interface MatchupHistoryProps {
  matchups: Matchup[];
  pokemonMap: Record<string, string>;
  search: string;
  sortBy: 'date' | 'result';
  selectedForBulk: string[];
  showNotesFor: string | null;
  onSearchChange: (search: string) => void;
  onSortByChange: (sortBy: 'date' | 'result') => void;
  onBulkSelect: (id: string) => void;
  onBulkDelete: () => void;
  onEdit: (matchup: Matchup) => void;
  onDelete: (id: string) => void;
  onShowNotes: (id: string | null) => void;
  onPokemonClick: (name: string) => void;
}

export default function MatchupHistory({
  matchups,
  pokemonMap,
  search,
  sortBy,
  selectedForBulk,
  showNotesFor,
  onSearchChange,
  onSortByChange,
  onBulkSelect,
  onBulkDelete,
  onEdit,
  onDelete,
  onShowNotes,
  onPokemonClick,
}: MatchupHistoryProps) {
  const filteredMatchups = matchups
    .filter(m => {
      if (!search) return true;
      const allPokemon = [...m.myPokemon, ...m.enemyPokemon];
      return allPokemon.some(p => p.toLowerCase().includes(search.toLowerCase()));
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'result') return a.result.localeCompare(b.result);
      return 0;
    });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Matchup History</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'date' | 'result')}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="date">Sort by Date</option>
            <option value="result">Sort by Result</option>
          </select>
          {selectedForBulk.length > 0 && (
            <button
              onClick={onBulkDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Selected ({selectedForBulk.length})
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {filteredMatchups.map((m) => (
          <div key={m.id} className={`border rounded-lg p-4 relative ${m.result === 'win' ? 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700' : 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700'}`}>
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={selectedForBulk.includes(m.id)}
                onChange={(e) => onBulkSelect(m.id)}
              />
            </div>
            <div className="mb-2 flex items-center justify-center gap-4">
              <div className="flex flex-wrap gap-1">
                {m.myPokemon.map(name => (
                  <img key={name} src={pokemonMap[name]} alt={name} className="w-20 h-20 cursor-pointer" onClick={() => onPokemonClick(name)} />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-500 mx-4">vs</span>
              <div className="flex flex-wrap gap-1">
                {m.enemyPokemon.map(name => (
                  <img key={name} src={pokemonMap[name]} alt={name} className="w-20 h-20 cursor-pointer" onClick={() => onPokemonClick(name)} />
                ))}
              </div>
            </div>
            <div className="text-sm mb-1 text-center"><strong>Turn Order:</strong> {m.turnOrder}</div>
            {showNotesFor === m.id && m.notes && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-center border">
                <strong>Notes:</strong> {m.notes}
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              {m.notes && (
                <button
                  onClick={() => onShowNotes(showNotesFor === m.id ? null : m.id)}
                  className="bg-blue-500 text-white p-1 rounded text-sm hover:bg-blue-600 shadow-md"
                  title="Show notes"
                >
                  📝
                </button>
              )}
              <button
                onClick={() => onEdit(m)}
                className="bg-yellow-500 text-white p-1 rounded text-sm hover:bg-yellow-600 shadow-md"
                title="Edit matchup"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(m.id)}
                className="bg-red-500 text-white p-1 rounded text-sm hover:bg-red-600 shadow-md"
                title="Delete matchup"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}