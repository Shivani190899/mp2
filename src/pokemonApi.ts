import axios from "axios";
import type { Pokemon } from "./types";

interface PokemonApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;

  sprites: {
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
  };

  types: {
    type: {
      name: string;
    };
  }[];

  abilities: {
    ability: {
      name: string;
    };
  }[];

  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

export async function getPokemon(id: number): Promise<Pokemon> {
  const response = await axios.get<PokemonApiResponse>(
    `https://pokeapi.co/api/v2/pokemon/${id}`,
    { timeout: 12000 }
  );

  const data = response.data;

  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other["official-artwork"].front_default,
    types: data.types.map((entry) => entry.type.name),
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map((entry) => entry.ability.name),
    stats: data.stats.map((entry) => ({
      name: entry.stat.name,
      value: entry.base_stat,
    })),
  };
}

async function loadPokemonCollection(): Promise<Pokemon[]> {
  const collection: Pokemon[] = [];
  const batchSize = 10;

  for (let start = 1; start <= 151; start += batchSize) {
    const requests: Promise<Pokemon>[] = [];

    for (
      let id = start;
      id < start + batchSize && id <= 151;
      id++
    ) {
      requests.push(getPokemon(id));
    }

    const batch = await Promise.all(requests);
    collection.push(...batch);
  }

  return collection;
}

let collectionPromise: Promise<Pokemon[]> | null = null;

export function getAllPokemon(): Promise<Pokemon[]> {
  if (!collectionPromise) {
    collectionPromise = loadPokemonCollection().catch((error) => {
      collectionPromise = null;
      throw error;
    });
  }

  return collectionPromise;
}