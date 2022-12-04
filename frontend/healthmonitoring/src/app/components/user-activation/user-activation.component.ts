import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserActivationService } from './service/user-activation.service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.css'],
  providers: [MessageService]
})
export class UserActivationComponent implements OnInit{

  constructor(private userActivationService: UserActivationService,private messageService: MessageService,private router: Router,private route: ActivatedRoute){}

  ngOnInit(): void {}

  activateAccount(){
    this.route.params.subscribe(params => {
      this.userActivationService.activateUser(params['token'], params['uidb64']+'==').subscribe((res: any)=>{
        this.router.navigate(['login'])
      }, err =>{
        this.showWarnMsg("Die Aktivierung ist fehlgeschlagen!")
      })
    })
  }

  redirectToLogin(){
    this.router.navigate(['login'])
  }

  showWarnMsg(msg: string){
    this.messageService.add({severity:'warn', summary: 'Warn', detail: msg});
  }
}
