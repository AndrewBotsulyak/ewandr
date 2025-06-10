import { TestBed } from '@angular/core/testing';

import { ProductContainerService } from './product-container.service';

describe('ProductContainerService', () => {
  let service: ProductContainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductContainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
