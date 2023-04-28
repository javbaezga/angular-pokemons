import { TestBed } from '@angular/core/testing';
import { InMemoryDataService } from './in-memory-data.service';
import { POKEMONS } from './testing/mock-pokemons';

describe('InMemoryDataService', () => {
  let service: InMemoryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#createDb should return { pokemons: Pokemon[] }', () => {
    expect(service.createDb()).toEqual({pokemons: []});
  });

  it('#genId should return 53', () => {
    expect(service.genId(POKEMONS)).toEqual(53);
  });
});
