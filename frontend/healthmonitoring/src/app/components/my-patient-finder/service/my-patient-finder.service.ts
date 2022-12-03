import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyPatientFinderService {

  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient) { }

  getMedicalFindings(): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/medical_findings_doctor/', {'headers': headers})
  }
}
