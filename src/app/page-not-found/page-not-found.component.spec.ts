import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../app.module';
import { AppRoutingModule } from '../app-routing.module';
import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent,
      harness: RouterTestingHarness;

  const testRoutes = [
    {
      path: '**',
      component: PageNotFoundComponent
    }
  ];
  const testUrl: string = '/any-url';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .overrideModule(
      AppRoutingModule,
      {set: {imports: [RouterTestingModule.withRoutes(testRoutes)]}}
    )
    .compileComponents();
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(testUrl, PageNotFoundComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain test URL', () => {
    const element: any = harness.routeDebugElement?.nativeElement;
    expect(element?.querySelector('#url').textContent)
      .withContext('URL')
      .toEqual(testUrl);
  });
});
