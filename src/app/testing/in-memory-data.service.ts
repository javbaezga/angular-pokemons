import { Injectable } from '@angular/core';
import { InMemoryDataService, PokemonDb } from '../in-memory-data.service';
import { POKEMONS } from './mock-pokemons';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataServiceTest extends InMemoryDataService {
  readonly data: PokemonDb = {pokemons: [...POKEMONS]};

  override createDb(): PokemonDb {
    return this.data;
  }

  refresh(): void {
    this.data.pokemons = [...POKEMONS];
  }
}