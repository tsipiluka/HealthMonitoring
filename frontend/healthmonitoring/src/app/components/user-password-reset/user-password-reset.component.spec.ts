import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserPasswordResetComponent } from './user-password-reset.component';

describe('UserPasswordResetComponent', () => {
  let component: UserPasswordResetComponent;
  let fixture: ComponentFixture<UserPasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ UserPasswordResetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
