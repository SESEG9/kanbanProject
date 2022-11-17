import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GlobalSettingsComponent } from './list/global-settings.component';
import { GlobalSettingsDetailComponent } from './detail/global-settings-detail.component';
import { GlobalSettingsUpdateComponent } from './update/global-settings-update.component';
import { GlobalSettingsDeleteDialogComponent } from './delete/global-settings-delete-dialog.component';
import { GlobalSettingsRoutingModule } from './route/global-settings-routing.module';

@NgModule({
  imports: [SharedModule, GlobalSettingsRoutingModule],
  declarations: [
    GlobalSettingsComponent,
    GlobalSettingsDetailComponent,
    GlobalSettingsUpdateComponent,
    GlobalSettingsDeleteDialogComponent,
  ],
})
export class GlobalSettingsModule {}
