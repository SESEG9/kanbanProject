import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VacationComponent } from './list/vacation.component';
import { VacationDetailComponent } from './detail/vacation-detail.component';
import { VacationUpdateComponent } from './update/vacation-update.component';
import { VacationDeleteDialogComponent } from './delete/vacation-delete-dialog.component';
import { VacationRoutingModule } from './route/vacation-routing.module';
import { VacationApplyCreateComponent } from './vacation-apply-create/vacation-apply-create.component';
import { VacationStatePipePipe } from './vacation-apply-create/vacation-state-pipe.pipe';
import { VacationApplyCheckComponent } from './vacation-apply-check/vacation-apply-check.component';

@NgModule({
  imports: [SharedModule, VacationRoutingModule],
  declarations: [
    VacationComponent,
    VacationDetailComponent,
    VacationUpdateComponent,
    VacationDeleteDialogComponent,
    VacationApplyCreateComponent,
    VacationStatePipePipe,
    VacationApplyCheckComponent,
  ],
})
export class VacationModule {}
