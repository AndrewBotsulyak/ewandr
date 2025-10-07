import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductContainerService} from "./product-container.service";
import {ProductStatusEnum} from "@ewandr-workspace/core";
import {Router} from "@angular/router";
import {MatCardModuleUI, MatButtonUI} from "@ewandr-workspace/ui-shared-lib";
import {ProductCardComponent} from "./product-card/product-card.component";
import {SearchProductsQuery} from "@ewandr-workspace/data-access-graphql";
import {FacetFilterService} from "../services/facet-filter.service";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
  selector: 'product-container',
  imports: [CommonModule, MatButtonUI, MatCardModuleUI, ProductCardComponent, MatSnackBarModule],
  providers: [ProductContainerService],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainerComponent implements OnInit {
  private service = inject(ProductContainerService);
  private facetFilterService = inject(FacetFilterService);
  private snackBar = inject(MatSnackBar);
  public router = inject(Router);

  collectionId = input<string>();
  collectionSlug = input<string>();

  // Get products directly from the facet filter service (single source of truth)
  products = this.facetFilterService.searchResults;

  status = ProductStatusEnum;

  ngOnInit() {
  }

  public handleGetProducts() {
    this.service.getGqlProducts().subscribe();
  }

  public handleProductClick(product: SearchProductsQuery['search']['items'][number]) {
    this.router.navigate([`product/${product.slug}`])
  }

  public handleAddToCart(product: SearchProductsQuery['search']['items'][number]) {
    this.snackBar.open(`"${product.productName}" added to cart`, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

}
