import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../room-price.test-samples';

import { RoomPriceFormService } from './room-price-form.service';

describe('RoomPrice Form Service', () => {
  let service: RoomPriceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomPriceFormService);
  });

  describe('Service methods', () => {
    describe('createRoomPriceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRoomPriceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            price: expect.any(Object),
            capacity: expect.any(Object),
            room: expect.any(Object),
          })
        );
      });

      it('passing IRoomPrice should create a new form with FormGroup', () => {
        const formGroup = service.createRoomPriceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            price: expect.any(Object),
            capacity: expect.any(Object),
            room: expect.any(Object),
          })
        );
      });
    });

    describe('getRoomPrice', () => {
      it('should return NewRoomPrice for default RoomPrice initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRoomPriceFormGroup(sampleWithNewData);

        const roomPrice = service.getRoomPrice(formGroup) as any;

        expect(roomPrice).toMatchObject(sampleWithNewData);
      });

      it('should return NewRoomPrice for empty RoomPrice initial value', () => {
        const formGroup = service.createRoomPriceFormGroup();

        const roomPrice = service.getRoomPrice(formGroup) as any;

        expect(roomPrice).toMatchObject({});
      });

      it('should return IRoomPrice', () => {
        const formGroup = service.createRoomPriceFormGroup(sampleWithRequiredData);

        const roomPrice = service.getRoomPrice(formGroup) as any;

        expect(roomPrice).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRoomPrice should not enable id FormControl', () => {
        const formGroup = service.createRoomPriceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRoomPrice should disable id FormControl', () => {
        const formGroup = service.createRoomPriceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
