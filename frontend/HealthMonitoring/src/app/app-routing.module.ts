import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonenComponent } from './personen/personen.component';

const routes: Routes = [
  {path: 'personen', component: PersonenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
