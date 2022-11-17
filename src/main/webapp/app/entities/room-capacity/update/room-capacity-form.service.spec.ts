import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../room-capacity.test-samples';

import { RoomCapacityFormService } from './room-capacity-form.service';

describe('RoomCapacity Form Service', () => {
  let service: RoomCapacityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomCapacityFormService);
  });

  describe('Service methods', () => {
    describe('createRoomCapacityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRoomCapacityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            capacity: expect.any(Object),
          })
        );
      });

      it('passing IRoomCapacity should create a new form with FormGroup', () => {
        const formGroup = service.createRoomCapacityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            capacity: expect.any(Object),
          })
        );
      });
    });

    describe('getRoomCapacity', () => {
      it('should return NewRoomCapacity for default RoomCapacity initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRoomCapacityFormGroup(sampleWithNewData);

        const roomCapacity = service.getRoomCapacity(formGroup) as any;

        expect(roomCapacity).toMatchObject(sampleWithNewData);
      });

      it('should return NewRoomCapacity for empty RoomCapacity initial value', () => {
        const formGroup = service.createRoomCapacityFormGroup();

        const roomCapacity = service.getRoomCapacity(formGroup) as any;

        expect(roomCapacity).toMatchObject({});
      });

      it('should return IRoomCapacity', () => {
        const formGroup = service.createRoomCapacityFormGroup(sampleWithRequiredData);

        const roomCapacity = service.getRoomCapacity(formGroup) as any;

        expect(roomCapacity).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRoomCapacity should not enable id FormControl', () => {
        const formGroup = service.createRoomCapacityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRoomCapacity should disable id FormControl', () => {
        const formGroup = service.createRoomCapacityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
