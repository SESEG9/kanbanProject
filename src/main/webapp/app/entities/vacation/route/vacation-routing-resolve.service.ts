import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVacation } from '../vacation.model';
import { VacationService } from '../service/vacation.service';

@Injectable({ providedIn: 'root' })
export class VacationRoutingResolveService implements Resolve<IVacation | null> {
  constructor(protected service: VacationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVacation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vacation: HttpResponse<IVacation>) => {
          if (vacation.body) {
            return of(vacation.body);
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
