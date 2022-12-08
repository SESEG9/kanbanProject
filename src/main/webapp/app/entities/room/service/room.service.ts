import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRoom, Room, RoomResponse } from '../room.model';

export type PartialUpdateRoom = Partial<IRoom> & Pick<IRoom, 'id'>;

export type EntityResponseType = HttpResponse<IRoom>;
export type EntityArrayResponseType = HttpResponse<IRoom[]>;

@Injectable({ providedIn: 'root' })
export class RoomService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rooms');
  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('api/public/rooms');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(room: Room): Observable<EntityResponseType> {
    return this.http.post<IRoom>(this.resourceUrl, room, { observe: 'response' });
  }

  update(room: IRoom): Observable<EntityResponseType> {
    return this.http.put<IRoom>(`${this.resourceUrl}/${this.getRoomIdentifier(room)}`, room, { observe: 'response' });
  }

  partialUpdate(room: PartialUpdateRoom): Observable<EntityResponseType> {
    return this.http.patch<IRoom>(`${this.resourceUrl}/${this.getRoomIdentifier(room)}`, room, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<RoomResponse>> {
    return this.http.get<RoomResponse>(`${this.publicResourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRoom[]>(this.publicResourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRoomIdentifier(room: Pick<IRoom, 'id'>): number {
    return room.id;
  }

  compareRoom(o1: Pick<IRoom, 'id'> | null, o2: Pick<IRoom, 'id'> | null): boolean {
    return o1 && o2 ? this.getRoomIdentifier(o1) === this.getRoomIdentifier(o2) : o1 === o2;
  }

  addRoomToCollectionIfMissing<Type extends Pick<IRoom, 'id'>>(
    roomCollection: Type[],
    ...roomsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const rooms: Type[] = roomsToCheck.filter(isPresent);
    if (rooms.length > 0) {
      const roomCollectionIdentifiers = roomCollection.map(roomItem => this.getRoomIdentifier(roomItem)!);
      const roomsToAdd = rooms.filter(roomItem => {
        const roomIdentifier = this.getRoomIdentifier(roomItem);
        if (roomCollectionIdentifiers.includes(roomIdentifier)) {
          return false;
        }
        roomCollectionIdentifiers.push(roomIdentifier);
        return true;
      });
      return [...roomsToAdd, ...roomCollection];
    }
    return roomCollection;
  }
}
