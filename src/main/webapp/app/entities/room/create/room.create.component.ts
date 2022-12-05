import { Component, OnInit } from '@angular/core';
import { IRoomCapacity } from '../../room-capacity/room-capacity.model';
import { EntityArrayResponseType, RoomCapacityService } from '../../room-capacity/service/room-capacity.service';

@Component({
  selector: 'jhi-create',
  templateUrl: './room.create.component.html',
  styleUrls: ['./room.create.component.scss'],
})
export class RoomCreateComponent implements OnInit {
  constructor(private roomCapacityService: RoomCapacityService) {}

  prices: { capacity: IRoomCapacity | undefined; price: number }[] = [{ capacity: undefined, price: 0 }];

  capacities: IRoomCapacity[] = [];

  images: File[] = [];
  imageAsBase64: { base64: string; description: string; weight: number }[] = [];

  maxWeight: number = 0;

  maxCapacity: number | null = null;
  identifier: string = '';

  ngOnInit(): void {
    this.loadRoomCapacity();
  }

  private loadRoomCapacity() {
    this.roomCapacityService.query().subscribe((next: EntityArrayResponseType) => (this.capacities = next.body!!));
  }

  addNewPrice() {
    this.prices.push({ capacity: undefined, price: 0 });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        this.imageAsBase64.push({ base64: reader.result, description: '', weight: this.maxWeight++ });
      }
    };

    reader.readAsDataURL(files[0]);

    Array.from(files)
      .filter(f => f !== null)
      .forEach(f => this.images.push(f));
  }

  removePriceItem(index: number) {
    this.prices.splice(index, 1);
  }

  removePicture(index: number) {
    this.imageAsBase64.splice(index, 1);
  }

  submitRoom() {}
}
