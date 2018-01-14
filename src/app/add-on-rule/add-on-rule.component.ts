import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddOnRule } from '../add-on-rule/add-on-rule.model';

@Component({
  selector: 'app-add-on-rule',
  templateUrl: './add-on-rule.component.html',
  styleUrls: ['./add-on-rule.component.css']
})
export class AddOnRuleComponent {
  @Input() rule: AddOnRule;
  @Input() appEdit: any; // appEdit attribute
  @Output() addRule = new EventEmitter<AddOnRule>();
  @Output() delRule = new EventEmitter<AddOnRule>();
  @Output() addOnIncrement = new EventEmitter<AddOnRule>();

  get edit(): boolean {
    return this.appEdit !== undefined;
  }

  constructor() { }

  onAddOnIncrement() {
    this.addOnIncrement.emit(this.rule);
  }

  onAddRule() {
    this.addRule.emit(this.rule);
  }

  onDelRule() {
    this.delRule.emit(this.rule);
  }
}
