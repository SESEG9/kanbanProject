import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkSchedulingComponent } from './work-scheduling.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [WorkSchedulingComponent],
  imports: [CommonModule, FullCalendarModule, SharedModule, RouterModule.forChild([{ path: '', component: WorkSchedulingComponent }])],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WorkSchedulingModule {}
