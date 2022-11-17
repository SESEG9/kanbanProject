import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorkPackageComponent } from './list/work-package.component';
import { WorkPackageDetailComponent } from './detail/work-package-detail.component';
import { WorkPackageUpdateComponent } from './update/work-package-update.component';
import { WorkPackageDeleteDialogComponent } from './delete/work-package-delete-dialog.component';
import { WorkPackageRoutingModule } from './route/work-package-routing.module';

@NgModule({
  imports: [SharedModule, WorkPackageRoutingModule],
  declarations: [WorkPackageComponent, WorkPackageDetailComponent, WorkPackageUpdateComponent, WorkPackageDeleteDialogComponent],
})
export class WorkPackageModule {}
