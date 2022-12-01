import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFindingFinderComponent } from './medical-finding-finder.component';

describe('MedicalFindingFinderComponent', () => {
  let component: MedicalFindingFinderComponent;
  let fixture: ComponentFixture<MedicalFindingFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalFindingFinderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFindingFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
