import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MyPatientFinderComponent } from './my-patient-finder.component';

describe('MyPatientFinderComponent', () => {
  let component: MyPatientFinderComponent;
  let fixture: ComponentFixture<MyPatientFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ MyPatientFinderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPatientFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
