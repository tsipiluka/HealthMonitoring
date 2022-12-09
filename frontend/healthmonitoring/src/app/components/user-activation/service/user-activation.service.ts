import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserActivationService {

  readonly APIUrl = "https://health-monitoring.wh0cares.live/api";

  constructor(private http: HttpClient) { }

  activateUser(token: string, uidb64: string): Observable<any>{
    return this.http.post(this.APIUrl + '/auth/activate/'+token+'/'+uidb64+'/', {})
  }
}
