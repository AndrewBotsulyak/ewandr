import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductContainerService} from "./product-container.service";
import {ProductStatusEnum} from "@ewandr-workspace/core";
import {Router} from "@angular/router";
import {MatCardModuleUI} from "@ewandr-workspace/ui-shared-lib";
import {ProductCardComponent} from "./product-card/product-card.component";
import {SearchProductsQuery} from "@ewandr-workspace/data-access-graphql";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
  selector: 'product-container',
  imports: [CommonModule, MatCardModuleUI, ProductCardComponent, MatSnackBarModule],
  providers: [ProductContainerService],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainerComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  public router = inject(Router);

  products = input<SearchProductsQuery['search'] |null>();

  status = ProductStatusEnum;

  ngOnInit() {
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
