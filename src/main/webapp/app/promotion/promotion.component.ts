import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent {

  constructor(
    private router: Router
  ) { }


  // routeToReservation(promo: string): void {
  //   this.router.navigateByUrl('/reservation/new', { state: { promo } });
  // }
}
