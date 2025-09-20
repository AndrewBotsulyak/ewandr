import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionItemContainer } from './collection-item-container';

describe('CollectionItemContainer', () => {
  let component: CollectionItemContainer;
  let fixture: ComponentFixture<CollectionItemContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionItemContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionItemContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
