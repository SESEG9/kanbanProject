import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoomPicture, RoomResponse } from '../room.model';
import { RoomPictureService } from '../../room-picture/service/room-picture.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./../room.global.scss', './room-detail.component.scss'],
})
export class RoomDetailComponent implements OnInit, AfterContentChecked {
  room: RoomResponse | null = null;
  roomPictures: RoomPicture[] = [];

  @ViewChild('carousel') carousel: NgbCarousel | undefined;

  constructor(protected activatedRoute: ActivatedRoute, private roomPictureService: RoomPictureService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ room }) => {
      this.room = room;

      if (this.room != null) {
        this.room.pictureIDs.forEach(id => this.roomPictureService.find(id).subscribe({ next: next => this.onPictureFetched(next.body) }));
      }
    });
  }

  ngAfterContentChecked() {
    this.carousel?.pause();
  }

  private onPictureFetched(picture: RoomPicture | null): void {
    if (picture) {
      this.roomPictures.push(picture);
      this.roomPictures.sort((p1, p2) => p1.weight - p2.weight);
    }
  }

  previousState(): void {
    window.history.back();
  }

  reserve(): void {
    console.log('');
    // TODO implement reserve room
  }
}
