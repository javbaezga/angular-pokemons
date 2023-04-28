import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PokemonService } from '../pokemon.service';
import { OverlayService } from '../overlay.service';
import { clearOutlet } from '../shared/router-outlet';
import { Pokemon } from '../pokemon';
import { noWhitespaceValidator } from '../shared/validators-helpers';

const URL_PATTERN: RegExp = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent {
  @Input() pokemon!: Pokemon;
  pokemonForm!: FormGroup;
  [index: string]: any;
  readonly attrs = {
    name: { maxLength: 50 },
    image: { maxLength: 255, pattern: URL_PATTERN },
    attack: {
      minControl: 0,
      min: 1,
      max: 100
    },
    defense: {
      minControl: 0,
      min: 1,
      max: 100
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private formBuilder: FormBuilder,
    readonly overlayService: OverlayService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.pokemon = data['pokemon'];
      this.initForm(this.pokemon);
      this.overlayService.hide();
    });
  }

  initForm(pokemon: Pokemon): void {
    this.pokemonForm = this.formBuilder.group({
      name: [
        pokemon.name,
        [Validators.required, Validators.maxLength(this.attrs.name.maxLength), noWhitespaceValidator]
      ],
      image: [
        pokemon.image,
        [
          Validators.required,
          Validators.maxLength(this.attrs.image.maxLength),
          Validators.pattern(this.attrs.image.pattern),
          noWhitespaceValidator
        ]
      ],
      attack: [
        pokemon.attack,
        [Validators.required, Validators.min(this.attrs.attack.min), Validators.max(this.attrs.attack.max)]
      ],
      defense: [
        pokemon.defense,
        [Validators.required, Validators.min(this.attrs.defense.min), Validators.max(this.attrs.defense.max)]
      ]
    });
  }

  get name(): FormControl {
    return this.pokemonForm.get('name') as FormControl;
  }

  get image(): FormControl {
    return this.pokemonForm.get('image') as FormControl;
  }

  get attack(): FormControl {
    return this.pokemonForm.get('attack') as FormControl;
  }

  get defense(): FormControl {
    return this.pokemonForm.get('defense') as FormControl;
  }

  set values(pokemon: Partial<Pokemon>) {
    this.pokemonForm.patchValue({
      name: pokemon.name !== undefined ? pokemon.name : this.name.value,
      image: pokemon.image !== undefined ? pokemon.image : this.image.value,
      attack: pokemon.attack !== undefined ? pokemon.attack : this.attack.value,
      defense: pokemon.defense !== undefined ? pokemon.defense : this.defense.value,
   });
  }

  save(): void {
    if (this.pokemon) {
      this.overlayService.show();
      const pokemon: Pokemon = { ...this.pokemon, ...this.pokemonForm.getRawValue() };
      const api$: Observable<Pokemon> = pokemon.id > 0 ?
        this.pokemonService.updatePokemon(pokemon) :
        this.pokemonService.addPokemon(pokemon);
      api$.subscribe(() => clearOutlet(this.router, 'details'));
    }
  }

  submit() {
    this.save();
  }

  cancel() {
    clearOutlet(this.router, 'details');
  }
}
