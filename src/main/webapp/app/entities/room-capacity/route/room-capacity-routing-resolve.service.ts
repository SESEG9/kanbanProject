import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRoomCapacity } from '../room-capacity.model';
import { RoomCapacityService } from '../service/room-capacity.service';

@Injectable({ providedIn: 'root' })
export class RoomCapacityRoutingResolveService implements Resolve<IRoomCapacity | null> {
  constructor(protected service: RoomCapacityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRoomCapacity | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((roomCapacity: HttpResponse<IRoomCapacity>) => {
          if (roomCapacity.body) {
            return of(roomCapacity.body);
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
