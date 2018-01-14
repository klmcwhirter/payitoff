import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTermsComponent } from './loan-terms.component';

describe('LoanTermsComponent', () => {
  let component: LoanTermsComponent;
  let fixture: ComponentFixture<LoanTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
