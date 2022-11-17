import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHumanResource } from '../human-resource.model';
import { HumanResourceService } from '../service/human-resource.service';

@Injectable({ providedIn: 'root' })
export class HumanResourceRoutingResolveService implements Resolve<IHumanResource | null> {
  constructor(protected service: HumanResourceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHumanResource | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((humanResource: HttpResponse<IHumanResource>) => {
          if (humanResource.body) {
            return of(humanResource.body);
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
