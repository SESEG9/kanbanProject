import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IHumanResource } from '../human-resource.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../human-resource.test-samples';

import { HumanResourceService, RestHumanResource } from './human-resource.service';

const requireRestSample: RestHumanResource = {
  ...sampleWithRequiredData,
  birthday: sampleWithRequiredData.birthday?.format(DATE_FORMAT),
};

describe('HumanResource Service', () => {
  let service: HumanResourceService;
  let httpMock: HttpTestingController;
  let expectedResult: IHumanResource | IHumanResource[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HumanResourceService);
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

    it('should create a HumanResource', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const humanResource = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(humanResource).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HumanResource', () => {
      const humanResource = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(humanResource).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HumanResource', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HumanResource', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a HumanResource', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHumanResourceToCollectionIfMissing', () => {
      it('should add a HumanResource to an empty array', () => {
        const humanResource: IHumanResource = sampleWithRequiredData;
        expectedResult = service.addHumanResourceToCollectionIfMissing([], humanResource);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(humanResource);
      });

      it('should not add a HumanResource to an array that contains it', () => {
        const humanResource: IHumanResource = sampleWithRequiredData;
        const humanResourceCollection: IHumanResource[] = [
          {
            ...humanResource,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHumanResourceToCollectionIfMissing(humanResourceCollection, humanResource);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HumanResource to an array that doesn't contain it", () => {
        const humanResource: IHumanResource = sampleWithRequiredData;
        const humanResourceCollection: IHumanResource[] = [sampleWithPartialData];
        expectedResult = service.addHumanResourceToCollectionIfMissing(humanResourceCollection, humanResource);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(humanResource);
      });

      it('should add only unique HumanResource to an array', () => {
        const humanResourceArray: IHumanResource[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const humanResourceCollection: IHumanResource[] = [sampleWithRequiredData];
        expectedResult = service.addHumanResourceToCollectionIfMissing(humanResourceCollection, ...humanResourceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const humanResource: IHumanResource = sampleWithRequiredData;
        const humanResource2: IHumanResource = sampleWithPartialData;
        expectedResult = service.addHumanResourceToCollectionIfMissing([], humanResource, humanResource2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(humanResource);
        expect(expectedResult).toContain(humanResource2);
      });

      it('should accept null and undefined values', () => {
        const humanResource: IHumanResource = sampleWithRequiredData;
        expectedResult = service.addHumanResourceToCollectionIfMissing([], null, humanResource, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(humanResource);
      });

      it('should return initial array if no HumanResource is added', () => {
        const humanResourceCollection: IHumanResource[] = [sampleWithRequiredData];
        expectedResult = service.addHumanResourceToCollectionIfMissing(humanResourceCollection, undefined, null);
        expect(expectedResult).toEqual(humanResourceCollection);
      });
    });

    describe('compareHumanResource', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHumanResource(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHumanResource(entity1, entity2);
        const compareResult2 = service.compareHumanResource(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHumanResource(entity1, entity2);
        const compareResult2 = service.compareHumanResource(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHumanResource(entity1, entity2);
        const compareResult2 = service.compareHumanResource(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
