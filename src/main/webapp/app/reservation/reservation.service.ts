import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bookings');
  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('api/public/bookings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

//   create(reservation: IReservation): Observable<EntityResponseType> {
//     return this.http.post<IRoom>(this.resourceUrl, room, { observe: 'response' });
//   }
}
