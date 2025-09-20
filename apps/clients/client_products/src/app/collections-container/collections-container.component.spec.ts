import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsContainerComponent } from './collections-container.component';

describe('CollectionsContainerComponent', () => {
  let component: CollectionsContainerComponent;
  let fixture: ComponentFixture<CollectionsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
