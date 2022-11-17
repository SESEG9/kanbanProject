import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IWorkPackage, NewWorkPackage } from '../work-package.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWorkPackage for edit and NewWorkPackageFormGroupInput for create.
 */
type WorkPackageFormGroupInput = IWorkPackage | PartialWithRequiredKeyOf<NewWorkPackage>;

type WorkPackageFormDefaults = Pick<NewWorkPackage, 'id'>;

type WorkPackageFormGroupContent = {
  id: FormControl<IWorkPackage['id'] | NewWorkPackage['id']>;
  start: FormControl<IWorkPackage['start']>;
  end: FormControl<IWorkPackage['end']>;
  summary: FormControl<IWorkPackage['summary']>;
  description: FormControl<IWorkPackage['description']>;
  humanResource: FormControl<IWorkPackage['humanResource']>;
};

export type WorkPackageFormGroup = FormGroup<WorkPackageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WorkPackageFormService {
  createWorkPackageFormGroup(workPackage: WorkPackageFormGroupInput = { id: null }): WorkPackageFormGroup {
    const workPackageRawValue = {
      ...this.getFormDefaults(),
      ...workPackage,
    };
    return new FormGroup<WorkPackageFormGroupContent>({
      id: new FormControl(
        { value: workPackageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      start: new FormControl(workPackageRawValue.start),
      end: new FormControl(workPackageRawValue.end),
      summary: new FormControl(workPackageRawValue.summary),
      description: new FormControl(workPackageRawValue.description),
      humanResource: new FormControl(workPackageRawValue.humanResource),
    });
  }

  getWorkPackage(form: WorkPackageFormGroup): IWorkPackage | NewWorkPackage {
    return form.getRawValue() as IWorkPackage | NewWorkPackage;
  }

  resetForm(form: WorkPackageFormGroup, workPackage: WorkPackageFormGroupInput): void {
    const workPackageRawValue = { ...this.getFormDefaults(), ...workPackage };
    form.reset(
      {
        ...workPackageRawValue,
        id: { value: workPackageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WorkPackageFormDefaults {
    return {
      id: null,
    };
  }
}
