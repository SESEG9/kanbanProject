import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRoomPrice } from '../room-price.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../room-price.test-samples';

import { RoomPriceService } from './room-price.service';

const requireRestSample: IRoomPrice = {
  ...sampleWithRequiredData,
};

describe('RoomPrice Service', () => {
  let service: RoomPriceService;
  let httpMock: HttpTestingController;
  let expectedResult: IRoomPrice | IRoomPrice[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RoomPriceService);
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

    it('should create a RoomPrice', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const roomPrice = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(roomPrice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RoomPrice', () => {
      const roomPrice = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(roomPrice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RoomPrice', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RoomPrice', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RoomPrice', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRoomPriceToCollectionIfMissing', () => {
      it('should add a RoomPrice to an empty array', () => {
        const roomPrice: IRoomPrice = sampleWithRequiredData;
        expectedResult = service.addRoomPriceToCollectionIfMissing([], roomPrice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(roomPrice);
      });

      it('should not add a RoomPrice to an array that contains it', () => {
        const roomPrice: IRoomPrice = sampleWithRequiredData;
        const roomPriceCollection: IRoomPrice[] = [
          {
            ...roomPrice,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRoomPriceToCollectionIfMissing(roomPriceCollection, roomPrice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RoomPrice to an array that doesn't contain it", () => {
        const roomPrice: IRoomPrice = sampleWithRequiredData;
        const roomPriceCollection: IRoomPrice[] = [sampleWithPartialData];
        expectedResult = service.addRoomPriceToCollectionIfMissing(roomPriceCollection, roomPrice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(roomPrice);
      });

      it('should add only unique RoomPrice to an array', () => {
        const roomPriceArray: IRoomPrice[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const roomPriceCollection: IRoomPrice[] = [sampleWithRequiredData];
        expectedResult = service.addRoomPriceToCollectionIfMissing(roomPriceCollection, ...roomPriceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const roomPrice: IRoomPrice = sampleWithRequiredData;
        const roomPrice2: IRoomPrice = sampleWithPartialData;
        expectedResult = service.addRoomPriceToCollectionIfMissing([], roomPrice, roomPrice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(roomPrice);
        expect(expectedResult).toContain(roomPrice2);
      });

      it('should accept null and undefined values', () => {
        const roomPrice: IRoomPrice = sampleWithRequiredData;
        expectedResult = service.addRoomPriceToCollectionIfMissing([], null, roomPrice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(roomPrice);
      });

      it('should return initial array if no RoomPrice is added', () => {
        const roomPriceCollection: IRoomPrice[] = [sampleWithRequiredData];
        expectedResult = service.addRoomPriceToCollectionIfMissing(roomPriceCollection, undefined, null);
        expect(expectedResult).toEqual(roomPriceCollection);
      });
    });

    describe('compareRoomPrice', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRoomPrice(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRoomPrice(entity1, entity2);
        const compareResult2 = service.compareRoomPrice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRoomPrice(entity1, entity2);
        const compareResult2 = service.compareRoomPrice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRoomPrice(entity1, entity2);
        const compareResult2 = service.compareRoomPrice(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
