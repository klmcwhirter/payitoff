import { TestBed, inject } from '@angular/core/testing';

import { AddOnRuleService } from './add-on-rule.service';

describe('AddOnRuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddOnRuleService]
    });
  });

  it('should be created', inject([AddOnRuleService], (service: AddOnRuleService) => {
    expect(service).toBeTruthy();
  }));
});
