import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pokemon } from './pokemon';

export interface IPokemonService {
  /**
   * Gets pokemons.
   * @param idAuthor Author ID. 
   */
  getPokemons(idAuthor: number): Observable<Pokemon[]>;
  /**
   * Gets pokemon.
   * @param id Pokemon ID.
   */
  getPokemon(id: number): Observable<Pokemon>;
  /**
   * Adds pokemon.
   * @param pokemon Pokemon to add.
   */
  addPokemon(pokemon: Pokemon): Observable<Pokemon>;
  /**
   * Updates pokemon.
   * @param pokemon Pokemon to update.
   */
  updatePokemon(pokemon: Pokemon): Observable<Pokemon>;
  /**
   * Deletes pokemon.
   * @param id Pokemon ID.
   */
  deletePokemon(id: number): Observable<Pokemon>;
  /**
   * Searchs pokemons.
   * @param term Search term (pokemon name).
   */
  searchPokemons(term: string | null): Observable<Pokemon[]>;
  /**
   * On change event.
   * Runs when a pokemon is added or updated.
   */
  onChange(): Observable<Pokemon>;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService implements IPokemonService {
  private pokemonsUrl = 'https://bp-pokemons.herokuapp.com/api/pokemons'; // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private changeSubject = new Subject<Pokemon>();

  constructor(private http: HttpClient) { }

  getPokemons(idAuthor: number): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.pokemonsUrl}/?idAuthor=${idAuthor}`)
      .pipe(
        catchError(this.handleError<Pokemon[]>('getPokemons', []))
      );
  }

  getPokemon(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.pokemonsUrl}/${id}`).pipe(
      catchError(this.handleError<Pokemon>(`getPokemon id=${id}`))
    );
  }

  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    const newPokemon: Pokemon = { ...pokemon };
    delete (newPokemon as any).id;
    return this.http.post<Pokemon>(this.pokemonsUrl, newPokemon, this.httpOptions).pipe(
      tap((pokemon: Pokemon) => this.change(pokemon)),
      catchError(this.handleError<Pokemon>('addPokemon'))
    );
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.put<Pokemon>(`${this.pokemonsUrl}/${pokemon.id}`, pokemon, this.httpOptions).pipe(
      tap((pokemon: Pokemon) => this.change(pokemon)),
      catchError(this.handleError<Pokemon>('updatePokemon'))
    );
  }

  deletePokemon(id: number): Observable<Pokemon> {
    return this.http.delete<Pokemon>(`${this.pokemonsUrl}/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<Pokemon>(`deletePokemon id=${id}`))
    );
  }

  searchPokemons(term: string | null): Observable<Pokemon[]> {
    if (!term || !term.trim()) {
      return this.http.get<Pokemon[]>(this.pokemonsUrl).pipe(
        catchError(this.handleError<Pokemon[]>('searchPokemons', []))
      );
    }
    return this.http.get<Pokemon[]>(`${this.pokemonsUrl}/?name=${term}`).pipe(
      catchError(this.handleError<Pokemon[]>(`searchPokemons term=${term}`, []))
    );
  }

  onChange(): Observable<Pokemon> {
    return this.changeSubject;
  }

  /**
   * Handles Http operation that failed.
   * Lets the app continue.
   *
   * @param operation Name of the operation that failed.
   * @param result Optional value to return as the observable result.
   */
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Log the error to console.
      console.error(operation, error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private change(pokemon: Pokemon) {
    this.changeSubject.next(pokemon);
  }
}
