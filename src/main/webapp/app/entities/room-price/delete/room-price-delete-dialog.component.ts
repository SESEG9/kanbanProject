import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoomPrice } from '../room-price.model';
import { RoomPriceService } from '../service/room-price.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './room-price-delete-dialog.component.html',
})
export class RoomPriceDeleteDialogComponent {
  roomPrice?: IRoomPrice;

  constructor(protected roomPriceService: RoomPriceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.roomPriceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
