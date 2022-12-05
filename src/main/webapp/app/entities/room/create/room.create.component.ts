import { Component, OnInit } from '@angular/core';
import { IRoomCapacity } from '../../room-capacity/room-capacity.model';
import { EntityArrayResponseType, RoomCapacityService } from '../../room-capacity/service/room-capacity.service';
import { Room, RoomPicture, RoomPrice } from '../room.model';
import { RoomService } from '../service/room.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-create',
  templateUrl: './room.create.component.html',
  styleUrls: ['./room.create.component.scss'],
})
export class RoomCreateComponent implements OnInit {
  constructor(private roomCapacityService: RoomCapacityService, private roomService: RoomService, private modalService: NgbModal) {}

  prices: (RoomPrice & { capacityError: string; priceError: string })[] = [
    { id: null, capacity: undefined, price: 0, capacityError: '', priceError: '' },
  ];

  capacities: IRoomCapacity[] = [];

  images: File[] = [];
  imageAsBase64: RoomPicture[] = [];

  maxWeight: number = 0;

  maxCapacity: number | null = 1;
  identifier: string = '';

  ngOnInit(): void {
    this.loadRoomCapacity();
  }

  private loadRoomCapacity() {
    this.roomCapacityService.query().subscribe((next: EntityArrayResponseType) => (this.capacities = next.body!!));
  }

  addNewPrice() {
    this.prices.push({ id: null, capacity: undefined, price: 0, capacityError: '', priceError: '' });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        this.imageAsBase64.push({ picture: reader.result, description: '', weight: this.maxWeight++, id: null });
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

  private isFormValid(): boolean {
    return (
      this.validateIdentifier(this.identifier) &&
      this.validateMaxCapacity(this.maxCapacity) &&
      this.prices.every(p => this.validatePrice(p)) &&
      this.prices.every(p => this.validatePriceCapacity(p))
    );
  }

  validateIdentifier(identifier: string): boolean {
    return identifier.length > 0;
  }

  validateMaxCapacity(maxCapacity: number | null): boolean {
    return maxCapacity != null && maxCapacity >= 1 && Math.trunc(maxCapacity) == maxCapacity;
  }

  validatePrice(price: RoomPrice & { priceError: string }): boolean {
    if (price.price <= 0) {
      price.priceError = 'Preis muss größer 0 sein!';
      return false;
    } else {
      price.priceError = '';
      return true;
    }
  }

  validatePriceCapacity(price: RoomPrice & { capacityError: string }): boolean {
    if (price.capacity?.capacity == undefined) {
      price.capacityError = 'Belegung wählen!';
      return false;
    } else if (this.maxCapacity != null && price.capacity.capacity > this.maxCapacity) {
      price.capacityError = 'Belegung zu groß für Maximalkapazität!';
      return false;
    } else if (this.prices.filter(p => p.capacity != null).filter(p => p.capacity?.id == price.capacity?.id).length > 1) {
      price.capacityError = 'Belegung darf nur einmal gewählt werden!';
      return false;
    } else {
      price.capacityError = '';
      return true;
    }
  }

  submitRoom() {
    if (this.isFormValid()) {
      const room: Room = {
        id: null,
        maxCapacity: this.maxCapacity,
        identifyer: this.identifier,
        prices: this.prices,
        roomPictures: this.imageAsBase64,
      };
      this.roomService.create(room).subscribe({
        next: next => console.log(next),
        error: error => {},
      });
    }
  }
}
