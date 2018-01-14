import { Injectable } from '@angular/core';

import { AddOnRuleService } from '../add-on-rule/add-on-rule.service';
import { ILoanPeriod, LoanMonth, LoanYear, LoanTerms } from './loan-terms.model';

@Injectable()
export class LoanTermsService {
    loanTerms: LoanTerms = new LoanTerms();

    constructor(
        private addOnRuleService: AddOnRuleService
    ) { }

    updateTerms(
        start: string,
        months: number,
        rate: number,
        principal: number
    ) {
        this.loanTerms.start = start;
        this.loanTerms.months = months;
        this.loanTerms.rate = rate;
        this.loanTerms.principal = principal;
    }

    amortize(byYear: boolean): ILoanPeriod[] {
        const rc = [];
        let month = 1;
        let year = 1;

        let loanYear: LoanYear;
        let balance = this.loanTerms.principal;
        while (balance > 0.0) {
            const loanMonth = new LoanMonth(month++, this.loanTerms, balance, 0);

            // Apply AddOnRule if exists
            const amt = this.addOnRuleService.findAddOnAmt(loanMonth.date.toDate());
            // console.log(`amortize: date=${loanMonth.date}, byYear=${byYear}, amt=${amt}`);

            loanMonth.tryUpdateAddOnAmt(amt);
            // console.log(`amortize: loanMonth.addOnAmt=${loanMonth.addOnAmt}`);

            if (byYear) {
                if (loanMonth.isFirstLastOrJanuary()) {
                    loanYear = new LoanYear(year++, loanMonth);
                    rc.push(loanYear);
                } else {
                    loanYear.update(loanMonth);
                }
            } else {
                rc.push(loanMonth);
            }
            balance = loanMonth.balance;
        }

        return rc;
    }
}
