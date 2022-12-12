import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserPasswordResetComponent } from './user-password-reset.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { routes } from 'src/app/app-routing.module';

describe('UserPasswordResetComponent', () => {
  let userPasswordResetComponent: UserPasswordResetComponent;
  let fixture: ComponentFixture<UserPasswordResetComponent>;
  let location: Location
  let router: Router

  const token = '123456abcdef'


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes)],
      declarations: [ UserPasswordResetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPasswordResetComponent);
    location = TestBed.get(Location);
    router = TestBed.get(Router)
    userPasswordResetComponent = fixture.componentInstance;
    router.initialNavigation();
  });

  it('should create', () => {
    expect(userPasswordResetComponent).toBeTruthy();
  });

  it('empty password reset', fakeAsync(() => {
    router.navigate(['/password-reset/'+token]);
    tick()
    userPasswordResetComponent.resetPassword();
    expect(userPasswordResetComponent.warnMsg).toBe('Ihr eingegebenes Passwort entspricht nicht den Anforderungen!');
    expect(location.path()).toBe('/password-reset/'+token);
  }));

  it('password reset with faulty password', fakeAsync(() => {
    router.navigate(['/password-reset/'+token]);
    tick()
    userPasswordResetComponent.new_password1 = '123456';
    userPasswordResetComponent.resetPassword();
    expect(userPasswordResetComponent.warnMsg).toBe('Ihr eingegebenes Passwort entspricht nicht den Anforderungen!');
    expect(location.path()).toBe('/password-reset/'+token);
  }));

  it('password reset with correct password', fakeAsync(() => {
    router.navigate(['/password-reset/'+token]);
    tick()
    userPasswordResetComponent.new_password1 = 'Tester123321+';
    userPasswordResetComponent.resetPassword();
    expect(userPasswordResetComponent.warnMsg).toBe('Ihre eingegebenen Passwörter stimmen nicht überein!');
    expect(location.path()).toBe('/password-reset/'+token);
  }));

  it('password reset with correct password and wrong password confirmation', fakeAsync(() => {
    router.navigate(['/password-reset/'+token]);
    tick()
    userPasswordResetComponent.new_password1 = 'Tester123321+';
    userPasswordResetComponent.new_password2 = 'Tester123321';
    userPasswordResetComponent.resetPassword();
    expect(userPasswordResetComponent.warnMsg).toBe('Ihre eingegebenen Passwörter stimmen nicht überein!');
    expect(location.path()).toBe('/password-reset/'+token);
  }));

  it('correct passwort reset flow', fakeAsync(() => {
    router.navigate(['/password-reset/'+token]);
    tick()
    userPasswordResetComponent.new_password1 = 'Tester123321+';
    userPasswordResetComponent.new_password2 = 'Tester123321+';
    userPasswordResetComponent.resetPassword();
    expect(userPasswordResetComponent.warnMsg).toBeUndefined();
    expect(location.path()).toBe('/password-reset/'+token);
  }));
});
