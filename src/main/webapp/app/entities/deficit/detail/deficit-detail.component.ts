import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDeficit } from '../deficit.model';

@Component({
  selector: 'jhi-deficit-detail',
  templateUrl: './deficit-detail.component.html',
})
export class DeficitDetailComponent implements OnInit {
  deficit: IDeficit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deficit }) => {
      this.deficit = deficit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
