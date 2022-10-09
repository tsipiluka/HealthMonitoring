import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../config.json' //an diesem Pfad config.json mit credentials einfügen (bis jetzt nur 'ApiUrl')

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIurl = config.ApiUrl; //Hier muss eine eigene config.json angelegt werden mit credentials, weil meine im gitignore ist.

  constructor(private http:HttpClient) { }

  //Bis jetzt wurde nur dieser Call als Test in der Personen-Komponente aufgerufen
  getPersonenList(): Observable<any[]>{
    return this.http.get<any[]>(this.APIurl + '/person/');
  }

  addPerson(val: any){
    return this.http.post(this.APIurl + '/person/', val);
  }

  delPerson(val: any){
    return this.http.delete(this.APIurl + '/person/' + val);
  }
}
