import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmailAttachment, NewEmailAttachment } from '../email-attachment.model';

export type PartialUpdateEmailAttachment = Partial<IEmailAttachment> & Pick<IEmailAttachment, 'id'>;

export type EntityResponseType = HttpResponse<IEmailAttachment>;
export type EntityArrayResponseType = HttpResponse<IEmailAttachment[]>;

@Injectable({ providedIn: 'root' })
export class EmailAttachmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/email-attachments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(emailAttachment: NewEmailAttachment): Observable<EntityResponseType> {
    return this.http.post<IEmailAttachment>(this.resourceUrl, emailAttachment, { observe: 'response' });
  }

  update(emailAttachment: IEmailAttachment): Observable<EntityResponseType> {
    return this.http.put<IEmailAttachment>(`${this.resourceUrl}/${this.getEmailAttachmentIdentifier(emailAttachment)}`, emailAttachment, {
      observe: 'response',
    });
  }

  partialUpdate(emailAttachment: PartialUpdateEmailAttachment): Observable<EntityResponseType> {
    return this.http.patch<IEmailAttachment>(`${this.resourceUrl}/${this.getEmailAttachmentIdentifier(emailAttachment)}`, emailAttachment, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmailAttachment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmailAttachment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmailAttachmentIdentifier(emailAttachment: Pick<IEmailAttachment, 'id'>): number {
    return emailAttachment.id;
  }

  compareEmailAttachment(o1: Pick<IEmailAttachment, 'id'> | null, o2: Pick<IEmailAttachment, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmailAttachmentIdentifier(o1) === this.getEmailAttachmentIdentifier(o2) : o1 === o2;
  }

  addEmailAttachmentToCollectionIfMissing<Type extends Pick<IEmailAttachment, 'id'>>(
    emailAttachmentCollection: Type[],
    ...emailAttachmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const emailAttachments: Type[] = emailAttachmentsToCheck.filter(isPresent);
    if (emailAttachments.length > 0) {
      const emailAttachmentCollectionIdentifiers = emailAttachmentCollection.map(
        emailAttachmentItem => this.getEmailAttachmentIdentifier(emailAttachmentItem)!
      );
      const emailAttachmentsToAdd = emailAttachments.filter(emailAttachmentItem => {
        const emailAttachmentIdentifier = this.getEmailAttachmentIdentifier(emailAttachmentItem);
        if (emailAttachmentCollectionIdentifiers.includes(emailAttachmentIdentifier)) {
          return false;
        }
        emailAttachmentCollectionIdentifiers.push(emailAttachmentIdentifier);
        return true;
      });
      return [...emailAttachmentsToAdd, ...emailAttachmentCollection];
    }
    return emailAttachmentCollection;
  }
}
