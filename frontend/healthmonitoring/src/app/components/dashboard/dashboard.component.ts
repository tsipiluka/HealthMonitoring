import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicalFinding } from 'src/app/entities/medicalFinding.modal';
import { LoginService } from '../login/service/login.service';
import { DashboardService } from './service/dashboard.service';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  medicalFindingList: MedicalFinding[] = []

  addEntryModel: boolean = false

  new_disease: string | undefined
  new_medicine: string | undefined
  selectedDoctorID: string | undefined
  selectedUsers: string[] | undefined

  constructor(private loginService: LoginService,private dashboardService: DashboardService,  private router: Router) {}

  ngOnInit(): void {
    const refresh_token = {
      "refresh": localStorage.getItem('refresh_token')
    } 
    this.loginService.refreshToken(refresh_token).subscribe((res: any) => {
      console.log(res)
      localStorage.setItem('access_token', res.access)
      this.loadMedicalFindings()
    },
    err => {
      // ERRORHANDLER
      this.router.navigate(['login'])
    })
  }

  loadMedicalFindings() {
    this.medicalFindingList = []
    this.dashboardService.loadMedicalFindings().subscribe((res: any) => {
      for(let finding of <MedicalFinding[]>res){
        this.medicalFindingList.push(<MedicalFinding>finding)
      }
    }, err => {
      // ERRORHANDLER
      console.log(err)
    })
  }

  deleteMedicalFinding(uid: string) {
    this.dashboardService.deleteMedicalFinding(uid).subscribe((res: any) => {
      this.loadMedicalFindings()
    })
  }

  createPdf(finding: MedicalFinding,) {
      let doc = new jsPDF('p', 'pt', 'a4')
      doc.text(finding.uid, 290, 20)
      doc.text("This document contains confidential medical information about Person XY", 40, 60)
      doc.text("Disease: "+finding.disease , 40, 90)
      doc.text("Required Medicine: "+finding.medicine , 40, 110)
      doc.text("Zu Risiken und Nebenwirkungen lesen Sie die Packungsbeilage und fragen", 40, 200)
      doc.text("Sie Ihren Arzt oder Apotheker. ", 40, 220)

      window.open(doc.output('bloburl'))
  }

  displayAddEntryModel(){
    this.addEntryModel = true
  }

  createNewMedicalFinding(){
    if(this.new_disease !== '' && this.new_medicine !== ''){
      if(this.selectedDoctorID === undefined){
        const medicalFinding_info = { 
          'disease': this.new_disease, 
          'medicine': this.new_medicine,
        }
        this.createNewMedicalFindingHelper(medicalFinding_info)
      }else{
        const doctorID = {profile_id: this.selectedDoctorID!}
        this.dashboardService.getUserId(doctorID).subscribe((user: any) => {
          const medicalFinding_info = { 
            'disease': this.new_disease, 
            'medicine': this.new_medicine,
            'treator': user.id
          }
          this.createNewMedicalFindingHelper(medicalFinding_info)
        })
      }
    }
  }

  createNewMedicalFindingHelper(medicalFinding_info: any){
    this.dashboardService.createMedicalFinding(medicalFinding_info).subscribe((medicalFinding: any)=>{
      for(let i = 0; i<this.selectedUsers!.length; i++){
        const profil_id = {profile_id: this.selectedDoctorID!}  
        this.dashboardService.getUserId(profil_id).subscribe((user2: any) => {
          const readUser = {reader: user2.id}
          this.dashboardService.addReadAccessToMedicalFinding(medicalFinding.id, readUser).subscribe((res: any)=> {
            console.log(res)
          })
        })
      }
      this.addEntryModel = false
      this.new_disease = ''
      this.new_medicine = ''
      this.selectedDoctorID = ''
      this.selectedUsers = []
      this.loadMedicalFindings()
    })
  }
}
