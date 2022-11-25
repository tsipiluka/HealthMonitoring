import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './service/login.service';
import pgk from '../../../../secrets.json'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})
export class LoginComponent implements OnInit {

  email: string =''
  password: string =''

  captchaSiteKey: string = pgk.CAPTCHA_SITEKEY
  captchaStatus: boolean = false

  constructor(private router: Router,private loginService: LoginService) {}

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
    if(this.email !== '' && this.password !== ''){
    // if(this.checkEmail(this.email) && this.password !== '' && this.captchaStatus){
      const creds = {username: this.email, password: this.password}
      this.loginService.loginUser(creds).subscribe((res:any)=>{
        localStorage.setItem('access_token', res.access)
        localStorage.setItem('refresh_token', res.refresh)
        this.router.navigate(['dashboard'])
      }, err => {
        // TODO error popup
        console.log(err)
      })
    }
  }

  checkEmail(email: string): boolean{
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
  }

  captchaSuccess(event: any){
    this.captchaStatus = true
  }
}
