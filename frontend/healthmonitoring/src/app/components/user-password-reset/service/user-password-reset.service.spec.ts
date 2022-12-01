import { TestBed } from '@angular/core/testing';

import { UserPasswordResetService } from './user-password-reset.service';

describe('UserPasswordResetService', () => {
  let service: UserPasswordResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPasswordResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
