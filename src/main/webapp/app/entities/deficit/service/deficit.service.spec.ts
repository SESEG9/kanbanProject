import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDeficit } from '../deficit.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../deficit.test-samples';

import { DeficitService } from './deficit.service';

const requireRestSample: IDeficit = {
  ...sampleWithRequiredData,
};

describe('Deficit Service', () => {
  let service: DeficitService;
  let httpMock: HttpTestingController;
  let expectedResult: IDeficit | IDeficit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DeficitService);
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

    it('should create a Deficit', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const deficit = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(deficit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Deficit', () => {
      const deficit = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(deficit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Deficit', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Deficit', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Deficit', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDeficitToCollectionIfMissing', () => {
      it('should add a Deficit to an empty array', () => {
        const deficit: IDeficit = sampleWithRequiredData;
        expectedResult = service.addDeficitToCollectionIfMissing([], deficit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(deficit);
      });

      it('should not add a Deficit to an array that contains it', () => {
        const deficit: IDeficit = sampleWithRequiredData;
        const deficitCollection: IDeficit[] = [
          {
            ...deficit,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDeficitToCollectionIfMissing(deficitCollection, deficit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Deficit to an array that doesn't contain it", () => {
        const deficit: IDeficit = sampleWithRequiredData;
        const deficitCollection: IDeficit[] = [sampleWithPartialData];
        expectedResult = service.addDeficitToCollectionIfMissing(deficitCollection, deficit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(deficit);
      });

      it('should add only unique Deficit to an array', () => {
        const deficitArray: IDeficit[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const deficitCollection: IDeficit[] = [sampleWithRequiredData];
        expectedResult = service.addDeficitToCollectionIfMissing(deficitCollection, ...deficitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const deficit: IDeficit = sampleWithRequiredData;
        const deficit2: IDeficit = sampleWithPartialData;
        expectedResult = service.addDeficitToCollectionIfMissing([], deficit, deficit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(deficit);
        expect(expectedResult).toContain(deficit2);
      });

      it('should accept null and undefined values', () => {
        const deficit: IDeficit = sampleWithRequiredData;
        expectedResult = service.addDeficitToCollectionIfMissing([], null, deficit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(deficit);
      });

      it('should return initial array if no Deficit is added', () => {
        const deficitCollection: IDeficit[] = [sampleWithRequiredData];
        expectedResult = service.addDeficitToCollectionIfMissing(deficitCollection, undefined, null);
        expect(expectedResult).toEqual(deficitCollection);
      });
    });

    describe('compareDeficit', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDeficit(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDeficit(entity1, entity2);
        const compareResult2 = service.compareDeficit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDeficit(entity1, entity2);
        const compareResult2 = service.compareDeficit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDeficit(entity1, entity2);
        const compareResult2 = service.compareDeficit(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
