import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRoomCapacity, NewRoomCapacity } from '../room-capacity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRoomCapacity for edit and NewRoomCapacityFormGroupInput for create.
 */
type RoomCapacityFormGroupInput = IRoomCapacity | PartialWithRequiredKeyOf<NewRoomCapacity>;

type RoomCapacityFormDefaults = Pick<NewRoomCapacity, 'id'>;

type RoomCapacityFormGroupContent = {
  id: FormControl<IRoomCapacity['id'] | NewRoomCapacity['id']>;
  name: FormControl<IRoomCapacity['name']>;
  capacity: FormControl<IRoomCapacity['capacity']>;
};

export type RoomCapacityFormGroup = FormGroup<RoomCapacityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RoomCapacityFormService {
  createRoomCapacityFormGroup(roomCapacity: RoomCapacityFormGroupInput = { id: null }): RoomCapacityFormGroup {
    const roomCapacityRawValue = {
      ...this.getFormDefaults(),
      ...roomCapacity,
    };
    return new FormGroup<RoomCapacityFormGroupContent>({
      id: new FormControl(
        { value: roomCapacityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(roomCapacityRawValue.name),
      capacity: new FormControl(roomCapacityRawValue.capacity, {
        validators: [Validators.min(1)],
      }),
    });
  }

  getRoomCapacity(form: RoomCapacityFormGroup): IRoomCapacity | NewRoomCapacity {
    return form.getRawValue() as IRoomCapacity | NewRoomCapacity;
  }

  resetForm(form: RoomCapacityFormGroup, roomCapacity: RoomCapacityFormGroupInput): void {
    const roomCapacityRawValue = { ...this.getFormDefaults(), ...roomCapacity };
    form.reset(
      {
        ...roomCapacityRawValue,
        id: { value: roomCapacityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RoomCapacityFormDefaults {
    return {
      id: null,
    };
  }
}
