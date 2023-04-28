import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonsComponent } from './pokemons/pokemons.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { SliderComponent } from './slider/slider.component';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { OverlayService } from './overlay.service';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AppComponent,
    PokemonsComponent,
    PageNotFoundComponent,
    PokemonDetailComponent,
    SliderComponent,
    ProgressSpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    OverlayModule
  ],
  providers: [OverlayService],
  bootstrap: [AppComponent]
})
export class AppModule { }
