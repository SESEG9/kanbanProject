import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BulkLetterTemplateFormService, BulkLetterTemplateFormGroup } from './bulk-letter-template-form.service';
import { IBulkLetterTemplate } from '../bulk-letter-template.model';
import { BulkLetterTemplateService } from '../service/bulk-letter-template.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { BulkLetterType } from 'app/entities/enumerations/bulk-letter-type.model';

@Component({
  selector: 'jhi-bulk-letter-template-update',
  templateUrl: './bulk-letter-template-update.component.html',
})
export class BulkLetterTemplateUpdateComponent implements OnInit {
  isSaving = false;
  bulkLetterTemplate: IBulkLetterTemplate | null = null;
  bulkLetterTypeValues = Object.keys(BulkLetterType);

  editForm: BulkLetterTemplateFormGroup = this.bulkLetterTemplateFormService.createBulkLetterTemplateFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected bulkLetterTemplateService: BulkLetterTemplateService,
    protected bulkLetterTemplateFormService: BulkLetterTemplateFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bulkLetterTemplate }) => {
      this.bulkLetterTemplate = bulkLetterTemplate;
      if (bulkLetterTemplate) {
        this.updateForm(bulkLetterTemplate);
      }
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

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bulkLetterTemplate = this.bulkLetterTemplateFormService.getBulkLetterTemplate(this.editForm);
    if (bulkLetterTemplate.id !== null) {
      this.subscribeToSaveResponse(this.bulkLetterTemplateService.update(bulkLetterTemplate));
    } else {
      this.subscribeToSaveResponse(this.bulkLetterTemplateService.create(bulkLetterTemplate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBulkLetterTemplate>>): void {
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

  protected updateForm(bulkLetterTemplate: IBulkLetterTemplate): void {
    this.bulkLetterTemplate = bulkLetterTemplate;
    this.bulkLetterTemplateFormService.resetForm(this.editForm, bulkLetterTemplate);
  }
}
