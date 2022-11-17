import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmailAttachment } from '../email-attachment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../email-attachment.test-samples';

import { EmailAttachmentService } from './email-attachment.service';

const requireRestSample: IEmailAttachment = {
  ...sampleWithRequiredData,
};

describe('EmailAttachment Service', () => {
  let service: EmailAttachmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmailAttachment | IEmailAttachment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmailAttachmentService);
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

    it('should create a EmailAttachment', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const emailAttachment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(emailAttachment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EmailAttachment', () => {
      const emailAttachment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(emailAttachment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EmailAttachment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EmailAttachment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EmailAttachment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEmailAttachmentToCollectionIfMissing', () => {
      it('should add a EmailAttachment to an empty array', () => {
        const emailAttachment: IEmailAttachment = sampleWithRequiredData;
        expectedResult = service.addEmailAttachmentToCollectionIfMissing([], emailAttachment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emailAttachment);
      });

      it('should not add a EmailAttachment to an array that contains it', () => {
        const emailAttachment: IEmailAttachment = sampleWithRequiredData;
        const emailAttachmentCollection: IEmailAttachment[] = [
          {
            ...emailAttachment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmailAttachmentToCollectionIfMissing(emailAttachmentCollection, emailAttachment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EmailAttachment to an array that doesn't contain it", () => {
        const emailAttachment: IEmailAttachment = sampleWithRequiredData;
        const emailAttachmentCollection: IEmailAttachment[] = [sampleWithPartialData];
        expectedResult = service.addEmailAttachmentToCollectionIfMissing(emailAttachmentCollection, emailAttachment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emailAttachment);
      });

      it('should add only unique EmailAttachment to an array', () => {
        const emailAttachmentArray: IEmailAttachment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const emailAttachmentCollection: IEmailAttachment[] = [sampleWithRequiredData];
        expectedResult = service.addEmailAttachmentToCollectionIfMissing(emailAttachmentCollection, ...emailAttachmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const emailAttachment: IEmailAttachment = sampleWithRequiredData;
        const emailAttachment2: IEmailAttachment = sampleWithPartialData;
        expectedResult = service.addEmailAttachmentToCollectionIfMissing([], emailAttachment, emailAttachment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emailAttachment);
        expect(expectedResult).toContain(emailAttachment2);
      });

      it('should accept null and undefined values', () => {
        const emailAttachment: IEmailAttachment = sampleWithRequiredData;
        expectedResult = service.addEmailAttachmentToCollectionIfMissing([], null, emailAttachment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emailAttachment);
      });

      it('should return initial array if no EmailAttachment is added', () => {
        const emailAttachmentCollection: IEmailAttachment[] = [sampleWithRequiredData];
        expectedResult = service.addEmailAttachmentToCollectionIfMissing(emailAttachmentCollection, undefined, null);
        expect(expectedResult).toEqual(emailAttachmentCollection);
      });
    });

    describe('compareEmailAttachment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmailAttachment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEmailAttachment(entity1, entity2);
        const compareResult2 = service.compareEmailAttachment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEmailAttachment(entity1, entity2);
        const compareResult2 = service.compareEmailAttachment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEmailAttachment(entity1, entity2);
        const compareResult2 = service.compareEmailAttachment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
