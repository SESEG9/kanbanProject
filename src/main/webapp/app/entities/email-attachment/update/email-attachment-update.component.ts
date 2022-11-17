import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EmailAttachmentFormService, EmailAttachmentFormGroup } from './email-attachment-form.service';
import { IEmailAttachment } from '../email-attachment.model';
import { EmailAttachmentService } from '../service/email-attachment.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IBulkLetterTemplate } from 'app/entities/bulk-letter-template/bulk-letter-template.model';
import { BulkLetterTemplateService } from 'app/entities/bulk-letter-template/service/bulk-letter-template.service';

@Component({
  selector: 'jhi-email-attachment-update',
  templateUrl: './email-attachment-update.component.html',
})
export class EmailAttachmentUpdateComponent implements OnInit {
  isSaving = false;
  emailAttachment: IEmailAttachment | null = null;

  bulkLetterTemplatesSharedCollection: IBulkLetterTemplate[] = [];

  editForm: EmailAttachmentFormGroup = this.emailAttachmentFormService.createEmailAttachmentFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected emailAttachmentService: EmailAttachmentService,
    protected emailAttachmentFormService: EmailAttachmentFormService,
    protected bulkLetterTemplateService: BulkLetterTemplateService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBulkLetterTemplate = (o1: IBulkLetterTemplate | null, o2: IBulkLetterTemplate | null): boolean =>
    this.bulkLetterTemplateService.compareBulkLetterTemplate(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emailAttachment }) => {
      this.emailAttachment = emailAttachment;
      if (emailAttachment) {
        this.updateForm(emailAttachment);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('lionhotelApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emailAttachment = this.emailAttachmentFormService.getEmailAttachment(this.editForm);
    if (emailAttachment.id !== null) {
      this.subscribeToSaveResponse(this.emailAttachmentService.update(emailAttachment));
    } else {
      this.subscribeToSaveResponse(this.emailAttachmentService.create(emailAttachment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmailAttachment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(emailAttachment: IEmailAttachment): void {
    this.emailAttachment = emailAttachment;
    this.emailAttachmentFormService.resetForm(this.editForm, emailAttachment);

    this.bulkLetterTemplatesSharedCollection =
      this.bulkLetterTemplateService.addBulkLetterTemplateToCollectionIfMissing<IBulkLetterTemplate>(
        this.bulkLetterTemplatesSharedCollection,
        emailAttachment.bulkLetterTemplate
      );
  }

  protected loadRelationshipsOptions(): void {
    this.bulkLetterTemplateService
      .query()
      .pipe(map((res: HttpResponse<IBulkLetterTemplate[]>) => res.body ?? []))
      .pipe(
        map((bulkLetterTemplates: IBulkLetterTemplate[]) =>
          this.bulkLetterTemplateService.addBulkLetterTemplateToCollectionIfMissing<IBulkLetterTemplate>(
            bulkLetterTemplates,
            this.emailAttachment?.bulkLetterTemplate
          )
        )
      )
      .subscribe((bulkLetterTemplates: IBulkLetterTemplate[]) => (this.bulkLetterTemplatesSharedCollection = bulkLetterTemplates));
  }
}
