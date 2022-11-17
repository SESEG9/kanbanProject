import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { HumanResourceFormService, HumanResourceFormGroup } from './human-resource-form.service';
import { IHumanResource } from '../human-resource.model';
import { HumanResourceService } from '../service/human-resource.service';
import { HumanResourceType } from 'app/entities/enumerations/human-resource-type.model';
import { Gender } from 'app/entities/enumerations/gender.model';

@Component({
  selector: 'jhi-human-resource-update',
  templateUrl: './human-resource-update.component.html',
})
export class HumanResourceUpdateComponent implements OnInit {
  isSaving = false;
  humanResource: IHumanResource | null = null;
  humanResourceTypeValues = Object.keys(HumanResourceType);
  genderValues = Object.keys(Gender);

  editForm: HumanResourceFormGroup = this.humanResourceFormService.createHumanResourceFormGroup();

  constructor(
    protected humanResourceService: HumanResourceService,
    protected humanResourceFormService: HumanResourceFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ humanResource }) => {
      this.humanResource = humanResource;
      if (humanResource) {
        this.updateForm(humanResource);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const humanResource = this.humanResourceFormService.getHumanResource(this.editForm);
    if (humanResource.id !== null) {
      this.subscribeToSaveResponse(this.humanResourceService.update(humanResource));
    } else {
      this.subscribeToSaveResponse(this.humanResourceService.create(humanResource));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHumanResource>>): void {
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

  protected updateForm(humanResource: IHumanResource): void {
    this.humanResource = humanResource;
    this.humanResourceFormService.resetForm(this.editForm, humanResource);
  }
}
