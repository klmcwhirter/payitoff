import { Injectable } from '@angular/core';

import { AddOnRule } from './add-on-rule.model';

@Injectable()
export class AddOnRuleService {
  public addOnRules: AddOnRule[] = [];

  constructor() { }

  getNewRule(amount: number = 0, after: string = new Date().toShortDateString()): AddOnRule {
    return new AddOnRule(amount, after);
  }

  addRule(rule: AddOnRule): void {
    rule.after = rule.after.toDate().toShortDateString();
    this.addOnRules.unshift(rule);
    this.sortRules();
  }

  addIncrementAmtPerDate(rule: AddOnRule, ruleAdjustAmount: number, dateSource: Date[]) {
    let amt = rule.amount;

    dateSource.forEach(date => {
      amt += ruleAdjustAmount;

      const foundRule = this.findRule(date);
      if (foundRule && amt < foundRule.amount) {
        // If a rule already exists for this date, copy its amount if it is bigger
        amt = foundRule.amount;
      }

      if (!foundRule) {
        const newRule = this.getNewRule(amt, date.toShortDateString());
        this.addOnRules.unshift(newRule);
      }
    });
    this.sortRules();
  }

  delRule(rule: AddOnRule): void {
    const index = this.addOnRules.indexOf(rule, 0);
    if (index > -1) {
      this.addOnRules.splice(index, 1);
    }
  }

  findAddOnAmt(after: Date): number {
    const rule = this.addOnRules.find((r: AddOnRule) => after.isShortDateGreaterEqual(r.after.toDate()));
    return rule ? rule.amount : 0.0;
  }

  findRule(after: Date): AddOnRule {
    const rule = this.addOnRules.find((r: AddOnRule) => after.isShortDateEqual(r.after.toDate()));
    return rule;
  }

  sortRules(): void {
    this.addOnRules.sort((r1, r2) => r2.after.toDate().compareShortDate(r1.after.toDate()));
  }
}
