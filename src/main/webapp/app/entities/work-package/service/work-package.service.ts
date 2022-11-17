import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWorkPackage, NewWorkPackage } from '../work-package.model';

export type PartialUpdateWorkPackage = Partial<IWorkPackage> & Pick<IWorkPackage, 'id'>;

type RestOf<T extends IWorkPackage | NewWorkPackage> = Omit<T, 'start' | 'end'> & {
  start?: string | null;
  end?: string | null;
};

export type RestWorkPackage = RestOf<IWorkPackage>;

export type NewRestWorkPackage = RestOf<NewWorkPackage>;

export type PartialUpdateRestWorkPackage = RestOf<PartialUpdateWorkPackage>;

export type EntityResponseType = HttpResponse<IWorkPackage>;
export type EntityArrayResponseType = HttpResponse<IWorkPackage[]>;

@Injectable({ providedIn: 'root' })
export class WorkPackageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/work-packages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(workPackage: NewWorkPackage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(workPackage);
    return this.http
      .post<RestWorkPackage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(workPackage: IWorkPackage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(workPackage);
    return this.http
      .put<RestWorkPackage>(`${this.resourceUrl}/${this.getWorkPackageIdentifier(workPackage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(workPackage: PartialUpdateWorkPackage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(workPackage);
    return this.http
      .patch<RestWorkPackage>(`${this.resourceUrl}/${this.getWorkPackageIdentifier(workPackage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestWorkPackage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestWorkPackage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWorkPackageIdentifier(workPackage: Pick<IWorkPackage, 'id'>): number {
    return workPackage.id;
  }

  compareWorkPackage(o1: Pick<IWorkPackage, 'id'> | null, o2: Pick<IWorkPackage, 'id'> | null): boolean {
    return o1 && o2 ? this.getWorkPackageIdentifier(o1) === this.getWorkPackageIdentifier(o2) : o1 === o2;
  }

  addWorkPackageToCollectionIfMissing<Type extends Pick<IWorkPackage, 'id'>>(
    workPackageCollection: Type[],
    ...workPackagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const workPackages: Type[] = workPackagesToCheck.filter(isPresent);
    if (workPackages.length > 0) {
      const workPackageCollectionIdentifiers = workPackageCollection.map(
        workPackageItem => this.getWorkPackageIdentifier(workPackageItem)!
      );
      const workPackagesToAdd = workPackages.filter(workPackageItem => {
        const workPackageIdentifier = this.getWorkPackageIdentifier(workPackageItem);
        if (workPackageCollectionIdentifiers.includes(workPackageIdentifier)) {
          return false;
        }
        workPackageCollectionIdentifiers.push(workPackageIdentifier);
        return true;
      });
      return [...workPackagesToAdd, ...workPackageCollection];
    }
    return workPackageCollection;
  }

  protected convertDateFromClient<T extends IWorkPackage | NewWorkPackage | PartialUpdateWorkPackage>(workPackage: T): RestOf<T> {
    return {
      ...workPackage,
      start: workPackage.start?.format(DATE_FORMAT) ?? null,
      end: workPackage.end?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restWorkPackage: RestWorkPackage): IWorkPackage {
    return {
      ...restWorkPackage,
      start: restWorkPackage.start ? dayjs(restWorkPackage.start) : undefined,
      end: restWorkPackage.end ? dayjs(restWorkPackage.end) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestWorkPackage>): HttpResponse<IWorkPackage> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestWorkPackage[]>): HttpResponse<IWorkPackage[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
