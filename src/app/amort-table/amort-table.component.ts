import { Component, Input, OnInit } from '@angular/core';
import { ILoanPeriod } from '../loan-terms/loan-terms.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-amort-table',
  templateUrl: './amort-table.component.html',
  styleUrls: ['./amort-table.component.css']
})
export class AmortTableComponent implements OnInit {
  @Input() dataSource: MatTableDataSource<ILoanPeriod>;
  displayedColumns = ['number', 'date', 'totalPmt', 'payment', 'addOnAmt', 'interest', 'principal', 'balance'];

  constructor() { }

  ngOnInit() {
  }

}
