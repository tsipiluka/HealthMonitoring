import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import pkg from '../../../../secrets.json';
import { RegistrationService } from './service/registration.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [MessageService]
})
export class RegistrationComponent implements OnInit {

  captchaSiteKey: string = pkg.CAPTCHA_SITEKEY
  captchaStatus: boolean = false

  firstname: string | undefined
  lastname: string | undefined
  birthday: string | undefined
  email: string | undefined
  password1: string | undefined
  password2: string | undefined
  
  constructor(private messageService: MessageService,private registrationService: RegistrationService, private router: Router) { }

  ngOnInit(): void {
  }

  registerUser(){
    console.log(this.firstname)
    if(this.validateStringInput(this.firstname!)){
      if(this.validateStringInput(this.lastname!)){
        if(this.validateDate(this.birthday!)){
          if(this.validateEmail(this.email!)){
            if(this.validatePassword(this.password1!)){
              if(this.password1 === this.password2){
                if(this.captchaStatus){
                  const registrationData = {first_name: this.firstname, last_name: this.lastname, email: this.email,birth_date: this.birthday, password: this.password1, password2: this.password2, role: "PATIENT"}
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

  validateEmail(email: string): boolean{
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
  }

  validatePassword(password: string): boolean{
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[^\w\s])(?=.{8,})/.test(password)
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
}
