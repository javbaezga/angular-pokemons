import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Pokemon } from './pokemon';

export type PokemonDb = { pokemons: Pokemon[] };

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb(): PokemonDb {
    return { pokemons: [] };
  }

  genId(pokemons: Pokemon[]): number {
    return pokemons.length > 0 ? Math.max(...pokemons.map(pokemon => pokemon.id)) + 1 : 1;
  }
}