import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBooking } from '../booking.model';
import { BookingService } from '../service/booking.service';

@Injectable({ providedIn: 'root' })
export class BookingRoutingResolveService implements Resolve<IBooking | null> {
  constructor(protected service: BookingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBooking | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((booking: HttpResponse<IBooking>) => {
          if (booking.body) {
            return of(booking.body);
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
