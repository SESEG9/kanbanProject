import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRoom } from '../room.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../room.test-samples';

import { RoomService } from './room.service';

const requireRestSample: IRoom = {
  ...sampleWithRequiredData,
};

describe('Room Service', () => {
  let service: RoomService;
  let httpMock: HttpTestingController;
  let expectedResult: IRoom | IRoom[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RoomService);
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

    it('should create a Room', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const room = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(room).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Room', () => {
      const room = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(room).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Room', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Room', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Room', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRoomToCollectionIfMissing', () => {
      it('should add a Room to an empty array', () => {
        const room: IRoom = sampleWithRequiredData;
        expectedResult = service.addRoomToCollectionIfMissing([], room);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(room);
      });

      it('should not add a Room to an array that contains it', () => {
        const room: IRoom = sampleWithRequiredData;
        const roomCollection: IRoom[] = [
          {
            ...room,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRoomToCollectionIfMissing(roomCollection, room);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Room to an array that doesn't contain it", () => {
        const room: IRoom = sampleWithRequiredData;
        const roomCollection: IRoom[] = [sampleWithPartialData];
        expectedResult = service.addRoomToCollectionIfMissing(roomCollection, room);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(room);
      });

      it('should add only unique Room to an array', () => {
        const roomArray: IRoom[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const roomCollection: IRoom[] = [sampleWithRequiredData];
        expectedResult = service.addRoomToCollectionIfMissing(roomCollection, ...roomArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const room: IRoom = sampleWithRequiredData;
        const room2: IRoom = sampleWithPartialData;
        expectedResult = service.addRoomToCollectionIfMissing([], room, room2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(room);
        expect(expectedResult).toContain(room2);
      });

      it('should accept null and undefined values', () => {
        const room: IRoom = sampleWithRequiredData;
        expectedResult = service.addRoomToCollectionIfMissing([], null, room, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(room);
      });

      it('should return initial array if no Room is added', () => {
        const roomCollection: IRoom[] = [sampleWithRequiredData];
        expectedResult = service.addRoomToCollectionIfMissing(roomCollection, undefined, null);
        expect(expectedResult).toEqual(roomCollection);
      });
    });

    describe('compareRoom', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRoom(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRoom(entity1, entity2);
        const compareResult2 = service.compareRoom(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRoom(entity1, entity2);
        const compareResult2 = service.compareRoom(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRoom(entity1, entity2);
        const compareResult2 = service.compareRoom(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
