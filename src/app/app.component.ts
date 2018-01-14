import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material';

import { AddOnRuleService } from './add-on-rule/add-on-rule.service';
import { ILoanPeriod } from './loan-terms/loan-terms.model';
import { LoanTermsService } from './loan-terms/loan-terms.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  constructor(
    private addOnRuleService: AddOnRuleService,
    private loanTermsService: LoanTermsService
  ) { }

  byYear = true;
  ruleAdjustAmount = 50.0;

  dataSource = new MatTableDataSource<ILoanPeriod>();

  displayAddOnRules = false;

  ngOnInit() {
    this.loanTermsService.updateTerms('08/01/2012', 360, .03875, 258000.00);
    this.addOnRuleService.addRule(this.addOnRuleService.getNewRule(260.0, '01/01/2018'));
    this.addOnRuleService.addRule(this.addOnRuleService.getNewRule(800.0, '02/01/2018'));
    this.onModelChanged();
  }

  isValidEntry(): boolean {
    const loanTerms = this.loanTermsService.loanTerms;
    const rc = loanTerms.start.isValidDate()
      && loanTerms.months.isValidNumber()
      && loanTerms.rate.isValidNumber()
      && loanTerms.principal.isValidNumber();

    return rc;
  }

  onModelChanged() {
    if (this.isValidEntry()) {
      this.dataSource.data = this.loanTermsService.amortize(this.byYear);
    }
  }
}
