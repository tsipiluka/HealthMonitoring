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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { ProfileComponent } from './components/profile/profile.component';


// Primeng Modules
import {CardModule} from 'primeng/card';
import {CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';
import {PasswordModule} from 'primeng/password';
import {DividerModule} from 'primeng/divider';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    NavComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    CommonModule,
    HttpClientModule,
    NgbModule,

    // PrimeNG Modules
    CardModule,
    CalendarModule,
    DialogModule,
    PasswordModule,
    DividerModule,
    OverlayPanelModule,
    ConfirmDialogModule
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
