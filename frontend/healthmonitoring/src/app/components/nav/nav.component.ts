import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  user: any

  constructor(private userService: UserService,private errorHandler: ErrorHandlerService,private router: Router) {}

  ngOnInit(){
    this.userService.getUserInformation().subscribe((userInfo: any)=>{
      this.user = userInfo
    },
    err =>{
      this.errorHandler.handleError(err)
    })
  } 

  checkIfDoctor(){
    return this.user!.role === "DOCTOR"
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['login'])
  }

  redirectToGivenPage(page: string){
    this.router.navigate([page])
  }
}
