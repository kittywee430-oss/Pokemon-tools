'use client';

import { Tournament, TournamentStanding } from '@/types/tournament';

interface TournamentStatisticsProps {
  tournament: Tournament;
  standing: TournamentStanding;
  pokemonMap: Record<string, string>;
  onBackToSelection: () => void;
}

export default function TournamentStatistics({ tournament, standing, pokemonMap, onBackToSelection }: TournamentStatisticsProps) {
  // Create a list of individual rounds instead of aggregating by archetype
  const roundResults = tournament.rounds.map((round, index) => ({
    id: round.id,
    roundNumber: index + 1,
    enemyPokemon: round.enemyPokemon,
    result: round.result,
    createdAt: round.createdAt
  }));

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


  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Tournament Statistics</h2>

      {/* Tournament Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{tournament.name}</h3>
              {tournament.deck.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">with</span>
                  <div className="flex gap-1">
                    {tournament.deck.slice(0, 4).map((pokemon, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={pokemonMap[pokemon] || '/placeholder.png'}
                          alt={pokemon}
                          className="w-10 h-10 rounded"
                          title={pokemon}
                        />
                      </div>
                    ))}
                    {tournament.deck.length > 4 && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        +{tournament.deck.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBackToSelection}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              ← Select Tournament
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Type:</span> {tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)}
          </div>
          <div>
            <span className="font-medium">Format:</span> {tournament.format.toUpperCase()}
          </div>
          <div>
            <span className="font-medium">Date:</span> {new Date(tournament.date).toLocaleDateString()}
          </div>
        </div>
        {tournament.location && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Location:</span> {tournament.location}
          </div>
        )}
      </div>

      {/* Standings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Your Standings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{standing.wins}</div>
            <div className="text-sm text-gray-600">Wins</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{standing.losses}</div>
            <div className="text-sm text-gray-600">Losses</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{standing.ties}</div>
            <div className="text-sm text-gray-600">Ties</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{standing.winRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-lg font-semibold">
            Record: {standing.wins}-{standing.losses}-{standing.ties}
          </div>
        </div>
      </div>

      {/* Individual Round Results */}
      {roundResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Round Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roundResults.map((round) => {
              // Determine background color based on round result
              let bgColor = 'bg-gray-100';
              if (round.result === 'win') bgColor = 'bg-green-200';
              else if (round.result === 'lose') bgColor = 'bg-red-200';
              else if (round.result === 'tie') bgColor = 'bg-yellow-200';
              else if (round.result === 'no_show' || round.result === 'bye') bgColor = 'bg-blue-200';

              return (
                <div key={round.id} className={`p-4 rounded-lg border ${bgColor}`}>
                  <div className="flex items-center justify-center mb-2">
                    {renderArchetype(round.enemyPokemon.join('|'))}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium mb-2">
                      Round {round.roundNumber}
                    </div>
                    <div className="flex justify-center gap-1 mb-2">
                      {round.result === 'no_show' || round.result === 'bye' ? (
                        <span className="px-3 py-1 rounded text-xs font-bold bg-blue-500 text-white">
                          {round.result === 'no_show' ? 'NO SHOW' : 'BYE'}
                        </span>
                      ) : (
                        <span className={`px-3 py-1 rounded text-xs font-bold ${
                          round.result === 'win' ? 'bg-green-500 text-white' :
                          round.result === 'lose' ? 'bg-red-500 text-white' :
                          'bg-yellow-500 text-black'
                        }`}>
                          {round.result.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}