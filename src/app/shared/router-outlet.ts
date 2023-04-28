import { Router } from '@angular/router';

export function clearOutlet(router: Router, outletNames: string[] | string): Promise<boolean> {
    const routeExtras: { outlets: { [key: string]: null } } = { outlets: {} };
    if (Array.isArray(outletNames)) {
      outletNames.forEach((outletName: string) => routeExtras.outlets[outletName] = null);
    } else {
      routeExtras.outlets[outletNames] = null;
    }
    return router.navigate(['', routeExtras]);
};