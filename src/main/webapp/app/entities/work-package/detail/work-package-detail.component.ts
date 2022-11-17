import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkPackage } from '../work-package.model';

@Component({
  selector: 'jhi-work-package-detail',
  templateUrl: './work-package-detail.component.html',
})
export class WorkPackageDetailComponent implements OnInit {
  workPackage: IWorkPackage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workPackage }) => {
      this.workPackage = workPackage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
