import { TestBed } from '@angular/core/testing';

import { ServerUrlService } from './server-url.service';

describe('ServerUrlService', () => {
  let service: ServerUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
