import { NgModule } from '@angular/core';
import { RoomsComponent } from './rooms.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild([{ path: '', component: RoomsComponent }])],
  declarations: [RoomsComponent],
})
export class RoomsModule {}
