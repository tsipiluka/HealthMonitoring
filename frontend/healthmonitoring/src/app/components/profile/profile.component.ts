import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from './service/profile.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import { UserService } from 'src/app/services/user-service/user.service';
import { LoginService } from '../login/service/login.service';
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service';
import { ValidateInputService } from 'src/app/services/validateInput-service/validate-input-service.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ProfileComponent implements OnInit {

  user: any | undefined
  birth_date: Date | undefined

  passwordChangeModel: boolean = false

  old_password: string | undefined
  new_password1: string | undefined
  new_password2: string | undefined

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private validateInputService: ValidateInputService
  ) { }

  ngOnInit(): void {
    const refresh_token = {
      "refresh": localStorage.getItem('refresh_token')
    } 
    this.loginService.refreshToken(refresh_token).subscribe((res: any) => {
      localStorage.setItem('access_token', res.access)
      this.userService.getUserInformation().subscribe((userinfo: any)=>{
        this.user = userinfo
        this.birth_date = new Date(this.user.birth_date)
      })
    },err =>{
      this.errorHandler.handleError(err)
    })
    
  }

  displayPasswordChangeModel(){
    this.passwordChangeModel = true
  }

  showWarnMsg(msg: string){
    this.messageService.add({severity:'warn', summary: 'Warn', detail: msg});
  }

  resetPassword(){
    this.passwordChangeModel = false
    if(this.validateInputService.validatePassword(this.old_password!)){
      if(this.validateInputService.validatePassword(this.new_password1!)){
        if(this.new_password1 === this.new_password2){
          const passwords = {
            'old_password': this.old_password,
            'new_password': this.new_password1,
            'new_password2': this.new_password2
          }
          this.profileService.resetPassword(passwords).subscribe(()=>{
            localStorage.clear()
            this.router.navigate(['login'])
          },err =>{
            this.showWarnMsg("Das alte Passwort ist nicht korrekt!")
          })
        }else{
          this.showWarnMsg("Die beiden Passwörter stimmen nicht überein!")
        }
      }else{
        this.showWarnMsg("Das Passwort entspricht nicht den Anforderungen!")
      }
    }else{
      this.showWarnMsg("Das alte Passwort ist nicht korrekt!")
    }
  }

  deleteAccount(){
    this.confirmationService.confirm({
      message: 'Sind Sie sich sicher, dass sie ihren Account löschen wollen?',
      header: 'Account Löschen',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.profileService.deleteAccount().subscribe(()=>{
          localStorage.clear()
          this.router.navigate(['login'])
        })
      }
  });
  }
}
