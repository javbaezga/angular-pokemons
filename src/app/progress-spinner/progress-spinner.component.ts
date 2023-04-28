import { Component, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.css']
})
export class ProgressSpinnerComponent {
  @ViewChild('progressSpinnerRef')
  readonly progressSpinnerRef!: TemplateRef<any>;
}