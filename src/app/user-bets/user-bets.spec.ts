import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBets } from './user-bets';

describe('UserBets', () => {
  let component: UserBets;
  let fixture: ComponentFixture<UserBets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBets],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
