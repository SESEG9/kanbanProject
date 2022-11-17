import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDeficit, NewDeficit } from '../deficit.model';

export type PartialUpdateDeficit = Partial<IDeficit> & Pick<IDeficit, 'id'>;

export type EntityResponseType = HttpResponse<IDeficit>;
export type EntityArrayResponseType = HttpResponse<IDeficit[]>;

@Injectable({ providedIn: 'root' })
export class DeficitService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/deficits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(deficit: NewDeficit): Observable<EntityResponseType> {
    return this.http.post<IDeficit>(this.resourceUrl, deficit, { observe: 'response' });
  }

  update(deficit: IDeficit): Observable<EntityResponseType> {
    return this.http.put<IDeficit>(`${this.resourceUrl}/${this.getDeficitIdentifier(deficit)}`, deficit, { observe: 'response' });
  }

  partialUpdate(deficit: PartialUpdateDeficit): Observable<EntityResponseType> {
    return this.http.patch<IDeficit>(`${this.resourceUrl}/${this.getDeficitIdentifier(deficit)}`, deficit, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDeficit>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDeficit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDeficitIdentifier(deficit: Pick<IDeficit, 'id'>): number {
    return deficit.id;
  }

  compareDeficit(o1: Pick<IDeficit, 'id'> | null, o2: Pick<IDeficit, 'id'> | null): boolean {
    return o1 && o2 ? this.getDeficitIdentifier(o1) === this.getDeficitIdentifier(o2) : o1 === o2;
  }

  addDeficitToCollectionIfMissing<Type extends Pick<IDeficit, 'id'>>(
    deficitCollection: Type[],
    ...deficitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const deficits: Type[] = deficitsToCheck.filter(isPresent);
    if (deficits.length > 0) {
      const deficitCollectionIdentifiers = deficitCollection.map(deficitItem => this.getDeficitIdentifier(deficitItem)!);
      const deficitsToAdd = deficits.filter(deficitItem => {
        const deficitIdentifier = this.getDeficitIdentifier(deficitItem);
        if (deficitCollectionIdentifiers.includes(deficitIdentifier)) {
          return false;
        }
        deficitCollectionIdentifiers.push(deficitIdentifier);
        return true;
      });
      return [...deficitsToAdd, ...deficitCollection];
    }
    return deficitCollection;
  }
}
