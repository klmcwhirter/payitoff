import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoanTermsService } from './loan-terms.service';

@Component({
  selector: 'app-loan-terms',
  templateUrl: './loan-terms.component.html',
  styleUrls: ['./loan-terms.component.css']
})
export class LoanTermsComponent implements OnInit {
  @Output() modelChanged = new EventEmitter<boolean>();

  loanTerms = this.loanTermsService.loanTerms;

  constructor(
    private loanTermsService: LoanTermsService
  ) { }

  ngOnInit() {
  }

  onModelChange() {
    this.modelChanged.emit(true);
  }
}
