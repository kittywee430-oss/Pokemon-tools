'use client';

import { useState, useEffect, useRef } from 'react';
import ToolHub from '@/components/ToolHub';
import MatchupForm from '@/components/MatchupForm';
import Statistics from '@/components/Statistics';
import MatchupHistory from '@/components/MatchupHistory';
import PokemonDetailsModal from '@/components/PokemonDetailsModal';
import TournamentSelector from '@/components/TournamentSelector';
import TournamentForm from '@/components/TournamentForm';
import TournamentRoundForm from '@/components/TournamentRoundForm';
import TournamentStatistics from '@/components/TournamentStatistics';
import { useMatchups } from '@/hooks/useMatchups';
import { usePokemonMap } from '@/hooks/usePokemonMap';
import { useTournaments } from '@/hooks/useTournaments';
import { Tournament, TournamentRound, RoundResult } from '@/types/tournament';
import { PokemonDetails } from '@/types';

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

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [myPokemon, setMyPokemon] = useState<string[]>([]);
  const [enemyPokemon, setEnemyPokemon] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<'win' | 'lose'>('win');
  const [turnOrder, setTurnOrder] = useState<'first' | 'second'>('first');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'result'>('date');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [exportType, setExportType] = useState<'json' | 'csv'>('json');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNotesFor, setShowNotesFor] = useState<string | null>(null);
  const editFormRef = useRef<HTMLDivElement>(null);

  const { matchups, loading, addMatchup, updateMatchup, deleteMatchup, bulkDelete, importMatchups } = useMatchups();
  const pokemonMap = usePokemonMap();
  const {
    tournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    addRoundToTournament,
    updateRoundInTournament,
    deleteRoundFromTournament,
    getTournamentStanding
  } = useTournaments();

  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [isCreatingTournament, setIsCreatingTournament] = useState(false);
  const [tournamentEnemyPokemon, setTournamentEnemyPokemon] = useState<string[]>([]);
  const [tournamentResult, setTournamentResult] = useState<RoundResult>('win');
  const [tournamentEditingId, setTournamentEditingId] = useState<string | null>(null);
  const [tournamentErrorMessage, setTournamentErrorMessage] = useState('');

  useEffect(() => {
    const storedDark = localStorage.getItem('dark-mode');
    if (storedDark) {
      setDarkMode(JSON.parse(storedDark));
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);




  const handleBulkDelete = () => {
    bulkDelete(selectedForBulk);
    setSelectedForBulk([]);
  };

  const handlePokemonClick = async (name: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPokemonDetails(data);
      setShowDetails(true);
    } catch (error) {
      console.error('Failed to fetch Pokemon details', error);
    }
  };

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

  const handleAddMatchup = () => {
    setErrorMessage('');

    if (myPokemon.length === 0) {
      setErrorMessage('Please select at least one Pokemon for your team.');
      return;
    }

    if (enemyPokemon.length === 0) {
      setErrorMessage('Please select at least one Pokemon for the enemy team.');
      return;
    }

    if (myPokemon.length > 2) {
      setErrorMessage('Your team cannot have more than 2 Pokemon.');
      return;
    }

    if (enemyPokemon.length > 2) {
      setErrorMessage('The enemy team cannot have more than 2 Pokemon.');
      return;
    }

    const now = new Date().toISOString();
    if (editingId) {
      updateMatchup(editingId, {
        myPokemon,
        enemyPokemon,
        notes,
        result,
        turnOrder,
        updatedAt: now,
      });
    } else {
      const newMatchup: Matchup = {
        id: Date.now().toString(),
        myPokemon,
        enemyPokemon,
        notes,
        result,
        turnOrder,
        createdAt: now,
        updatedAt: now,
      };
      addMatchup(newMatchup);
    }

    setMyPokemon([]);
    setEnemyPokemon([]);
    setNotes('');
    setResult('win');
    setTurnOrder('first');
    setEditingId(null);
  };

  const handleEdit = (matchup: Matchup) => {
    setMyPokemon(matchup.myPokemon);
    setEnemyPokemon(matchup.enemyPokemon);
    setNotes(matchup.notes || '');
    setResult(matchup.result as 'win' | 'lose');
    setTurnOrder(matchup.turnOrder as 'first' | 'second');
    setEditingId(matchup.id);

    setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleDelete = (id: string) => {
    deleteMatchup(id);
  };

  const handleCancelEdit = () => {
    setMyPokemon([]);
    setEnemyPokemon([]);
    setNotes('');
    setResult('win');
    setTurnOrder('first');
    setEditingId(null);
    setErrorMessage(''); // Clear error message when canceling edit
  };

  const myArchetypes = Array.from(new Set(matchups.map(m => m.myPokemon.sort().join('|')))).sort();
  const enemyArchetypes = Array.from(new Set(matchups.map(m => m.enemyPokemon.sort().join('|')))).sort();
  const allPokemon = Array.from(new Set(matchups.flatMap(m => [...m.myPokemon, ...m.enemyPokemon])));
  const recentPokemon = allPokemon.slice(-20);

  const handleSelectTool = (toolId: string) => {
    setSelectedTool(toolId);
  };

  const handleBackToHub = () => {
    setSelectedTool(null);
  };

  const handleCreateTournament = (tournament: Tournament) => {
    addTournament(tournament);
    setIsCreatingTournament(false);
  };

  const handleSelectTournament = (tournamentId: string) => {
    setSelectedTournamentId(tournamentId);
    setIsCreatingTournament(false);
  };

  const handleDeleteTournament = (tournamentId: string) => {
    if (selectedTournamentId === tournamentId) {
      setSelectedTournamentId(null);
    }
    deleteTournament(tournamentId);
  };

  const handleAddTournamentRound = () => {
    if (!selectedTournamentId) return;

    setTournamentErrorMessage('');

    if (tournamentEnemyPokemon.length === 0) {
      setTournamentErrorMessage('Please select at least one Pokemon for the enemy team.');
      return;
    }

    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    if (!tournament) return;

    const now = new Date().toISOString();
    if (tournamentEditingId) {
      updateRoundInTournament(selectedTournamentId, tournamentEditingId, {
        enemyPokemon: tournamentEnemyPokemon,
        result: tournamentResult,
        updatedAt: now,
      });
    } else {
      const newRound: TournamentRound = {
        id: Date.now().toString(),
        tournamentId: selectedTournamentId,
        enemyPokemon: tournamentEnemyPokemon,
        result: tournamentResult,
        createdAt: now,
        updatedAt: now,
      };
      addRoundToTournament(selectedTournamentId, newRound);
    }

    setTournamentEnemyPokemon([]);
    setTournamentResult('win');
    setTournamentEditingId(null);
  };

  const handleCancelTournamentEdit = () => {
    setTournamentEnemyPokemon([]);
    setTournamentResult('win');
    setTournamentEditingId(null);
    setTournamentErrorMessage('');
  };

  const handleBackToTournamentSelection = () => {
    setSelectedTournamentId(null);
    setIsCreatingTournament(false);
  };

  const winMatrix: Record<string, Record<string, { wins: number, total: number }>> = {};
  matchups.forEach(m => {
    const rowKey = m.myPokemon.sort().join('|');
    const colKey = m.enemyPokemon.sort().join('|');

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
    if (!hasData) return 'bg-black text-gray-700';

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

  const handleExport = () => {
    if (exportType === 'json') {
      const dataStr = JSON.stringify(matchups, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'pokemon-matchups.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      const csv = [
        ['ID', 'My Pokemon', 'Enemy Pokemon', 'Notes', 'Result', 'Turn Order', 'Created At', 'Updated At'],
        ...matchups.map(m => [
          m.id,
          m.myPokemon.join(';'),
          m.enemyPokemon.join(';'),
          m.notes || '',
          m.result,
          m.turnOrder,
          m.createdAt,
          m.updatedAt
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csv);
      const exportFileDefaultName = 'pokemon-matchups.csv';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          let data: Matchup[];
          if (file.name.endsWith('.csv')) {
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
            data = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.replace(/"/g, ''));
              return {
                id: values[0],
                myPokemon: values[1].split(';'),
                enemyPokemon: values[2].split(';'),
                notes: values[3] || null,
                result: values[4] as 'win' | 'lose',
                turnOrder: values[5] as 'first' | 'second',
                favorite: values[7] === 'Yes',
                createdAt: values[8],
                updatedAt: values[9],
              };
            });
          } else {
            data = JSON.parse(text);
          }
          importMatchups(data);
        } catch (error) {
          console.error('Failed to import matchups', error);
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  const handleExportAll = () => {
    const allData = {
      matchups,
      tournaments,
      darkMode,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(allData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'pokemon-tcg-toolbox-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = JSON.parse(text);

          if (data.matchups) {
            importMatchups(data.matchups);
          }

          if (data.tournaments) {
            localStorage.setItem('tournaments', JSON.stringify(data.tournaments));
            window.location.reload();
          }

          if (data.darkMode !== undefined) {
            setDarkMode(data.darkMode);
          }

          alert('Data imported successfully!');
        } catch (error) {
          console.error('Failed to import data', error);
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!selectedTool) {
    return (
      <ToolHub
        onSelectTool={handleSelectTool}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onExportAll={handleExportAll}
        onImportAll={handleImportAll}
      />
    );
  }

  if (selectedTool === 'matchup-tracker') {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={handleBackToHub}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← Back to Hub
          </button>
        </div>

        <MatchupForm
          matchups={matchups}
          myPokemon={myPokemon}
          enemyPokemon={enemyPokemon}
          notes={notes}
          result={result}
          turnOrder={turnOrder}
          editingId={editingId}
          errorMessage={errorMessage}
          exportType={exportType}
          darkMode={darkMode}
          recentPokemon={recentPokemon}
          onMyPokemonChange={setMyPokemon}
          onEnemyPokemonChange={setEnemyPokemon}
          onNotesChange={setNotes}
          onResultChange={setResult}
          onTurnOrderChange={setTurnOrder}
          onAddMatchup={handleAddMatchup}
          onCancelEdit={handleCancelEdit}
          onExportTypeChange={setExportType}
          onExport={handleExport}
          onImport={handleImport}
          onDarkModeToggle={() => setDarkMode(!darkMode)}
        />

        <Statistics matchups={matchups} pokemonMap={pokemonMap} />

        <MatchupHistory
          matchups={matchups}
          pokemonMap={pokemonMap}
          search={search}
          sortBy={sortBy}
          selectedForBulk={selectedForBulk}
          showNotesFor={showNotesFor}
          onSearchChange={setSearch}
          onSortByChange={setSortBy}
          onBulkSelect={(id) => {
            if (selectedForBulk.includes(id)) {
              setSelectedForBulk(selectedForBulk.filter(bulkId => bulkId !== id));
            } else {
              setSelectedForBulk([...selectedForBulk, id]);
            }
          }}
          onBulkDelete={handleBulkDelete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShowNotes={(id) => setShowNotesFor(id)}
          onPokemonClick={handlePokemonClick}
        />

        <PokemonDetailsModal
          pokemonDetails={pokemonDetails}
          showDetails={showDetails}
          onClose={() => setShowDetails(false)}
        />
      </div>
    );
  }

  if (selectedTool === 'tournament-tracker') {
    const selectedTournament = selectedTournamentId ? tournaments.find(t => t.id === selectedTournamentId) : null;
    const tournamentStanding = selectedTournamentId ? getTournamentStanding(selectedTournamentId) : null;

    return (
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={handleBackToHub}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← Back to Hub
          </button>
        </div>

        {isCreatingTournament ? (
          <TournamentForm
            onCreateTournament={handleCreateTournament}
            onCancel={() => setIsCreatingTournament(false)}
          />
        ) : selectedTournament ? (
          <>
            <TournamentStatistics
              tournament={selectedTournament}
              standing={tournamentStanding!}
              pokemonMap={pokemonMap}
              onBackToSelection={handleBackToTournamentSelection}
            />

            <TournamentRoundForm
              tournamentId={selectedTournamentId!}
              enemyPokemon={tournamentEnemyPokemon}
              result={tournamentResult}
              editingId={tournamentEditingId}
              errorMessage={tournamentErrorMessage}
              tournamentFormat={selectedTournament?.format || 'bo3'}
              recentPokemon={recentPokemon}
              onEnemyPokemonChange={setTournamentEnemyPokemon}
              onResultChange={setTournamentResult}
              onAddRound={handleAddTournamentRound}
              onCancelEdit={handleCancelTournamentEdit}
              onBackToSelection={handleBackToTournamentSelection}
            />
          </>
        ) : (
          <TournamentSelector
            tournaments={tournaments}
            selectedTournamentId={selectedTournamentId}
            pokemonMap={pokemonMap}
            onSelectTournament={handleSelectTournament}
            onCreateNew={() => setIsCreatingTournament(true)}
            onDeleteTournament={handleDeleteTournament}
          />
        )}

        <PokemonDetailsModal
          pokemonDetails={pokemonDetails}
          showDetails={showDetails}
          onClose={() => setShowDetails(false)}
        />
      </div>
    );
  }


  return (
    <ToolHub
      onSelectTool={handleSelectTool}
      darkMode={darkMode}
      onDarkModeToggle={() => setDarkMode(!darkMode)}
      onExportAll={handleExportAll}
      onImportAll={handleImportAll}
    />
  );
}
