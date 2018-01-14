import { TestBed, inject } from '@angular/core/testing';

import { addExtensions } from '../extensions';

import { AddOnRuleService } from './add-on-rule.service';

const firstDate = '01/01/01';
const secondDate = '02/01/01';
const amount1 = 1000.0;

describe('AddOnRuleService', () => {
  beforeEach(() => {
    addExtensions();
    TestBed.configureTestingModule({
      providers: [AddOnRuleService]
    });
  });

  it('should be created', inject([AddOnRuleService], (service: AddOnRuleService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created with defined empty addOnRules array', inject([AddOnRuleService], (service: AddOnRuleService) => {
    expect(service.addOnRules).toBeTruthy();
    expect(service.addOnRules.length).toEqual(0);
  }));

  it('getNewRule should create a new one with defaults', inject([AddOnRuleService], (service: AddOnRuleService) => {
    const rule = service.getNewRule();

    expect(rule).toBeTruthy();

    expect(rule.after).toEqual(new Date().toShortDateString());
    expect(rule.amount).toEqual(0.0);
  }));

  it('getNewRule should create a new one with specified values', inject([AddOnRuleService], (service: AddOnRuleService) => {
    const rule = service.getNewRule(amount1, firstDate);

    expect(rule).toBeTruthy();

    expect(rule.after).toEqual(firstDate);
    expect(rule.amount).toEqual(amount1);
  }));

  it('addRule should add a new rule', inject([AddOnRuleService], (service: AddOnRuleService) => {
    expect(service.addOnRules.length).toEqual(0);

    const rule = service.getNewRule(amount1, firstDate);
    service.addRule(rule);

    expect(service.addOnRules.length).toEqual(1);
    expect(service.addOnRules[0]).toBe(rule);
  }));

  it('addRule should sort desc by after', inject([AddOnRuleService], (service: AddOnRuleService) => {
    // purposely add them in asc order by after
    const rule1 = service.getNewRule(amount1, firstDate);
    service.addRule(rule1);
    const rule2 = service.getNewRule(amount1, secondDate);
    service.addRule(rule2);

    expect(service.addOnRules.length).toEqual(2);
    expect(service.addOnRules[0]).toBe(rule2);
    expect(service.addOnRules[1]).toBe(rule1);
  }));

  it('delRule should delete rule', inject([AddOnRuleService], (service: AddOnRuleService) => {

    // purposely add them in asc order by after
    const rule1 = service.getNewRule(amount1, firstDate);
    service.addRule(rule1);
    const rule2 = service.getNewRule(amount1, secondDate);
    service.addRule(rule2);

    expect(service.addOnRules.length).toEqual(2);

    service.delRule(rule1);

    expect(service.addOnRules.length).toEqual(1);
    expect(service.addOnRules[0]).toBe(rule2);
  }));

  it('delRule should not fail if not found', inject([AddOnRuleService], (service: AddOnRuleService) => {
    // purposely add them in asc order by after
    const rule1 = service.getNewRule(amount1, firstDate);
    service.addRule(rule1);
    const rule2 = service.getNewRule(amount1, secondDate);

    service.delRule(rule2);

    expect(service.addOnRules.length).toEqual(1);
    expect(service.addOnRules[0]).toBe(rule1);
  }));

  it('findAddOnAmt should return correct amount', inject([AddOnRuleService], (service: AddOnRuleService) => {
    // purposely add them in asc order by after
    const rule1 = service.getNewRule(amount1, firstDate);
    service.addRule(rule1);
    const rule2 = service.getNewRule(amount1, secondDate);
    service.addRule(rule2);

    const amt = service.findAddOnAmt(rule2.after.toDate());

    expect(amt).toBe(rule2.amount);
  }));

  it('findAddOnAmt should return 0 if no rule', inject([AddOnRuleService], (service: AddOnRuleService) => {
    // purposely add them in asc order by after
    const amt = service.findAddOnAmt(firstDate.toDate());

    expect(amt).toBe(0.0);
  }));

  it('findAddOnAmt should return last amount where after < date', inject([AddOnRuleService], (service: AddOnRuleService) => {
    // purposely add them in asc order by after
    const rule1 = service.getNewRule(amount1, firstDate);
    service.addRule(rule1);
    const rule2 = service.getNewRule(amount1, secondDate);
    service.addRule(rule2);

    const amt = service.findAddOnAmt('12/01/2001'.toDate());

    expect(amt).toBe(rule2.amount);
  }));

  it('findRule should return rule if found', inject([AddOnRuleService], (service: AddOnRuleService) => {
    // purposely add them in asc order by after
    const rule1 = service.getNewRule(amount1, firstDate);
    service.addRule(rule1);
    const rule2 = service.getNewRule(amount1, secondDate);
    service.addRule(rule2);

    const rule = service.findRule(rule1.after.toDate());

    expect(rule).toBe(rule1);
  }));

  it('findRule should return undefined if not found', inject([AddOnRuleService], (service: AddOnRuleService) => {
    // purposely add them in asc order by after
    const rule1 = service.getNewRule(amount1, firstDate);
    service.addRule(rule1);
    const rule2 = service.getNewRule(amount1, secondDate);
    service.addRule(rule2);

    const rule = service.findRule('12/01/2001'.toDate());

    expect(rule).toBeFalsy();
  }));
});
