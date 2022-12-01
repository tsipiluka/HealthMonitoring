import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserActivationService } from './service/user-activation.service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.css']
})
export class UserActivationComponent implements OnInit{

  constructor(private userActivationService: UserActivationService,private router: Router,private route: ActivatedRoute){}

  ngOnInit(): void {
    
  }

  activateAccount(){
    this.route.params.subscribe(params => {
      this.userActivationService.activateUser(params['token'], params['uidb64']+'==').subscribe((res: any)=>{
        // localStorage.setItem('access_token', res.access)
        // localStorage.setItem('refresh_token', res.refresh)
        // this.router.navigate(['dashboard'])
        this.router.navigate(['login'])
      })
    })
  }
}
