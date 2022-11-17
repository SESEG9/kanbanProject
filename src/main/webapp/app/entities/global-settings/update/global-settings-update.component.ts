import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GlobalSettingsFormService, GlobalSettingsFormGroup } from './global-settings-form.service';
import { IGlobalSettings } from '../global-settings.model';
import { GlobalSettingsService } from '../service/global-settings.service';

@Component({
  selector: 'jhi-global-settings-update',
  templateUrl: './global-settings-update.component.html',
})
export class GlobalSettingsUpdateComponent implements OnInit {
  isSaving = false;
  globalSettings: IGlobalSettings | null = null;

  editForm: GlobalSettingsFormGroup = this.globalSettingsFormService.createGlobalSettingsFormGroup();

  constructor(
    protected globalSettingsService: GlobalSettingsService,
    protected globalSettingsFormService: GlobalSettingsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ globalSettings }) => {
      this.globalSettings = globalSettings;
      if (globalSettings) {
        this.updateForm(globalSettings);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const globalSettings = this.globalSettingsFormService.getGlobalSettings(this.editForm);
    if (globalSettings.id !== null) {
      this.subscribeToSaveResponse(this.globalSettingsService.update(globalSettings));
    } else {
      this.subscribeToSaveResponse(this.globalSettingsService.create(globalSettings));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGlobalSettings>>): void {
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

  protected updateForm(globalSettings: IGlobalSettings): void {
    this.globalSettings = globalSettings;
    this.globalSettingsFormService.resetForm(this.editForm, globalSettings);
  }
}
