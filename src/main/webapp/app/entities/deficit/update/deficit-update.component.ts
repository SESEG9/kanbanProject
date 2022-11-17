import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DeficitFormService, DeficitFormGroup } from './deficit-form.service';
import { IDeficit } from '../deficit.model';
import { DeficitService } from '../service/deficit.service';
import { IRoom } from 'app/entities/room/room.model';
import { RoomService } from 'app/entities/room/service/room.service';
import { DeficitState } from 'app/entities/enumerations/deficit-state.model';

@Component({
  selector: 'jhi-deficit-update',
  templateUrl: './deficit-update.component.html',
})
export class DeficitUpdateComponent implements OnInit {
  isSaving = false;
  deficit: IDeficit | null = null;
  deficitStateValues = Object.keys(DeficitState);

  roomsSharedCollection: IRoom[] = [];

  editForm: DeficitFormGroup = this.deficitFormService.createDeficitFormGroup();

  constructor(
    protected deficitService: DeficitService,
    protected deficitFormService: DeficitFormService,
    protected roomService: RoomService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRoom = (o1: IRoom | null, o2: IRoom | null): boolean => this.roomService.compareRoom(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deficit }) => {
      this.deficit = deficit;
      if (deficit) {
        this.updateForm(deficit);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const deficit = this.deficitFormService.getDeficit(this.editForm);
    if (deficit.id !== null) {
      this.subscribeToSaveResponse(this.deficitService.update(deficit));
    } else {
      this.subscribeToSaveResponse(this.deficitService.create(deficit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDeficit>>): void {
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

  protected updateForm(deficit: IDeficit): void {
    this.deficit = deficit;
    this.deficitFormService.resetForm(this.editForm, deficit);

    this.roomsSharedCollection = this.roomService.addRoomToCollectionIfMissing<IRoom>(this.roomsSharedCollection, deficit.room);
  }

  protected loadRelationshipsOptions(): void {
    this.roomService
      .query()
      .pipe(map((res: HttpResponse<IRoom[]>) => res.body ?? []))
      .pipe(map((rooms: IRoom[]) => this.roomService.addRoomToCollectionIfMissing<IRoom>(rooms, this.deficit?.room)))
      .subscribe((rooms: IRoom[]) => (this.roomsSharedCollection = rooms));
  }
}
