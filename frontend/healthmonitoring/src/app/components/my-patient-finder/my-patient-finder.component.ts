import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { MedicalFinding } from 'src/app/entities/medicalFinding.modal';
import { Patient } from 'src/app/entities/patient.modal';
import { UserService } from 'src/app/services/user-service/user.service';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { MyPatientFinderService } from './service/my-patient-finder.service';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {MessageService} from 'primeng/api';

export interface ReadAccessObject{
  medical_finding: string,
  reader: number,
  uid: string
}

export interface ReadAccessUser{
  [key: string]: any
}

@Component({
  selector: 'app-my-patient-finder',
  templateUrl: './my-patient-finder.component.html',
  styleUrls: ['./my-patient-finder.component.css'],
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
  providers: [MessageService]
})
export class MyPatientFinderComponent implements OnInit {

  medicalFindingList: MedicalFinding[] = []
  user: any 

  profileIdRegex: RegExp = /^[a-zA-Z]{2}#[0-9]{4}$/
  modify_mode: boolean = true
  medicalFindingModel: boolean = false
  selectedMedicalFinding: MedicalFinding | undefined

  new_disease: string | undefined
  new_medicine: string | undefined
  new_file: File | undefined
  selectedUsers: string[] = []
  currentReadAccessObjects: ReadAccessUser = {}

  medicalFindings: MedicalFinding[] = []
  medicalFindingsLight: MedicalFinding[] = []
  patientenListLight: Patient[] = []
  selectedPatient: Patient | undefined

  constructor(private userService: UserService,private messageService: MessageService,private dashboardService: DashboardService,private myPatientFinderService: MyPatientFinderService, private router: Router){}

  ngOnInit(): void {
    this.loadMedicalFindings()
  }

  showWarnMsg(msg: string){
    this.messageService.add({severity:'warn', summary: 'Warn', detail: msg});
  }
  
  showSuccessMsg(msg: string){
    this.messageService.add({severity:'success', summary: 'Success', detail: msg});
  }

  loadMedicalFindings(){
    this.myPatientFinderService.getMedicalFindings().subscribe((medicalFindings: MedicalFinding[])=> {
      this.medicalFindings = medicalFindings
      this.medicalFindingsLight = this.medicalFindings
    })
  }

  filterPatients(event: any){
    let filtered : Patient[] = []
    let query = event.query;
    for(let i = 0; i < this.medicalFindings.length; i++) {
        let patient = this.medicalFindings[i].patient;
        if (patient.patient_profile.patient_id.includes(query)) {
          let checker = true
          for(let j = 0; j < filtered.length; j++){
            if(filtered[j].id===this.medicalFindings[i].patient.id){
              checker = false
              break;
            }
          }
          if(checker){
            filtered.push(this.medicalFindings[i].patient);
          }
        }
    }
    this.patientenListLight = filtered;
  }
  
  loadFilteredMedicalFindings(){
    this.medicalFindingsLight = this.medicalFindings.filter(entry => entry.patient.patient_profile.patient_id === this.selectedPatient?.patient_profile.patient_id)
  }

  deleteDoctorFromList(finding: MedicalFinding){
    this.selectedMedicalFinding = finding
    const changedValues = {treator: null} 
    this.dashboardService.updateMedicalFinding(this.selectedMedicalFinding!.uid, changedValues).subscribe(()=>{
      this.resetMedicalFindingValues()
      this.loadMedicalFindings()
      this.showSuccessMsg("Sie sind nicht länger für den medizinischen Befund verantwortlich!")
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

  validateEmail(email: string): boolean{
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
  }

  displayChangeEntryModel(medicalFinding: MedicalFinding){
    this.selectedMedicalFinding = medicalFinding
    this.selectedUsers = [];
    this.new_disease = medicalFinding.disease
    this.new_medicine = medicalFinding.medicine
    this.new_file = medicalFinding.file;
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

  changeMedicalFinding(){
    if(this.validateStringInput(this.new_medicine!) && this.validateStringInput(this.new_disease!)){
      const changedValues = {disease: this.new_disease, medicine: this.new_medicine} 
      this.dashboardService.updateMedicalFinding(this.selectedMedicalFinding!.uid, changedValues).subscribe(()=>{
        this.resetMedicalFindingValues()
        this.loadMedicalFindings()
        this.showSuccessMsg("Sie haben den medizinischen Befund erfolgreich geändert!")
      })
    }
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
