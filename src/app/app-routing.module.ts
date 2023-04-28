import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { pokemonDetailResolver } from './pokemon-detail-resolver';
import { PokemonsComponent } from './pokemons/pokemons.component';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'pokemons/:id',
    component: PokemonDetailComponent,
    outlet: 'details',
    resolve: {pokemon: pokemonDetailResolver}
  },
  { path: 'pokemons', component: PokemonsComponent },
  { path: '', redirectTo: '/pokemons', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
