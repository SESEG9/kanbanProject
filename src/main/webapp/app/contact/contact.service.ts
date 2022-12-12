import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { ContactRequest } from './type/contact.request';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('api/public/mail');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  sendRequest(request: ContactRequest): Observable<any> {
    return this.http.post(this.publicResourceUrl, request)
  }
}
