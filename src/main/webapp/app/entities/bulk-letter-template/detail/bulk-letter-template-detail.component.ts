import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBulkLetterTemplate } from '../bulk-letter-template.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-bulk-letter-template-detail',
  templateUrl: './bulk-letter-template-detail.component.html',
})
export class BulkLetterTemplateDetailComponent implements OnInit {
  bulkLetterTemplate: IBulkLetterTemplate | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bulkLetterTemplate }) => {
      this.bulkLetterTemplate = bulkLetterTemplate;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
