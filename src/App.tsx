import React, { useMemo } from "react";
import "./App.css";
import { useObservableState } from "observable-hooks";
import { BehaviorSubject, combineLatestWith, map } from "rxjs";

import { pokemon$, selected$, deck$ } from "./store/store";

const Deck = () => {
  // const { deck$ } = usePokemon();
  const deck = useObservableState(deck$, []);
  return (
    <div>
      <h4>Deck</h4>
      <div>
        {deck.map((p) => (
          <div key={p.id} style={{ display: "flex" }}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
              alt={p.name}
            />
            <div>
              <div>{p.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Search = () => {
  // const { pokemon$, selected$ } = usePokemon();
  const search$ = useMemo(() => new BehaviorSubject(""), []);

  const [filteredPokemon] = useObservableState(
    () =>
      pokemon$.pipe(
        /* recall: pokemon$ is a combination of pokemonWithPower$ & selected$ */
        /* here, we further combine pokemon$ with search$ */
        combineLatestWith(search$),
        map(([pokemon, search]) => pokemon.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())))
      ),
    []
  );

  return (
    <div>
      <input type="text" value={search$.value} onChange={(e) => search$.next(e.target.value)} />
      <div>
        {filteredPokemon.map((p) => (
          <div key={p.name}>
            {/* List: checkbox + pokemon name */}
            <input
              type="checkbox"
              checked={p.selected}
              onChange={() => {
                if (selected$.value.includes(p.id)) {
                  /* if the selected value includes that p.id, then we remove it from the selected$ array */
                  selected$.next(selected$.value.filter((id: any) => id !== p.id));
                } else {
                  /* the selected value doesn't contain the id, so let's add the id */
                  selected$.next([...selected$.value, p.id]);
                }
              }}
            />
            <strong>{p.name}</strong> - {p.power}
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    // @ts-ignore
    // <PokemonProvider>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <Search />
      <Deck />
    </div>
    // </PokemonProvider>
  );
}

export default App;
