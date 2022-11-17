import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RoomPriceFormService, RoomPriceFormGroup } from './room-price-form.service';
import { IRoomPrice } from '../room-price.model';
import { RoomPriceService } from '../service/room-price.service';
import { IRoomCapacity } from 'app/entities/room-capacity/room-capacity.model';
import { RoomCapacityService } from 'app/entities/room-capacity/service/room-capacity.service';
import { IRoom } from 'app/entities/room/room.model';
import { RoomService } from 'app/entities/room/service/room.service';

@Component({
  selector: 'jhi-room-price-update',
  templateUrl: './room-price-update.component.html',
})
export class RoomPriceUpdateComponent implements OnInit {
  isSaving = false;
  roomPrice: IRoomPrice | null = null;

  roomCapacitiesSharedCollection: IRoomCapacity[] = [];
  roomsSharedCollection: IRoom[] = [];

  editForm: RoomPriceFormGroup = this.roomPriceFormService.createRoomPriceFormGroup();

  constructor(
    protected roomPriceService: RoomPriceService,
    protected roomPriceFormService: RoomPriceFormService,
    protected roomCapacityService: RoomCapacityService,
    protected roomService: RoomService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRoomCapacity = (o1: IRoomCapacity | null, o2: IRoomCapacity | null): boolean =>
    this.roomCapacityService.compareRoomCapacity(o1, o2);

  compareRoom = (o1: IRoom | null, o2: IRoom | null): boolean => this.roomService.compareRoom(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roomPrice }) => {
      this.roomPrice = roomPrice;
      if (roomPrice) {
        this.updateForm(roomPrice);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const roomPrice = this.roomPriceFormService.getRoomPrice(this.editForm);
    if (roomPrice.id !== null) {
      this.subscribeToSaveResponse(this.roomPriceService.update(roomPrice));
    } else {
      this.subscribeToSaveResponse(this.roomPriceService.create(roomPrice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoomPrice>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(roomPrice: IRoomPrice): void {
    this.roomPrice = roomPrice;
    this.roomPriceFormService.resetForm(this.editForm, roomPrice);

    this.roomCapacitiesSharedCollection = this.roomCapacityService.addRoomCapacityToCollectionIfMissing<IRoomCapacity>(
      this.roomCapacitiesSharedCollection,
      roomPrice.capacity
    );
    this.roomsSharedCollection = this.roomService.addRoomToCollectionIfMissing<IRoom>(this.roomsSharedCollection, roomPrice.room);
  }

  protected loadRelationshipsOptions(): void {
    this.roomCapacityService
      .query()
      .pipe(map((res: HttpResponse<IRoomCapacity[]>) => res.body ?? []))
      .pipe(
        map((roomCapacities: IRoomCapacity[]) =>
          this.roomCapacityService.addRoomCapacityToCollectionIfMissing<IRoomCapacity>(roomCapacities, this.roomPrice?.capacity)
        )
      )
      .subscribe((roomCapacities: IRoomCapacity[]) => (this.roomCapacitiesSharedCollection = roomCapacities));

    this.roomService
      .query()
      .pipe(map((res: HttpResponse<IRoom[]>) => res.body ?? []))
      .pipe(map((rooms: IRoom[]) => this.roomService.addRoomToCollectionIfMissing<IRoom>(rooms, this.roomPrice?.room)))
      .subscribe((rooms: IRoom[]) => (this.roomsSharedCollection = rooms));
  }
}
