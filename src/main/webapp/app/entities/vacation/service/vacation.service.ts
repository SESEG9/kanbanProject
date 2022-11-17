import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVacation, NewVacation } from '../vacation.model';

export type PartialUpdateVacation = Partial<IVacation> & Pick<IVacation, 'id'>;

type RestOf<T extends IVacation | NewVacation> = Omit<T, 'start' | 'end'> & {
  start?: string | null;
  end?: string | null;
};

export type RestVacation = RestOf<IVacation>;

export type NewRestVacation = RestOf<NewVacation>;

export type PartialUpdateRestVacation = RestOf<PartialUpdateVacation>;

export type EntityResponseType = HttpResponse<IVacation>;
export type EntityArrayResponseType = HttpResponse<IVacation[]>;

@Injectable({ providedIn: 'root' })
export class VacationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vacations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vacation: NewVacation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacation);
    return this.http
      .post<RestVacation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vacation: IVacation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacation);
    return this.http
      .put<RestVacation>(`${this.resourceUrl}/${this.getVacationIdentifier(vacation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vacation: PartialUpdateVacation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacation);
    return this.http
      .patch<RestVacation>(`${this.resourceUrl}/${this.getVacationIdentifier(vacation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVacation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVacation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVacationIdentifier(vacation: Pick<IVacation, 'id'>): number {
    return vacation.id;
  }

  compareVacation(o1: Pick<IVacation, 'id'> | null, o2: Pick<IVacation, 'id'> | null): boolean {
    return o1 && o2 ? this.getVacationIdentifier(o1) === this.getVacationIdentifier(o2) : o1 === o2;
  }

  addVacationToCollectionIfMissing<Type extends Pick<IVacation, 'id'>>(
    vacationCollection: Type[],
    ...vacationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vacations: Type[] = vacationsToCheck.filter(isPresent);
    if (vacations.length > 0) {
      const vacationCollectionIdentifiers = vacationCollection.map(vacationItem => this.getVacationIdentifier(vacationItem)!);
      const vacationsToAdd = vacations.filter(vacationItem => {
        const vacationIdentifier = this.getVacationIdentifier(vacationItem);
        if (vacationCollectionIdentifiers.includes(vacationIdentifier)) {
          return false;
        }
        vacationCollectionIdentifiers.push(vacationIdentifier);
        return true;
      });
      return [...vacationsToAdd, ...vacationCollection];
    }
    return vacationCollection;
  }

  protected convertDateFromClient<T extends IVacation | NewVacation | PartialUpdateVacation>(vacation: T): RestOf<T> {
    return {
      ...vacation,
      start: vacation.start?.format(DATE_FORMAT) ?? null,
      end: vacation.end?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restVacation: RestVacation): IVacation {
    return {
      ...restVacation,
      start: restVacation.start ? dayjs(restVacation.start) : undefined,
      end: restVacation.end ? dayjs(restVacation.end) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVacation>): HttpResponse<IVacation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVacation[]>): HttpResponse<IVacation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
