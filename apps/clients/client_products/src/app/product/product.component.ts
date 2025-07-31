import {Component, inject, OnInit, signal} from '@angular/core';
import {toSignal} from "@angular/core/rxjs-interop";
import {ProductService} from "./product.service";
import {ActivatedRoute} from "@angular/router";
import {JsonPipe} from "@angular/common";
import {map} from "rxjs";
import {GetProductQuery} from "@ewandr-workspace/data-access-graphql";

@Component({
  selector: 'app-product',
  imports: [
    JsonPipe
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  private service = inject(ProductService);
  private route = inject(ActivatedRoute);

  // product = toSignal(this.service.selectedProduct$);

  product = signal<GetProductQuery['product']>(null);

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('productId');

    if (productId == null)
      return;

    this.service.getProduct(productId).pipe(
      map(data => this.product.set(data))
    ).subscribe();
  }
}
