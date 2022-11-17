import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRoomCapacity, NewRoomCapacity } from '../room-capacity.model';

export type PartialUpdateRoomCapacity = Partial<IRoomCapacity> & Pick<IRoomCapacity, 'id'>;

export type EntityResponseType = HttpResponse<IRoomCapacity>;
export type EntityArrayResponseType = HttpResponse<IRoomCapacity[]>;

@Injectable({ providedIn: 'root' })
export class RoomCapacityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/room-capacities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(roomCapacity: NewRoomCapacity): Observable<EntityResponseType> {
    return this.http.post<IRoomCapacity>(this.resourceUrl, roomCapacity, { observe: 'response' });
  }

  update(roomCapacity: IRoomCapacity): Observable<EntityResponseType> {
    return this.http.put<IRoomCapacity>(`${this.resourceUrl}/${this.getRoomCapacityIdentifier(roomCapacity)}`, roomCapacity, {
      observe: 'response',
    });
  }

  partialUpdate(roomCapacity: PartialUpdateRoomCapacity): Observable<EntityResponseType> {
    return this.http.patch<IRoomCapacity>(`${this.resourceUrl}/${this.getRoomCapacityIdentifier(roomCapacity)}`, roomCapacity, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRoomCapacity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRoomCapacity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRoomCapacityIdentifier(roomCapacity: Pick<IRoomCapacity, 'id'>): number {
    return roomCapacity.id;
  }

  compareRoomCapacity(o1: Pick<IRoomCapacity, 'id'> | null, o2: Pick<IRoomCapacity, 'id'> | null): boolean {
    return o1 && o2 ? this.getRoomCapacityIdentifier(o1) === this.getRoomCapacityIdentifier(o2) : o1 === o2;
  }

  addRoomCapacityToCollectionIfMissing<Type extends Pick<IRoomCapacity, 'id'>>(
    roomCapacityCollection: Type[],
    ...roomCapacitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const roomCapacities: Type[] = roomCapacitiesToCheck.filter(isPresent);
    if (roomCapacities.length > 0) {
      const roomCapacityCollectionIdentifiers = roomCapacityCollection.map(
        roomCapacityItem => this.getRoomCapacityIdentifier(roomCapacityItem)!
      );
      const roomCapacitiesToAdd = roomCapacities.filter(roomCapacityItem => {
        const roomCapacityIdentifier = this.getRoomCapacityIdentifier(roomCapacityItem);
        if (roomCapacityCollectionIdentifiers.includes(roomCapacityIdentifier)) {
          return false;
        }
        roomCapacityCollectionIdentifiers.push(roomCapacityIdentifier);
        return true;
      });
      return [...roomCapacitiesToAdd, ...roomCapacityCollection];
    }
    return roomCapacityCollection;
  }
}
