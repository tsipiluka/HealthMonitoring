import { Component, OnInit } from '@angular/core';
import pkg from '../../../../secrets.json';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  captchaSiteKey: string = pkg.CAPTCHA_SITEKEY
  captchaStatus: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  captchaSuccess(event: any){
    this.captchaStatus = true
  }
}
