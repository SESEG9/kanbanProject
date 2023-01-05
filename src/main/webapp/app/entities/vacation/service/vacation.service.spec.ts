import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IVacation } from '../vacation.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../vacation.test-samples';

import { RestVacation, VacationService } from './vacation.service';

const requireRestSample: RestVacation = {
  ...sampleWithRequiredData,
  start: sampleWithRequiredData.start?.format(DATE_FORMAT),
  end: sampleWithRequiredData.end?.format(DATE_FORMAT),
};

describe('Vacation Service', () => {
  let service: VacationService;
  let httpMock: HttpTestingController;
  let expectedResult: IVacation | IVacation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VacationService);
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

    it('should create a Vacation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const vacation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vacation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vacation', () => {
      const vacation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vacation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vacation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vacation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should dialog-reject a Vacation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVacationToCollectionIfMissing', () => {
      it('should add a Vacation to an empty array', () => {
        const vacation: IVacation = sampleWithRequiredData;
        expectedResult = service.addVacationToCollectionIfMissing([], vacation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vacation);
      });

      it('should not add a Vacation to an array that contains it', () => {
        const vacation: IVacation = sampleWithRequiredData;
        const vacationCollection: IVacation[] = [
          {
            ...vacation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVacationToCollectionIfMissing(vacationCollection, vacation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vacation to an array that doesn't contain it", () => {
        const vacation: IVacation = sampleWithRequiredData;
        const vacationCollection: IVacation[] = [sampleWithPartialData];
        expectedResult = service.addVacationToCollectionIfMissing(vacationCollection, vacation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vacation);
      });

      it('should add only unique Vacation to an array', () => {
        const vacationArray: IVacation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vacationCollection: IVacation[] = [sampleWithRequiredData];
        expectedResult = service.addVacationToCollectionIfMissing(vacationCollection, ...vacationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vacation: IVacation = sampleWithRequiredData;
        const vacation2: IVacation = sampleWithPartialData;
        expectedResult = service.addVacationToCollectionIfMissing([], vacation, vacation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vacation);
        expect(expectedResult).toContain(vacation2);
      });

      it('should accept null and undefined values', () => {
        const vacation: IVacation = sampleWithRequiredData;
        expectedResult = service.addVacationToCollectionIfMissing([], null, vacation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vacation);
      });

      it('should return initial array if no Vacation is added', () => {
        const vacationCollection: IVacation[] = [sampleWithRequiredData];
        expectedResult = service.addVacationToCollectionIfMissing(vacationCollection, undefined, null);
        expect(expectedResult).toEqual(vacationCollection);
      });
    });

    describe('compareVacation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVacation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVacation(entity1, entity2);
        const compareResult2 = service.compareVacation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVacation(entity1, entity2);
        const compareResult2 = service.compareVacation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVacation(entity1, entity2);
        const compareResult2 = service.compareVacation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
