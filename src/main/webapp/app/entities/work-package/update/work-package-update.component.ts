import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { WorkPackageFormService, WorkPackageFormGroup } from './work-package-form.service';
import { IWorkPackage } from '../work-package.model';
import { WorkPackageService } from '../service/work-package.service';
import { IHumanResource } from 'app/entities/human-resource/human-resource.model';
import { HumanResourceService } from 'app/entities/human-resource/service/human-resource.service';

@Component({
  selector: 'jhi-work-package-update',
  templateUrl: './work-package-update.component.html',
})
export class WorkPackageUpdateComponent implements OnInit {
  isSaving = false;
  workPackage: IWorkPackage | null = null;

  humanResourcesSharedCollection: IHumanResource[] = [];

  editForm: WorkPackageFormGroup = this.workPackageFormService.createWorkPackageFormGroup();

  constructor(
    protected workPackageService: WorkPackageService,
    protected workPackageFormService: WorkPackageFormService,
    protected humanResourceService: HumanResourceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareHumanResource = (o1: IHumanResource | null, o2: IHumanResource | null): boolean =>
    this.humanResourceService.compareHumanResource(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workPackage }) => {
      this.workPackage = workPackage;
      if (workPackage) {
        this.updateForm(workPackage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const workPackage = this.workPackageFormService.getWorkPackage(this.editForm);
    if (workPackage.id !== null) {
      this.subscribeToSaveResponse(this.workPackageService.update(workPackage));
    } else {
      this.subscribeToSaveResponse(this.workPackageService.create(workPackage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkPackage>>): void {
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

  protected updateForm(workPackage: IWorkPackage): void {
    this.workPackage = workPackage;
    this.workPackageFormService.resetForm(this.editForm, workPackage);

    this.humanResourcesSharedCollection = this.humanResourceService.addHumanResourceToCollectionIfMissing<IHumanResource>(
      this.humanResourcesSharedCollection,
      workPackage.humanResource
    );
  }

  protected loadRelationshipsOptions(): void {
    this.humanResourceService
      .query()
      .pipe(map((res: HttpResponse<IHumanResource[]>) => res.body ?? []))
      .pipe(
        map((humanResources: IHumanResource[]) =>
          this.humanResourceService.addHumanResourceToCollectionIfMissing<IHumanResource>(humanResources, this.workPackage?.humanResource)
        )
      )
      .subscribe((humanResources: IHumanResource[]) => (this.humanResourcesSharedCollection = humanResources));
  }
}
