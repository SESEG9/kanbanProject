import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoomPicture, RoomPrice, RoomResponse } from '../room.model';
import { RoomPictureService } from '../../room-picture/service/room-picture.service';

@Component({
  selector: 'jhi-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./../room.global.scss', './room-detail.component.scss'],
})
export class RoomDetailComponent implements OnInit {
  room: RoomResponse | null = null;
  selectedPrice: RoomPrice | null = null;
  roomPictures: RoomPicture[] = [];

  constructor(protected activatedRoute: ActivatedRoute, private roomPictureService: RoomPictureService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ room }) => {
      this.room = room;

      if (this.room != null) {
        this.room.pictureIDs.forEach(id => this.roomPictureService.find(id).subscribe({ next: next => this.onPictureFetched(next.body) }));
      }
    });
  }

  private onPictureFetched(picture: RoomPicture | null) {
    if (picture) {
      this.roomPictures.push(picture);
      this.roomPictures.sort((p1, p2) => p1.weight - p2.weight);
    }
  }

  previousState(): void {
    window.history.back();
  }
}
