import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVacation, NewVacation } from '../vacation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVacation for edit and NewVacationFormGroupInput for create.
 */
type VacationFormGroupInput = IVacation | PartialWithRequiredKeyOf<NewVacation>;

type VacationFormDefaults = Pick<NewVacation, 'id'>;

type VacationFormGroupContent = {
  id: FormControl<IVacation['id'] | NewVacation['id']>;
  start: FormControl<IVacation['start']>;
  end: FormControl<IVacation['end']>;
  state: FormControl<IVacation['state']>;
  humanResource: FormControl<IVacation['humanResource']>;
};

export type VacationFormGroup = FormGroup<VacationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VacationFormService {
  createVacationFormGroup(vacation: VacationFormGroupInput = { id: null }): VacationFormGroup {
    const vacationRawValue = {
      ...this.getFormDefaults(),
      ...vacation,
    };
    return new FormGroup<VacationFormGroupContent>({
      id: new FormControl(
        { value: vacationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      start: new FormControl(vacationRawValue.start),
      end: new FormControl(vacationRawValue.end),
      state: new FormControl(vacationRawValue.state),
      humanResource: new FormControl(vacationRawValue.humanResource),
    });
  }

  getVacation(form: VacationFormGroup): IVacation | NewVacation {
    return form.getRawValue() as IVacation | NewVacation;
  }

  resetForm(form: VacationFormGroup, vacation: VacationFormGroupInput): void {
    const vacationRawValue = { ...this.getFormDefaults(), ...vacation };
    form.reset(
      {
        ...vacationRawValue,
        id: { value: vacationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VacationFormDefaults {
    return {
      id: null,
    };
  }
}
