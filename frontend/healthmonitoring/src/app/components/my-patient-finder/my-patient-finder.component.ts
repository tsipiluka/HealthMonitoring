import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMedicalFinding, MedicalFinding } from 'src/app/entities/medicalFinding.modal';
import { Patient } from 'src/app/entities/patient.modal';
import { UserService } from 'src/app/services/user-service/user.service';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { MyPatientFinderService } from './service/my-patient-finder.service';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {ConfirmationService, MessageService} from 'primeng/api';
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
  providers: [ConfirmationService, MessageService]
})
export class MyPatientFinderComponent implements OnInit {

  medicalFindingList: MedicalFinding[] = []
  user: any 

  profileIdRegex: RegExp = /^[a-zA-Z]{2}#[0-9]{4}$/
  modify_mode: boolean = true
  medicalFindingModel: boolean = false
  selectedMedicalFinding: MedicalFinding | undefined

  new_disease: string | undefined
  new_comment: string | undefined
  new_file: File | undefined
  selectedUsers: string[] = []
  currentReadAccessObjects: ReadAccessUser = {}

  medicalFindings: MedicalFinding[] = []
  medicalFindingsLight: MedicalFinding[] = []
  patientenListLight: Patient[] = []
  selectedPatient: Patient | undefined

  requestLoading: boolean = false

  acceptedFileTypes: string = ".pdf, .doc, .docx, .xls, .xlsx, .txt, .png, .jpg, .jpeg"
  acceptedMediaTypes: string[] = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "image/png", "image/jpeg"]

  constructor(private userService: UserService,private fileshareService: FileshareService,private messageService: MessageService,
    private dashboardService: DashboardService,private myPatientFinderService: MyPatientFinderService, private router: Router,
    private confirmationService: ConfirmationService){}

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

  deleteDoctorFromList(event: Event, finding: MedicalFinding){
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Sind Sie sich sicher, dass Sie nicht weiter als Arzt für den ausgwählten Befund verantwortlich sein wollen?',
      header: 'Medinizische Untersuchung verlassen',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.selectedMedicalFinding = finding
        const changedValues = {treator: null} 
        this.dashboardService.updateMedicalFinding(this.selectedMedicalFinding!.uid, changedValues).subscribe(()=>{
          this.resetMedicalFindingValues()
          this.loadMedicalFindings()
          this.showSuccessMsg("Sie sind nicht länger für den medizinischen Befund verantwortlich!")
        })
      }
    });
  }

  downloadPdf(finding: any){
    this.selectedMedicalFinding = <IMedicalFinding>finding
    this.fileshareService.downloadMedicalFindingDocument(this.selectedMedicalFinding.uid).subscribe((res: any) => {
      let blob: Blob = res.body as Blob;
      let a = document.createElement('a')
      a.download= finding.file.file_name+'.'+res.body.type.split('/')[1]
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
    this.new_comment = medicalFinding.comment
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

  changeMedicalFinding(){
    this.requestLoading = true
    if(this.validateStringInput(this.new_comment!) && this.validateStringInput(this.new_disease!)){
      const changedValues = {disease: this.new_disease, comment: this.new_comment} 
      this.dashboardService.updateMedicalFinding(this.selectedMedicalFinding!.uid, changedValues).subscribe((res: any)=>{
        this.selectedMedicalFinding = res
        if(this.new_file){
          this.fileshareService.deleteMedicalFindingDocument(res.uid).subscribe(()=>{
            this.changeDocumentfromMedicalFinding()
          }, err=>{
            this.changeDocumentfromMedicalFinding()
          })
        }else{
          this.loadAfterChange()
        }
      })
    }else{
      this.requestLoading = false
      this.showWarnMsg("Das Krankheits und Kommentarfeld dürfen nicht leer sein!")
    }
  }

  changeDocumentfromMedicalFinding(){
    const formData = new FormData();
    formData.append("medical_finding", this.selectedMedicalFinding!.uid);
    formData.append("file", this.new_file!, this.new_file!.name);
    this.fileshareService.uploadMedicalFindingDocument(formData).subscribe(()=>{
      this.loadAfterChange()
    })
  }

  loadAfterChange(){
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
    this.requestLoading = false
    this.new_disease = ''
    this.new_comment = ''
    this.selectedUsers = []
    this.currentReadAccessObjects = {}
  }

  validateProfileID(profilId: string){
    return this.profileIdRegex.test(profilId)
  }
  
  onFileSelected(event: any){
    if(this.acceptedMediaTypes.includes(event.target.files[0].type)){
      this.new_file = event.target.files[0]
    }else{
      this.new_file = undefined
      this.showWarnMsg("Bitte wählen Sie eine Datei mit einer der folgenden Endungen aus: "+this.acceptedFileTypes)
    }
  }
}
