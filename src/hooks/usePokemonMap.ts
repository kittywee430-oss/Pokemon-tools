import { useState, useEffect } from 'react';
import { PokemonListItem } from '@/types';

export function usePokemonMap() {
  const [pokemonMap, setPokemonMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Clear old pokemon map cache to force refresh
        localStorage.removeItem('pokemon-map-cache');

        const map: Record<string, string> = {};
        data.results.forEach((p: PokemonListItem, index: number) => {
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

          map[p.name] = spriteUrl;
        });
        setPokemonMap(map);
      } catch (error) {
        console.error('Failed to fetch Pokemon map', error);
      }
    };
    fetchPokemon();
  }, []);

  return pokemonMap;
}