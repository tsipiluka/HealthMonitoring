import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { environment } from 'src/environments/environment.prod';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';

describe('LoginComponent', () => {
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule],
      declarations: [ LoginComponent ],
      providers: [{provide: 'CAPTCHA_SITEKEY', useValue: environment.CAPTCHA_SITEKEY}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    location = TestBed.get(Location);
    router = TestBed.get(Router)
    loginComponent = fixture.componentInstance;
    router.initialNavigation();
  });

  it('should create', () => {
    expect(loginComponent).toBeTruthy();
  });

  it('faulty email', fakeAsync(() => {
    router.navigate(['/login']);
    tick()
    loginComponent.email = 'test.de'
    loginComponent.login();
    expect(loginComponent.warnMsg).toBe('Bitte tragen Sie eine gültige Email ein!');
    expect(location.path()).toBe('/login');
  }));

  it('correct email', fakeAsync(() => {
    router.navigate(['/login']);
    tick()
    loginComponent.email = 'test@test.de'
    loginComponent.login();
    expect(loginComponent.warnMsg).toBe('Das Password entspricht nicht den Anforderungen!');
    expect(location.path()).toBe('/login');
  }));

  it('correct email and false password', fakeAsync(() => {
    router.navigate(['/login']);
    tick()
    loginComponent.email = 'test@test.de'
    loginComponent.password = 'Tester123321';
    loginComponent.login();
    expect(loginComponent.warnMsg).toBe('Das Password entspricht nicht den Anforderungen!');
    expect(location.path()).toBe('/login');
  }));

  it('correct email and correct password', fakeAsync(() => {
    router.navigate(['/login']);
    tick()
    loginComponent.email = 'test@test.de'
    loginComponent.password = 'Tester123321+';
    loginComponent.login();
    expect(loginComponent.warnMsg).toBe('Bitte bestätigen Sie das Captcha!');
    expect(location.path()).toBe('/login');
  }));

  it('correct login', fakeAsync(() => {
    router.navigate(['/login']);
    tick()
    loginComponent.email = 'test@test.de'
    loginComponent.password = 'Tester123321+';
    loginComponent.captchaSuccess(event);
    loginComponent.login();
    expect(loginComponent.warnMsg).toBeUndefined();
    expect(location.path()).toBe('/login');
  }));
});