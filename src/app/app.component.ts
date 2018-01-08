import { Component, Input, ViewChild } from '@angular/core';

import { MatPaginator, MatTableDataSource } from '@angular/material';

import { AddOnRule, LoanTerms, LoanMonth, ILoanPeriod } from './app.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  byYear = true;
  loanTerms = new LoanTerms(
    '08/01/2012',
    360,
    .03875,
    258000.00
  );
  addOnRuleToEdit: AddOnRule = new AddOnRule(0, new Date().toShortDateString());
  addOnRules: AddOnRule[] = [
    new AddOnRule(260.0, new Date('1/1/2018').toShortDateString()),
    new AddOnRule(800.0, new Date('2/1/2018').toShortDateString())
  ];

  displayedColumns = ['number', 'date', 'payment', 'addOnAmt', 'interest', 'principal', 'balance'];
  dataSource = new MatTableDataSource<ILoanPeriod>(this.loanTerms.schedule(this.byYear, this.addOnRules));

  displayAddOnRules = false;
  ruleAdjustAmount = 50.0;

  addRule() {
    if (this.isValidNumber(this.addOnRuleToEdit.amount) && this.isValidDate(this.addOnRuleToEdit.after)) {
      this.addOnRules.push(this.addOnRuleToEdit);
      this.addOnRuleToEdit = new AddOnRule(0, new Date().toShortDateString());
      this.updateSchedule();
    }
  }

  add50PerYear(rule: AddOnRule) {
    const mays = this.findAllMayAfter(rule.after.toDate());
    let amt = rule.amount;
    mays.forEach(may => {
      amt += this.ruleAdjustAmount;
      this.addOnRules.push(new AddOnRule(amt, may.toShortDateString()));
    });
    this.updateSchedule();
  }

  delRule(rule: AddOnRule) {
    this.addOnRules = this.addOnRules.filter(r => r.after !== rule.after);
    this.updateSchedule();
  }

  findAllMayAfter(date: Date): Date[] {
    const rc = this.loanTerms.schedule(false, this.addOnRules)
      .filter(lp => lp.date.toDate().isShortDateGreater(date) && lp.date.toDate().getMonth() === 4)
      .map(lp => lp.date.toDate());
    return rc;
  }

  isValidDate(date: string): boolean {
    let rc = false;
    try {
      const dt = date.toDate();
      rc = (Object.prototype.toString.call(dt) === '[object Date]') && !isNaN(dt.getTime());
    } catch (e) {
    }
    return rc;
  }

  isValidNumber(val: number): boolean {
    const rc = !Number.isNaN(Number(val));
    return rc;
  }

  isValidEntry(): boolean {
    const rc = this.isValidDate(this.loanTerms.start)
      && this.isValidNumber(this.loanTerms.months)
      && this.isValidNumber(this.loanTerms.rate)
      && this.isValidNumber(this.loanTerms.principal);

    return rc;
  }

  updateSchedule() {
    if (this.isValidEntry()) {
      this.dataSource.data = this.loanTerms.schedule(this.byYear, this.addOnRules);
    }
  }

  get diagnostic(): string { return JSON.stringify(this.loanTerms); }
}
