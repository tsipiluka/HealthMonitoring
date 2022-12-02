import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { MedicalFinding } from 'src/app/entities/medicalFinding.modal';
import { MyPatientFinderService } from './service/my-patient-finder.service';

@Component({
  selector: 'app-my-patient-finder',
  templateUrl: './my-patient-finder.component.html',
  styleUrls: ['./my-patient-finder.component.css']
})
export class MyPatientFinderComponent implements OnInit {

  selectedPatientEmail: string | undefined
  medicalFindings: MedicalFinding[] = []

  constructor(private myPatientFinderService: MyPatientFinderService, private router: Router){}

  ngOnInit(): void {
    this.myPatientFinderService.getUserInformation().subscribe((res: any)=>{
      if(res.role === "PATIENT"){
        this.router.navigate(['dashboard'])
      }
    })
  }

  searchMedicalFindings(){
    if(this.validateEmail(this.selectedPatientEmail!)){
      this.myPatientFinderService.getMedicalFindings().subscribe((medicalFindings: MedicalFinding[])=> {
        this.medicalFindings = medicalFindings
      })
    }
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
