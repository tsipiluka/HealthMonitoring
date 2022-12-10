import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/core/server-url/server-url.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  readonly APIUrl = this.serverUrlService.getAPIUrl();

  constructor(private http: HttpClient, private serverUrlService: ServerUrlService) { }

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