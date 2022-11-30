import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './components/login/service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'healthmonitoring';

  constructor(protected loginService: LoginService, private router: Router){
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['login'])
  }

}