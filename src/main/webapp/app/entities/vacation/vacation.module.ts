import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VacationComponent } from './list/vacation.component';
import { VacationDetailComponent } from './detail/vacation-detail.component';
import { VacationUpdateComponent } from './update/vacation-update.component';
import { VacationDeleteDialogComponent } from './delete/vacation-delete-dialog.component';
import { VacationRoutingModule } from './route/vacation-routing.module';
import { VacationApplyCreateComponent } from './vacation-apply-create/vacation-apply-create.component';

@NgModule({
  imports: [SharedModule, VacationRoutingModule],
  declarations: [
    VacationComponent,
    VacationDetailComponent,
    VacationUpdateComponent,
    VacationDeleteDialogComponent,
    VacationApplyCreateComponent,
  ],
})
export class VacationModule {}
