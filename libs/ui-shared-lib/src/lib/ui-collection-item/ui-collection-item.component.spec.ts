import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCollectionItemComponent } from './ui-collection-item.component';

describe('UiCollectionItemComponent', () => {
  let component: UiCollectionItemComponent;
  let fixture: ComponentFixture<UiCollectionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCollectionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiCollectionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
