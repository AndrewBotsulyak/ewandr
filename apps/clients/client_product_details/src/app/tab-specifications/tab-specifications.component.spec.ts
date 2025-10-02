import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSpecificationsComponent } from './tab-specifications.component';

describe('TabSpecificationsComponent', () => {
  let component: TabSpecificationsComponent;
  let fixture: ComponentFixture<TabSpecificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabSpecificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabSpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
