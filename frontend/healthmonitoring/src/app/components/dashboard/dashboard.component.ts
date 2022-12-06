import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MedicalFinding } from 'src/app/entities/medicalFinding.modal';
import { LoginService } from '../login/service/login.service';
import { DashboardService } from './service/dashboard.service';
import { jsPDF } from "jspdf";
import { UserService } from 'src/app/services/user-service/user.service';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {MessageService} from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { FileshareService } from 'src/app/services/fileshare-service/fileshare.service';


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
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('errorState', [
        state('hidden', style({
            opacity: 0
        })),
        state('visible', style({
            opacity: 1
        })),
        transition('visible => hidden', animate('400ms ease-in')),
        transition('hidden => visible', animate('400ms ease-out'))
    ])
  ],
  providers: [MessageService, UserService, HttpClient, LoginService, DashboardService]
})
export class DashboardComponent implements OnInit {

  medicalFindingList: MedicalFinding[] = []
  user: any 

  profileIdRegex: RegExp = /^[a-zA-Z]{2}#[0-9]{4}$/
  modify_mode: boolean = false
  medicalFindingModel: boolean = false
  selectedMedicalFinding: MedicalFinding | undefined

  new_disease: string | undefined
  new_medicine: string | undefined
  new_file: File | undefined 
  selectedDoctorID: string | undefined
  selectedUsers: string[] = []
  currentReadAccessObjects: ReadAccessUser = {}

  constructor(private userService: UserService,private messageService: MessageService,private loginService: LoginService,
    private dashboardService: DashboardService,  private router: Router, private errorHandler: ErrorHandlerService,
    private fileshareService: FileshareService) {}

  ngOnInit(): void {
    const refresh_token = {
      "refresh": localStorage.getItem('refresh_token')
    } 
    this.loginService.refreshToken(refresh_token).subscribe((res: any) => {
      localStorage.setItem('access_token', res.access)
      this.userService.getUserInformation().subscribe((userInfo: any)=>{
        this.user = userInfo
        if(!this.validateIfDoctor()){
          this.loadMedicalFindings()
        }
      })
    },err=>{
      this.errorHandler.handleError(err)
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
      this.showSuccessMsg("Sie haben den Eintrag erfolgreich gelöscht!")
    })
  }

  showWarnMsg(msg: string){
    this.messageService.add({severity:'warn', summary: 'Warn', detail: msg});
  }
  
  showSuccessMsg(msg: string){
    this.messageService.add({severity:'success', summary: 'Success', detail: msg});
  }
  
  displayAddEntryModel(){
    this.modify_mode = false
    this.medicalFindingModel = true
  }

  downloadPdf(finding: MedicalFinding){
    this.selectedMedicalFinding = finding
    this.fileshareService.downloadMedicalFindingDocument(this.selectedMedicalFinding.uid).subscribe((res: any) => {
      let blob: Blob = res.body as Blob;
      let a = document.createElement('a')
      a.download= 'befund.'+res.body.type.split('/')[1]
      a.href = window.URL.createObjectURL(blob)
      a.click()
    }, err=>{
      if(err.status===404){
        this.showWarnMsg("Es wurde keine medizinische Datei zu dem Befund hochgeladen!")
      }
    })
  }

