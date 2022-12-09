import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  readonly APIUrl = "https://health-monitoring.wh0cares.live/api";

  constructor(private http: HttpClient) { }

  loginUser(authenticationData: any): Observable<any>{
    return this.http.post(this.APIUrl + '/auth/login/', authenticationData )
  }

  refreshToken(refresh_token: any): Observable<any>{
    return this.http.post(this.APIUrl + '/auth/login/refresh/', refresh_token)
  }

  resetPassword(val: any): Observable<any>{
    return this.http.post(this.APIUrl + '/auth/password-reset/', val)
  }
} 