import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAllPokemon } from "./pokemonApi";
import type { Pokemon } from "./types";

interface DetailNavigation {
  ids: number[];
  returnTo: string;
}

function PokemonDetail() {
  const { id } = useParams();
  const location = useLocation();

  const navigation = location.state as DetailNavigation | null;

  const [collection, setCollection] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCollection() {
      try {
        const data = await getAllPokemon();

        if (!ignore) {
          setCollection(data);
        }
      } catch {
        if (!ignore) {
          setError(
            "We couldn’t load this Pokémon. Please refresh to try again."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCollection();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const pokemonId = Number(id);
  const returnTo = navigation?.returnTo ?? "/";

  if (
    !Number.isInteger(pokemonId) ||
    pokemonId < 1 ||
    pokemonId > 151
  ) {
    return (
      <section className="detail-page">
        <h1>Pokémon not found</h1>
        <p>This Pokédex contains Pokémon numbered 1 through 151.</p>
        <Link className="back-link" to="/">
          ← Back to the collection
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="detail-page">
        <p role="status">Opening your Pokédex…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="detail-page">
        <p role="alert">{error}</p>
        <Link className="back-link" to={returnTo}>
          ← Back to the collection
        </Link>
      </section>
    );
  }

  const pokemon = collection.find((item) => item.id === pokemonId);

  if (!pokemon) {
    return (
      <section className="detail-page">
        <h1>Pokémon not found</h1>
        <Link className="back-link" to="/">
          ← Back to the collection
        </Link>
      </section>
    );
  }

  const ids = navigation?.ids.includes(pokemon.id)
    ? navigation.ids
    : collection.map((item) => item.id);

  const currentIndex = ids.indexOf(pokemon.id);
  const previousId = ids[(currentIndex - 1 + ids.length) % ids.length];
  const nextId = ids[(currentIndex + 1) % ids.length];

  const navigationState: DetailNavigation = {
    ids,
    returnTo,
  };

  return (
    <section className="detail-page">
      <Link className="back-link" to={returnTo}>
        ← Back to the collection
      </Link>

      <article className="detail-card" aria-labelledby="pokemon-title">
        <div className="detail-artwork">
          {pokemon.image ? (
            <img
              src={pokemon.image}
              alt={pokemon.name}
              width="360"
              height="360"
            />
          ) : (
            <p>Artwork unavailable</p>
          )}

          {pokemon.id === 39 && (
            <p className="favorite-note">
              Momo’s forever favorite ♡
            </p>
          )}
        </div>

        <div className="detail-information">
          <p className="eyebrow">
            POKÉDEX #{String(pokemon.id).padStart(3, "0")}
          </p>

          <h1 id="pokemon-title">{pokemon.name}</h1>

          <p className="detail-types">
            {pokemon.types.join(" · ")}
          </p>

          <dl className="detail-facts">
            <div>
              <dt>Height</dt>
              <dd>{pokemon.height / 10} m</dd>
            </div>

            <div>
              <dt>Weight</dt>
              <dd>{pokemon.weight / 10} kg</dd>
            </div>

            <div>
              <dt>Abilities</dt>
              <dd className="ability-names">
                {pokemon.abilities
                  .map((ability) => ability.replaceAll("-", " "))
                  .join(", ")}
              </dd>
            </div>
          </dl>

          <h2>Base stats</h2>

          <dl className="stat-list">
            {pokemon.stats.map((stat) => (
              <div className="stat-row" key={stat.name}>
                <dt>{stat.name.replaceAll("-", " ")}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>

      <nav className="detail-navigation" aria-label="Browse Pokémon">
        <Link
          className="navigation-button"
          to={`/pokemon/${previousId}`}
          state={navigationState}
        >
          ← Previous
        </Link>

        <p>
          {currentIndex + 1} of {ids.length} Pokémon
        </p>

        <Link
          className="navigation-button"
          to={`/pokemon/${nextId}`}
          state={navigationState}
        >
          Next →
        </Link>
      </nav>
    </section>
  );
}

export default PokemonDetail;