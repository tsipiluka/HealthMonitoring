import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicalFinding } from 'src/app/entities/medicalFinding.modal';
import { LoginService } from '../login/service/login.service';
import { DashboardService } from './service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  MedicalFindingList: MedicalFinding[] = []
  test: boolean = true

  constructor(private loginService: LoginService,private dashboardService: DashboardService,  private router: Router) { 
    console.log(this.MedicalFindingList.length)
  }

  ngOnInit(): void {
    const refresh_token = {
      "refresh": localStorage.getItem('refresh_token')
    } 
    console.log(refresh_token)
    console.log(this.MedicalFindingList)
    this.loginService.verifyToken(refresh_token).subscribe((res: any) => {
      localStorage.setItem('access_token', res.access)
      this.test = false
      this.loadMedicalFindings()
    },
    err => {
      this.router.navigate(['login'])
    })
  }

  loadMedicalFindings() {
    this.dashboardService.loadMedicalFindings().subscribe((res: any) => {
      for(let finding of <MedicalFinding[]>res.data!){
        this.MedicalFindingList.push(<MedicalFinding>finding)
      }
    })
  }

  deleteMedicalFinding(uid: string) {
    const response_uid = {'uid': uid}
    this.dashboardService.deleteMedicalFinding(response_uid).subscribe((res: any) => {
      this.MedicalFindingList = []
      this.loadMedicalFindings()
    })
  }
}
