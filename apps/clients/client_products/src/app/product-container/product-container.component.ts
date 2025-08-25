import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductContainerService} from "./product-container.service";
import {ProductStatusEnum} from "@ewandr-workspace/core";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatCardModuleUI, MatButtonUI} from "@ewandr-workspace/ui-shared-lib";
import {ProductCardComponent} from "./product-card/product-card.component";
import {ProductItemModel} from "./models/product-item.model";

@Component({
  selector: 'app-product-container',
  imports: [CommonModule, MatButtonUI, MatCardModuleUI, ProductCardComponent],
  providers: [ProductContainerService],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainerComponent implements OnInit {
  private service = inject(ProductContainerService);
  public activatedRoute = inject(ActivatedRoute);
  public router = inject(Router);

  products = toSignal(this.service.getGqlProducts().pipe(
    map(data => data.items)
  ));

  status = ProductStatusEnum;

  ngOnInit() {

    // combineLatest([
    //   this.service.products$,
    //   this.service.isLoading$
    // ]).pipe(
    //   filter(([, isLoading]) => isLoading === false),
    //   take(1)
    // ).subscribe(([products]) => {
    //   if (products == null) {
    //     this.service.getProducts();
    //   }
    // });
  }

  public handleGetProducts() {
    this.service.getGqlProducts().subscribe();
  }

  public handleProductClick(product: ProductItemModel) {
    this.router.navigate([`${product.id}`], {relativeTo: this.activatedRoute})
  }

}
