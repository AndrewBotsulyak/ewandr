import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOptionsGroupsComponent } from './product-options-groups.component';

describe('ProductOptionsGroupsComponent', () => {
  let component: ProductOptionsGroupsComponent;
  let fixture: ComponentFixture<ProductOptionsGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOptionsGroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOptionsGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
