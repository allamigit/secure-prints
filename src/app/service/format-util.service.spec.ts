import { TestBed } from '@angular/core/testing';

import { FormatUtilService } from './format-util.service';

describe('FormatUtilService', () => {
  let service: FormatUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
