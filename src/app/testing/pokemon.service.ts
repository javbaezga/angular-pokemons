import { Observable, Subject } from 'rxjs';
import { asyncData } from './async-observable-helpers';
import { IPokemonService } from '../pokemon.service';
import { POKEMONS } from './mock-pokemons';
import { Pokemon } from '../pokemon';

export class PokemonServiceSpy implements IPokemonService {
  readonly pokemons: Pokemon[] = [...POKEMONS];
  private changeSubject = new Subject<Pokemon>();

  getPokemonIndex(prop: keyof Pokemon, value: unknown): number {
    for (let i = 0; i < this.pokemons.length; i++) {
      const pokemon: Pokemon = this.pokemons[i];
      if (pokemon[prop] === value) {
        return i;
      }
    }
    return -1;
  }

  readonly getPokemons = jasmine.createSpy('getPokemons').and.callFake(
    (idAuthor: number) => asyncData(this.pokemons.filter((pokemon: Pokemon) => pokemon.idAuthor === idAuthor))
  );

  readonly getPokemon = jasmine.createSpy('getPokemon').and.callFake(
    (id: number) => {
      const data = this.pokemons.filter((pokemon: Pokemon) => pokemon.id === id);
      return asyncData(data.length ? {...data[0]} : null);
    }
  );

  readonly addPokemon = jasmine.createSpy('addPokemon').and.callFake(
    (pokemon: Pokemon) => {
      const index = this.getPokemonIndex('id', pokemon.id);
      if (index !== -1) {
        this.pokemons.push(pokemon);
        this.change(pokemon);
        return asyncData(pokemon);
      }
      return asyncData(null);
    }
  );

  readonly updatePokemon = jasmine.createSpy('updatePokemon').and.callFake(
    (pokemon: Pokemon) => {
      const index = this.getPokemonIndex('id', pokemon.id);
      if (index !== -1) {
        this.pokemons[index] = pokemon;
        this.change(pokemon);
        return asyncData(pokemon);
      }
      return asyncData(null);
    }
  );

  readonly deletePokemon = jasmine.createSpy('deletePokemon').and.callFake(
    (id: number) => {
      const index = this.getPokemonIndex('id', id);
      if (index !== -1) {
        const pokemon: Pokemon = this.pokemons[index];
        this.pokemons.splice(index, 1);
        return asyncData(pokemon);
      }
      return asyncData(null);
    }
  );

  readonly searchPokemons = jasmine.createSpy('searchPokemons').and.callFake(
    (term: string) => {
      let result;
      if (term) {
        term = term.toUpperCase();
        result = this.pokemons.filter((pokemon: Pokemon) => pokemon.name.toUpperCase().indexOf(term) !== -1);
      } else {
        result = [...this.pokemons];
      }
      return asyncData(result);
    }
  );

  readonly change = jasmine.createSpy('change').and.callFake(
    (pokemon: Pokemon) => this.changeSubject.next(pokemon)
  );

  onChange(): Observable<Pokemon> {
    return this.changeSubject;
  }
}