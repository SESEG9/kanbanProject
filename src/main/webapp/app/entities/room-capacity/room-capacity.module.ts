import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RoomCapacityComponent } from './list/room-capacity.component';
import { RoomCapacityDetailComponent } from './detail/room-capacity-detail.component';
import { RoomCapacityUpdateComponent } from './update/room-capacity-update.component';
import { RoomCapacityDeleteDialogComponent } from './delete/room-capacity-delete-dialog.component';
import { RoomCapacityRoutingModule } from './route/room-capacity-routing.module';

@NgModule({
  imports: [SharedModule, RoomCapacityRoutingModule],
  declarations: [RoomCapacityComponent, RoomCapacityDetailComponent, RoomCapacityUpdateComponent, RoomCapacityDeleteDialogComponent],
})
export class RoomCapacityModule {}
