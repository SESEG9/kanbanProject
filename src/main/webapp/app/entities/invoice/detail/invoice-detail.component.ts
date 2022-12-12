import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInvoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';

@Component({
  selector: 'jhi-invoice-detail',
  templateUrl: './invoice-detail.component.html',
})
export class InvoiceDetailComponent implements OnInit {
  invoice: IInvoice | null = null;

  constructor(protected activatedRoute: ActivatedRoute, protected invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoice }) => {
      this.invoice = invoice;
    });
  }

  getInvoicePdfUrl(): string {
    if (this.invoice) {
      return this.invoiceService.getInvoicePdfUrl(this.invoice.id);
    }
    return '#';
  }

  previousState(): void {
    window.history.back();
  }
}
