import { TestBed, inject, ComponentFixture } from '@angular/core/testing';

import { addExtensions } from '../extensions';

import { LoanTerms, LoanMonth } from './loan-terms.model';

import { AddOnRuleService } from '../add-on-rule/add-on-rule.service';
import { LoanTermsService } from './loan-terms.service';
import { AddOnRule } from '../add-on-rule/add-on-rule.model';

let addOnSvc: AddOnRuleService;

describe('LoanTermsService', () => {
  beforeEach(() => {
    addExtensions();

    TestBed.configureTestingModule({
      providers: [
        LoanTermsService,
        { provide: AddOnRuleService, useValue: new AddOnRuleService() }
      ]
    });

    addOnSvc = TestBed.get(AddOnRuleService);
  });

  it('should be created', inject([LoanTermsService], (service: LoanTermsService) => {
    expect(service).toBeTruthy();
  }));

  it('should update loanTerms', inject([LoanTermsService], (service: LoanTermsService) => {
    const first = new Date();
    expect(service.loanTerms.start).toEqual(first.toShortDateString());
    expect(service.loanTerms.months).toEqual(360);
    expect(service.loanTerms.rate).toEqual(.05);
    expect(service.loanTerms.principal).toEqual(200000);

    let in360Months = new Date(first.getFullYear(), first.getMonth() + service.loanTerms.months, first.getDate());
    expect(service.loanTerms.due).toEqual(in360Months.toShortDateString());

    const then = '01/01/2001'.toDate();
    service.updateTerms(then.toShortDateString(), 1, 1, 1);

    expect(service.loanTerms.start).toEqual('01/01/2001');
    expect(service.loanTerms.months).toEqual(1);
    expect(service.loanTerms.rate).toEqual(1);
    expect(service.loanTerms.principal).toEqual(1);

    in360Months = new Date(then.getFullYear(), then.getMonth() + service.loanTerms.months, then.getDate());
    expect(service.loanTerms.due).toEqual(in360Months.toShortDateString());
  }));

  it('should amortorize by month', inject([LoanTermsService], (service: LoanTermsService) => {
    service.loanTerms = new LoanTerms('01/01/01', 2, .05, 100);

    const periods = service.amortize(false);

    expect(periods).toBeTruthy();

    expect(periods.length).toEqual(2);

    const period1 = periods[0];
    expect(period1.number).toEqual(1);
    expect(period1.date).toEqual('02/01/2001');
    expect(period1.interestAmt).toBeCloseTo(0.42);
    expect(period1.payment).toBeCloseTo(50.32);
    expect(period1.addOnAmt).toBeCloseTo(0);
    expect(period1.principalAmt).toBeCloseTo(49.90);
    expect(period1.balance).toBeCloseTo(50.10);

    const period2 = periods[1];
    expect(period2.number).toEqual(2);
    expect(period2.date).toEqual('03/01/2001');
    expect(period2.interestAmt).toBeCloseTo(0.21);
    expect(period2.payment).toBeCloseTo(50.31);
    expect(period2.addOnAmt).toBeCloseTo(0);
    expect(period2.principalAmt).toBeCloseTo(50.10);
    expect(period2.balance).toBeCloseTo(0.0);
  }));

  it('should amortorize by month with AddOnRules',
    inject([LoanTermsService], (service: LoanTermsService) => {

      service.loanTerms = new LoanTerms('01/01/2001', 3, .05, 1000);
      expect(addOnSvc).toBeTruthy();

      expect(addOnSvc.addOnRules.length).toEqual(0);
      addOnSvc.addOnRules = [new AddOnRule(5, '03/01/2001')];
      expect(addOnSvc.addOnRules.length).toEqual(1);

      const periods = service.amortize(false);

      expect(periods).toBeTruthy();

      expect(periods.length).toEqual(3);

      const period1 = periods[0];
      expect(period1.number).toEqual(1);
      expect(period1.date).toEqual('02/01/2001');
      expect(period1.payment).toBeCloseTo(336.12);
      expect(period1.addOnAmt).toBeCloseTo(0);
      expect(period1.balance).toBeCloseTo(668.05);

      const period2 = periods[1];
      expect(period2.number).toEqual(2);
      expect(period2.date).toEqual('03/01/2001');
      expect(period2.payment).toBeCloseTo(336.12);
      expect(period2.addOnAmt).toBeCloseTo(5);
      expect(period2.balance).toBeCloseTo(329.71);

      const period3 = periods[2];
      expect(period3.number).toEqual(3);
      expect(period3.date).toEqual('04/01/2001');
      expect(period3.payment).toBeCloseTo(331.08);
      expect(period3.addOnAmt).toBeCloseTo(0);
      expect(period3.balance).toBeCloseTo(0.0);
    }));

  it('should amortorize by year', inject([LoanTermsService], (service: LoanTermsService) => {
    service.loanTerms = new LoanTerms('01/01/01', 24, .05, 1000);

    const periods = service.amortize(true);

    expect(periods).toBeTruthy();

    expect(periods.length).toEqual(3);

    const period1 = periods[0];
    expect(period1.number).toEqual(1);
    expect(period1.date).toEqual('02/01/2001');
    expect(period1.interestAmt).toBeCloseTo(36.62);
    expect(period1.payment).toBeCloseTo(482.68);
    expect(period1.addOnAmt).toBeCloseTo(0);
    expect(period1.principalAmt).toBeCloseTo(446.06);
    expect(period1.balance).toBeCloseTo(553.94);

    const period2 = periods[1];
    expect(period2.number).toEqual(2);
    expect(period2.date).toEqual('01/01/2002');
    expect(period2.interestAmt).toBeCloseTo(16.10);
    expect(period2.payment).toBeCloseTo(526.56);
    expect(period2.addOnAmt).toBeCloseTo(0);
    expect(period2.principalAmt).toBeCloseTo(510.46);
    expect(period2.balance).toBeCloseTo(43.48);

    const period3 = periods[2];
    expect(period3.number).toEqual(3);
    expect(period3.date).toEqual('01/01/2003');
    expect(period3.interestAmt).toBeCloseTo(0.18);
    expect(period3.payment).toBeCloseTo(43.66);
    expect(period3.addOnAmt).toBeCloseTo(0);
    expect(period3.principalAmt).toBeCloseTo(43.48);
    expect(period3.balance).toBeCloseTo(0.0);
  }));

  it('should amortorize by year with AddOnRules adjusting addOnAmt',
    inject([LoanTermsService], (service: LoanTermsService) => {

      service.loanTerms = new LoanTerms('01/01/2001', 48, .05, 58000);
      expect(addOnSvc).toBeTruthy();

      expect(addOnSvc.addOnRules.length).toEqual(0);
      addOnSvc.addOnRules = [new AddOnRule(1000, '03/01/2001')];
      expect(addOnSvc.addOnRules.length).toEqual(1);

      const periods = service.amortize(true);

      expect(periods).toBeTruthy();

      expect(periods.length).toEqual(4);

      const period1 = periods[0];
      expect(period1.number).toEqual(1);
      expect(period1.date).toEqual('02/01/2001');
      expect(period1.payment).toBeCloseTo(14692.70);
      expect(period1.addOnAmt).toBeCloseTo(10000);
      expect(period1.balance).toBeCloseTo(35522.16);

      const period2 = periods[1];
      expect(period2.number).toEqual(2);
      expect(period2.date).toEqual('01/01/2002');
      expect(period2.payment).toBeCloseTo(16028.40);
      expect(period2.addOnAmt).toBeCloseTo(12000);
      expect(period2.balance).toBeCloseTo(8659.82);

      const period3 = periods[2];
      expect(period3.number).toEqual(3);
      expect(period3.date).toEqual('01/01/2003');
      expect(period3.payment).toBeCloseTo(4007.10);
      expect(period3.addOnAmt).toBeCloseTo(3000);
      expect(period3.balance).toBeCloseTo(1732.18);

      // Note that addOnAmt is adjusted by the else clause in LoanMonth.tryUpdateAddOnAmt
      const period4 = periods[3];
      expect(period4.number).toEqual(4);
      expect(period4.date).toEqual('04/01/2003');
      expect(period4.payment).toBeCloseTo(1335.70);
      expect(period4.addOnAmt).toBeCloseTo(403.70);
      expect(period4.balance).toBeCloseTo(0.0);
    }));
});
