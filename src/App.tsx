import { Link, Route, Routes } from "react-router-dom";
import FeaturedPokemon from "./FeaturedPokemon";
import PokemonCollection from "./PokemonCollection";
import PokemonDetail from "./PokemonDetail";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="site-header">
        <Link className="brand" to="/">
          Momo’s Pokédex
        </Link>

        <span className="header-note">
          A little love letter to childhood
        </span>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section className="hero">
                  <p className="eyebrow">THE ORIGINAL 151 POKÉMON</p>

                  <h1>
                    A little nostalgia.
                    <br />
                    <span>A lot of heart.</span>
                  </h1>

                  <p className="introduction">
                    I grew up wishing I could step into the Pokémon world.
                    Now, as a web programmer, I get to build a little piece
                    of it. Momo’s Pokédex is my full-circle moment—a love
                    letter to the little girl who never stopped dreaming.
                  </p>

                  <FeaturedPokemon />
                </section>

                <PokemonCollection />
              </>
            }
          />

          <Route path="/pokemon/:id" element={<PokemonDetail />} />

          <Route
            path="*"
            element={
              <section className="detail-page">
                <h1>This page wandered off.</h1>
                <Link className="back-link" to="/">
                  ← Back to the collection
                </Link>
              </section>
            }
          />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>Designed by Shivani Darekar</p>
        <p>
          A little childhood wonder, a little code, a lot of heart.
        </p>
      </footer>
    </div>
  );
}

export default App;