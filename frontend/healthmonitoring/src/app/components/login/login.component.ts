import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './service/login.service';
// import pgk from '../../../../secrets.json'
import {MessageService} from 'primeng/api';
import { ValidateInputService} from 'src/app/services/validateInput-service/validate-input-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
  
})
export class LoginComponent implements OnInit {

  email: string | undefined
  password: string | undefined
  resetEmail: string | undefined

  // captchaSiteKey: string = pgk.CAPTCHA_SITEKEY
  captchaSiteKey: string = environment.CAPTCHA_SITEKEY
  
  captchaStatus: boolean = false

  constructor(@Inject('CAPTCHA_SITEKEY') private messageService: MessageService,private router: Router,private loginService: LoginService, private validateInputService: ValidateInputService) {
    console.log(this.captchaSiteKey)
  }

  ngOnInit(): void {
    const refresh_token = {
      "refresh": localStorage.getItem('refresh_token')
    } 
    this.loginService.refreshToken(refresh_token).subscribe((res: any)=>{
      localStorage.setItem('access_token', res.access)
      this.router.navigate(['dashboard'])
    })
  }

  login() {
    if(this.validateInputService.validateEmail(this.email!)){
      if(this.validateInputService.validatePassword(this.password!)){
        if(this.captchaStatus){
          const creds = {email: this.email, password: this.password}
          this.loginService.loginUser(creds).subscribe((res:any)=>{
            localStorage.setItem('access_token', res.access)
            localStorage.setItem('refresh_token', res.refresh)
            this.router.navigate(['dashboard'])
          }, err => {
            if(err.status === 401){
              this.showWarnMsg("Der angegebene User existiert nicht oder die Daten sind falsch!")
            }
          })
        }else{
          this.showWarnMsg("Bitte bestätigen Sie das Captcha!")
        }
      }else{
        this.showWarnMsg("Das Password entspricht nicht den Anforderungen!")
      }
    }else{
      this.showWarnMsg("Bitte tragen Sie eine gültige Email ein!")
    }
  }

  showWarnMsg(msg: string){
    this.messageService.add({severity:'warn', summary: 'Warn', detail: msg});
  }
  
  showSuccessMsg(msg: string){
    this.messageService.add({severity:'success', summary: 'Success', detail: msg});
  }

  captchaSuccess(event: any){
    this.captchaStatus = true
  }

  resetPassword(){
    if(this.validateInputService.validateEmail(this.resetEmail!)){
      const resetEmail = {email: this.resetEmail}
      this.loginService.resetPassword(resetEmail).subscribe()
      this.showSuccessMsg("Ein Password Reset wurde angefragt!")
    }else{
      this.showWarnMsg("Bitte tragen Sie eine gültige Email ein!")
    }
    this.resetEmail = undefined
  }

  redirectToRegistration(){
    this.router.navigate(['registration'])
  }
}
