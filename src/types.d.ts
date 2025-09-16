declare module 'next-pwa';

// Pokemon API Types
export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string;
  back_shiny: string;
  back_female: string | null;
  back_shiny_female: string | null;
}

export interface PokemonDetails {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: unknown[]; // Pokemon abilities array
  forms: unknown[]; // Pokemon forms array
  game_indices: unknown[]; // Game indices array
  held_items: unknown[]; // Held items array
  location_area_encounters: string;
  moves: unknown[]; // Pokemon moves array
  species: { name: string; url: string }; // Pokemon species reference
  sprites: PokemonSprites;
  stats: PokemonStat[];
  types: PokemonType[];
  past_types: unknown[]; // Past types array
}