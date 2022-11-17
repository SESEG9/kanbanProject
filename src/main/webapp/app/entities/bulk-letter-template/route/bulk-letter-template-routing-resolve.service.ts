import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBulkLetterTemplate } from '../bulk-letter-template.model';
import { BulkLetterTemplateService } from '../service/bulk-letter-template.service';

@Injectable({ providedIn: 'root' })
export class BulkLetterTemplateRoutingResolveService implements Resolve<IBulkLetterTemplate | null> {
  constructor(protected service: BulkLetterTemplateService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBulkLetterTemplate | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bulkLetterTemplate: HttpResponse<IBulkLetterTemplate>) => {
          if (bulkLetterTemplate.body) {
            return of(bulkLetterTemplate.body);
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
