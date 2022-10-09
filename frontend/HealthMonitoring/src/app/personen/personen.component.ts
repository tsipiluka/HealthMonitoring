import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-personen',
  templateUrl: './personen.component.html',
  styleUrls: ['./personen.component.css']
})
export class PersonenComponent implements OnInit {

  constructor(private service: SharedService) { }

  PersonenList:any=[];

  ngOnInit(): void {
    this.refreshPersonenList();
  }

  //Methode greift auf SharedService zu, in welcher der eigentliche API-Call aufgerufen wird
  refreshPersonenList(){
    this.service.getPersonenList().subscribe(data => {
      this.PersonenList=data;
    });
  }

}
