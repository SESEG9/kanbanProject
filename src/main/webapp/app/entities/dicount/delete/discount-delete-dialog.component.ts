import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { DiscountService } from '../service/discount.service';
import { IDiscount } from '../type/discount';

@Component({
  templateUrl: './discount-delete-dialog.component.html',
})
export class DiscountDeleteComponent {
  discount?: IDiscount;

  constructor(protected discountService: DiscountService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(discountCode: string): void {
    this.discountService.delete(discountCode).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
