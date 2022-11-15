import { Component, OnInit } from '@angular/core';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent implements OnInit {

  email: string =''
  password: string =''

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  login() {
    if(this.email !== '' && this.password !== ''){

      const requestData = {
        'username': this.email,
        'password': this.password 
      }

      this.loginService.loginUser(requestData).subscribe((res: any) => {
        localStorage.setItem('access_token', res.access) 
        localStorage.setItem('refresh_token', res.refresh) 
        
      })
    }
  }

}
