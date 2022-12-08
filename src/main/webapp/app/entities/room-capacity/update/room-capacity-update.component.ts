import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { RoomCapacityFormGroup, RoomCapacityFormService } from './room-capacity-form.service';
import { IRoomCapacity } from '../room-capacity.model';
import { RoomCapacityService } from '../service/room-capacity.service';

@Component({
  selector: 'jhi-room-capacity-update',
  templateUrl: './room-capacity-update.component.html',
  styleUrls: ['../room-capacity.global.scss'],
})
export class RoomCapacityUpdateComponent implements OnInit {
  isSaving = false;
  roomCapacity: IRoomCapacity | null = null;

  editForm: RoomCapacityFormGroup = this.roomCapacityFormService.createRoomCapacityFormGroup();

  constructor(
    protected roomCapacityService: RoomCapacityService,
    protected roomCapacityFormService: RoomCapacityFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roomCapacity }) => {
      this.roomCapacity = roomCapacity;
      if (roomCapacity) {
        this.updateForm(roomCapacity);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const roomCapacity = this.roomCapacityFormService.getRoomCapacity(this.editForm);
    if (roomCapacity.id !== null) {
      this.subscribeToSaveResponse(this.roomCapacityService.update(roomCapacity));
    } else {
      this.subscribeToSaveResponse(this.roomCapacityService.create(roomCapacity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoomCapacity>>): void {
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

  protected updateForm(roomCapacity: IRoomCapacity): void {
    this.roomCapacity = roomCapacity;
    this.roomCapacityFormService.resetForm(this.editForm, roomCapacity);
  }
}
