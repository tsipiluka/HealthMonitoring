import { TestBed } from '@angular/core/testing';

import { MedicalFindingFinderService } from './medical-finding-finder.service';

describe('MedicalFindingFinderService', () => {
  let service: MedicalFindingFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalFindingFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
