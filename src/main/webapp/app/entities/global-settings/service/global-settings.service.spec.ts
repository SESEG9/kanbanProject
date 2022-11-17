import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGlobalSettings } from '../global-settings.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../global-settings.test-samples';

import { GlobalSettingsService } from './global-settings.service';

const requireRestSample: IGlobalSettings = {
  ...sampleWithRequiredData,
};

describe('GlobalSettings Service', () => {
  let service: GlobalSettingsService;
  let httpMock: HttpTestingController;
  let expectedResult: IGlobalSettings | IGlobalSettings[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GlobalSettingsService);
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

    it('should create a GlobalSettings', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const globalSettings = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(globalSettings).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GlobalSettings', () => {
      const globalSettings = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(globalSettings).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GlobalSettings', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GlobalSettings', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GlobalSettings', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGlobalSettingsToCollectionIfMissing', () => {
      it('should add a GlobalSettings to an empty array', () => {
        const globalSettings: IGlobalSettings = sampleWithRequiredData;
        expectedResult = service.addGlobalSettingsToCollectionIfMissing([], globalSettings);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(globalSettings);
      });

      it('should not add a GlobalSettings to an array that contains it', () => {
        const globalSettings: IGlobalSettings = sampleWithRequiredData;
        const globalSettingsCollection: IGlobalSettings[] = [
          {
            ...globalSettings,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGlobalSettingsToCollectionIfMissing(globalSettingsCollection, globalSettings);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GlobalSettings to an array that doesn't contain it", () => {
        const globalSettings: IGlobalSettings = sampleWithRequiredData;
        const globalSettingsCollection: IGlobalSettings[] = [sampleWithPartialData];
        expectedResult = service.addGlobalSettingsToCollectionIfMissing(globalSettingsCollection, globalSettings);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(globalSettings);
      });

      it('should add only unique GlobalSettings to an array', () => {
        const globalSettingsArray: IGlobalSettings[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const globalSettingsCollection: IGlobalSettings[] = [sampleWithRequiredData];
        expectedResult = service.addGlobalSettingsToCollectionIfMissing(globalSettingsCollection, ...globalSettingsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const globalSettings: IGlobalSettings = sampleWithRequiredData;
        const globalSettings2: IGlobalSettings = sampleWithPartialData;
        expectedResult = service.addGlobalSettingsToCollectionIfMissing([], globalSettings, globalSettings2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(globalSettings);
        expect(expectedResult).toContain(globalSettings2);
      });

      it('should accept null and undefined values', () => {
        const globalSettings: IGlobalSettings = sampleWithRequiredData;
        expectedResult = service.addGlobalSettingsToCollectionIfMissing([], null, globalSettings, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(globalSettings);
      });

      it('should return initial array if no GlobalSettings is added', () => {
        const globalSettingsCollection: IGlobalSettings[] = [sampleWithRequiredData];
        expectedResult = service.addGlobalSettingsToCollectionIfMissing(globalSettingsCollection, undefined, null);
        expect(expectedResult).toEqual(globalSettingsCollection);
      });
    });

    describe('compareGlobalSettings', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGlobalSettings(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGlobalSettings(entity1, entity2);
        const compareResult2 = service.compareGlobalSettings(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGlobalSettings(entity1, entity2);
        const compareResult2 = service.compareGlobalSettings(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGlobalSettings(entity1, entity2);
        const compareResult2 = service.compareGlobalSettings(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
