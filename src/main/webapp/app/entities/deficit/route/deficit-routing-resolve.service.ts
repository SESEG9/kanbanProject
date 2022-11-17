import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDeficit } from '../deficit.model';
import { DeficitService } from '../service/deficit.service';

@Injectable({ providedIn: 'root' })
export class DeficitRoutingResolveService implements Resolve<IDeficit | null> {
  constructor(protected service: DeficitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDeficit | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((deficit: HttpResponse<IDeficit>) => {
          if (deficit.body) {
            return of(deficit.body);
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
