import { TestBed } from '@angular/core/testing';

import { SessionTimerService } from './session-timer.service';

describe('SessionTimerService', () => {
  let service: SessionTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionTimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
