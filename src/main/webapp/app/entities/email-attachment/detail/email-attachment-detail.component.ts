import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmailAttachment } from '../email-attachment.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-email-attachment-detail',
  templateUrl: './email-attachment-detail.component.html',
})
export class EmailAttachmentDetailComponent implements OnInit {
  emailAttachment: IEmailAttachment | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emailAttachment }) => {
      this.emailAttachment = emailAttachment;
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
