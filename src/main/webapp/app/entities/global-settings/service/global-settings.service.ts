import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGlobalSettings, NewGlobalSettings } from '../global-settings.model';

export type PartialUpdateGlobalSettings = Partial<IGlobalSettings> & Pick<IGlobalSettings, 'id'>;

export type EntityResponseType = HttpResponse<IGlobalSettings>;
export type EntityArrayResponseType = HttpResponse<IGlobalSettings[]>;

@Injectable({ providedIn: 'root' })
export class GlobalSettingsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/global-settings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(globalSettings: NewGlobalSettings): Observable<EntityResponseType> {
    return this.http.post<IGlobalSettings>(this.resourceUrl, globalSettings, { observe: 'response' });
  }

  update(globalSettings: IGlobalSettings): Observable<EntityResponseType> {
    return this.http.put<IGlobalSettings>(`${this.resourceUrl}/${this.getGlobalSettingsIdentifier(globalSettings)}`, globalSettings, {
      observe: 'response',
    });
  }

  partialUpdate(globalSettings: PartialUpdateGlobalSettings): Observable<EntityResponseType> {
    return this.http.patch<IGlobalSettings>(`${this.resourceUrl}/${this.getGlobalSettingsIdentifier(globalSettings)}`, globalSettings, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGlobalSettings>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGlobalSettings[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGlobalSettingsIdentifier(globalSettings: Pick<IGlobalSettings, 'id'>): number {
    return globalSettings.id;
  }

  compareGlobalSettings(o1: Pick<IGlobalSettings, 'id'> | null, o2: Pick<IGlobalSettings, 'id'> | null): boolean {
    return o1 && o2 ? this.getGlobalSettingsIdentifier(o1) === this.getGlobalSettingsIdentifier(o2) : o1 === o2;
  }

  addGlobalSettingsToCollectionIfMissing<Type extends Pick<IGlobalSettings, 'id'>>(
    globalSettingsCollection: Type[],
    ...globalSettingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const globalSettings: Type[] = globalSettingsToCheck.filter(isPresent);
    if (globalSettings.length > 0) {
      const globalSettingsCollectionIdentifiers = globalSettingsCollection.map(
        globalSettingsItem => this.getGlobalSettingsIdentifier(globalSettingsItem)!
      );
      const globalSettingsToAdd = globalSettings.filter(globalSettingsItem => {
        const globalSettingsIdentifier = this.getGlobalSettingsIdentifier(globalSettingsItem);
        if (globalSettingsCollectionIdentifiers.includes(globalSettingsIdentifier)) {
          return false;
        }
        globalSettingsCollectionIdentifiers.push(globalSettingsIdentifier);
        return true;
      });
      return [...globalSettingsToAdd, ...globalSettingsCollection];
    }
    return globalSettingsCollection;
  }
}
