import { TestBed } from '@angular/core/testing';

import { UserActivationService } from './user-activation.service';

describe('UserActivationService', () => {
  let service: UserActivationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActivationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
