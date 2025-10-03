import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantItemComponent } from './product-variant-item.component';

describe('ProductVariantItemComponent', () => {
  let component: ProductVariantItemComponent;
  let fixture: ComponentFixture<ProductVariantItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVariantItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVariantItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
