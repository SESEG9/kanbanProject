import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VacationFormService, VacationFormGroup } from './vacation-form.service';
import { IVacation } from '../vacation.model';
import { VacationService } from '../service/vacation.service';
import { IHumanResource } from 'app/entities/human-resource/human-resource.model';
import { HumanResourceService } from 'app/entities/human-resource/service/human-resource.service';
import { VacationState } from 'app/entities/enumerations/vacation-state.model';

@Component({
  selector: 'jhi-vacation-update',
  templateUrl: './vacation-update.component.html',
})
export class VacationUpdateComponent implements OnInit {
  isSaving = false;
  vacation: IVacation | null = null;
  vacationStateValues = Object.keys(VacationState);

  humanResourcesSharedCollection: IHumanResource[] = [];

  editForm: VacationFormGroup = this.vacationFormService.createVacationFormGroup();

  constructor(
    protected vacationService: VacationService,
    protected vacationFormService: VacationFormService,
    protected humanResourceService: HumanResourceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareHumanResource = (o1: IHumanResource | null, o2: IHumanResource | null): boolean =>
    this.humanResourceService.compareHumanResource(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vacation }) => {
      this.vacation = vacation;
      if (vacation) {
        this.updateForm(vacation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vacation = this.vacationFormService.getVacation(this.editForm);
    if (vacation.id !== null) {
      this.subscribeToSaveResponse(this.vacationService.update(vacation));
    } else {
      this.subscribeToSaveResponse(this.vacationService.create(vacation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVacation>>): void {
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

  protected updateForm(vacation: IVacation): void {
    this.vacation = vacation;
    this.vacationFormService.resetForm(this.editForm, vacation);

    this.humanResourcesSharedCollection = this.humanResourceService.addHumanResourceToCollectionIfMissing<IHumanResource>(
      this.humanResourcesSharedCollection,
      vacation.humanResource
    );
  }

  protected loadRelationshipsOptions(): void {
    this.humanResourceService
      .query()
      .pipe(map((res: HttpResponse<IHumanResource[]>) => res.body ?? []))
      .pipe(
        map((humanResources: IHumanResource[]) =>
          this.humanResourceService.addHumanResourceToCollectionIfMissing<IHumanResource>(humanResources, this.vacation?.humanResource)
        )
      )
      .subscribe((humanResources: IHumanResource[]) => (this.humanResourcesSharedCollection = humanResources));
  }
}
