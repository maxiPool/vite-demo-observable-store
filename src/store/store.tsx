import { BehaviorSubject, map, combineLatestWith } from "rxjs";
// import { createContext, useContext } from "react";

export interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  power?: number /* optional field, derived from the original data */;
  selected?: boolean /* optional field, user modification */;
}

const rawPokemon$ = new BehaviorSubject<Pokemon[]>([]);

const pokemonWithPower$ = rawPokemon$.pipe(
  map((pokemon: Pokemon[]) =>
    pokemon.map((p: Pokemon) => ({
      ...p,
      power: p.hp + p.attack + p.defense + p.special_attack + p.special_defense + p.speed,
    }))
  )
);

export const selected$ = new BehaviorSubject<number[]>([]);

// combine selected$ with pokemonWithPower$ !
export const pokemon$ = pokemonWithPower$.pipe(
  combineLatestWith(selected$),
  map(([pokemon, selected]) =>
    pokemon.map((p) => ({
      ...p,
      selected: selected.includes(p.id),
    }))
  )
);

export const deck$ = pokemon$.pipe(map((pokemon) => pokemon.filter((p) => p.selected)));

fetch("/pokemon-simplified.json")
  .then((res) => res.json())
  .then((data) => rawPokemon$.next(data));

// const PokemonContext = createContext({
//   pokemon$,
//   selected$,
//   deck$,
// });
//
// export const usePokemon = () => useContext(PokemonContext);
//
// // @ts-ignore
// export const PokemonProvider: React.FunctionComponent = ({ children }) => (
//   <PokemonContext.Provider
//     value={{
//       pokemon$,
//       selected$,
//       deck$,
//     }}
//   >
//     {children}
//   </PokemonContext.Provider>
// );
