import { AfterContentInit, Component, OnInit } from '@angular/core';
import { IRoomCapacity } from '../../room-capacity/room-capacity.model';
import { EntityArrayResponseType, RoomCapacityService } from '../../room-capacity/service/room-capacity.service';
import { IRoom, Room, RoomPicture, RoomPrice } from '../room.model';
import { RoomService } from '../service/room.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../core/util/alert.service';

@Component({
  selector: 'jhi-create',
  templateUrl: './room.create.component.html',
  styleUrls: ['./room.create.component.scss'],
})
export class RoomCreateComponent implements OnInit, AfterContentInit {
  constructor(
    private roomCapacityService: RoomCapacityService,
    private roomService: RoomService,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {}

  prices: (RoomPrice & { capacityError: string; priceError: string })[] = [
    { id: null, capacity: undefined, price: 0, capacityError: '', priceError: '' },
  ];

  capacities: IRoomCapacity[] = [];

  images: File[] = [];
  imageAsBase64: RoomPicture[] = [];

  maxWeight: number = 0;

  maxCapacity: number | null = 1;
  maxCapacityError: string = '';
  identifier: string = '';
  identifierError: string = '';
  identifierChecked: { check: boolean; error: boolean } = { check: false, error: false };

  ngOnInit(): void {
    this.loadRoomCapacity();
  }

  ngAfterContentInit(): void {
    this.checkIdentifier();
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
      this.prices.every(p => this.validatePriceCapacity(p)) &&
      !this.identifierChecked.error
    );
  }

  validateIdentifier(identifier: string): boolean {
    if (identifier.length <= 0) {
      this.identifierError = 'Darf nicht leer sein!';
      this.identifierChecked = { error: false, check: false };
      return false;
    } else {
      if (!this.identifierChecked.error) {
        this.identifierError = '';
      }
      return true;
    }
  }

  validateMaxCapacity(maxCapacity: number | null): boolean {
    if (maxCapacity == null || maxCapacity < 1) {
      this.maxCapacityError = 'Maximalbelegung muss mindestens 1 sein!';
      return false;
    } else if (Math.trunc(maxCapacity) != maxCapacity) {
      this.maxCapacityError = 'Maximalbelegung muss eine Ganzzahl sein!';
      return false;
    } else {
      this.maxCapacityError = '';
      return true;
    }
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
        prices: this.getAdjustedPrices(this.prices),
        roomPictures: this.imageAsBase64,
      };
      this.roomService.create(room).subscribe({
        next: next => {
          this.alertService.addAlert({
            type: 'success',
            message: 'Zimmer erfolgreich erstellt!',
            timeout: 2000,
          });
        },
        error: error => {
          this.alertService.addAlert({ type: 'danger', message: 'Ein Fehler ist aufgetreten!', timeout: 2000 });
        },
      });
    } else {
      this.alertService.addAlert({ type: 'danger', message: 'Fehlerhafte Felder gefunden!', timeout: 2000 });
    }
  }
  private getAdjustedPrices(prices: RoomPrice[]): RoomPrice[] {
    return prices.map(price => {
      const p = { ...price };
      p.price = Math.round(p.price * 100);
      return price;
    });
  }

  checkIdentifier() {
    if (this.identifierError.length == 0 || this.identifierChecked.error) {
      this.identifierChecked.check = false;
      this.roomService.query({ identifyer: this.identifier }).subscribe({
        next: next => this.checkIdentifierResponse(next.body),
      });
    }
  }

  private checkIdentifierResponse(rooms: IRoom[] | null) {
    if (rooms != null && rooms.filter(r => r.identifyer == this.identifier).length > 0) {
      this.identifierChecked = { error: true, check: false };
      this.identifierError = 'Zimmernummer existiert bereits!';
    } else {
      this.identifierChecked = { error: false, check: true };
      this.identifierError = '';
    }
  }
}
