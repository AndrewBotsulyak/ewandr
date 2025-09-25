import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductContainerService} from "./product-container.service";
import {ProductStatusEnum} from "@ewandr-workspace/core";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs";
import {MatCardModuleUI, MatButtonUI} from "@ewandr-workspace/ui-shared-lib";
import {ProductCardComponent} from "./product-card/product-card.component";
import {SearchProductsQuery} from "@ewandr-workspace/data-access-graphql";

@Component({
  selector: 'product-container',
  imports: [CommonModule, MatButtonUI, MatCardModuleUI, ProductCardComponent],
  providers: [ProductContainerService],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainerComponent implements OnInit {
  private service = inject(ProductContainerService);
  public router = inject(Router);

  collectionId = input<string>();

  products: WritableSignal<SearchProductsQuery['search'] | null> = signal(null);

  // products = toSignal(this.service.getGqlProducts().pipe(
  //   map(data => data.items),
  //   tap(data => {
  //     console.log('getGqlProducts = ', data);
  //   })
  // ));

  status = ProductStatusEnum;

  constructor() {
    effect(() => {
      const collectionId = this.collectionId();

      this.service.searchProducts({ collectionId }).pipe(
        take(1)
      ).subscribe((data) => {
        this.products.set(data);
      })
    });
  }

  ngOnInit() {
  }

  public handleGetProducts() {
    this.service.getGqlProducts().subscribe();
  }

  public handleProductClick(product: SearchProductsQuery['search']['items'][number]) {
    this.router.navigate([`product/${product.slug}`])
  }

}
