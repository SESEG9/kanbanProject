import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHumanResource } from '../human-resource.model';

@Component({
  selector: 'jhi-human-resource-detail',
  templateUrl: './human-resource-detail.component.html',
})
export class HumanResourceDetailComponent implements OnInit {
  humanResource: IHumanResource | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ humanResource }) => {
      this.humanResource = humanResource;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
