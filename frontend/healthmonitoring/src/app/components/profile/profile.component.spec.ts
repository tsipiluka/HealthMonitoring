import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileComponent } from './profile.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';

describe('ProfileComponent', () => {
  let profileComponent: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let location: Location
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes),HttpClientTestingModule],
      declarations: [ ProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    location = TestBed.get(Location);
    router = TestBed.get(Router)
    profileComponent = fixture.componentInstance;
    router.initialNavigation();
  });

  it('should create', () => {
    expect(profileComponent).toBeTruthy();
  });

  describe('Reset Password', () => {
    it('Check if reset Passwort function works', fakeAsync(() => {
      router.navigate(['profile']);
      spyOn(profileComponent, 'resetPassword');
      fixture.debugElement.nativeElement.querySelector('#resetPasswordBtn').click();
      tick();
      expect(profileComponent.resetPassword).toHaveBeenCalled();
      expect(location.path()).toBe('/profile');
    }));
  
    it('Try to reset password with no input', fakeAsync(() => {
      router.navigate(['profile']);
      fixture.debugElement.nativeElement.querySelector('#resetPasswordBtn').click();
      tick();
      expect(profileComponent.warnMsg).toBe('Das alte Passwort ist nicht korrekt!');
      expect(location.path()).toBe('/profile');
    }));
  
    it('Try to reset password with unvalid old password', fakeAsync(() => {
      router.navigate(['profile']);
      profileComponent.old_password = 'unvalidpasswort';
      fixture.debugElement.nativeElement.querySelector('#resetPasswordBtn').click();
      tick();
      expect(profileComponent.warnMsg).toBe('Das alte Passwort ist nicht korrekt!');
      expect(location.path()).toBe('/profile');
    }));
  
    it('Try to reset password with valid old password and unvalid new password', fakeAsync(() => {
      router.navigate(['profile']);
      profileComponent.old_password = 'Tester123321+';
      profileComponent.new_password1 = 'unvalidpasswort';
      fixture.debugElement.nativeElement.querySelector('#resetPasswordBtn').click();
      tick();
      expect(profileComponent.warnMsg).toBe('Das neue Passwort entspricht nicht den Anforderungen!');
      expect(location.path()).toBe('/profile');
    }));
  
    it('Try to reset password with valid old password and valid new password and unvalid new password confirmation', fakeAsync(() => {
      router.navigate(['profile']);
      profileComponent.old_password = 'Tester123321+';
      profileComponent.new_password1 = 'NewValidPasswort123321+';
      fixture.debugElement.nativeElement.querySelector('#resetPasswordBtn').click();
      tick();
      expect(profileComponent.warnMsg).toBe('Die beiden Passwörter stimmen nicht überein!');
      expect(location.path()).toBe('/profile');
    }));
  
    it('Try to reset password with valid old password, valid new password and valid new password confirmation', fakeAsync(() => {
      profileComponent.old_password = 'Tester123321+';
      profileComponent.new_password1 = 'NewValidPasswort123321+';
      profileComponent.new_password2 = 'NewValidPasswort123321+';
      fixture.debugElement.nativeElement.querySelector('#resetPasswordBtn').click();
      tick();
      expect(profileComponent.warnMsg).toBeUndefined();
    }));
  });

  describe('Delete Account', () => {
    it('Check if delete Account function works', fakeAsync(() => {
      router.navigate(['profile']);
      spyOn(profileComponent, 'deleteAccount');
      fixture.debugElement.nativeElement.querySelector('#deleteAccountBtnId').click();
      tick();
      expect(profileComponent.deleteAccount).toHaveBeenCalled();
      expect(location.path()).toBe('/profile');
    }));
  });
});
