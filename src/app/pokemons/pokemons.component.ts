import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap, tap } from 'rxjs';
import { OverlayService } from '../overlay.service';
import { clearOutlet } from '../shared/router-outlet';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css']
})
export class PokemonsComponent implements OnInit {
  data$!: Observable<Pokemon[]>;
  private searchTerms: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _reload: boolean = false;

  constructor(
    private router: Router,
    private pokemonService: PokemonService,
    readonly overlayService: OverlayService
  ) { }

  ngOnInit(): void {
    this.overlayService.show();
    this.data$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged((previous: string, current: string) => {
        let result;
        if (this._reload) {
          this._reload = false;
          result = false;
        } else {
          result = previous === current;
        }
        if (!result) {
          this.overlayService.show();
        }
        return result;
      }),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.pokemonService.searchPokemons(term)),
      tap(() => this.overlayService.hide())
    );
    this.pokemonService.onChange().subscribe(() => this.reload());
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  reload(): void {
    this._reload = true;
    this.searchTerms.next(this.searchTerms.getValue());
  }

  edit(id: number) {
    this.overlayService.show();
    clearOutlet(this.router, 'details').then(
      () => this.router.navigate(['', { outlets: { details: ['pokemons', id] } }])
    );
  }

  delete(id: number): void {
    this.overlayService.show();
    clearOutlet(this.router, 'details');
    this.pokemonService.deletePokemon(id).subscribe(() => this.reload());
  }
}
