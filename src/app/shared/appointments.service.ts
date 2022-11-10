import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

export interface Appointment {
  id?: string;
  title: string;
  date?: string;
}

interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  static url =
    'https://calendar-7bc30-default-rtdb.firebaseio.com/appointments';

  constructor(private http: HttpClient) {}

  load(date: moment.Moment): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(
        `${AppointmentsService.url}/${date.format('DD-MM-YYYY')}.json`
      )
      .pipe(
        map((appointments) => {
          if (!appointments) {
            return [];
          }
          return Object.keys(appointments).map((key: any) => ({
            ...appointments[key],
            id: key,
          }));
        })
      );
  }

  create(appointment: Appointment): Observable<Appointment> {
    return this.http
      .post<CreateResponse>(
        `${AppointmentsService.url}/${appointment.date}.json`,
        appointment
      )
      .pipe(
        map((res) => {
          return { ...appointment, id: res.name };
        })
      );
  }

  remove(appointment: Appointment): Observable<void> {
    return this.http.delete<void>(
      `${AppointmentsService.url}/${appointment.date}/${appointment.id}.json`
    );
  }
}
