import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { OverlayService } from './overlay.service';

describe('OverlayService', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AppModule]}).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should create the app component and overlay service', () => {
    expect(fixture.componentInstance)
      .withContext('app component')
      .toBeTruthy();
    expect(fixture.componentInstance.overlayService)
      .withContext('overlay service')
      .toBeTruthy();
  });

  it('`isVisible` should be false', () => {
    expect(fixture.componentInstance.overlayService.isVisible).toBeFalse();
  });

  it('should have shown the overlay and `isVisible` must be true', () => {
    const overlayService: OverlayService = fixture.componentInstance.overlayService;
    expect(overlayService.isVisible)
      .withContext('before show')
      .toBeFalse();
    overlayService.show();
    expect(overlayService.isVisible)
      .withContext('after show')
      .toBeTrue();
  });

  it('should have shown and hidden the overlay and `isVisible` must be false', () => {
    const overlayService: OverlayService = fixture.componentInstance.overlayService;
    expect(overlayService.isVisible)
      .withContext('before show')
      .toBeFalse();
    overlayService.show();
    expect(overlayService.isVisible)
      .withContext('after show')
      .toBeTrue();
    overlayService.hide();
    expect(overlayService.isVisible)
      .withContext('after hide')
      .toBeFalse();
  });
});
