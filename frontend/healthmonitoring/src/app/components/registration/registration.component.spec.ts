import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegistrationComponent } from './registration.component';
import { environment } from '../../../environments/environment.prod'
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';

describe('RegistrationComponent', () => {
  let registrationComponent: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let location: Location
  let router: Router


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule.withRoutes(routes), HttpClientTestingModule],
      declarations: [ RegistrationComponent ],
      providers: [{provide: 'CAPTCHA_SITEKEY', useValue: environment.CAPTCHA_SITEKEY}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    location = TestBed.get(Location);
    router = TestBed.get(Router)
    registrationComponent = fixture.componentInstance;
    router.initialNavigation();
  });

  it('should create', () => {
    expect(registrationComponent).toBeTruthy();
  });

  it('empty registration', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBe('Bitte tragen Sie ihren Vornamen ein!');
    expect(location.path()).toBe('/registration');
  }));

  it('registration with firstname', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.firstname = 'Max';
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBe('Bitte tragen Sie ihren Nachnamen ein!');
    expect(location.path()).toBe('/registration');
  }));

  it('registration with firstname and lastname', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.firstname = 'Max';
    registrationComponent.lastname = 'Mustermann';
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBe('Bitte tragen Sie ihr Geburtsdatum ein!');
    expect(location.path()).toBe('/registration');
  }));

  it('registration with firstname, lastname and birthday', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.firstname = 'Max';
    registrationComponent.lastname = 'Mustermann';
    registrationComponent.birthday = '01.01.2000';
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBe('Bitte tragen Sie eine gültige Email ein!');
    expect(location.path()).toBe('/registration');
  }));

  it('registration with firstname, lastname, birthday and faulty email', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.firstname = 'Max';
    registrationComponent.lastname = 'Mustermann';
    registrationComponent.birthday = '01.01.2000';
    registrationComponent.email = 'test.de'
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBe('Bitte tragen Sie eine gültige Email ein!');
    expect(location.path()).toBe('/registration');
  }));

  it('registration with firstname, lastname, birthday and correct email', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.firstname = 'Max';
    registrationComponent.lastname = 'Mustermann';
    registrationComponent.birthday = '01.01.2000';
    registrationComponent.email = 'tester@tester.de'
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBe('Das Password entspricht nicht den Anforderungen!');
    expect(location.path()).toBe('/registration');
  }));

  it('registration with firstname, lastname, birthday, correct email and faulty password', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.firstname = 'Max';
    registrationComponent.lastname = 'Mustermann';
    registrationComponent.birthday = '01.01.2000';
    registrationComponent.email = 'tester@tester.de'
    registrationComponent.password1 = 'test'
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBe('Das Password entspricht nicht den Anforderungen!');
    expect(location.path()).toBe('/registration');
  }));

  it('registration with firstname, lastname, birthday, correct email and correct password', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.firstname = 'Max';
    registrationComponent.lastname = 'Mustermann';
    registrationComponent.birthday = '01.01.2000';
    registrationComponent.email = 'tester@tester.de'
    registrationComponent.password1 = 'Tester123321+'
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBe('Die eingetragenen Passwörter sind nicht gleich!');
    expect(location.path()).toBe('/registration');
  }));

  it('registration with firstname, lastname, birthday, correct email, correct password and faulty password confirmation', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.firstname = 'Max';
    registrationComponent.lastname = 'Mustermann';
    registrationComponent.birthday = '01.01.2000';
    registrationComponent.email = 'tester@tester.de'
    registrationComponent.password1 = 'Tester123321+'
    registrationComponent.password2 = 'Tester123321'
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBe('Die eingetragenen Passwörter sind nicht gleich!');
    expect(location.path()).toBe('/registration');
  }));

  it('registration with firstname, lastname, birthday, correct email, correct password and correct password confirmation', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.firstname = 'Max';
    registrationComponent.lastname = 'Mustermann';
    registrationComponent.birthday = '01.01.2000';
    registrationComponent.email = 'tester@tester.de'
    registrationComponent.password1 = 'Tester123321+'
    registrationComponent.password2 = 'Tester123321+'
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBe('Bitte bestätigen Sie das Captcha!');
    expect(location.path()).toBe('/registration');
  }));

  it('correct registration', fakeAsync(() => {
    router.navigate(['/registration']);
    tick()
    registrationComponent.firstname = 'Max';
    registrationComponent.lastname = 'Mustermann';
    registrationComponent.birthday = '01.01.2000';
    registrationComponent.email = 'tester@tester.de'
    registrationComponent.password1 = 'Tester123321+'
    registrationComponent.password2 = 'Tester123321+'
    registrationComponent.captchaSuccess(event);
    registrationComponent.registerUser();
    expect(registrationComponent.warnMsg).toBeUndefined();
  }));
});