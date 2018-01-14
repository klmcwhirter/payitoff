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
    this.addOnRules.sort((r1, r2) => r2.after.toDate().compareShortDate(r1.after.toDate()));
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

}
