/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { formatDate } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, Calendar } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AccountService } from 'app/core/auth/account.service';
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

  users: Employee[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin],
    height: 'auto',
    allDaySlot: true,
    firstDay: 1,
    locale: 'de-AT',
    datesSet: () => this.updateEvents(),
  };

  clearCalendar(): void {
    this.calendarApi.getEvents().forEach(event => event.remove());
  }

  updateEvents(userIds: number[] = []): void {
    if (!this.$accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
      this.loadMySchedule();
    } else if (this.form.valid) {
      const dateDiffInDays = this.dateDiffInDays(this.calendarApi.view.currentStart, this.calendarApi.view.currentEnd);
      const workDays = [];
      const date = this.calendarApi.view.currentStart;
      workDays.push(formatDate(date, 'yyyy-MM-dd', 'en-US'));
      for (let i = 0; i < dateDiffInDays; i++) {
        date.setDate(date.getDate() + 1);
        workDays.push(formatDate(date, 'yyyy-MM-dd', 'en-US'));
      }
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this.$workSchedulingService.getWorkSchedule(userIds, workDays, []).subscribe(value => {
        this.clearCalendar();
        value.forEach(workitem => {
          const start = new Date(workitem.workday + 'T' + workitem.timeSlot.startTime);
          const end = new Date(workitem.workday + 'T' + workitem.timeSlot.endTime);
          let allDay = false;
          if (workitem.timeSlot.name === 'nightShift') {
            end.setDate(end.getDate() + 1);
          } else if (workitem.timeSlot.name === 'vacation') {
            allDay = true;
          }
          this.calendarApi.addEvent({
            title: workitem.user.firstName + ' ' + workitem.user.lastName,
            start,
            end,
            allDay,
          });
        });
      });
    }
  }

  constructor(private $workSchedulingService: WorkSchedulingService, private $accountService: AccountService) {
    this.form.valueChanges.subscribe(() => {
      if (this.form.valid) {
        const userIds = this.form.controls['employee'].value !== -1 ? [this.form.controls['employee'].value!] : [];
        if (this.form.controls['employee'].value === -1 || this.form.controls['employee'].value?.toString() === '-1') {
          userIds.length = 0;
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
    this.$workSchedulingService.getEmployees().subscribe(value => {
      this.users = value;
    });
    if (!this.$accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
      this.loadMySchedule();
    }
  }
  ngAfterViewInit(): void {
    this.calendarApi = this.calendarComponent!.getApi();
  }

  loadMySchedule(): void {
    this.$workSchedulingService.getMySchedule().subscribe({
      next: value => {
        this.clearCalendar();
        value.forEach(workitem => {
          const start = new Date(workitem.workday + 'T' + workitem.timeSlot.startTime);
          const end = new Date(workitem.workday + 'T' + workitem.timeSlot.endTime);
          let allDay = false;
          if (workitem.timeSlot.name === 'nightShift') {
            end.setDate(end.getDate() + 1);
          } else if (workitem.timeSlot.name === 'vacation') {
            allDay = true;
          }
          this.calendarApi.addEvent({
            title: workitem.user.firstName + ' ' + workitem.user.lastName,
            start,
            end,
            allDay,
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
      const start = new Date(this.form.controls['date'].value!);
      const end = new Date(this.form.controls['date'].value!);
      let allDay = false;
      if (this.form.controls['shiftType'].value === 'nightShift') {
        start.setHours(19);
        start.setMinutes(0);
        end.setDate(end.getDate() + 1);
        end.setHours(7);
        end.setMinutes(0);
      } else if (this.form.controls['shiftType'].value === 'dayShift') {
        start.setHours(7);
        start.setMinutes(0);
        end.setHours(19);
        end.setMinutes(0);
      } else {
        allDay = true;
      }
      const request: WorkSchedule = {
        userId: workSchedule.employee,
        workday: workSchedule.date,
        timeSlot: this.mapShift(workSchedule.shiftType),
      };
      this.$workSchedulingService.createWorkSchedule(request).subscribe({
        next: () => {
          const event = {
            title: this.users.find(user => user.id === this.form.controls['employee'].value!)!.login,
            start: formatDate(start, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
            end: formatDate(end, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
            allDay,
          };
          this.calendarApi.addEvent(event);
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
}
