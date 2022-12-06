import { TestBed } from '@angular/core/testing';

import { FileshareService } from './fileshare.service';

describe('FileshareService', () => {
  let service: FileshareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileshareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
