import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserActivationService {

  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient) { }

  activateUser(token: string, uidb64: string): Observable<any>{
    return this.http.post(this.APIUrl + '/auth/activate/'+token+'/'+uidb64+'/', {})
  }
}
