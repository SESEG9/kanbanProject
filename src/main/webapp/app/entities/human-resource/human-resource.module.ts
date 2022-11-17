import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HumanResourceComponent } from './list/human-resource.component';
import { HumanResourceDetailComponent } from './detail/human-resource-detail.component';
import { HumanResourceUpdateComponent } from './update/human-resource-update.component';
import { HumanResourceDeleteDialogComponent } from './delete/human-resource-delete-dialog.component';
import { HumanResourceRoutingModule } from './route/human-resource-routing.module';

@NgModule({
  imports: [SharedModule, HumanResourceRoutingModule],
  declarations: [HumanResourceComponent, HumanResourceDetailComponent, HumanResourceUpdateComponent, HumanResourceDeleteDialogComponent],
})
export class HumanResourceModule {}
