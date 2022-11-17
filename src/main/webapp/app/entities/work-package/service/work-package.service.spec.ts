import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IWorkPackage } from '../work-package.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../work-package.test-samples';

import { WorkPackageService, RestWorkPackage } from './work-package.service';

const requireRestSample: RestWorkPackage = {
  ...sampleWithRequiredData,
  start: sampleWithRequiredData.start?.format(DATE_FORMAT),
  end: sampleWithRequiredData.end?.format(DATE_FORMAT),
};

describe('WorkPackage Service', () => {
  let service: WorkPackageService;
  let httpMock: HttpTestingController;
  let expectedResult: IWorkPackage | IWorkPackage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WorkPackageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a WorkPackage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const workPackage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(workPackage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a WorkPackage', () => {
      const workPackage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(workPackage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a WorkPackage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of WorkPackage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a WorkPackage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWorkPackageToCollectionIfMissing', () => {
      it('should add a WorkPackage to an empty array', () => {
        const workPackage: IWorkPackage = sampleWithRequiredData;
        expectedResult = service.addWorkPackageToCollectionIfMissing([], workPackage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workPackage);
      });

      it('should not add a WorkPackage to an array that contains it', () => {
        const workPackage: IWorkPackage = sampleWithRequiredData;
        const workPackageCollection: IWorkPackage[] = [
          {
            ...workPackage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWorkPackageToCollectionIfMissing(workPackageCollection, workPackage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a WorkPackage to an array that doesn't contain it", () => {
        const workPackage: IWorkPackage = sampleWithRequiredData;
        const workPackageCollection: IWorkPackage[] = [sampleWithPartialData];
        expectedResult = service.addWorkPackageToCollectionIfMissing(workPackageCollection, workPackage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workPackage);
      });

      it('should add only unique WorkPackage to an array', () => {
        const workPackageArray: IWorkPackage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const workPackageCollection: IWorkPackage[] = [sampleWithRequiredData];
        expectedResult = service.addWorkPackageToCollectionIfMissing(workPackageCollection, ...workPackageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const workPackage: IWorkPackage = sampleWithRequiredData;
        const workPackage2: IWorkPackage = sampleWithPartialData;
        expectedResult = service.addWorkPackageToCollectionIfMissing([], workPackage, workPackage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workPackage);
        expect(expectedResult).toContain(workPackage2);
      });

      it('should accept null and undefined values', () => {
        const workPackage: IWorkPackage = sampleWithRequiredData;
        expectedResult = service.addWorkPackageToCollectionIfMissing([], null, workPackage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workPackage);
      });

      it('should return initial array if no WorkPackage is added', () => {
        const workPackageCollection: IWorkPackage[] = [sampleWithRequiredData];
        expectedResult = service.addWorkPackageToCollectionIfMissing(workPackageCollection, undefined, null);
        expect(expectedResult).toEqual(workPackageCollection);
      });
    });

    describe('compareWorkPackage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWorkPackage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWorkPackage(entity1, entity2);
        const compareResult2 = service.compareWorkPackage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWorkPackage(entity1, entity2);
        const compareResult2 = service.compareWorkPackage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWorkPackage(entity1, entity2);
        const compareResult2 = service.compareWorkPackage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
