import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRoomPrice } from '../room-price.model';
import { RoomPriceService } from '../service/room-price.service';

@Injectable({ providedIn: 'root' })
export class RoomPriceRoutingResolveService implements Resolve<IRoomPrice | null> {
  constructor(protected service: RoomPriceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRoomPrice | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((roomPrice: HttpResponse<IRoomPrice>) => {
          if (roomPrice.body) {
            return of(roomPrice.body);
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
