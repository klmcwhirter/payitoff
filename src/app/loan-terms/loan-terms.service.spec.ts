import { TestBed, inject } from '@angular/core/testing';

import { LoanTermsService } from './loan-terms.service';

describe('LoanTermsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanTermsService]
    });
  });

  it('should be created', inject([LoanTermsService], (service: LoanTermsService) => {
    expect(service).toBeTruthy();
  }));
});
