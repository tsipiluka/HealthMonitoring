import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MyPatientFinderService } from './my-patient-finder.service';

describe('MyPatientFinderService', () => {
  let service: MyPatientFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MyPatientFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
