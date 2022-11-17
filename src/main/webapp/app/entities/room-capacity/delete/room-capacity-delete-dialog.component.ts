import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoomCapacity } from '../room-capacity.model';
import { RoomCapacityService } from '../service/room-capacity.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './room-capacity-delete-dialog.component.html',
})
export class RoomCapacityDeleteDialogComponent {
  roomCapacity?: IRoomCapacity;

  constructor(protected roomCapacityService: RoomCapacityService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.roomCapacityService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
