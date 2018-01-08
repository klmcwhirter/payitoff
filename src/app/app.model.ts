
export class AddOnRule {
    constructor(
        public amount: number,
        public after: string
    ) { }

    static findAddOnAmt(addOnRules: AddOnRule[], after: Date): number {
        if (addOnRules) {
            addOnRules = addOnRules.sort((r1, r2) => r2.after.toDate().compareShortDate(r1.after.toDate()));
            // console.log(addOnRules);
            const rule = addOnRules.find((r: AddOnRule) => after.isShortDateGreaterEqual(r.after.toDate()));
            return rule ? rule.amount : 0.0;
        }
        return 0.0;
    }
}

export interface ILoanPeriod {
    number: number;
    date: string;
    interestAmt: number;
    payment: number;
    addOnAmt: number;
    principalAmt: number;
    balance: number;
}

export class LoanMonth implements ILoanPeriod {
    constructor(
        public number: number,
        public loanTerms: LoanTerms,
        public prevBalance: number,
        public addOnAmt: number
    ) { }

    get date(): string {
        const dt = this.loanTerms.start.toDate();
        dt.setMonth(dt.getMonth() + this.number);
        return dt.toShortDateString();
    }

    get interestAmt(): number {
        return this.prevBalance * (this.loanTerms.rate / 12);
    }

    get payment(): number {
        return (this.prevBalance > this.loanTerms.payment) ? this.loanTerms.payment : this.prevBalance + this.interestAmt;
    }

    get principalAmt(): number {
        return this.payment - this.interestAmt;
    }

    get balance(): number {
        let rc = this.prevBalance - this.principalAmt - this.addOnAmt;
        if (rc <= 0) {
            rc = 0.0;
        }
        return rc;
    }

    isFirstLastOrJanuary(): boolean {
        // Is this the first month?
        const firstDt = this.date.toDate();
        // This first item in the array of LoanMonths will be for one month after start
        firstDt.setMonth(firstDt.getMonth() - 1);

        let rc = firstDt.isShortDateEqual(this.loanTerms.start.toDate());

        if (!rc) {
            // Is this January
            const dt = this.date.toDate();
            rc = dt.getMonth() === 0;
        }

        if (!rc) {
            // Is this the last month?
            rc = this.balance === 0.0;
        }

        return rc;
    }

    tryUpdateAddOnAmt(amt: number): void {
        if (this.balance > (amt + this.payment)) {
            this.addOnAmt = amt;
        } else if (this.payment >= this.balance) {
            this.addOnAmt = 0.0;
        } else {
            this.addOnAmt = Math.min(amt, this.prevBalance - this.payment + this.interestAmt);
        }
    }
}

export class LoanYear implements ILoanPeriod {
    public number: number;
    public date: string;
    public interestAmt: number;
    public payment: number;
    public addOnAmt;
    public principalAmt: number;
    public balance: number;

    constructor(number: number, loanMonth: LoanMonth) {
        this.number = number;
        this.date = loanMonth.date.toDate().toFirstOfTheMonthString();
        this.interestAmt = loanMonth.interestAmt;
        this.payment = loanMonth.payment;
        this.addOnAmt = loanMonth.addOnAmt;
        this.principalAmt = loanMonth.principalAmt;
        this.balance = loanMonth.balance;
    }

    update(loanMonth: LoanMonth) {
        if (loanMonth.balance === 0.0) {
            this.date = loanMonth.date.toDate().toFirstOfTheMonthString();
        }
        this.interestAmt += loanMonth.interestAmt;
        this.payment += loanMonth.payment;
        this.addOnAmt += loanMonth.addOnAmt;
        this.principalAmt += loanMonth.principalAmt;

        this.balance = loanMonth.balance;
    }
}

export class LoanTerms {

    constructor(
        public start: string,
        public months: number,
        public rate: number,
        public principal: number
    ) { }

    get payment(): number {
        // [R/(((1 + R)^M) - 1)] x [(1 + R)^M] x L
        const R = this.rate / 12;
        const M = this.months;
        const L = this.principal;

        const pmt = (R / (Math.pow(1 + R, M) - 1)) * Math.pow(1 + R, M) * L;

        // Round to 2 decimal places
        return Math.ceil(pmt * 100) / 100;
    }

    get due(): string {
        const due = this.start.toDate();
        due.setMonth(due.getMonth() + this.months);
        return due.toShortDateString();
    }

    schedule(byYear: boolean, addOnRules?: AddOnRule[]): ILoanPeriod[] {
        const rc = [];
        let month = 1;
        let year = 1;

        let loanYear: LoanYear;
        let balance = this.principal;
        while (balance > 0.0) {
            const loanMonth = new LoanMonth(month++, this, balance, 0);
            const amt = AddOnRule.findAddOnAmt(addOnRules, loanMonth.date.toDate());
            loanMonth.tryUpdateAddOnAmt(amt);

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
