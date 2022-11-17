import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGlobalSettings } from '../global-settings.model';

@Component({
  selector: 'jhi-global-settings-detail',
  templateUrl: './global-settings-detail.component.html',
})
export class GlobalSettingsDetailComponent implements OnInit {
  globalSettings: IGlobalSettings | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ globalSettings }) => {
      this.globalSettings = globalSettings;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
