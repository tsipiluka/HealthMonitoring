import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IMedicalFinding, MedicalFinding } from 'src/app/entities/medicalFinding.modal';
import { LoginService } from '../login/service/login.service';
import { DashboardService } from './service/dashboard.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { FormGroup } from '@angular/forms';
import { FileshareService } from 'src/app/services/fileshare-service/fileshare.service';

export interface ReadAccessObject {
  medical_finding: string;
  reader: number;
  uid: string;
}

export interface ReadAccessUser {
  [key: string]: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('errorState', [
      state(
        'hidden',
        style({
          opacity: 0,
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
        })
      ),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out')),
    ]),
  ],
  providers: [ConfirmationService, MessageService],
})
export class DashboardComponent implements OnInit {

  medicalFindingList: MedicalFinding[] = []
  user: any 

  profileIdRegex = /^[a-zA-Z]{2}#[0-9]{4}$/
  modify_mode = false
  medicalFindingModel = false
  selectedMedicalFinding: MedicalFinding | undefined

  new_disease: string | undefined
  new_comment: string | undefined
  new_file: File | undefined 
  selectedDoctorID: string | undefined
  selectedUsers: string[] = []
  currentReadAccessObjects: ReadAccessUser = {}

  requestLoading = false

  warnMsg: string | undefined

