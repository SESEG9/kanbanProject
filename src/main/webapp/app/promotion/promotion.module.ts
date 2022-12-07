import { NgModule } from '@angular/core';
import { PromotionComponent } from './promotion.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [PromotionComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: PromotionComponent,
      },
    ]),
  ],
})
export class PromotionModule {}
