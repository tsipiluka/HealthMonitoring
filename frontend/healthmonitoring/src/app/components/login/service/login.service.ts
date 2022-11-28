import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient) { }

  loginUser(authenticationData: any): Observable<any>{
    return this.http.post(this.APIUrl + '/api/token/', authenticationData)
  }

  verifyToken(refresh_token: any): Observable<any>{
    return this.http.post(this.APIUrl + '/api/token/verify/', refresh_token)
  }
}
