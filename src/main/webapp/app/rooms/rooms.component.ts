import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-home',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent {

  rooms = [
    {
      id: 1,
      title: 'Luxury Sweet',
      image: 'luxury.jpg',
      price: '379€',
      description: 'Unsere Luxury Sweet im obersten Stockwerk bietet Ihnen ein King-Size Bett, als auch einen Whirlpool zum entspanne. Auf Ihrem großen Balkon haben Sie einen wunderschönen Blick auf das Meer.'
    },
    {
      id: 2,
      title: 'Presidentschal Sweet',
      image: 'presidential.jpg',
      price: '280€',
      description: 'Unsere Presidentschal Sweet bietet Ihnen ein Queen-Size Bett, als auch direkten Blick zum Meer.'
    },
    {
      id: 3,
      title: 'Doppelzimmer Meerblick',
      image: 'dz-sea.jpg',
      price: '140€',
      description: 'Doppelzimmer mit Blick aufs Meer, wo wüst Meer?'
    },
    {
      id: 4,
      title: 'Doppelzimmer ohne Meerblick',
      image: 'dz-no-sea.jpg',
      price: '110€',
      description: 'Doppelzimmer ohne Blick aufs Meer, sicha wüst Meer!'
    },
    {
      id: 5,
      title: 'Einzelzimmer Meerblick',
      image: 'ez-sea.jpg',
      price: '90€',
      description: 'Auweh nur a Einzelzimmer, findest schon noch wen brudi :*'
    }
  ]


  constructor(private router: Router) {}


  bookRoom(room: any): void {
    this.router.navigate(['reservation/' + JSON.stringify(room.id)])
  }
}
