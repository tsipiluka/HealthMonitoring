import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient) { }

  loadMedicalFindings(): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/medical_findings/' ,{'headers': headers})
  }
  
  createMedicalFinding(medicalFinding_info: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/api/medical_finding/' ,medicalFinding_info, {'headers': headers})
  }

  deleteMedicalFinding(uid: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/medical_finding/',{'body': uid, 'headers': headers})
  }
}
