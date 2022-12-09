import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import pkg from '../../../../secrets.json';
import { RegistrationService } from './service/registration.service';
import {MessageService} from 'primeng/api';
import { ValidateInputService } from 'src/app/services/validateInput-service/validate-input-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [MessageService]
})
export class RegistrationComponent implements OnInit {

  captchaStatus: boolean = false

  firstname: string | undefined
  lastname: string | undefined
  birthday: string | undefined
  email: string | undefined
  password1: string | undefined
  password2: string | undefined
  
  constructor(@Inject('CAPTCHA_SITEKEY') public captchaSiteKey: string, private messageService: MessageService,private registrationService: RegistrationService, private router: Router,
    private validateInputService: ValidateInputService) {}

  ngOnInit(): void {
  }

  registerUser(){
    if(this.validateStringInput(this.firstname!)){
      if(this.validateStringInput(this.lastname!)){
        if(this.validateDate(this.birthday!)){
          if(this.validateInputService.validateEmail(this.email!)){
            if(this.validateInputService.validatePassword(this.password1!)){
              if(this.password1 === this.password2){
                if(this.captchaStatus){
                  const registrationData = {first_name: this.firstname, last_name: this.lastname, email: this.email,birth_date: this.birthday, password: this.password1, password2: this.password2}
                  this.registrationService.registerUser(registrationData).subscribe((res: any) => {
                    this.router.navigate(['login'])
                  },
                  err=>{
                    this.showWarnMsg("Die Registrierung ist fehlgeschlagen!")
                  })
                }else{
                  this.showWarnMsg("Bitte bestätigen Sie das Captcha!")
                }
              }else{
                this.showWarnMsg("Die eingetragenen Passwörter sind nicht gleich!")
              }
            }else{
              this.showWarnMsg("Das Password entspricht nicht den Anforderungen!")
            }
          }else{
            this.showWarnMsg("Bitte tragen Sie eine gültige Email ein!")
          }
        }else{
          this.showWarnMsg("Bitte tragen Sie ihr Geburtsdatum ein!")
        }
      }else{
        this.showWarnMsg("Bitte tragen Sie ihren Nachnamen ein!")
      }
    }else{
      this.showWarnMsg("Bitte tragen Sie ihren Vornamen ein!")
    }
  }

  showWarnMsg(msg: string){
    this.messageService.add({severity:'warn', summary: 'Warn', detail: msg});
  }

  validateStringInput(str: string){
    return str !== '' && str !== undefined && str !== null
  }

  validateDate(date: string){
    var timestamp = Date.parse(date)
    if(!isNaN(timestamp)){
      return true
    }else {
      return false
    }
  }

  captchaSuccess(event: any){
    this.captchaStatus = true
  }

  redirectToLogin(){
    this.router.navigate(['login'])
  }
}