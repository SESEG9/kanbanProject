import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoomPrice } from '../room-price.model';

@Component({
  selector: 'jhi-room-price-detail',
  templateUrl: './room-price-detail.component.html',
})
export class RoomPriceDetailComponent implements OnInit {
  roomPrice: IRoomPrice | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roomPrice }) => {
      this.roomPrice = roomPrice;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
