/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { formatDate } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, Calendar, EventApi, EventClickArg } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AccountService } from 'app/core/auth/account.service';
import { HumanResourceType } from 'app/entities/enumerations/human-resource-type.model';
import { Employee } from './types/employee';
import { WorkSchedule } from './types/work.schedule';
import { WorkSchedulingService } from './work-scheduling.service';

@Component({
  selector: 'jhi-work-scheduling',
  templateUrl: './work-scheduling.component.html',
  styleUrls: ['./work-scheduling.component.scss'],
})
export class WorkSchedulingComponent implements OnInit, AfterViewInit {
  form = new FormGroup({
    type: new FormControl(''),
    shiftType: new FormControl('', [Validators.required]),
    employee: new FormControl(-1, [Validators.required]),
    date: new FormControl(new Date(), [Validators.required]),
  });

  calendarApi!: Calendar;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent | undefined;

  error = false;
  errorMessage = '';

  types = Object.keys(HumanResourceType);

  users: Employee[] = [];
  currentEvent?: EventApi;

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin],
    height: 'auto',
    allDaySlot: true,
    firstDay: 1,
    locale: 'de-AT',
    contentHeight: 'auto',
    slotDuration: '02:00:00',
    datesSet: () => this.updateEvents(),
    eventClick: event => this.eventClick(event),
  };

  clearCalendar(): void {
    this.calendarApi?.getEvents().forEach(event => event.remove());
  }

  getWorkdays(): string[] {
    const workDays = [];
    if (this.calendarApi !== undefined) {
      const dateDiffInDays = this.dateDiffInDays(this.calendarApi.view.currentStart, this.calendarApi.view.currentEnd);
      const date = this.calendarApi.view.currentStart;
      workDays.push(formatDate(date, 'yyyy-MM-dd', 'en-US'));
      for (let i = 0; i < dateDiffInDays; i++) {
        date.setDate(date.getDate() + 1);
        workDays.push(formatDate(date, 'yyyy-MM-dd', 'en-US'));
      }
    } else {
      const date1 = new Date();
      const date2 = new Date();
      workDays.push(formatDate(date1, 'yyyy-MM-dd', 'en-US'));
      for (let i = 0; i < date1.getDay() - 1; i++) {
        date1.setDate(date1.getDate() - 1);
        workDays.push(formatDate(date1, 'yyyy-MM-dd', 'en-US'));
      }
      for (let i = 0; i < 6 - date2.getDay(); i++) {
        date2.setDate(date2.getDate() + 1);
        workDays.push(formatDate(date2, 'yyyy-MM-dd', 'en-US'));
      }
    }
    return workDays;
  }

  updateEvents(userIds: number[] = []): void {
    if (!this.$accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
      this.loadMySchedule();
    } else if (this.form.controls['type'].valid && this.form.controls['employee'].valid) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (userIds.length > 0 || this.form.controls['type'].value === '') {
        this.$workSchedulingService.getWorkSchedule(userIds, this.getWorkdays(), []).subscribe(value => {
          this.clearCalendar();
          value.forEach(workitem => {
            const start = new Date(workitem.workday + 'T' + workitem.timeSlot.startTime);
            const end = new Date(workitem.workday + 'T' + workitem.timeSlot.endTime);
            let allDay = false;
            if (workitem.timeSlot.name === 'night_shift') {
              end.setDate(end.getDate() + 1);
            } else if (workitem.timeSlot.name === 'vacation') {
              allDay = true;
            }
            this.calendarApi.addEvent({
              title: workitem.user.firstName + ' ' + workitem.user.lastName + (allDay ? ' Urlaub' : ''),
              start,
              end,
              allDay,
              extendedProps: {
                id: workitem.id,
              },
            });
          });
        });
      } else {
        this.clearCalendar();
      }
    }
  }

  constructor(private $workSchedulingService: WorkSchedulingService, private $accountService: AccountService) {
    this.form.controls['type'].valueChanges.subscribe(() => this.form.controls['employee'].setValue(-1));
    this.form.valueChanges.subscribe(() => {
      if (this.form.controls['type'].valid && this.form.controls['employee'].valid) {
        const userIds = this.form.controls['employee'].value !== -1 ? [this.form.controls['employee'].value!] : [];
        if (this.form.controls['employee'].value === -1 || this.form.controls['employee'].value?.toString() === '-1') {
          userIds.length = 0;
          this.users.forEach(user => {
            if (user.type === this.form.controls['type'].value) {
              userIds.push(user.id);
            }
          });
        }
        this.updateEvents(userIds);
      }
    });
  }

  dateDiffInDays(a: Date, b: Date): number {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  ngOnInit(): void {
    if (this.$accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
      this.$workSchedulingService.getEmployees().subscribe(value => {
        this.users = value;
      });
    }
  }
  ngAfterViewInit(): void {
    this.calendarApi = this.calendarComponent!.getApi();
    if (!this.$accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
      this.loadMySchedule();
    }
  }

  loadMySchedule(): void {
    this.$workSchedulingService.getMySchedule(this.getWorkdays(), []).subscribe({
      next: value => {
        this.clearCalendar();
        value.forEach(workitem => {
          const start = new Date(workitem.workday + 'T' + workitem.timeSlot.startTime);
          const end = new Date(workitem.workday + 'T' + workitem.timeSlot.endTime);
          let allDay = false;
          if (workitem.timeSlot.name === 'night_shift') {
            end.setDate(end.getDate() + 1);
          } else if (workitem.timeSlot.name === 'vacation') {
            allDay = true;
          }
          this.calendarApi.addEvent({
            title: workitem.user.firstName + ' ' + workitem.user.lastName + (allDay ? ' Urlaub' : ''),
            start,
            end,
            allDay,
            extendedProps: {
              id: workitem.id,
            },
          });
        });
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  filterUsersByType() {
    return this.users.filter(user => {
      if (this.form.controls['type'].value === '') {
        return true;
      }
      return user.type === this.form.controls['type'].value;
    });
  }

  createWorkSchedule(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const workSchedule: any = this.form.value;
      const request: WorkSchedule = {
        userId: workSchedule.employee,
        workday: workSchedule.date,
        timeSlot: this.mapShift(workSchedule.shiftType),
      };
      this.$workSchedulingService.createWorkSchedule(request).subscribe({
        next: workitem => {
          const start = new Date(workitem.workday + 'T' + workitem.timeSlot.startTime);
          const end = new Date(workitem.workday + 'T' + workitem.timeSlot.endTime);
          let allDay = false;
          if (workitem.timeSlot.name === 'night_shift') {
            end.setDate(end.getDate() + 1);
          } else if (workitem.timeSlot.name === 'vacation') {
            allDay = true;
          }
          this.calendarApi.addEvent({
            title: workitem.user.firstName + ' ' + workitem.user.lastName + (allDay ? ' Urlaub' : ''),
            start,
            end,
            allDay,
            extendedProps: {
              id: workitem.id,
            },
          });
          this.error = false;
        },
        error: error => {
          this.error = true;
          this.errorMessage = error.error.title;
        },
      });
    }
  }

  mapShift(shift: string): string {
    switch (shift) {
      case 'dayShift':
        return 'day_shift';
      case 'nightShift':
        return 'night_shift';
      default:
        return 'vacation';
    }
  }

  eventClick(event: EventClickArg): void {
    if (this.$accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
      const tmpEvent = event.event;
      this.currentEvent?.setProp('backgroundColor', tmpEvent.backgroundColor);
      this.currentEvent = tmpEvent;
      this.currentEvent?.setProp('backgroundColor', '#aaaaaa');
    }
  }

  delete(): void {
    this.$workSchedulingService.deleteSchedule(this.currentEvent?.extendedProps.id).subscribe({
      next: () => {
        this.currentEvent?.remove();
        this.currentEvent = undefined;
      },
    });
  }
}
