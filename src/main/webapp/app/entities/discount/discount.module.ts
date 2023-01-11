import { NgModule } from '@angular/core';
import { DiscountListComponent } from './list/discount-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { DiscountRoutingModule } from './route/discount-routing.module';
import { DiscountDeleteComponent } from './delete/discount-delete-dialog.component';
import { DiscountUpdateComponent } from './update/discount-update.component';



@NgModule({
  imports: [SharedModule, DiscountRoutingModule],
  declarations: [DiscountListComponent, DiscountDeleteComponent, DiscountUpdateComponent],
})
export class DiscountModule { }
