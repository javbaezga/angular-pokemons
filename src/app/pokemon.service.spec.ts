import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataServiceTest } from './testing/in-memory-data.service';
import { PokemonService } from './pokemon.service';
import { Pokemon, DEFAULT_AUTHOR_ID } from './pokemon';

describe('PokemonService', () => {
  let service: PokemonService,
      inMemoryDataService: InMemoryDataServiceTest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(
          InMemoryDataServiceTest, { dataEncapsulation: false }
        )
      ]
    });
    service = TestBed.inject(PokemonService);
    inMemoryDataService = TestBed.inject(InMemoryDataServiceTest);
  });

  afterEach(() => {
    inMemoryDataService.refresh();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getPokemons should return an array with all pokemons', (done: DoneFn) => {
    service.getPokemons(DEFAULT_AUTHOR_ID).subscribe((result: Pokemon[]) => {
      expect(result).toEqual(inMemoryDataService.data.pokemons);
      done();
    });
  });

  it('#getPokemons should not return any pokemon because author ID is invalid', (done: DoneFn) => {
    service.getPokemons(DEFAULT_AUTHOR_ID + 1).subscribe((result: Pokemon[]) => {
      expect(result).toEqual([]);
      done();
    });
  });

  it('#getPokemon should return the Pikachu object', (done: DoneFn) => {
    const expectedPokemon: Pokemon = inMemoryDataService.data.pokemons[0];
    service.getPokemon(expectedPokemon.id).subscribe((result: Pokemon) => {
      expect(result).toEqual(expectedPokemon);
      done();
    });
  });

  it('#searchPokemons should return only the Pikachu object', (done: DoneFn) => {
    const expectedPokemon: Pokemon = inMemoryDataService.data.pokemons[0];
    service.searchPokemons(expectedPokemon.name).subscribe((result: Pokemon[]) => {
      expect(result).toEqual([expectedPokemon]);
      done();
    });
  });

  it('#addPokemon should return a pokemon object with id = 53', (done: DoneFn) => {
    const expectedPokemon: Pokemon = {
      ...inMemoryDataService.data.pokemons[0],
      ...{ id: 53, name: "Pikachu added" }
    };
    service.addPokemon(expectedPokemon).subscribe((result: Pokemon) => {
      expect(result).toEqual(expectedPokemon);
      done();
    });
  });

  it('#updatePokemon should return the Pikachu object updated', (done: DoneFn) => {
    const expectedPokemon: Pokemon = {
      id: 25,
      name: "Pikachu updated",
      image: "https://ichef.bbci.co.uk/news/976/cpsprodpb/C120/production/_104304494_mediaitem104304493.jpg.webp",
      attack: 10,
      defense: 20,
      hp: 30,
      type: "Psychic",
      idAuthor: 2
    };
    service.updatePokemon(expectedPokemon).subscribe(() => {
      service.getPokemon(expectedPokemon.id).subscribe((result: Pokemon) => {
        expect(result).toEqual(expectedPokemon);
        done();
      })
    });
  });

  it('#deletePokemon should return undefined after delete', (done: DoneFn) => {
    const expectedPokemon: Pokemon = inMemoryDataService.data.pokemons[0];
    service.deletePokemon(expectedPokemon.id).subscribe(() => {
      service.getPokemon(expectedPokemon.id).subscribe((result?: Pokemon) => {
        expect(result).toBeUndefined();
        done();
      })
    });
  });
});
