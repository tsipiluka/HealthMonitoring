import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPasswordResetService } from './service/user-password-reset.service';

@Component({
  selector: 'app-user-password-reset',
  templateUrl: './user-password-reset.component.html',
  styleUrls: ['./user-password-reset.component.css']
})
export class UserPasswordResetComponent {

  new_password1: string | undefined
  new_password2: string | undefined

  constructor(private userPasswordResetService: UserPasswordResetService,private router: Router,private route: ActivatedRoute){}

  ngOnInit(): void {}

  resetPassword(){
    if(this.new_password1 === this.new_password2){
      if(this.validatePassword(this.new_password1!)){
        this.route.params.subscribe(params => {
          const passwordResetRequestBody = {token: params['token'], password: this.new_password1}
          this.userPasswordResetService.resetPassword(passwordResetRequestBody).subscribe((res: any)=>{
            this.router.navigate(['login'])
          })
        })
      }else{
        // RESPONSE password does not match the password guideline
      }
    }else{
      // RESPONSE both passwords are not equal
    }
  }

  validatePassword(password: string): boolean{
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[^\w\s])(?=.{8,})/.test(password)
  }
}
