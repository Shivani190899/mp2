import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllPokemon } from "./pokemonApi";
import type { Pokemon } from "./types";

function PokemonCollection() {
  const [params] = useSearchParams();

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(params.get("q") ?? "");

  const [sortBy, setSortBy] = useState(
    params.get("sort") === "name" ? "name" : "id"
  );

  const [sortOrder, setSortOrder] = useState(
    params.get("order") === "desc" ? "desc" : "asc"
  );

  const [view, setView] = useState(
    params.get("view") === "list" ? "list" : "gallery"
  );

  const [selectedType, setSelectedType] = useState(
    params.get("type") ?? "all"
  );
  
  useEffect(() => {
    let ignore = false;

    async function loadPokemon() {
      try {
        const collection = await getAllPokemon();

        if (!ignore) {
          setPokemon(collection);
        }
      } catch {
        if (!ignore) {
          setError(
            "We couldn’t load the Pokémon. Please refresh to try again."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPokemon();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <p role="status">Gathering your childhood favorites…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }
 const availableTypes = [
  ...new Set(pokemon.flatMap((item) => item.types)),
].sort();

const query = search.trim().toLowerCase();

const filteredPokemon = pokemon.filter((item) => {
  const matchesSearch = item.name.toLowerCase().includes(query);

  const matchesType =
    selectedType === "all" || item.types.includes(selectedType);

  return matchesSearch && matchesType;
});

  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    const comparison =
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : a.id - b.id;

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const returnParams = new URLSearchParams({
    q: search,
    sort: sortBy,
    order: sortOrder,
    view,
    type: selectedType,
  });

  const navigationState = {
    ids: sortedPokemon.map((item) => item.id),
    returnTo: `/?${returnParams.toString()}`,
  };

  return (
    <section className="collection" aria-labelledby="collection-title">
      <h2 id="collection-title">Meet the original 151</h2>
      
      <div className="view-controls" role="group" aria-label="Collection view">
        <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
        >
         List view
        </button>

        <button
            type="button"
            aria-pressed={view === "gallery"}
            onClick={() => setView("gallery")}
        >
            Gallery view
        </button>
      </div>
      <div className="search-field">
        <label htmlFor="pokemon-search">Find a childhood favorite</label>

        <input
        id="pokemon-search"
        type="search"
        placeholder="Search Pokémon by name…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
  />
</div>

<div className="sort-controls">
  <div className="sort-field">
    <label htmlFor="sort-by">Sort by</label>

    <select
      id="sort-by"
      value={sortBy}
      onChange={(event) => setSortBy(event.target.value)}
    >
      <option value="id">Pokédex number</option>
      <option value="name">Name</option>
    </select>
  </div>

  <div className="sort-field">
    <label htmlFor="sort-order">Order</label>

    <select
      id="sort-order"
      value={sortOrder}
      onChange={(event) => setSortOrder(event.target.value)}
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
</div>
<div className="sort-field type-filter">
  <label htmlFor="pokemon-type">Filter by type</label>

  <select
    id="pokemon-type"
    value={selectedType}
    onChange={(event) => setSelectedType(event.target.value)}
  >
    <option value="all">All types</option>

    {availableTypes.map((type) => (
      <option key={type} value={type}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </option>
    ))}
  </select>
</div>
<p className="collection-count" role="status">
  Showing {filteredPokemon.length} of {pokemon.length} Pokémon
</p>

{filteredPokemon.length === 0 && (
  <p>No Pokémon match. Try another name or choose All types.</p>
)}  
      <ul className={view === "gallery" ? "pokemon-grid" : "pokemon-list"}>
  {sortedPokemon.map((item) => (
    <li key={item.id}>
      <Link
        className="pokemon-card"
        to={`/pokemon/${item.id}`}
        state={navigationState}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            width="160"
            height="160"
          />
        ) : (
          <span className="artwork-placeholder">
            Artwork unavailable
          </span>
        )}

        <p className="pokemon-number">
          #{String(item.id).padStart(3, "0")}
        </p>

        <h3 className="pokemon-name">{item.name}</h3>

        <p className="pokemon-types">
          {item.types.join(" · ")}
        </p>
      </Link>
    </li>
  ))}
</ul>
    </section>
  );
}

export default PokemonCollection;