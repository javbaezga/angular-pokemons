import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { FormControl } from '@angular/forms';
import { AppModule } from '../app.module';
import { AppRoutingModule } from '../app-routing.module';
import { pokemonDetailResolver } from '../pokemon-detail-resolver';
import { PokemonService } from '../pokemon.service';
import { PokemonServiceSpy } from '../testing/pokemon.service';
import { PokemonDetailComponent } from './pokemon-detail.component';
import { POKEMONS } from '../testing/mock-pokemons';
import { Pokemon } from '../pokemon';

type ValidatorType = 'required' | 'maxlength' | 'min' | 'max' | 'pattern' | 'whitespace';

describe('PokemonDetailComponent', () => {
  let component: PokemonDetailComponent,
      harness: RouterTestingHarness,
      pokemonServiceSpy: PokemonServiceSpy;

  const testRoutes = [
    {
      path: 'pokemons/:id',
      component: PokemonDetailComponent,
      resolve: { pokemon: pokemonDetailResolver }
    }
  ];
  const testPokemon: Pokemon = POKEMONS[0];

  const getNativeElement = (): any => {
    return harness.routeDebugElement?.nativeElement;
  }

  const testFormAndHtmlFields = (expectedData: Pokemon): void => {
    const fields = {'name': null, 'image': null, 'attack': '.slider', 'defense': '.slider'},
          element: any = getNativeElement();
    for (const [fieldName, childSelector] of Object.entries(fields)) {
      expect((component[fieldName] as FormControl).value)
        .withContext(`reactive form control - ${fieldName}`)
        .toEqual(expectedData[fieldName]);
      expect(element?.querySelector(`#${fieldName} ${childSelector ? childSelector : ''}`)?.value)
        .withContext(`html form element - #${fieldName}`)
        .toEqual(expectedData[fieldName].toString());
    }
  }

  const expectFormValidator = (fieldName: string, type: ValidatorType, equalValue: any): void => {
    expect(component[fieldName].errors?.[type])
      .withContext(`reactive form control - ${fieldName}`)
      .toEqual(equalValue);
  }

  const expectHtmlValidator = (element: any, fieldName: string, type: ValidatorType): void => {
    expect(element?.querySelector(`#${fieldName}-${type}`))
      .withContext(`html - ${fieldName}-${type}`)
      .not.toBeNull();
  }

  const testValidators = (
    expectedData: Partial<Pokemon>,
    type: ValidatorType,
    callback: (attrs: any, fieldName: string, expectedData: Partial<Pokemon>) => any
  ): void => {
    const attrs: any = component.attrs,
          element: any = getNativeElement();
    component.values = expectedData;
    for (const fieldName in expectedData) {
      component[fieldName].markAsDirty();
    }
    harness.detectChanges();
    for (const fieldName in expectedData) {
      expectFormValidator(fieldName, type, callback(attrs, fieldName, expectedData));
      expectHtmlValidator(element, fieldName, type);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [{provide: PokemonService, useClass: PokemonServiceSpy}]
    })
    .overrideModule(
      AppRoutingModule,
      {set: {imports: [RouterTestingModule.withRoutes(testRoutes)]}}
    )
    .compileComponents();
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(`pokemons/${testPokemon.id}`, PokemonDetailComponent);
    pokemonServiceSpy = harness.routeDebugElement!.injector.get(PokemonService) as any;
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called `getPokemon`', () => {
    expect(pokemonServiceSpy.getPokemon.calls.count())
      .withContext('getPokemon called once')
      .toEqual(1);
  });

  it('should display test pokemon\'s data', () => {
    testFormAndHtmlFields(testPokemon);
  });

  it('should have changed field values', () => {
    const expectedData: Pokemon = POKEMONS[1];
    component.values = expectedData;
    harness.detectChanges();
    testFormAndHtmlFields(expectedData);
  });

  it('should have called `submit` and `save`', fakeAsync(() => {
    const expectedData: Partial<Pokemon> = {
      id: testPokemon.id,
      name: 'Name test',
      image: 'https://www.thefactsite.com/wp-content/uploads/2016/05/raichu-facts-pokemon.webp',
      attack: 70,
      defense: 80
    };
    component.values = expectedData;
    harness.detectChanges();
    component.submit();
    tick();
    expect(pokemonServiceSpy.updatePokemon.calls.count())
      .withContext('updatePokemon called once')
      .toEqual(1);
    const updatedData: Pokemon = pokemonServiceSpy.pokemons[pokemonServiceSpy.getPokemonIndex('id', expectedData.id)];
    for (const fieldName in expectedData) {
      expect(updatedData[fieldName])
        .withContext(`updated data - ${fieldName}`)
        .toEqual((expectedData as any)[fieldName]);
    }
  }));

  it('should have shown required validations', () => {
    testValidators(
      {
        name: '',
        image: ''
      },
      'required',
      () => true
    );
  });

  it('should have shown whitespace validations', () => {
    testValidators(
      {
        name: ' '.repeat(10),
        image: ' '.repeat(10)
      },
      'whitespace',
      () => true
    );
  });

  it('should have shown maxLength validations', () => {
    const attrs: any = component.attrs;
    testValidators(
      {
        name: 'n'.repeat(attrs.name.maxLength + 1),
        image: 'i'.repeat(attrs.image.maxLength + 1)
      },
      'maxlength',
      (attrs: any, fieldName: string, expectedData: Partial<Pokemon>) =>
        ({ requiredLength: attrs[fieldName].maxLength, actualLength: attrs[fieldName].maxLength + 1 })
    );
  });

  it('should have shown pattern validations', () => {
    testValidators(
      {image: 'xyz'},
      'pattern',
      (attrs: any, fieldName: string, expectedData: Partial<Pokemon>) =>
        ({ requiredPattern: attrs[fieldName].pattern.toString(), actualValue: expectedData[fieldName] })
    );
  });

  it('should have shown min validations', () => {
    const attrs: any = component.attrs;
    testValidators(
      {
        attack: -attrs.attack.max,
        defense: -attrs.defense.max
      },
      'min',
      (attrs: any, fieldName: string, expectedData: Partial<Pokemon>) =>
        ({ min: attrs[fieldName].min, actual: expectedData[fieldName] })
    );
  });

  it('should have shown max validations', () => {
    const attrs: any = component.attrs;
    testValidators(
      {
        attack: attrs.attack.max * 2,
        defense: attrs.defense.max * 2
      },
      'max',
      (attrs: any, fieldName: string, expectedData: Partial<Pokemon>) =>
        ({ max: attrs[fieldName].max, actual: expectedData[fieldName] })
    );
  });
});
