import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { MedicalFinding } from 'src/app/entities/medicalFinding.modal';
import { Patient } from 'src/app/entities/patient.modal';
import { User } from 'src/app/entities/user.modal';
import { MedicalFindingFinderService } from './service/medical-finding-finder.service';

@Component({
  selector: 'app-medical-finding-finder',
  templateUrl: './medical-finding-finder.component.html',
  styleUrls: ['./medical-finding-finder.component.css']
})
export class MedicalFindingFinderComponent {

  medicalFindings: MedicalFinding[] = []
  medicalFindingsLight: MedicalFinding[] = []
  patientenListLight: Patient[] = []
  selectedPatient: Patient | undefined

  constructor(private medicalFindingFinderService: MedicalFindingFinderService, private router: Router){}

  ngOnInit(): void {
    this.loadMedicalFindings()
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
          filtered.push(this.medicalFindings[i].patient);
        }
    }
    this.patientenListLight = filtered;
  }
  
  loadFilteredMedicalFindings(){
    this.medicalFindingsLight = this.medicalFindings.filter(entry => entry.patient.patient_profile.patient_id === this.selectedPatient?.patient_profile.patient_id)
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
}
