import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGlobalSettings } from '../global-settings.model';
import { GlobalSettingsService } from '../service/global-settings.service';

@Injectable({ providedIn: 'root' })
export class GlobalSettingsRoutingResolveService implements Resolve<IGlobalSettings | null> {
  constructor(protected service: GlobalSettingsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGlobalSettings | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((globalSettings: HttpResponse<IGlobalSettings>) => {
          if (globalSettings.body) {
            return of(globalSettings.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
