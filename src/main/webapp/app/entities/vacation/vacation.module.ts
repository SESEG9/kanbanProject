import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VacationComponent } from './list/vacation.component';
import { VacationRejectDialogComponent } from './dialog-reject/vacation-reject-dialog.component';
import { VacationRoutingModule } from './route/vacation-routing.module';
import { VacationApplyCreateComponent } from './vacation-apply-create/vacation-apply-create.component';
import { VacationStatePipePipe } from './vacation-apply-create/vacation-state-pipe.pipe';
import { VacationApplyCheckComponent } from './vacation-apply-check/vacation-apply-check.component';
import { VacationApproveDialogComponent } from './dialog-approve/vacation-approve-dialog.component';
import { OverlappingsPipe } from './vacation-apply-check/overlappings.pipe';

@NgModule({
  imports: [SharedModule, VacationRoutingModule],
  declarations: [
    VacationComponent,
    VacationRejectDialogComponent,
    VacationApproveDialogComponent,
    VacationApplyCreateComponent,
    VacationStatePipePipe,
    VacationApplyCheckComponent,
    OverlappingsPipe,
  ],
})
export class VacationModule {}
