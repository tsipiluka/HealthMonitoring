import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/core/server-url/server-url.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  readonly APIUrl = this.serverUrlService.getAPIUrl();

  constructor(private http: HttpClient, private serverUrlService: ServerUrlService) { }

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
