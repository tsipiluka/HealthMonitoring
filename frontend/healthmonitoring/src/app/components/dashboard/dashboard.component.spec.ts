import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { IMedicalFinding } from 'src/app/entities/medicalFinding.modal';

describe('DashboardComponent', () => {
  let dashboardComponent: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let location: Location
  let router: Router

  const user = {id:1, email:'test@test.de', first_name:'test',last_name:'test',
  birth_date: new Date, role: 'PATIENT'}
  const disease = 'testDisease'
  const comment = 'testComment'
  const medical_finding: any = {uid:'12112', disease: disease, comment: comment, patient:user}


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes),HttpClientTestingModule],
      declarations: [ DashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    location = TestBed.get(Location);
    router = TestBed.get(Router)
    dashboardComponent = fixture.componentInstance;
    dashboardComponent.user = user
    router.initialNavigation();
  });

  it('should create', () => {
    expect(dashboardComponent).toBeTruthy();
  });

  describe('Add a new Medical Finding', () => {
    it('Open add Entry Modal', fakeAsync(() => {
      spyOn(dashboardComponent, 'displayAddEntryModel');
      dashboardComponent.displayAddEntryModel();
      tick();
      expect(dashboardComponent.displayAddEntryModel).toHaveBeenCalled();
    }));
    
    it('Create a new MedicalFinding without input data', fakeAsync(() => {
      dashboardComponent.createNewMedicalFinding();
      tick();
      expect(dashboardComponent.warnMsg).toBe('Bitte tragen Sie eine Krankheit ein und Beschreiben Sie den Befund!');
    }));
    
    it('Create a new MedicalFinding with given disease and comment', fakeAsync(() => {
      dashboardComponent.new_disease = disease;
      dashboardComponent.new_comment = comment
      dashboardComponent.createNewMedicalFinding();
      tick();
      expect(dashboardComponent.warnMsg).toBeUndefined();
    }));
  })

  describe('Change a Medical Finding', () => {
    it('Open change Entry Modal', fakeAsync(() => {
      spyOn(dashboardComponent, 'displayChangeEntryModel');
      dashboardComponent.displayChangeEntryModel(<IMedicalFinding>medical_finding);
      tick();
      expect(dashboardComponent.displayChangeEntryModel).toHaveBeenCalled();
    }));
    
    it('Change a MedicalFinding without input data', fakeAsync(() => {
      dashboardComponent.changeMedicalFinding();
      tick();
      expect(dashboardComponent.requestLoading).toBe(false);
      expect(dashboardComponent.warnMsg).toBe('Bitte tragen Sie eine Krankheit ein und Beschreiben Sie den Befund!');
    }));

    it('Change a MedicalFinding without comment', fakeAsync(() => {
      dashboardComponent.new_disease = disease;
      dashboardComponent.changeMedicalFinding();
      tick();
      expect(dashboardComponent.requestLoading).toBe(false);
      expect(dashboardComponent.warnMsg).toBe('Bitte tragen Sie eine Krankheit ein und Beschreiben Sie den Befund!');
    }));

    it('Change a MedicalFinding without disease', fakeAsync(() => {
      dashboardComponent.new_comment = comment;
      dashboardComponent.changeMedicalFinding();
      tick();
      expect(dashboardComponent.requestLoading).toBe(false);
      expect(dashboardComponent.warnMsg).toBe('Bitte tragen Sie eine Krankheit ein und Beschreiben Sie den Befund!');
    }));

    it('Change a MedicalFinding with required disease and comment', fakeAsync(() => {
      dashboardComponent.selectedMedicalFinding = medical_finding;
      dashboardComponent.new_disease = disease;
      dashboardComponent.new_comment = comment;
      dashboardComponent.changeMedicalFinding();
      tick();
      expect(dashboardComponent.warnMsg).toBeUndefined();
    }));

    it('Change a MedicalFinding with required disease and comment and faulty doctorid', fakeAsync(() => {
      dashboardComponent.new_disease = disease;
      dashboardComponent.new_comment = comment;
      dashboardComponent.selectedDoctorID = 'BD#12341';
      dashboardComponent.changeMedicalFinding();
      tick();
      expect(dashboardComponent.requestLoading).toBe(false);
      expect(dashboardComponent.warnMsg).toBe('Bitte tragen Sie einen gültige ArztId ein!')
    }));
  });

  describe('File upload Test', () => {
    it('Test Upload Function', fakeAsync(() => {
      spyOn(dashboardComponent, 'onFileSelected');
      dashboardComponent.onFileSelected(event);
      tick();
      expect(dashboardComponent.onFileSelected).toHaveBeenCalled();
    }));

    it('Upload file with invalid type', fakeAsync(() => {
      const event = {
        target: {
          files: [
            {
              name: 'test',
              type: 'application/octet-stream'
            }
          ]
        }
      }
      dashboardComponent.onFileSelected(event);
      tick();
      expect(dashboardComponent.new_file).toBeUndefined();
      expect(dashboardComponent.warnMsg).toBe('Bitte wählen Sie eine Datei mit einer der folgenden Endungen aus: ' + dashboardComponent.acceptedFileTypes);
    }));

    it('Upload file with valid type', fakeAsync(() => {
      const event = {
        target: {
          files: [
            {
              name: 'test',
              type: 'application/pdf'
            }
          ]
        }
      }
      dashboardComponent.onFileSelected(event);
      tick();
      expect(dashboardComponent.new_file).not.toBeUndefined();
      expect(dashboardComponent.warnMsg).toBeUndefined();
    }));
  });
});


