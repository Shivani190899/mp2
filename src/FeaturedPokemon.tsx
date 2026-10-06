import { useEffect, useState } from "react";
import axios from "axios";

interface PokemonData {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
  };
}

function FeaturedPokemon() {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get<PokemonData>(
        "https://pokeapi.co/api/v2/pokemon/39",
        {
          signal: controller.signal,
          timeout: 12000,
        }
      )
      .then((response) => {
        if (!controller.signal.aborted) {
          setPokemon(response.data);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(true);
        }
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <p role="alert">
        Jigglypuff couldn’t load. Please refresh to try again.
      </p>
    );
  }

  if (!pokemon) {
    return <p role="status">Finding Jigglypuff…</p>;
  }

  const image =
    pokemon.sprites.other["official-artwork"].front_default;

  return (
    <figure className="featured-pokemon">
      {image ? (
        <img src={image} alt={pokemon.name} />
      ) : (
        <p>Artwork is unavailable.</p>
      )}

      <figcaption>
        #{String(pokemon.id).padStart(3, "0")} · Jigglypuff,
        forever my favorite
      </figcaption>
    </figure>
  );
}

export default FeaturedPokemon;