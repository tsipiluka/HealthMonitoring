import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  readonly APIUrl = "https://health-monitoring.wh0cares.live/api";

  constructor(private http: HttpClient) { }

  registerUser(data: any): Observable<any>{
    return this.http.post(this.APIUrl + '/auth/register/' , data)
  }
}
