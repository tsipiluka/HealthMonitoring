import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavService } from './service/nav.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  user: any

  constructor(private navService: NavService,private router: Router) {}

  ngOnInit(){
    this.navService.getUserInformation().subscribe((userInfo: any)=>{
      this.user = userInfo
    })
  } 

  checkIfDoctor(){
    return this.user!.role === "DOCTOR"
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['login'])
  }
}
