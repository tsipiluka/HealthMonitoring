import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileshareService {

  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient) { }

  uploadMedicalFindingDocument(val: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/upload/',val,{'headers': headers})
  }

  downloadMedicalFindingDocument(mfID: string): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/upload/'+mfID+'/',{'headers': headers})
  }

  deleteMedicalFindingDocument(mfID: string): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', 'Bearer '+localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/upload/delete/'+mfID+'/',{'headers': headers})
  }
}
