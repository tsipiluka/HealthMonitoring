import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { MedicalFinding } from 'src/app/entities/medicalFinding.modal';
import { Patient } from 'src/app/entities/patient.modal';
import { User } from 'src/app/entities/user.modal';
import { FileshareService } from 'src/app/services/fileshare-service/fileshare.service';
import { LoginService } from '../login/service/login.service';
import { MedicalFindingFinderService } from './service/medical-finding-finder.service';

@Component({
  selector: 'app-medical-finding-finder',
  templateUrl: './medical-finding-finder.component.html',
  styleUrls: ['./medical-finding-finder.component.css'],
  providers: [MessageService]
})
export class MedicalFindingFinderComponent {

  medicalFindings: MedicalFinding[] = []
  medicalFindingsLight: MedicalFinding[] = []
  patientenListLight: Patient[] = []
  selectedPatient: Patient | undefined
  selectedMedicalFinding: MedicalFinding | undefined

  constructor(private medicalFindingFinderService: MedicalFindingFinderService, private messageService: MessageService,private fileshareService: FileshareService,private errorHandler: ErrorHandlerService, private loginService: LoginService,private router: Router){}

  ngOnInit(): void {
    const refresh_token = {
      "refresh": localStorage.getItem('refresh_token')
    } 
    this.loginService.refreshToken(refresh_token).subscribe((res: any) => {
      localStorage.setItem('access_token', res.access)
      this.loadMedicalFindings()
    },err=>{
      this.errorHandler.handleError(err)
    })
  }

  loadMedicalFindings(){
    this.medicalFindingFinderService.getMedicalFindings().subscribe((medicalFindings: MedicalFinding[])=> {
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

  showWarnMsg(msg: string){
    this.messageService.add({severity:'warn', summary: 'Warn', detail: msg});
  }
  
  loadFilteredMedicalFindings(){
    this.medicalFindingsLight = this.medicalFindings.filter(entry => entry.patient.patient_profile.patient_id === this.selectedPatient?.patient_profile.patient_id)
  }

  validateEmail(email: string): boolean{
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
  }
}
