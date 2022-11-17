import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBulkLetterTemplate, NewBulkLetterTemplate } from '../bulk-letter-template.model';

export type PartialUpdateBulkLetterTemplate = Partial<IBulkLetterTemplate> & Pick<IBulkLetterTemplate, 'id'>;

type RestOf<T extends IBulkLetterTemplate | NewBulkLetterTemplate> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestBulkLetterTemplate = RestOf<IBulkLetterTemplate>;

export type NewRestBulkLetterTemplate = RestOf<NewBulkLetterTemplate>;

export type PartialUpdateRestBulkLetterTemplate = RestOf<PartialUpdateBulkLetterTemplate>;

export type EntityResponseType = HttpResponse<IBulkLetterTemplate>;
export type EntityArrayResponseType = HttpResponse<IBulkLetterTemplate[]>;

@Injectable({ providedIn: 'root' })
export class BulkLetterTemplateService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bulk-letter-templates');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bulkLetterTemplate: NewBulkLetterTemplate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bulkLetterTemplate);
    return this.http
      .post<RestBulkLetterTemplate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(bulkLetterTemplate: IBulkLetterTemplate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bulkLetterTemplate);
    return this.http
      .put<RestBulkLetterTemplate>(`${this.resourceUrl}/${this.getBulkLetterTemplateIdentifier(bulkLetterTemplate)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(bulkLetterTemplate: PartialUpdateBulkLetterTemplate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bulkLetterTemplate);
    return this.http
      .patch<RestBulkLetterTemplate>(`${this.resourceUrl}/${this.getBulkLetterTemplateIdentifier(bulkLetterTemplate)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBulkLetterTemplate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBulkLetterTemplate[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBulkLetterTemplateIdentifier(bulkLetterTemplate: Pick<IBulkLetterTemplate, 'id'>): number {
    return bulkLetterTemplate.id;
  }

  compareBulkLetterTemplate(o1: Pick<IBulkLetterTemplate, 'id'> | null, o2: Pick<IBulkLetterTemplate, 'id'> | null): boolean {
    return o1 && o2 ? this.getBulkLetterTemplateIdentifier(o1) === this.getBulkLetterTemplateIdentifier(o2) : o1 === o2;
  }

  addBulkLetterTemplateToCollectionIfMissing<Type extends Pick<IBulkLetterTemplate, 'id'>>(
    bulkLetterTemplateCollection: Type[],
    ...bulkLetterTemplatesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bulkLetterTemplates: Type[] = bulkLetterTemplatesToCheck.filter(isPresent);
    if (bulkLetterTemplates.length > 0) {
      const bulkLetterTemplateCollectionIdentifiers = bulkLetterTemplateCollection.map(
        bulkLetterTemplateItem => this.getBulkLetterTemplateIdentifier(bulkLetterTemplateItem)!
      );
      const bulkLetterTemplatesToAdd = bulkLetterTemplates.filter(bulkLetterTemplateItem => {
        const bulkLetterTemplateIdentifier = this.getBulkLetterTemplateIdentifier(bulkLetterTemplateItem);
        if (bulkLetterTemplateCollectionIdentifiers.includes(bulkLetterTemplateIdentifier)) {
          return false;
        }
        bulkLetterTemplateCollectionIdentifiers.push(bulkLetterTemplateIdentifier);
        return true;
      });
      return [...bulkLetterTemplatesToAdd, ...bulkLetterTemplateCollection];
    }
    return bulkLetterTemplateCollection;
  }

  protected convertDateFromClient<T extends IBulkLetterTemplate | NewBulkLetterTemplate | PartialUpdateBulkLetterTemplate>(
    bulkLetterTemplate: T
  ): RestOf<T> {
    return {
      ...bulkLetterTemplate,
      date: bulkLetterTemplate.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restBulkLetterTemplate: RestBulkLetterTemplate): IBulkLetterTemplate {
    return {
      ...restBulkLetterTemplate,
      date: restBulkLetterTemplate.date ? dayjs(restBulkLetterTemplate.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBulkLetterTemplate>): HttpResponse<IBulkLetterTemplate> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBulkLetterTemplate[]>): HttpResponse<IBulkLetterTemplate[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
