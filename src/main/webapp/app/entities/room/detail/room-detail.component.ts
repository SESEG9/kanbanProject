import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoomResponse } from '../room.model';

@Component({
  selector: 'jhi-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./../room.global.scss', './room-detail.component.scss'],
})
export class RoomDetailComponent implements OnInit {
  room: RoomResponse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ room }) => {
      this.room = room;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
