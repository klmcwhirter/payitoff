import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AddOnRuleService } from './add-on-rule/add-on-rule.service';
import { LoanTermsService } from './loan-terms/loan-terms.service';

import { AppComponent } from './app.component';
import { AddOnRuleComponent } from './add-on-rule/add-on-rule.component';
import { AddOnRulesComponent } from './add-on-rules/add-on-rules.component';
import { AmortTableComponent } from './amort-table/amort-table.component';
import { LoanTermsComponent } from './loan-terms/loan-terms.component';

@NgModule({
  declarations: [
    AppComponent,
    AddOnRuleComponent,
    AddOnRulesComponent,
    AmortTableComponent,
    LoanTermsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  providers: [AddOnRuleService, LoanTermsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
