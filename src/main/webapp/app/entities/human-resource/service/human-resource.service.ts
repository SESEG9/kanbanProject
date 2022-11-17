import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHumanResource, NewHumanResource } from '../human-resource.model';

export type PartialUpdateHumanResource = Partial<IHumanResource> & Pick<IHumanResource, 'id'>;

type RestOf<T extends IHumanResource | NewHumanResource> = Omit<T, 'birthday'> & {
  birthday?: string | null;
};

export type RestHumanResource = RestOf<IHumanResource>;

export type NewRestHumanResource = RestOf<NewHumanResource>;

export type PartialUpdateRestHumanResource = RestOf<PartialUpdateHumanResource>;

export type EntityResponseType = HttpResponse<IHumanResource>;
export type EntityArrayResponseType = HttpResponse<IHumanResource[]>;

@Injectable({ providedIn: 'root' })
export class HumanResourceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/human-resources');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(humanResource: NewHumanResource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(humanResource);
    return this.http
      .post<RestHumanResource>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(humanResource: IHumanResource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(humanResource);
    return this.http
      .put<RestHumanResource>(`${this.resourceUrl}/${this.getHumanResourceIdentifier(humanResource)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(humanResource: PartialUpdateHumanResource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(humanResource);
    return this.http
      .patch<RestHumanResource>(`${this.resourceUrl}/${this.getHumanResourceIdentifier(humanResource)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestHumanResource>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestHumanResource[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHumanResourceIdentifier(humanResource: Pick<IHumanResource, 'id'>): number {
    return humanResource.id;
  }

  compareHumanResource(o1: Pick<IHumanResource, 'id'> | null, o2: Pick<IHumanResource, 'id'> | null): boolean {
    return o1 && o2 ? this.getHumanResourceIdentifier(o1) === this.getHumanResourceIdentifier(o2) : o1 === o2;
  }

  addHumanResourceToCollectionIfMissing<Type extends Pick<IHumanResource, 'id'>>(
    humanResourceCollection: Type[],
    ...humanResourcesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const humanResources: Type[] = humanResourcesToCheck.filter(isPresent);
    if (humanResources.length > 0) {
      const humanResourceCollectionIdentifiers = humanResourceCollection.map(
        humanResourceItem => this.getHumanResourceIdentifier(humanResourceItem)!
      );
      const humanResourcesToAdd = humanResources.filter(humanResourceItem => {
        const humanResourceIdentifier = this.getHumanResourceIdentifier(humanResourceItem);
        if (humanResourceCollectionIdentifiers.includes(humanResourceIdentifier)) {
          return false;
        }
        humanResourceCollectionIdentifiers.push(humanResourceIdentifier);
        return true;
      });
      return [...humanResourcesToAdd, ...humanResourceCollection];
    }
    return humanResourceCollection;
  }

  protected convertDateFromClient<T extends IHumanResource | NewHumanResource | PartialUpdateHumanResource>(humanResource: T): RestOf<T> {
    return {
      ...humanResource,
      birthday: humanResource.birthday?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restHumanResource: RestHumanResource): IHumanResource {
    return {
      ...restHumanResource,
      birthday: restHumanResource.birthday ? dayjs(restHumanResource.birthday) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestHumanResource>): HttpResponse<IHumanResource> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestHumanResource[]>): HttpResponse<IHumanResource[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
