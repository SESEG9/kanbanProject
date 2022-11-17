import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../work-package.test-samples';

import { WorkPackageFormService } from './work-package-form.service';

describe('WorkPackage Form Service', () => {
  let service: WorkPackageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkPackageFormService);
  });

  describe('Service methods', () => {
    describe('createWorkPackageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWorkPackageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            start: expect.any(Object),
            end: expect.any(Object),
            summary: expect.any(Object),
            description: expect.any(Object),
            humanResource: expect.any(Object),
          })
        );
      });

      it('passing IWorkPackage should create a new form with FormGroup', () => {
        const formGroup = service.createWorkPackageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            start: expect.any(Object),
            end: expect.any(Object),
            summary: expect.any(Object),
            description: expect.any(Object),
            humanResource: expect.any(Object),
          })
        );
      });
    });

    describe('getWorkPackage', () => {
      it('should return NewWorkPackage for default WorkPackage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWorkPackageFormGroup(sampleWithNewData);

        const workPackage = service.getWorkPackage(formGroup) as any;

        expect(workPackage).toMatchObject(sampleWithNewData);
      });

      it('should return NewWorkPackage for empty WorkPackage initial value', () => {
        const formGroup = service.createWorkPackageFormGroup();

        const workPackage = service.getWorkPackage(formGroup) as any;

        expect(workPackage).toMatchObject({});
      });

      it('should return IWorkPackage', () => {
        const formGroup = service.createWorkPackageFormGroup(sampleWithRequiredData);

        const workPackage = service.getWorkPackage(formGroup) as any;

        expect(workPackage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWorkPackage should not enable id FormControl', () => {
        const formGroup = service.createWorkPackageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWorkPackage should disable id FormControl', () => {
        const formGroup = service.createWorkPackageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
