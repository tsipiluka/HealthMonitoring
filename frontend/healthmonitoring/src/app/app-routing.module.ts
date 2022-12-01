import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MedicalFindingFinderComponent } from './components/medical-finding-finder/medical-finding-finder.component';
import { MyPatientFinderComponent } from './components/my-patient-finder/my-patient-finder.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserActivationComponent } from './components/user-activation/user-activation.component';
import { UserPasswordResetComponent } from './components/user-password-reset/user-password-reset.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'activate/:token/:uidb64',
    component: UserActivationComponent
  },
  {
    path: 'password-reset/:token',
    component: UserPasswordResetComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'myPatientFinder',
    component: MyPatientFinderComponent
  },
  {
    path: 'medicalFindingFinder',
    component: MedicalFindingFinderComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
