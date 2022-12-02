import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient) { }

  getUserId(val: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/user_system/user/',val, {'headers': headers})
  }

  addReadAccessToMedicalFinding(mfID: string, val: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/api/add_reading_right/'+mfID+'/', val,{'headers': headers})
  }

  loadMedicalFindings(): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/medical_findings_patient/' ,{'headers': headers})
  }
  
  createMedicalFinding(medicalFinding_info: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/api/create_medical_finding/' ,medicalFinding_info, {'headers': headers})
  }

  deleteMedicalFinding(uid: string): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/delete_medical_finding/'+ uid+ '/',{'headers': headers})
  }
}