  displayChangeEntryModel(medicalFinding: MedicalFinding){
    this.selectedMedicalFinding = medicalFinding
    this.selectedUsers = [];
    this.new_disease = medicalFinding.disease
    this.new_medicine = medicalFinding.medicine
    this.selectedDoctorID = medicalFinding.treator !== null ? medicalFinding.treator.doctor_profile.doctor_id : undefined
    this.new_file = undefined
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
    if(this.validateStringInput(this.new_disease!) && this.validateStringInput(this.new_medicine!)){
      if(!this.validateStringInput(this.selectedDoctorID!)){
        const medicalFinding_info = { 
          'disease': this.new_disease, 
          'medicine': this.new_medicine
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
    }else{
      this.showWarnMsg("Bitte tragen Sie eine Krankheit und die verschriebene Medizin ein!")
    }
  }

  createNewMedicalFindingHelper(medicalFinding_info: any){
    this.dashboardService.createMedicalFinding(medicalFinding_info).subscribe((medicalFinding: any)=>{
      if (this.new_file){
        const formData = new FormData();
        formData.append("medical_finding", medicalFinding.uid);
        formData.append("file", this.new_file, this.new_file.name);
        this.fileshareService.uploadMedicalFindingDocument(formData).subscribe()
      }
      for(let i = 0; i<this.selectedUsers.length; i++){
        console.log(this.selectedUsers[i])
        const profil_id = {profile_id: this.selectedUsers[i]}  
        this.userService.getUserId(profil_id).subscribe((user2: any) => {
          const readUser = {reader: user2.id}
          this.dashboardService.addReadAccessToMedicalFinding(medicalFinding.uid, readUser).subscribe()
        }, err => {
          this.showWarnMsg(profil_id.profile_id+" konnte nicht hinzugefügt werden!")
        })
      }
      this.showSuccessMsg("Sie haben einen medizinischen Befund erfolgreich hinzugefügt!")
      this.resetMedicalFindingValues()
      this.loadMedicalFindings()
    })
  }

  getKeys(list: any): string[]{
    return Object.keys(list)
  }

  changeMedicalFinding(){
    if(this.validateStringInput(this.new_medicine!) && this.validateStringInput(this.new_disease!)){
      let changedValues = {}
      if(this.validateStringInput(this.selectedDoctorID!)){
        if(this.validateProfileID(this.selectedDoctorID!)){
          const profil_id = {profile_id: this.selectedDoctorID}  
          this.userService.getUserId(profil_id).subscribe((user: any)=>{
            changedValues = {disease: this.new_disease, medicine: this.new_medicine,treator: user.id } 
            this.changeMedicalFindingHelper(changedValues)
          }) 
        }else{
          changedValues = {disease: this.new_disease, medicine: this.new_medicine} 
          this.changeMedicalFindingHelper(changedValues)
        }
      }else{
        changedValues = {disease: this.new_disease, medicine: this.new_medicine,treator: null } 
        this.changeMedicalFindingHelper(changedValues)
      }
    }else{
      this.showWarnMsg("Das Krankheits und Medizinfeld dürfen nicht leer sein!")
    }
  }

  changeMedicalFindingHelper(changedValues: any){
    this.dashboardService.updateMedicalFinding(this.selectedMedicalFinding!.uid, changedValues).subscribe((res: any)=>{
      this.selectedMedicalFinding = res
      if(this.new_file){
        this.fileshareService.deleteMedicalFindingDocument(res.uid).subscribe(()=>{
          this.changeDocumentfromMedicalFinding()
        }, err=>{
          this.changeDocumentfromMedicalFinding()
        })
      }
    })
  }

  changeDocumentfromMedicalFinding(){
    const formData = new FormData();
    formData.append("medical_finding", this.selectedMedicalFinding!.uid);
    formData.append("file", this.new_file!, this.new_file!.name);
    this.fileshareService.uploadMedicalFindingDocument(formData).subscribe()
    this.resetMedicalFindingValues()
    this.loadMedicalFindings()
    this.showSuccessMsg("Sie haben den medizinischen Befund erfolgreich geändert!")
  }

  deleteReadAccess(key: string){
    if(this.modify_mode){
      this.dashboardService.deleteReadAccessFromMedicalFinding(this.selectedMedicalFinding!.uid, this.currentReadAccessObjects[key].reader.id).subscribe()
    }
  }

  addReadAccess(key:string){
    if(this.validateProfileID(key)){
      if(this.modify_mode){
        const profil_id = {profile_id: key}  
        this.userService.getUserId(profil_id).subscribe((user: any) => {
          const readUser = {reader: user.id}
          this.dashboardService.addReadAccessToMedicalFinding(this.selectedMedicalFinding!.uid, readUser).subscribe((res: any)=>{
            this.currentReadAccessObjects[key] = res
          })
        })
      }
    }else{
      this.selectedUsers.pop()
    }
  }

  validateIfDoctor(){
    return this.user!.role === "DOCTOR"
  }

  validateStringInput(str: string){
    return str !== '' && str !== undefined && str !== null
  }

  resetMedicalFindingValues(){
    this.medicalFindingModel = false
    this.new_disease = ''
    this.new_medicine = ''
    this.new_file = undefined
    this.selectedDoctorID = undefined
    this.selectedUsers = []
    this.currentReadAccessObjects = {}
  }

  validateProfileID(profilId: string){
    return this.profileIdRegex.test(profilId)
  }

  onFileSelected(event: any){
    this.new_file = event.target.files[0]
  }
}