import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('App Routing', () => {

    let location: Location;
    let router: Router;
    let fixture;

    let token = 'testing';
    let uid = 'test';
    let path = 'dieseseiteexistiertnicht'
    
    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule]
        });
        
        router = TestBed.get(Router);
        location = TestBed.get(Location);
        fixture = TestBed.createComponent(AppComponent);
        router.initialNavigation();
    });

    it('navigate to "" redirects you to /login', fakeAsync(() => {
        router.navigate(['']);
        tick();
        expect(location.path()).toBe('/login');
    }));

    it('navigate to "login" takes you to /login', fakeAsync(() => {
        router.navigate(['/login']);
        tick();
        expect(location.path()).toBe('/login');
    }));

    it('navigate to "registration" takes you to /registration', fakeAsync(() => {
        router.navigate(['/registration']);
        tick();
        expect(location.path()).toBe('/registration');
    }));

    it('navigate to "activate/:token/:uidb64" takes you to /activate/:token/:uidb64', fakeAsync(() => {
        router.navigate(['/activate'+'/'+token+'/'+uid]);
        tick();
        expect(location.path()).toBe('/activate'+'/'+token+'/'+uid);
    }));

    it('navigate to "password-reset/:token" takes you to /password-reset/:token', fakeAsync(() => {
        router.navigate(['/password-reset/'+token]);
        tick();
        expect(location.path()).toBe('/password-reset/'+token);
    }));

    it('navigate to "dashboard" takes you to /dashboard', fakeAsync(() => {
        router.navigate(['/dashboard']);
        tick();
        expect(location.path()).toBe('/dashboard');
    }));

    it('navigate to "medicalFindingFinder" takes you to /medicalFindingFinder', fakeAsync(() => {
        router.navigate(['/medicalFindingFinder']);
        tick();
        expect(location.path()).toBe('/medicalFindingFinder');
    }));

    it('navigate to "profile" takes you to /profile', fakeAsync(() => {
        router.navigate(['/profile']);
        tick();
        expect(location.path()).toBe('/profile');
    }));

    it('navigate to "**" takes you to /**', fakeAsync(() => {
        router.navigate(['/'+path]);
        tick();
        expect(location.path()).toBe('/'+path);
    }));
});

