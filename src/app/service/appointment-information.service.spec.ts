import { TestBed } from '@angular/core/testing';

import { AppointmentInformationService } from './appointment-information.service';

describe('AppointmentInformationService', () => {
  let service: AppointmentInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
