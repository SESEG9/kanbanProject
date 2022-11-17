import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VacationComponent } from './list/vacation.component';
import { VacationDetailComponent } from './detail/vacation-detail.component';
import { VacationUpdateComponent } from './update/vacation-update.component';
import { VacationDeleteDialogComponent } from './delete/vacation-delete-dialog.component';
import { VacationRoutingModule } from './route/vacation-routing.module';

@NgModule({
  imports: [SharedModule, VacationRoutingModule],
  declarations: [VacationComponent, VacationDetailComponent, VacationUpdateComponent, VacationDeleteDialogComponent],
})
export class VacationModule {}
