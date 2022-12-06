import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient) { }

  getReadAccessFromMedicalFinding(mfID: string): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/get_reading_rights/'+mfID+'/',{'headers': headers})
  }

  addReadAccessToMedicalFinding(mfID: string, val: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/api/add_reading_right/'+mfID+'/', val,{'headers': headers})
  }

  deleteReadAccessFromMedicalFinding(mfID: string, readerId: number): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/delete_reading_right/'+mfID+'/'+readerId+'/',{'headers': headers})
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

  updateMedicalFinding(mfID: string, val: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.put(this.APIUrl + '/api/update_medical_finding/' + mfID +'/' ,val, {'headers': headers})
  }

  deleteMedicalFinding(uid: string): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/delete_medical_finding/'+ uid+ '/',{'headers': headers})
  }

  uploadMedicalFindingDocument(mfID: number, file: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/upload/'+mfID+'/',file,{'headers': headers})
  }
}
