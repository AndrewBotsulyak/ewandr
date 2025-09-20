import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCollectionsLayout } from './ui-collections-layout';

describe('UiCollectionsLayout', () => {
  let component: UiCollectionsLayout;
  let fixture: ComponentFixture<UiCollectionsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCollectionsLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiCollectionsLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
