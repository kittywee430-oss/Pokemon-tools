'use client';

import Image from 'next/image';
import { PokemonDetails } from '@/types';

interface PokemonDetailsModalProps {
  pokemonDetails: PokemonDetails | null;
  showDetails: boolean;
  onClose: () => void;
}

export default function PokemonDetailsModal({ pokemonDetails, showDetails, onClose }: PokemonDetailsModalProps) {
  if (!showDetails || !pokemonDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 capitalize">{pokemonDetails.name}</h3>
        <Image
          src={pokemonDetails.sprites.front_default}
          alt={pokemonDetails.name}
          width={128}
          height={128}
          className="w-32 h-32 mx-auto mb-4"
        />
        <div className="mb-4">
          <h4 className="font-semibold">Types:</h4>
          <div className="flex gap-2">
            {pokemonDetails.types.map((t) => (
              <span key={t.type.name} className="bg-blue-100 px-2 py-1 rounded capitalize">
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Stats:</h4>
          <ul>
            {pokemonDetails.stats.map((s) => (
              <li key={s.stat.name} className="capitalize">
                {s.stat.name}: {s.base_stat}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}