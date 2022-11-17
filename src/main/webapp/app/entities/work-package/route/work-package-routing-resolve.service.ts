import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWorkPackage } from '../work-package.model';
import { WorkPackageService } from '../service/work-package.service';

@Injectable({ providedIn: 'root' })
export class WorkPackageRoutingResolveService implements Resolve<IWorkPackage | null> {
  constructor(protected service: WorkPackageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWorkPackage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((workPackage: HttpResponse<IWorkPackage>) => {
          if (workPackage.body) {
            return of(workPackage.body);
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
