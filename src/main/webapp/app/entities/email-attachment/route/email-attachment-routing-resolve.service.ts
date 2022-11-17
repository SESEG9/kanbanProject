import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmailAttachment } from '../email-attachment.model';
import { EmailAttachmentService } from '../service/email-attachment.service';

@Injectable({ providedIn: 'root' })
export class EmailAttachmentRoutingResolveService implements Resolve<IEmailAttachment | null> {
  constructor(protected service: EmailAttachmentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmailAttachment | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((emailAttachment: HttpResponse<IEmailAttachment>) => {
          if (emailAttachment.body) {
            return of(emailAttachment.body);
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
