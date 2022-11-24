import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})
export class LoginComponent implements OnInit {

  email: string =''
  password: string =''

  constructor(private router: Router,private loginService: LoginService) {}

  ngOnInit(): void {
    const refresh_token = {
      "refresh": localStorage.getItem('refresh_token')
    } 
    this.loginService.verifyToken(refresh_token).subscribe((res: any)=>{
      localStorage.setItem('access_token', res.access)
      this.router.navigate(['dashboard'])
    })
  }

  login() {
    if(this.email !== '' && this.password !== ''){
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
}
