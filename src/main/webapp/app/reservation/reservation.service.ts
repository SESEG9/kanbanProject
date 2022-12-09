import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { Reservation, ReservationResponse } from './reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bookings');
  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('api/public/bookings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reservation: Reservation): Observable<ReservationResponse> {
    console.log(reservation)
    return this.http.post<ReservationResponse>(this.publicResourceUrl, reservation);
  }
}
