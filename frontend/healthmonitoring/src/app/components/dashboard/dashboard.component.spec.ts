import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { User } from 'src/app/entities/user.modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let dashboardComponent: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let location: Location
  let router: Router

  const user = {id:1, email:'test@test.de', first_name:'test',last_name:'test',
  birth_date: new Date, role: 'PATIENT'}
  const disease = 'testDisease'
  const comment = 'testComment'

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
});