  acceptedFileTypes = ".pdf, .doc, .docx, .xls, .xlsx, .txt, .png, .jpg, .jpeg"
  acceptedMediaTypes: string[] = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "image/png", "image/jpeg"]

  constructor(private userService: UserService,private messageService: MessageService,private loginService: LoginService,
    private dashboardService: DashboardService,  private router: Router, private errorHandler: ErrorHandlerService,
    private fileshareService: FileshareService,private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    const refresh_token = {
      refresh: localStorage.getItem('refresh_token'),
    };
    this.loginService.refreshToken(refresh_token).subscribe(
      (res: any) => {
        localStorage.setItem('access_token', res.access);
        this.userService.getUserInformation().subscribe((userInfo: any) => {
          this.user = userInfo;
          if (!this.validateIfDoctor()) {
            this.loadMedicalFindings();
          }
        });
      },
      err => {
        this.errorHandler.handleError(err);
      }
    );
  }

  refreshToken() {
    const refresh_token = {
      refresh: localStorage.getItem('refresh_token'),
    };
    this.loginService.refreshToken(refresh_token).subscribe((res: any) => {
      localStorage.setItem('access_token', res.access);
    });
  }

  loadMedicalFindings() {
    this.medicalFindingList = [];
    this.dashboardService.loadMedicalFindings().subscribe(
      (res: any) => {
        for (const finding of <MedicalFinding[]>res) {
          this.medicalFindingList.push(<MedicalFinding>finding);
          this.refreshToken();
        }
      },
      err => {
        // ERRORHANDLER
        this.errorHandler.handleError(err);
      }
    );
  }

  deleteMedicalFinding(event: Event, uid: string) {
    console.log(event);
    console.log(uid);
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Sind Sie sich sicher, dass Sie den Befund löschen wollen?',
      header: 'Befund unwiderruflich Löschen',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.dashboardService.deleteMedicalFinding(uid).subscribe(
          (res: any) => {
            this.loadMedicalFindings();
            this.showSuccessMsg('Sie haben den Befund erfolgreich gelöscht!');
            this.refreshToken();
          },
          err => {
            this.errorHandler.handleError(err);
          }
        );
      },
      reject: () => {
        this.showWarnMsg('Sie haben den Befund nicht gelöscht!');
      },
    });
  }

  showWarnMsg(msg: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: msg });
  }

  showSuccessMsg(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  displayAddEntryModel() {
    this.modify_mode = false;
    this.medicalFindingModel = true;
  }

  downloadPdf(finding: any) {
    this.selectedMedicalFinding = <IMedicalFinding>finding;
    this.fileshareService.downloadMedicalFindingDocument(this.selectedMedicalFinding.uid).subscribe(
      (res: any) => {
        const blob: Blob = res.body as Blob;
        const a = document.createElement('a');
        a.download = finding.file.file_name.split('.'+res.body.type.split('/')[1])[0] + '.' + res.body.type.split('/')[1];
        a.href = window.URL.createObjectURL(blob);
        a.click();
        this.refreshToken();
      },
      err => {
        if (err.status === 404) {
          this.showWarnMsg('Es wurde keine medizinische Datei zu dem Befund hochgeladen!');
        }else{
          this.errorHandler.handleError(err);
        }
      }
    );
  }

  displayChangeEntryModel(medicalFinding: MedicalFinding) {
    this.selectedMedicalFinding = medicalFinding;
    this.selectedUsers = [];
    this.new_disease = medicalFinding.disease;
    this.new_comment = medicalFinding.comment;
    this.selectedDoctorID = medicalFinding.treator !== null ? medicalFinding.treator.doctor_profile.doctor_id : undefined;
    this.new_file = undefined;
    this.dashboardService.getReadAccessFromMedicalFinding(medicalFinding.uid).subscribe(
      (user: any) => {
        for (let i = 0; i < user.length; i++) {
          if (user[i]!.reader.role === 'PATIENT') {
            this.currentReadAccessObjects[String(user[i]!.reader.patient_profile.patient_id)] = user[i];
            this.selectedUsers.push(String(user[i]!.reader.patient_profile.patient_id));
          } else {
            this.currentReadAccessObjects[String(user[i]!.reader.doctor_profile.doctor_id)] = user[i];
            this.selectedUsers.push(String(user[i]!.reader.doctor_profile.doctor_id));
          }
          this.refreshToken();
        }
        this.selectedUsers = [...this.selectedUsers];
        this.modify_mode = true;
        this.medicalFindingModel = true;
      },
      err => {
        this.errorHandler.handleError(err);
      }
    );
  }

  getModifyEntryModelHeader() {
    return this.modify_mode ? 'Bitte nehmen Sie ihre Änderungen vor' : 'Füge einen neuen Eintrag hinzu';
  }

  createNewMedicalFinding() {
    this.requestLoading = true;
    if (this.validateStringInput(this.new_disease!) && this.validateStringInput(this.new_comment!)) {
      if (!this.validateStringInput(this.selectedDoctorID!)) {
        const medicalFinding_info = {
          disease: this.new_disease,
          comment: this.new_comment,
        };
        this.createNewMedicalFindingHelper(medicalFinding_info);
      } else {
        const doctorID = { profile_id: this.selectedDoctorID! };
        this.userService.getUserId(doctorID).subscribe(
          (user: any) => {
            const medicalFinding_info = {
              disease: this.new_disease,
              comment: this.new_comment,
              treator: user.id,
            };
            this.createNewMedicalFindingHelper(medicalFinding_info);
            this.refreshToken();
          },
          err => {
            this.errorHandler.handleError(err);
          }
        );
      }
    } else {
      this.requestLoading = false;
      this.warnMsg = 'Bitte tragen Sie eine Krankheit ein und Beschreiben Sie den Befund!';
      this.showWarnMsg(this.warnMsg);
    }
  }

  createNewMedicalFindingHelper(medicalFinding_info: any) {
    this.dashboardService.createMedicalFinding(medicalFinding_info).subscribe(
      (medicalFinding: any) => {
        if (this.new_file) {
          const formData = new FormData();
          formData.append('medical_finding', medicalFinding.uid);
          formData.append('file', this.new_file, this.new_file.name);
          this.fileshareService.uploadMedicalFindingDocument(formData).subscribe(
            () => {
              this.createNewMedicalFindingHelper2(medicalFinding);
            },
            err => {
              this.errorHandler.handleError(err);
            }
          );
        } else {
          this.createNewMedicalFindingHelper2(medicalFinding);
        }
        this.refreshToken();
      },
      err => {
        this.errorHandler.handleError(err);
        this.requestLoading = false;
        this.showWarnMsg('Der Befund konnte nicht hinzugefügt werden! Sie haben einen ungültigen Arzt eingetragen!');
      }
    );
  }

  createNewMedicalFindingHelper2(medicalFinding: any) {
    for (let i = 0; i < this.selectedUsers.length; i++) {
      const profil_id = { profile_id: this.selectedUsers[i] };
      this.userService.getUserId(profil_id).subscribe(
        (user2: any) => {
          const readUser = { reader: user2.id };
          this.dashboardService.addReadAccessToMedicalFinding(medicalFinding.uid, readUser).subscribe();
          this.refreshToken();
        },
        err => {
          this.showWarnMsg(profil_id.profile_id + ' konnte nicht hinzugefügt werden!');
          this.errorHandler.handleError(err);
        }
      );
    }
    this.showSuccessMsg('Sie haben einen medizinischen Befund erfolgreich hinzugefügt!');
    this.resetMedicalFindingValues();
    this.loadMedicalFindings();
  }

  getKeys(list: any): string[] {
    return Object.keys(list);
  }

  changeMedicalFinding() {
    this.requestLoading = true;
    if (this.validateStringInput(this.new_comment!) && this.validateStringInput(this.new_disease!)) {
      let changedValues = {};
      if (this.validateStringInput(this.selectedDoctorID!)) {
        if (this.validateProfileID(this.selectedDoctorID!)) {
          const profil_id = { profile_id: this.selectedDoctorID };
          this.userService.getUserId(profil_id).subscribe(
            (user: any) => {
              changedValues = { disease: this.new_disease, comment: this.new_comment, treator: user.id };
              this.changeMedicalFindingHelper(changedValues);
              this.refreshToken();
            },
            err => {
              this.errorHandler.handleError(err);
            }
          );
        } else {
          this.requestLoading = false;
          this.warnMsg = 'Bitte tragen Sie einen gültige ArztId ein!';
          this.showWarnMsg(this.warnMsg);
        }
      } else {
        changedValues = { disease: this.new_disease, comment: this.new_comment, treator: null };
        this.changeMedicalFindingHelper(changedValues);
      }
    } else {
      this.requestLoading = false;
      this.warnMsg = 'Bitte tragen Sie eine Krankheit ein und Beschreiben Sie den Befund!';
      this.showWarnMsg(this.warnMsg);
    }
  }

  changeMedicalFindingHelper(changedValues: any) {
    this.dashboardService.updateMedicalFinding(this.selectedMedicalFinding!.uid, changedValues).subscribe((res: any) => {
      this.selectedMedicalFinding = res;
      if (this.new_file) {
        this.fileshareService.deleteMedicalFindingDocument(res.uid).subscribe(
          () => {
            this.changeDocumentfromMedicalFinding();
            this.refreshToken();
          },
          err => {
            this.changeDocumentfromMedicalFinding();
            this.errorHandler.handleError(err);
          }
        );
      } else {
        this.loadAfterChange();
      }
    });
  }

  changeDocumentfromMedicalFinding() {
    const formData = new FormData();
    formData.append('medical_finding', this.selectedMedicalFinding!.uid);
    formData.append('file', this.new_file!, this.new_file!.name);
    this.fileshareService.uploadMedicalFindingDocument(formData).subscribe(() => {
      this.loadAfterChange();
    });
  }

  loadAfterChange() {
    this.resetMedicalFindingValues();
    this.loadMedicalFindings();
    this.showSuccessMsg('Sie haben den medizinischen Befund erfolgreich geändert!');
  }

  deleteReadAccess(key: string) {
    if (this.modify_mode) {
      this.dashboardService
        .deleteReadAccessFromMedicalFinding(this.selectedMedicalFinding!.uid, this.currentReadAccessObjects[key].reader.id)
        .subscribe();
    }
  }

  addReadAccess(key: string) {
    if (this.validateProfileID(key)) {
      if (this.modify_mode) {
        const profil_id = { profile_id: key };
        this.userService.getUserId(profil_id).subscribe(
          (user: any) => {
            const readUser = { reader: user.id };
            this.dashboardService.addReadAccessToMedicalFinding(this.selectedMedicalFinding!.uid, readUser).subscribe(
              (res: any) => {
                this.currentReadAccessObjects[key] = res;
              },
              err => {
                this.showWarnMsg(key + ' konnte nicht hinzugefügt werden!');
                this.errorHandler.handleError(err);
              }
            );
            this.refreshToken();
          },
          err => {
            this.showWarnMsg(key + ' konnte nicht hinzugefügt werden!');
            this.errorHandler.handleError(err);
          }
        );
      }
    } else {
      this.selectedUsers.pop();
    }
  }

  validateIfDoctor() {
    return this.user!.role === 'DOCTOR';
  }

  validateStringInput(str: string) {
    return str !== '' && str !== undefined && str !== null;
  }

  resetMedicalFindingValues() {
    this.medicalFindingModel = false;
    this.requestLoading = false;
    this.new_disease = '';
    this.new_comment = '';
    this.new_file = undefined;
    this.selectedDoctorID = undefined;
    this.selectedUsers = [];
    this.currentReadAccessObjects = {};
  }

  validateProfileID(profilId: string) {
    return this.profileIdRegex.test(profilId);
  }

  onFileSelected(event: any) {
    if (this.acceptedMediaTypes.includes(event.target.files[0].type)) {
      this.new_file = event.target.files[0];
    } else {
      this.new_file = undefined;
      this.warnMsg = 'Bitte wählen Sie eine Datei mit einer der folgenden Endungen aus: ' + this.acceptedFileTypes;
      this.showWarnMsg(this.warnMsg);
    }
  }
}
