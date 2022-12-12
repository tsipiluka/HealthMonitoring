import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ValidateInputService } from 'src/app/services/validateInput-service/validate-input-service.service';
import { UserPasswordResetService } from './service/user-password-reset.service';

@Component({
  selector: 'app-user-password-reset',
  templateUrl: './user-password-reset.component.html',
  styleUrls: ['./user-password-reset.component.css'],
  providers: [MessageService]
})
export class UserPasswordResetComponent {

  new_password1: string | undefined
  new_password2: string | undefined

  warnMsg: string | undefined

  constructor(private userPasswordResetService: UserPasswordResetService,private messageService: MessageService,private router: Router,private route: ActivatedRoute,
    private validateInputService: ValidateInputService){}

  resetPassword(){
    if(this.validateInputService.validatePassword(this.new_password1!)){
      if(this.new_password1 === this.new_password2){
        this.route.params.subscribe(params => {
          const passwordResetRequestBody = {token: params['token'], password: this.new_password1}
          this.userPasswordResetService.resetPassword(passwordResetRequestBody).subscribe((res: any)=>{
            this.router.navigate(['login'])
          },err=>{
            this.warnMsg = "Ihr Passwort reset ist fehlgeschlagen oder nicht möglich!"
            this.showWarnMsg(this.warnMsg)
          })
        })
      }else{
        this.warnMsg = "Ihre eingegebenen Passwörter stimmen nicht überein!"
        this.showWarnMsg(this.warnMsg)
      }
    }else{
      this.warnMsg = "Ihr eingegebenes Passwort entspricht nicht den Anforderungen!"
      this.showWarnMsg(this.warnMsg)
    }
  }

  showWarnMsg(msg: string){
    this.messageService.add({severity:'warn', summary: 'Warn', detail: msg});
  }

  redirectToLogin(){
    this.router.navigate(['login'])
  }
}
