import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RoomComponent } from './list/room.component';
import { RoomDetailComponent } from './detail/room-detail.component';
import { RoomUpdateComponent } from './update/room-update.component';
import { RoomDeleteDialogComponent } from './delete/room-delete-dialog.component';
import { RoomRoutingModule } from './route/room-routing.module';

@NgModule({
  imports: [SharedModule, RoomRoutingModule],
  declarations: [RoomComponent, RoomDetailComponent, RoomUpdateComponent, RoomDeleteDialogComponent],
})
export class RoomModule {}
