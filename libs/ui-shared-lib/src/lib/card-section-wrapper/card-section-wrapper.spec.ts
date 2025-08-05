import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSectionWrapper } from './card-section-wrapper';

describe('CardSectionWrapper', () => {
  let component: CardSectionWrapper;
  let fixture: ComponentFixture<CardSectionWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSectionWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSectionWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
