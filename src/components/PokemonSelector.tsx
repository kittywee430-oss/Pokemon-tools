'use client';

import { useState, useEffect, useRef } from 'react';
import { PokemonListItem } from '@/types';

interface Pokemon {
  name: string;
  id: number;
  sprite: string;
}

interface PokemonSelectorProps {
  selected: string[];
  onSelect: (pokemon: string[]) => void;
  maxSelect?: number;
  recentPokemon?: string[];
}

export default function PokemonSelector({ selected, onSelect, maxSelect = 3, recentPokemon = [] }: PokemonSelectorProps) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear old cache to force refresh with new PokemonDB sprites
    localStorage.removeItem('pokemon-list');
    fetchPokemon();

    async function fetchPokemon() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const pokemon: Pokemon[] = data.results.map((p: PokemonListItem, index: number) => {
          // Use Pokemon GO sprites from PokemonDB with correct patterns
          let spriteUrl: string;
          let baseName = p.name;

          // Handle Ogerpon variants specially
          if (p.name.startsWith('ogerpon-')) {
            // Remove -mask suffix from variant names
            const variant = p.name.replace('ogerpon-', '').replace('-mask', '');
            spriteUrl = `https://img.pokemondb.net/sprites/scarlet-violet/normal/ogerpon-${variant}.png`;
          }
          // Handle normal Ogerpon (not in Pokemon GO)
          else if (p.name === 'ogerpon') {
            spriteUrl = `https://img.pokemondb.net/sprites/scarlet-violet/normal/ogerpon.png`;
          }
          // Handle Mega Pokemon
          else if (p.name.includes('-mega')) {
            baseName = p.name.replace('-mega', '');
            // Handle special cases where API name format differs from sprite URL format
            if (baseName.endsWith('-x') || baseName.endsWith('-y')) {
              // Convert charizard-x-mega → charizard-mega-x, mewtwo-x-mega → mewtwo-mega-x
              const form = baseName.slice(-2); // '-x' or '-y'
              const pokemonName = baseName.slice(0, -2); // 'charizard' or 'mewtwo'
              spriteUrl = `https://img.pokemondb.net/sprites/go/normal/${pokemonName}-mega${form}.png`;
            } else {
              spriteUrl = `https://img.pokemondb.net/sprites/go/normal/${baseName}-mega.png`;
            }
          }
          // Handle G-Max Pokemon
          else if (p.name.includes('-gmax') || p.name.includes('-gigantamax')) {
            baseName = p.name.replace(/-gmax$/, '').replace(/-gigantamax$/, '');
            // All G-Max Pokemon use home sprites
            spriteUrl = `https://img.pokemondb.net/sprites/home/normal/${baseName}-gigantamax.png`;
          }
          // Regular Pokemon
          else {
            spriteUrl = `https://img.pokemondb.net/sprites/home/normal/${p.name}.png`;
          }

          return {
            name: p.name,
            id: index + 1,
            sprite: spriteUrl,
          };
        });
        setPokemonList(pokemon);
        localStorage.setItem('pokemon-list', JSON.stringify(pokemon));
      } catch (error) {
        console.error('Failed to fetch Pokemon', error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPokemon = pokemonList
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) && !selected.includes(p.name)
    )
    .slice(0, 50); // Limit to 50 for performance

  const handleSelect = (name: string) => {
    if (selected.includes(name)) {
      onSelect(selected.filter(p => p !== name));
    } else if (selected.length < maxSelect) {
      onSelect([...selected, name]);
      setSearch('');
      setIsOpen(false);
    }
  };

  const removeSelected = (name: string) => {
    onSelect(selected.filter(p => p !== name));
  };

  if (loading) return <div>Loading Pokemon...</div>;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map(name => {
          const pokemon = pokemonList.find(p => p.name === name);
          return (
            <div key={name} className="flex items-center bg-blue-100 dark:bg-blue-800 border border-blue-300 dark:border-blue-600 rounded-lg px-2 py-1">
              {pokemon && <img src={pokemon.sprite} alt={name} className="w-12 h-12 mr-2" />}
              <span className="text-sm capitalize">{name}</span>
              <button
                onClick={() => removeSelected(name)}
                className="ml-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      <input
        type="text"
        placeholder="Search Pokemon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      {recentPokemon.length > 0 && (
        <div className="mt-2">
          <div className="text-sm text-gray-600 mb-1">Recently Used:</div>
          <div className="flex flex-wrap gap-1">
            {recentPokemon.slice(0, 10).map(name => {
              const pokemon = pokemonList.find(p => p.name === name);
              return (
                <button
                  key={name}
                  onClick={() => handleSelect(name)}
                  disabled={selected.includes(name)}
                  className={`flex items-center bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-600 px-2 py-1 rounded text-sm ${selected.includes(name) ? 'opacity-50' : ''}`}
                >
                  {pokemon && <img src={pokemon.sprite} alt={name} className="w-8 h-8 mr-1" />}
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
          {filteredPokemon.map((pokemon) => (
            <div
              key={pokemon.id}
              onClick={() => handleSelect(pokemon.name)}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
            >
              <img src={pokemon.sprite} alt={pokemon.name} className="w-16 h-16 mr-2" />
              <span className="capitalize">{pokemon.name}</span>
            </div>
          ))}
          {filteredPokemon.length === 0 && (
            <div className="p-2 text-gray-500">No Pokemon found</div>
          )}
        </div>
      )}
    </div>
  );
}