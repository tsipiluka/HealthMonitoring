import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/core/server-url/server-url.service';

@Injectable({
  providedIn: 'root'
})
export class UserActivationService {

  readonly APIUrl = this.serverUrlService.getAPIUrl();

  constructor(private http: HttpClient, private serverUrlService: ServerUrlService) { }

  activateUser(token: string, uidb64: string): Observable<any>{
    return this.http.post(this.APIUrl + '/auth/activate/'+token+'/'+uidb64+'/', {})
  }
}
