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
    employee: new FormControl(null, [Validators.required]),
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
  };

  constructor(private $workSchedulingService: WorkSchedulingService, private $accountService: AccountService) {}

  ngOnInit(): void {
    this.$workSchedulingService.getEmployees().subscribe(value => {
      this.users = value;
    });
    if (this.$accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
      this.$workSchedulingService.getMySchedule().subscribe({
        next: value => {
          value.forEach(workitem => {
            const start = new Date(workitem.workDay);
            const end = new Date(workitem.workDay);
            let allDay = false;
            if (workitem.timeSlot.name === 'nightShift') {
              end.setDate(end.getDate() + 1);
            } else if (workitem.timeSlot.name === 'vacation') {
              allDay = true;
            }
            start.setHours(workitem.timeSlot.startTime.hour);
            start.setMinutes(workitem.timeSlot.startTime.minute);
            start.setSeconds(workitem.timeSlot.startTime.second);
            start.setMilliseconds(workitem.timeSlot.startTime.nano);
            end.setHours(workitem.timeSlot.endTime.hour);
            end.setMinutes(workitem.timeSlot.endTime.minute);
            end.setSeconds(workitem.timeSlot.endTime.second);
            end.setMilliseconds(workitem.timeSlot.endTime.nano);
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
  }
  ngAfterViewInit(): void {
    this.calendarApi = this.calendarComponent!.getApi();
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
            title: this.users.find(user => user.id === parseInt(this.form.controls['employee'].value!, 10))!.name,
            start: formatDate(start, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
            end: formatDate(end, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
            allDay,
          };
          this.calendarApi.addEvent(event);
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
