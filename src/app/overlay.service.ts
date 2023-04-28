import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Injectable()
export class OverlayService {
  private static overlayRef: OverlayRef;
  private static componentRef: TemplateRef<any>;
  private static viewContainerRef: ViewContainerRef;

  constructor(private overlay: Overlay) { }

  init(componentRef: TemplateRef<any>, viewContainerRef: ViewContainerRef): void {
    this.createOverlay();
    OverlayService.componentRef = componentRef;
    OverlayService.viewContainerRef = viewContainerRef;
  }

  private createOverlay(): void {
    if (!OverlayService.overlayRef) {
      const config: OverlayConfig = {
        hasBackdrop: true,
        positionStrategy: this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically()
      };
      OverlayService.overlayRef = this.overlay.create(config);
    }
  }

  private attachTemplatePortal(
    overlayRef: OverlayRef,
    templateRef: TemplateRef<any>,
    viewContainerRef: ViewContainerRef
  ): void {
    overlayRef.attach(new TemplatePortal(templateRef, viewContainerRef));
  }

  get isVisible(): boolean {
    return (OverlayService.overlayRef && OverlayService.overlayRef.hasAttached());
  }

  show(): boolean {
    if (OverlayService.overlayRef && !OverlayService.overlayRef.hasAttached()) {
      this.attachTemplatePortal(
        OverlayService.overlayRef,
        OverlayService.componentRef,
        OverlayService.viewContainerRef
      );
      return true;
    }
    return false;
  }

  hide(): boolean {
    if (OverlayService.overlayRef && OverlayService.overlayRef.hasAttached()) {
      OverlayService.overlayRef.detach();
      return true;
    }
    return false;
  }
}