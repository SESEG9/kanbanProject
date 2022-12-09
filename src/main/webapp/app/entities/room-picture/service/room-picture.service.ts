import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { Observable } from 'rxjs';
import { RoomPicture } from '../../room/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomPictureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/room-pictures');
  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('api/public/room-pictures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<HttpResponse<RoomPicture>> {
    return this.http.get<RoomPicture>(`${this.publicResourceUrl}/${id}`, { observe: 'response' });
  }
}
