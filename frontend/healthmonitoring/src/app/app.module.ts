import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserActivationComponent } from './components/user-activation/user-activation.component';
import { UserPasswordResetComponent } from './components/user-password-reset/user-password-reset.component';
import { MyPatientFinderComponent } from './components/my-patient-finder/my-patient-finder.component';
import { MedicalFindingFinderComponent } from './components/medical-finding-finder/medical-finding-finder.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NgxCaptchaModule} from 'ngx-captcha'
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';



// Primeng Modules
import {CardModule} from 'primeng/card';
import {CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';
import {PasswordModule} from 'primeng/password';
import {DividerModule} from 'primeng/divider';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {ChipsModule} from 'primeng/chips';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {KeyFilterModule} from 'primeng/keyfilter';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {FileUploadModule} from 'primeng/fileupload';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    NavComponent,
    ProfileComponent,
    UserActivationComponent,
    UserPasswordResetComponent,
    MyPatientFinderComponent,
    MedicalFindingFinderComponent,
    PagenotfoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    NgxCaptchaModule,

    // PrimeNG Modules
    CardModule,
    CalendarModule,
    DialogModule,
    PasswordModule,
    DividerModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    ButtonModule,
    InputTextModule,
    ChipsModule,
    AutoCompleteModule,
    KeyFilterModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    FileUploadModule
  ],
  providers: [
    {
      provide: 'CAPTCHA_SITEKEY', useValue: environment.CAPTCHA_SITEKEY
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }