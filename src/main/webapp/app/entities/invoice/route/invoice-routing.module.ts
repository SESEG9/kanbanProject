import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InvoiceComponent } from '../list/invoice.component';
import { InvoiceDetailComponent } from '../detail/invoice-detail.component';
import { InvoiceUpdateComponent } from '../update/invoice-update.component';
import { InvoiceRoutingResolveService } from './invoice-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const invoiceRoute: Routes = [
  {
    path: '',
    component: InvoiceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InvoiceDetailComponent,
    resolve: {
      invoice: InvoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InvoiceUpdateComponent,
    resolve: {
      invoice: InvoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InvoiceUpdateComponent,
    resolve: {
      invoice: InvoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(invoiceRoute)],
  exports: [RouterModule],
})
export class InvoiceRoutingModule {}
