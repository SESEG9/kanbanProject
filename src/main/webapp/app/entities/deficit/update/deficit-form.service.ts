import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDeficit, NewDeficit } from '../deficit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDeficit for edit and NewDeficitFormGroupInput for create.
 */
type DeficitFormGroupInput = IDeficit | PartialWithRequiredKeyOf<NewDeficit>;

type DeficitFormDefaults = Pick<NewDeficit, 'id'>;

type DeficitFormGroupContent = {
  id: FormControl<IDeficit['id'] | NewDeficit['id']>;
  description: FormControl<IDeficit['description']>;
  state: FormControl<IDeficit['state']>;
  discount: FormControl<IDeficit['discount']>;
  room: FormControl<IDeficit['room']>;
};

export type DeficitFormGroup = FormGroup<DeficitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DeficitFormService {
  createDeficitFormGroup(deficit: DeficitFormGroupInput = { id: null }): DeficitFormGroup {
    const deficitRawValue = {
      ...this.getFormDefaults(),
      ...deficit,
    };
    return new FormGroup<DeficitFormGroupContent>({
      id: new FormControl(
        { value: deficitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(deficitRawValue.description),
      state: new FormControl(deficitRawValue.state),
      discount: new FormControl(deficitRawValue.discount),
      room: new FormControl(deficitRawValue.room),
    });
  }

  getDeficit(form: DeficitFormGroup): IDeficit | NewDeficit {
    return form.getRawValue() as IDeficit | NewDeficit;
  }

  resetForm(form: DeficitFormGroup, deficit: DeficitFormGroupInput): void {
    const deficitRawValue = { ...this.getFormDefaults(), ...deficit };
    form.reset(
      {
        ...deficitRawValue,
        id: { value: deficitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DeficitFormDefaults {
    return {
      id: null,
    };
  }
}
