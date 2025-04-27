import { TestBed } from '@angular/core/testing';

import { EventModalService } from './event-modal.service';

describe('EventModalService', () => {
  let service: EventModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
