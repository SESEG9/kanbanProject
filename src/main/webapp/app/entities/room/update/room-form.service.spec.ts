import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../room.test-samples';

import { RoomFormService } from './room-form.service';

describe('Room Form Service', () => {
  let service: RoomFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomFormService);
  });

  describe('Service methods', () => {
    describe('createRoomFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRoomFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            identifyer: expect.any(Object),
            maxCapacity: expect.any(Object),
            invoice: expect.any(Object),
            bookings: expect.any(Object),
          })
        );
      });

      it('passing IRoom should create a new form with FormGroup', () => {
        const formGroup = service.createRoomFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            identifyer: expect.any(Object),
            maxCapacity: expect.any(Object),
            invoice: expect.any(Object),
            bookings: expect.any(Object),
          })
        );
      });
    });

    describe('getRoom', () => {
      it('should return NewRoom for default Room initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRoomFormGroup(sampleWithNewData);

        const room = service.getRoom(formGroup) as any;

        expect(room).toMatchObject(sampleWithNewData);
      });

      it('should return NewRoom for empty Room initial value', () => {
        const formGroup = service.createRoomFormGroup();

        const room = service.getRoom(formGroup) as any;

        expect(room).toMatchObject({});
      });

      it('should return IRoom', () => {
        const formGroup = service.createRoomFormGroup(sampleWithRequiredData);

        const room = service.getRoom(formGroup) as any;

        expect(room).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRoom should not enable id FormControl', () => {
        const formGroup = service.createRoomFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRoom should disable id FormControl', () => {
        const formGroup = service.createRoomFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
