import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/core/server-url/server-url.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  readonly APIUrl = this.serverUrlService.getAPIUrl();

  constructor(private http: HttpClient, private serverUrlService: ServerUrlService) { }

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
}
