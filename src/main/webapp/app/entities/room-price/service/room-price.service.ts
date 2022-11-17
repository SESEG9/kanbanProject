import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRoomPrice, NewRoomPrice } from '../room-price.model';

export type PartialUpdateRoomPrice = Partial<IRoomPrice> & Pick<IRoomPrice, 'id'>;

export type EntityResponseType = HttpResponse<IRoomPrice>;
export type EntityArrayResponseType = HttpResponse<IRoomPrice[]>;

@Injectable({ providedIn: 'root' })
export class RoomPriceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/room-prices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(roomPrice: NewRoomPrice): Observable<EntityResponseType> {
    return this.http.post<IRoomPrice>(this.resourceUrl, roomPrice, { observe: 'response' });
  }

  update(roomPrice: IRoomPrice): Observable<EntityResponseType> {
    return this.http.put<IRoomPrice>(`${this.resourceUrl}/${this.getRoomPriceIdentifier(roomPrice)}`, roomPrice, { observe: 'response' });
  }

  partialUpdate(roomPrice: PartialUpdateRoomPrice): Observable<EntityResponseType> {
    return this.http.patch<IRoomPrice>(`${this.resourceUrl}/${this.getRoomPriceIdentifier(roomPrice)}`, roomPrice, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRoomPrice>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRoomPrice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRoomPriceIdentifier(roomPrice: Pick<IRoomPrice, 'id'>): number {
    return roomPrice.id;
  }

  compareRoomPrice(o1: Pick<IRoomPrice, 'id'> | null, o2: Pick<IRoomPrice, 'id'> | null): boolean {
    return o1 && o2 ? this.getRoomPriceIdentifier(o1) === this.getRoomPriceIdentifier(o2) : o1 === o2;
  }

  addRoomPriceToCollectionIfMissing<Type extends Pick<IRoomPrice, 'id'>>(
    roomPriceCollection: Type[],
    ...roomPricesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const roomPrices: Type[] = roomPricesToCheck.filter(isPresent);
    if (roomPrices.length > 0) {
      const roomPriceCollectionIdentifiers = roomPriceCollection.map(roomPriceItem => this.getRoomPriceIdentifier(roomPriceItem)!);
      const roomPricesToAdd = roomPrices.filter(roomPriceItem => {
        const roomPriceIdentifier = this.getRoomPriceIdentifier(roomPriceItem);
        if (roomPriceCollectionIdentifiers.includes(roomPriceIdentifier)) {
          return false;
        }
        roomPriceCollectionIdentifiers.push(roomPriceIdentifier);
        return true;
      });
      return [...roomPricesToAdd, ...roomPriceCollection];
    }
    return roomPriceCollection;
  }
}
