import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MedicalFinding } from 'src/app/entities/medicalFinding.modal';
import { LoginService } from '../login/service/login.service';
import { DashboardService } from './service/dashboard.service';
import { jsPDF } from "jspdf";
import { UserService } from 'src/app/services/user-service/user.service';

export interface ReadAccessObject{
  medical_finding: string,
  reader: number,
  uid: string
}

export interface ReadAccessUser{
  [key: string]: any
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  medicalFindingList: MedicalFinding[] = []
  user: any 

  modify_mode: boolean = false
  medicalFindingModel: boolean = false
  selectedMedicalFinding: MedicalFinding | undefined

  tester: boolean = true

  new_disease: string | undefined
  new_medicine: string | undefined
  selectedDoctorID: string | undefined
  selectedUsers: string[] = []
  currentReadAccessObjects: ReadAccessUser = {}

  constructor(private userService: UserService,private loginService: LoginService,private dashboardService: DashboardService,  private router: Router) {}

  ngOnInit(): void {
    const refresh_token = {
      "refresh": localStorage.getItem('refresh_token')
    } 
    this.loginService.refreshToken(refresh_token).subscribe((res: any) => {
      localStorage.setItem('access_token', res.access)
      this.userService.getUserInformation().subscribe((userInfo: any)=>{
        this.user = userInfo
        this.loadMedicalFindings()
      })
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
    this.modify_mode = false
    this.medicalFindingModel = true
  }

  displayChangeEntryModel(medicalFinding: MedicalFinding){
    this.selectedMedicalFinding = medicalFinding
    this.selectedUsers = [];
    this.new_disease = medicalFinding.disease
    this.new_medicine = medicalFinding.medicine
    this.selectedDoctorID = medicalFinding.treator !== null ? medicalFinding.treator.doctor_profile.doctor_id : ''
    this.dashboardService.getReadAccessFromMedicalFinding(medicalFinding.uid).subscribe((user: any)=>{
      for(let i = 0; i < user.length; i++){
        if(user[i]!.reader.role ==='PATIENT'){
          this.currentReadAccessObjects[String(user[i]!.reader.patient_profile.patient_id)] = user[i]
          this.selectedUsers.push(String(user[i]!.reader.patient_profile.patient_id))
        }else{
          this.currentReadAccessObjects[String(user[i]!.reader.patient_profile.patient_id)] = user[i]
          this.selectedUsers.push(String(user[i]!.reader.doctor_profile.doctor_id))
        }
      }
      this.selectedUsers = [...this.selectedUsers]
      this.modify_mode = true
      this.medicalFindingModel = true
    })
  }

  getModifyEntryModelHeader(){
    return this.modify_mode ? "Bitte nehmen Sie ihre Änderungen vor" : "Füge einen neuen Eintrag hinzu"
  }

  createNewMedicalFinding(){
    if(this.new_disease !== '' && this.new_medicine !== ''){
      if(this.selectedDoctorID === undefined || this.selectedDoctorID === '' || this.selectedDoctorID === null){
        const medicalFinding_info = { 
          'disease': this.new_disease, 
          'medicine': this.new_medicine,
        }
        this.createNewMedicalFindingHelper(medicalFinding_info)
      }else{
        const doctorID = {profile_id: this.selectedDoctorID!}
        this.userService.getUserId(doctorID).subscribe((user: any) => {
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
      for(let i = 0; i<this.selectedUsers.length; i++){
        const profil_id = {profile_id: this.selectedUsers[i]}  
        this.userService.getUserId(profil_id).subscribe((user2: any) => {
          const readUser = {reader: user2.id}
          this.dashboardService.addReadAccessToMedicalFinding(medicalFinding.uid, readUser).subscribe()
        })
      }
      this.medicalFindingModel = false
      this.new_disease = ''
      this.new_medicine = ''
      this.selectedDoctorID = ''
      this.selectedUsers = []
      this.loadMedicalFindings()
    })
  }

  getKeys(list: any): string[]{
    return Object.keys(list)
  }

  changeMedicalFinding(){
    const a = 1
  }

  deleteReadAccess(key: string){
    if(this.modify_mode){
      const profil_id = {profile_id: key}  
      this.dashboardService.deleteReadAccessFromMedicalFinding(this.selectedMedicalFinding!.uid, this.currentReadAccessObjects[key].reader.id).subscribe()
    }
  }

  addReadAccess(key:string){
    if(this.modify_mode){
      const profil_id = {profile_id: key}  
      this.userService.getUserId(profil_id).subscribe((user: any) => {
        const readUser = {reader: user.id}
        this.dashboardService.addReadAccessToMedicalFinding(this.selectedMedicalFinding!.uid, readUser).subscribe((res: any)=>{
          this.currentReadAccessObjects[key] = res
        })
      })
    }
  }

  checkIfDoctor(){
    return this.user!.role === "DOCTOR"
  }
}
