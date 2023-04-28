import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { OverlayService } from './overlay.service';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(ProgressSpinnerComponent)
  private readonly progressSpinner!: ProgressSpinnerComponent;

  constructor(
    public readonly overlayService: OverlayService,
    private readonly viewContainerRef: ViewContainerRef
  ) { }

  ngAfterViewInit(): void {
    this.overlayService.init(this.progressSpinner.progressSpinnerRef, this.viewContainerRef);
  }
}
