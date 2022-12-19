import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'customer',
        data: { pageTitle: 'lionhotelApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'discount',
        data: { pageTitle: 'lionhotelApp.discount.home.title' },
        loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule),
      },
      {
        path: 'room',
        data: { pageTitle: 'lionhotelApp.room.home.title' },
        loadChildren: () => import('./room/room.module').then(m => m.RoomModule),
      },
      {
        path: 'room-capacity',
        data: { pageTitle: 'lionhotelApp.roomCapacity.home.title' },
        loadChildren: () => import('./room-capacity/room-capacity.module').then(m => m.RoomCapacityModule),
      },
      {
        path: 'room-price',
        data: { pageTitle: 'lionhotelApp.roomPrice.home.title' },
        loadChildren: () => import('./room-price/room-price.module').then(m => m.RoomPriceModule),
      },
      {
        path: 'booking',
        data: { pageTitle: 'lionhotelApp.booking.home.title' },
        loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
      },
      {
        path: 'invoice',
        data: { pageTitle: 'lionhotelApp.invoice.home.title' },
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule),
      },
      {
        path: 'global-settings',
        data: { pageTitle: 'lionhotelApp.globalSettings.home.title' },
        loadChildren: () => import('./global-settings/global-settings.module').then(m => m.GlobalSettingsModule),
      },
      {
        path: 'deficit',
        data: { pageTitle: 'lionhotelApp.deficit.home.title' },
        loadChildren: () => import('./deficit/deficit.module').then(m => m.DeficitModule),
      },
      {
        path: 'human-resource',
        data: { pageTitle: 'lionhotelApp.humanResource.home.title' },
        loadChildren: () => import('./human-resource/human-resource.module').then(m => m.HumanResourceModule),
      },
      {
        path: 'work-package',
        data: { pageTitle: 'lionhotelApp.workPackage.home.title' },
        loadChildren: () => import('./work-package/work-package.module').then(m => m.WorkPackageModule),
      },
      {
        path: 'vacation',
        data: { pageTitle: 'lionhotelApp.vacation.home.title' },
        loadChildren: () => import('./vacation/vacation.module').then(m => m.VacationModule),
      },
      {
        path: 'bulk-letter-template',
        data: { pageTitle: 'lionhotelApp.bulkLetterTemplate.home.title' },
        loadChildren: () => import('./bulk-letter-template/bulk-letter-template.module').then(m => m.BulkLetterTemplateModule),
      },
      {
        path: 'email-attachment',
        data: { pageTitle: 'lionhotelApp.emailAttachment.home.title' },
        loadChildren: () => import('./email-attachment/email-attachment.module').then(m => m.EmailAttachmentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
