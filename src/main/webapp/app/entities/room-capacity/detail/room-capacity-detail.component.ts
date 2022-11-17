import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoomCapacity } from '../room-capacity.model';

@Component({
  selector: 'jhi-room-capacity-detail',
  templateUrl: './room-capacity-detail.component.html',
})
export class RoomCapacityDetailComponent implements OnInit {
  roomCapacity: IRoomCapacity | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roomCapacity }) => {
      this.roomCapacity = roomCapacity;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
