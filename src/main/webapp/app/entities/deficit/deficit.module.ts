import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DeficitComponent } from './list/deficit.component';
import { DeficitDetailComponent } from './detail/deficit-detail.component';
import { DeficitUpdateComponent } from './update/deficit-update.component';
import { DeficitDeleteDialogComponent } from './delete/deficit-delete-dialog.component';
import { DeficitRoutingModule } from './route/deficit-routing.module';

@NgModule({
  imports: [SharedModule, DeficitRoutingModule],
  declarations: [DeficitComponent, DeficitDetailComponent, DeficitUpdateComponent, DeficitDeleteDialogComponent],
})
export class DeficitModule {}
