import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingSlip } from './betting-slip';

describe('BettingSlip', () => {
  let component: BettingSlip;
  let fixture: ComponentFixture<BettingSlip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BettingSlip],
    }).compileComponents();

    fixture = TestBed.createComponent(BettingSlip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
