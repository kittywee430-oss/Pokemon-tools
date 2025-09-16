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

interface StatisticsProps {
  matchups: Matchup[];
  pokemonMap: Record<string, string>;
}

export default function Statistics({ matchups, pokemonMap }: StatisticsProps) {
  // Collect unique archetypes
  const myArchetypes = Array.from(new Set(matchups.map(m => m.myPokemon.sort().join('|')))).sort();
  const enemyArchetypes = Array.from(new Set(matchups.map(m => m.enemyPokemon.sort().join('|')))).sort();

  // Compute win rates matrix - only track row archetype's win rate vs column archetype
  const winMatrix: Record<string, Record<string, { wins: number, total: number }>> = {};
  matchups.forEach(m => {
    const rowKey = m.myPokemon.sort().join('|'); // Row archetype (your team)
    const colKey = m.enemyPokemon.sort().join('|'); // Column archetype (enemy team)

    // Only track row's performance against column
    if (!winMatrix[rowKey]) winMatrix[rowKey] = {};
    if (!winMatrix[rowKey][colKey]) winMatrix[rowKey][colKey] = { wins: 0, total: 0 };
    winMatrix[rowKey][colKey].total++;
    if (m.result === 'win') winMatrix[rowKey][colKey].wins++;
  });

  const renderArchetype = (archetype: string) => (
    <div className="flex flex-wrap items-center justify-center gap-1 min-h-[40px]">
      {archetype.split('|').map(name => (
        <div key={name} className="relative group">
          <img src={pokemonMap[name]} alt={name} className="w-20 h-20" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </div>
        </div>
      ))}
    </div>
  );

  const getCellColor = (percentage: number, hasData: boolean = true) => {
    if (!hasData) return 'bg-black text-gray-700'; // Gray for no data

    // Use predefined Tailwind color classes for reliable gradient
    if (percentage >= 90) return 'bg-green-500 text-white';
    if (percentage >= 80) return 'bg-green-400 text-white';
    if (percentage >= 70) return 'bg-lime-400 text-black';
    if (percentage >= 60) return 'bg-lime-300 text-black';
    if (percentage >= 50) return 'bg-yellow-400 text-black';
    if (percentage >= 40) return 'bg-yellow-300 text-black';
    if (percentage >= 30) return 'bg-orange-400 text-white';
    if (percentage >= 20) return 'bg-orange-300 text-white';
    if (percentage >= 10) return 'bg-red-400 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{matchups.length}</div>
          <div className="text-sm text-gray-600">Total Matchups</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {matchups.length > 0 ? ((matchups.filter(m => m.result === 'win').length / matchups.length) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-sm text-gray-600">Overall Win Rate</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-4">Win Rates Matrix (Row vs Column)</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-600">
          <thead>
            <tr>
              <th className="border border-gray-600 p-2 bg-gray-100">vs.</th>
              {enemyArchetypes.map(enemy => (
                <th key={enemy} className="border border-gray-600 p-2 bg-gray-100 text-center">
                  {renderArchetype(enemy)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myArchetypes.map(my => (
              <tr key={my}>
                <td className="border border-gray-600 p-2 bg-gray-100 text-center">
                  {renderArchetype(my)}
                </td>
                {enemyArchetypes.map(enemy => {
                  const stats = winMatrix[my]?.[enemy] || { wins: 0, total: 0 };
                  const percentage = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
                  return (
                    <td key={enemy} className={`border border-gray-600 p-2 text-center text-white font-semibold ${getCellColor(percentage, stats.total > 0)}`}>
                      {stats.total > 0 ? `${stats.wins}/${stats.total} (${percentage.toFixed(1)}%)` : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <br/><br/>
        <hr></hr>
        <br/>
        <span className="mt-2">Your Deck in left colum vs Enemy deck in top row *</span>
      </div>
    </div>
  );
}