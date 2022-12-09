import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  readonly APIUrl = "https://health-monitoring.wh0cares.live/api";

  constructor(private http: HttpClient) { }

  resetPassword(passwords: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.put(this.APIUrl + '/auth/change-password/' , passwords, {'headers': headers})
  }

  deleteAccount(): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+ localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/auth/delete/' , {'headers': headers})
  }
}
