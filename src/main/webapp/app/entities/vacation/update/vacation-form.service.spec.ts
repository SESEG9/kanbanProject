import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vacation.test-samples';

import { VacationFormService } from './vacation-form.service';

describe('Vacation Form Service', () => {
  let service: VacationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacationFormService);
  });

  describe('Service methods', () => {
    describe('createVacationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVacationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            start: expect.any(Object),
            end: expect.any(Object),
            state: expect.any(Object),
            humanResource: expect.any(Object),
          })
        );
      });

      it('passing IVacation should create a new form with FormGroup', () => {
        const formGroup = service.createVacationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            start: expect.any(Object),
            end: expect.any(Object),
            state: expect.any(Object),
            humanResource: expect.any(Object),
          })
        );
      });
    });

    describe('getVacation', () => {
      it('should return NewVacation for default Vacation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVacationFormGroup(sampleWithNewData);

        const vacation = service.getVacation(formGroup) as any;

        expect(vacation).toMatchObject(sampleWithNewData);
      });

      it('should return NewVacation for empty Vacation initial value', () => {
        const formGroup = service.createVacationFormGroup();

        const vacation = service.getVacation(formGroup) as any;

        expect(vacation).toMatchObject({});
      });

      it('should return IVacation', () => {
        const formGroup = service.createVacationFormGroup(sampleWithRequiredData);

        const vacation = service.getVacation(formGroup) as any;

        expect(vacation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVacation should not enable id FormControl', () => {
        const formGroup = service.createVacationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVacation should disable id FormControl', () => {
        const formGroup = service.createVacationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
