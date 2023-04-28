import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PokemonService } from './pokemon.service';
import { EMPTY_POKEMON, Pokemon } from './pokemon';

export const pokemonDetailResolver: ResolveFn<Pokemon> = (route: ActivatedRouteSnapshot) => {
  const id = +route.paramMap.get('id')!;
  if (id > 0) {
    const router = inject(Router), pokemonService = inject(PokemonService);
    return pokemonService.getPokemon(id).pipe(mergeMap(pokemon => {
        if (pokemon) {
            return of(pokemon);
        }
        router.navigate(['/pokemons']);
        return EMPTY;
    }));
  }
  return of(EMPTY_POKEMON);
};