import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RoomPriceComponent } from './list/room-price.component';
import { RoomPriceDetailComponent } from './detail/room-price-detail.component';
import { RoomPriceUpdateComponent } from './update/room-price-update.component';
import { RoomPriceDeleteDialogComponent } from './delete/room-price-delete-dialog.component';
import { RoomPriceRoutingModule } from './route/room-price-routing.module';

@NgModule({
  imports: [SharedModule, RoomPriceRoutingModule],
  declarations: [RoomPriceComponent, RoomPriceDetailComponent, RoomPriceUpdateComponent, RoomPriceDeleteDialogComponent],
})
export class RoomPriceModule {}
