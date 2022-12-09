import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPasswordResetService {

  readonly APIUrl = "https://health-monitoring.wh0cares.live/api";

  constructor(private http: HttpClient) { }

  resetPassword(val: any): Observable<any>{
    return this.http.post(this.APIUrl + '/auth/password-reset/confirm/', val)
  }
}