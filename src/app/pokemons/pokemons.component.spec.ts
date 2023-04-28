import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { PokemonsComponent } from './pokemons.component';
import { PokemonService } from '../pokemon.service';
import { PokemonServiceSpy } from '../testing/pokemon.service';
import { Pokemon } from '../pokemon';

describe('PokemonsComponent', () => {
  let component: PokemonsComponent,
      fixture: ComponentFixture<PokemonsComponent>,
      pokemonServiceSpy: PokemonServiceSpy;

  const getTableElement = (): any => {
    return fixture.debugElement.nativeElement.querySelector('#table-data')!;
  };
  const _tick = () => tick(5000);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [PokemonsComponent],
      providers: [{provide: PokemonService, useClass: PokemonServiceSpy}]
    })
    .compileComponents();
    fixture = TestBed.createComponent(PokemonsComponent);
    pokemonServiceSpy = TestBed.inject(PokemonService) as any;
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called `searchPokemons`', () => {
    expect(pokemonServiceSpy.searchPokemons.calls.count())
      .withContext('searchPokemons called once')
      .toEqual(1);
  });

  it('1st pokemon should match 1st test pokemon', () => {
    const expectedPokemon: Pokemon = pokemonServiceSpy.pokemons[0],
          table: any = getTableElement();
    expect(table?.rows[1]?.cells[0]?.textContent)
      .withContext('pokemon.name')
      .toEqual(expectedPokemon.name);
  });

  it('should have deleted the 1st pokemon', fakeAsync(() => {
    const expectedPokemon: Pokemon = pokemonServiceSpy.pokemons[1],
          table: any = getTableElement();
    expect(table?.rows[1]?.cells[0]?.textContent)
      .withContext('current pokemon.name')
      .toEqual(pokemonServiceSpy.pokemons[0].name);
    table?.rows[1]?.cells[4]?.querySelector('.delete-item')?.dispatchEvent(new Event('click'));
    _tick();
    fixture.detectChanges();
    expect(pokemonServiceSpy.deletePokemon.calls.count())
      .withContext('deletePokemon called once')
      .toEqual(1);
    expect(table?.rows[1]?.cells[0]?.textContent)
      .withContext('new pokemon.name')
      .toEqual(expectedPokemon.name);
  }));

  it('should have deleted all the pokemons and shown no-data section', fakeAsync(() => {
    expect(getTableElement())
      .withContext('table-data')
      .not.toBeNull();
    const pokemons: Pokemon[] = [...pokemonServiceSpy.pokemons];
    for (let pokemon of pokemons) {
      component.delete(pokemon.id);
    }
    _tick();
    fixture.detectChanges();
    expect(pokemonServiceSpy.deletePokemon.calls.count())
      .withContext('deletePokemon called until data is empty')
      .toEqual(pokemons.length);
    expect(getTableElement())
      .withContext('table-data')
      .toBeNull();
    expect(fixture.debugElement.nativeElement.querySelector('#no-data'))
      .withContext('div.no-data')
      .not.toBeNull();
  }));

  it('should have called `search` and found the 1st pokemon', fakeAsync(() => {
    const expectedPokemon: Pokemon = pokemonServiceSpy.pokemons[0],
          expectedRows: number = 2, // includes table headers
          table: any = getTableElement();
    expect(table?.rows?.length)
      .withContext('current table.rows.length')
      .toEqual(pokemonServiceSpy.pokemons.length + 1); // includes table headers
    component.search(expectedPokemon.name);
    _tick();
    fixture.detectChanges();
    expect(pokemonServiceSpy.searchPokemons.calls.count())
      .withContext('searchPokemons called twice')
      .toEqual(2);
    expect(table?.rows?.length)
      .withContext('new table.rows.length')
      .toEqual(expectedRows);
    expect(table?.rows[1]?.cells[0]?.textContent)
      .withContext('pokemon.name')
      .toEqual(expectedPokemon.name);
  }));

  it('should have called `delete` and removed the 1st pokemon', fakeAsync(() => {
    const expectedPokemon: Pokemon = pokemonServiceSpy.pokemons[1],
          expectedRows: number = pokemonServiceSpy.pokemons.length, // includes table header
          table: any = getTableElement();
    expect(table?.rows?.length)
      .withContext('current table.rows.length')
      .toEqual(pokemonServiceSpy.pokemons.length + 1); // includes table headers
    component.delete(pokemonServiceSpy.pokemons[0].id);
    _tick();
    fixture.detectChanges();
    expect(pokemonServiceSpy.deletePokemon.calls.count())
      .withContext('deletePokemon called once')
      .toEqual(1);
    expect(table?.rows?.length)
      .withContext('new table.rows.length')
      .toEqual(expectedRows);
    expect(table?.rows[1]?.cells[0]?.textContent)
      .withContext('pokemon.name')
      .toEqual(expectedPokemon.name);
  }));

  it('should have called `reload`, and the 1st pokemon\'s name must be contains `test` at the end', fakeAsync(async () => {
    const pokemon: Pokemon = pokemonServiceSpy.pokemons[0],
          expectedPokemon: Pokemon = {...pokemon, name: `${pokemon.name} test`};
    expect(getTableElement()?.rows[1]?.cells[0]?.textContent)
      .withContext('current pokemon.name')
      .toEqual(pokemon.name);
    await pokemonServiceSpy.updatePokemon(expectedPokemon);
    _tick();
    fixture.detectChanges();
    expect(pokemonServiceSpy.searchPokemons.calls.count())
      .withContext('searchPokemons called twice')
      .toEqual(2);
    expect(pokemonServiceSpy.change.calls.count())
      .withContext('change called once')
      .toEqual(1);
    expect(getTableElement()?.rows[1]?.cells[0]?.textContent)
      .withContext('new pokemon.name')
      .toEqual(expectedPokemon.name);
  }));
});
