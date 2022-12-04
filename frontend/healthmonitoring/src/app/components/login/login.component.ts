import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './service/login.service';
import pgk from '../../../../secrets.json'
import {MessageService} from 'primeng/api';

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

  captchaSiteKey: string = pgk.CAPTCHA_SITEKEY
  captchaStatus: boolean = false

  constructor(private messageService: MessageService,private router: Router,private loginService: LoginService) {}

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
    if(this.validateEmail(this.email!)){
      if(this.validatePassword(this.password!)){
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

  validateEmail(email: string): boolean{
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
  }

  validatePassword(password: string): boolean{
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[^\w\s])(?=.{8,})/.test(password)
  }

  captchaSuccess(event: any){
    this.captchaStatus = true
  }

  resetPassword(){
    if(this.validateEmail(this.resetEmail!)){
      const resetEmail = {email: this.resetEmail}
      this.loginService.resetPassword(resetEmail).subscribe()
      this.showSuccessMsg("Ein Password Reset wurde angefragt!")
    }else{
      this.showWarnMsg("Bitte tragen Sie eine gültige Email ein!")
    }
    this.resetEmail = undefined
  }
}
