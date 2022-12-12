import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavComponent } from './nav.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';

describe('NavComponent', () => {
  let navbarComponent: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let location: Location
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes),HttpClientTestingModule],
      declarations: [ NavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    location = TestBed.get(Location);
    router = TestBed.get(Router)
    navbarComponent = fixture.componentInstance;
    router.initialNavigation();
  });

  it('should create', () => {
    expect(navbarComponent).toBeTruthy();
  });

  it('Testing Logout Button', fakeAsync(() => {
    router.navigate(['dashboard']);
    tick()
    expect(location.path()).toBe('/dashboard');
    spyOn(navbarComponent, 'logout');
    fixture.debugElement.nativeElement.querySelector('#logoutBtnID').click();
    expect(navbarComponent.logout).toHaveBeenCalled();
    router.navigate(['login']);
    tick()
    expect(location.path()).toBe('/login');
  }));

  it('Testing Dashboard Button', fakeAsync(() => {
    router.navigate(['profile']);
    tick()
    expect(location.path()).toBe('/profile');
    spyOn(navbarComponent, 'redirectToGivenPage');
    fixture.debugElement.nativeElement.querySelector('#dashboardBtnID').click();
    expect(navbarComponent.redirectToGivenPage).toHaveBeenCalled();
    router.navigate(['dashboard']);
    tick()
    expect(location.path()).toBe('/dashboard');
  }));

  it('Testing Profile Button', fakeAsync(() => {
    router.navigate(['dashboard']);
    tick()
    spyOn(navbarComponent, 'redirectToGivenPage');
    fixture.debugElement.nativeElement.querySelector('#profileBtnID').click();
    expect(navbarComponent.redirectToGivenPage).toHaveBeenCalled();
    router.navigate(['profile']);
    tick()
    expect(location.path()).toBe('/profile');
  }));

  it('Testing MedicalFindingFinder Button', fakeAsync(() => {
    router.navigate(['dashboard']);
    tick()
    spyOn(navbarComponent, 'redirectToGivenPage');
    fixture.debugElement.nativeElement.querySelector('#medicalFindingFinderBtnID').click();
    expect(navbarComponent.redirectToGivenPage).toHaveBeenCalled();
    navbarComponent.redirectToGivenPage('medicalFindingFinder');
    router.navigate(['medicalFindingFinder']);
    tick()
    expect(location.path()).toBe('/medicalFindingFinder');
  }));
});
