import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { LANGUAGES } from 'app/config/language.constants';
import { IUser } from '../user-management.model';
import { UserManagementService } from '../service/user-management.service';
import { HumanResourceType } from '../../../entities/enumerations/human-resource-type.model';
import { Gender } from '../../../entities/enumerations/gender.model';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const userTemplate = { langKey: 'de' } as IUser;

const newUser: IUser = {
  langKey: 'de',
  activated: true,
} as IUser;

function ngbDateStructToNullableString(date: NgbDateStruct): string | null {
  if (date.day < 0 || date.month < 0 || date.year < 0) {
    return null;
  }
  return (
    ('0000' + date.year.toString()).slice(-4) + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2)
  );
}

function nullableStringToNgbDateStruct(value: string | null): NgbDateStruct {
  if (!value) {
    return { year: -1, month: -1, day: -1 };
  }
  const parts = value.split('-');
  if (parts.length !== 3) {
    return { year: -1, month: -1, day: -1 };
  }
  return { year: parseInt(parts[0]), month: parseInt(parts[1]), day: parseInt(parts[2]) };
}

@Injectable()
export class CustomDateAdapter {
  fromModel(value: string | null): NgbDateStruct {
    return nullableStringToNgbDateStruct(value);
  }

  toModel(date: NgbDateStruct): string | null {
    return ngbDateStructToNullableString(date);
  }
}

@Injectable()
export class CustomDateParser {
  parse(value: string | null): NgbDateStruct {
    return nullableStringToNgbDateStruct(value);
  }

  format(date: NgbDateStruct): string | null {
    return ngbDateStructToNullableString(date);
  }
}

@Component({
  selector: 'jhi-user-mgmt-update',
  templateUrl: './user-management-update.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParser },
  ],
})
export class UserManagementUpdateComponent implements OnInit {
  languages = LANGUAGES;
  authorities: string[] = [];
  genders: string[] = [];
  types: string[] = [];
  isSaving = false;

  editForm = new FormGroup({
    id: new FormControl(userTemplate.id),
    login: new FormControl(userTemplate.login, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    firstName: new FormControl(userTemplate.firstName, {
      validators: [Validators.maxLength(50), Validators.required],
    }),
    lastName: new FormControl(userTemplate.lastName, {
      validators: [Validators.maxLength(50), Validators.required],
    }),
    email: new FormControl(userTemplate.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    activated: new FormControl(userTemplate.activated, { nonNullable: true }),
    langKey: new FormControl(userTemplate.langKey, { nonNullable: true }),
    authorities: new FormControl(userTemplate.authorities, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    gender: new FormControl(userTemplate.gender, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl(userTemplate.type, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birthday: new FormControl(userTemplate.birthday, { nonNullable: true }),
    phone: new FormControl(userTemplate.phone, { nonNullable: true }),
    ssn: new FormControl(userTemplate.ssn, { nonNullable: true }),
    banking: new FormControl(userTemplate.banking, { nonNullable: true }),
    address: new FormControl(userTemplate.address, { nonNullable: true }),
  });

  constructor(private userService: UserManagementService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      if (user) {
        this.editForm.reset(user);
      } else {
        this.editForm.reset(newUser);
      }
    });
    this.userService.authorities().subscribe(authorities => (this.authorities = authorities));
    this.types = Object.keys(HumanResourceType);
    this.genders = Object.keys(Gender);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const user = this.editForm.getRawValue();
    if (user.id !== null) {
      this.userService.update(user).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      });
    } else {
      this.userService.create(user).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      });
    }
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError(): void {
    this.isSaving = false;
  }
}
