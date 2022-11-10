import { Component, OnInit } from '@angular/core';
import { switchMap, Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
  Appointment,
  AppointmentsService,
} from 'src/app/shared/appointments.service';
import { DateService } from 'src/app/shared/date.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
  form!: FormGroup;
  appointments: Appointment[] = [];

  constructor(
    public dateService: DateService,
    public appointmentsService: AppointmentsService // public addAppointment: AddAppointmentComponent
  ) {}

  ngOnInit() {
    this.dateService.date
      .pipe(switchMap((value) => this.appointmentsService.load(value)))
      .subscribe((appointments) => {
        this.appointments = appointments;
      });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  submit() {
    const { title } = this.form.value;

    const appointment: Appointment = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
    };

    this.appointmentsService.create(appointment).subscribe({
      next: (appointment) => {
        this.appointments.push(appointment);
        this.form.reset();
      },
      error: (err) => console.error(err),
    });
  }

  remove(appointment: Appointment) {
    this.appointmentsService.remove(appointment).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(
          (a) => a.id !== appointment.id
        );
      },
      error: (err: any) => console.error(err),
    });
  }
}
