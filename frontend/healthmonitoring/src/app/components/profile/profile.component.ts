import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from './service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  birthday: Date | undefined

  passwordChangeModel: boolean = false

  old_password: string | undefined
  new_password1: string | undefined
  new_password2: string | undefined

  constructor(
    private router: Router,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
  }

  displayPasswordChangeModel(){
    this.passwordChangeModel = true
  }

  resetPassword(){
    this.passwordChangeModel = false
    if(this.checkPassword(this.new_password1!) && this.checkPassword(this.new_password2!)){
      const passwords = {
        'old_password': this.old_password,
        'new_password': this.new_password1,
        'new_password2': this.new_password2
      }
      this.profileService.resetPassword(passwords).subscribe(()=>{
        localStorage.clear()
        this.router.navigate(['login'])
      })
    }
  }

  checkPassword(password: string): boolean{
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[^\w\s])(?=.{8,})/.test(password)
  }
}
