import { Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AddOnRule } from '../add-on-rule/add-on-rule.model';
import { AddOnRuleService } from '../add-on-rule/add-on-rule.service';
import { LoanTermsService } from '../loan-terms/loan-terms.service';

const noop = () => {
};

@Component({
  selector: 'app-add-on-rules',
  templateUrl: './add-on-rules.component.html',
  styleUrls: ['./add-on-rules.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AddOnRulesComponent,
    multi: true
  }]
})
export class AddOnRulesComponent implements ControlValueAccessor, OnInit {
  @Output() rulesChanged = new EventEmitter<boolean>();
  ruleAdjustAmount = 50.0;
  addOnRuleToEdit = this.addOnRuleService.getNewRule();
  addOnRules = this.addOnRuleService.addOnRules;

  // get accessor
  get value(): number {
    return this.ruleAdjustAmount;
  }

  // set accessor including call the onchange callback
  set value(v: number) {
    if (v !== this.ruleAdjustAmount) {
      this.ruleAdjustAmount = v;
      this.onChangeCallback(v);
    }
  }

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor(
    private addOnRuleService: AddOnRuleService,
    private loanTermsService: LoanTermsService
  ) { }

  ngOnInit() {
  }

  // ControlValueAccessor implementation

  writeValue(value: number): void {
    if (this.ruleAdjustAmount !== value) {
      this.ruleAdjustAmount = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  // Component behavior

  findAllMayAfter(date: Date): Date[] {
    const rc = this.loanTermsService.amortize(false)
      .filter(lp => lp.date.toDate().isShortDateGreater(date) && lp.date.toDate().getMonth() === 4)
      .map(lp => lp.date.toDate());
    return rc;
  }

  onAddIncrementPerYear(rule: AddOnRule) {
    const mays = this.findAllMayAfter(rule.after.toDate());
    let amt = rule.amount;
    mays.forEach(may => {
      amt += this.ruleAdjustAmount;

      const mayRule = this.addOnRuleService.findRule(may);
      if (mayRule && amt < mayRule.amount) {
        amt = mayRule.amount;
      }

      if (!mayRule) {
        const newRule = this.addOnRuleService.getNewRule(amt, may.toShortDateString());
        this.addOnRuleService.addRule(newRule);
      }
    });
    this.rulesChanged.emit(true);
  }

  onAddRule(rule: AddOnRule) {
    if (rule.amount.isValidNumber() && rule.after.isValidDate()) {
      this.addOnRuleService.addRule(rule);
      this.addOnRuleToEdit = this.addOnRuleService.getNewRule();
      this.rulesChanged.emit(true);
    }
  }

  onDelRule(rule: AddOnRule) {
    this.addOnRuleService.delRule(rule);
    this.rulesChanged.emit(true);
  }

  onRuleAdjustAmount(ruleAdjustAmount: number) {
    this.ruleAdjustAmount = ruleAdjustAmount;
  }

}
