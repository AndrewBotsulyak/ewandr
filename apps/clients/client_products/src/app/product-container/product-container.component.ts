import {ChangeDetectionStrategy, Component, inject, input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductContainerService} from "./product-container.service";
import {ProductStatusEnum} from "@ewandr-workspace/core";
import {Router} from "@angular/router";
import {MatCardModuleUI} from "@ewandr-workspace/ui-shared-lib";
import {ProductCardComponent} from "./product-card/product-card.component";
import {SearchProductsQuery} from "@ewandr-workspace/data-access-graphql";
import {NotificationService, NotificationType} from "@ewandr-workspace/client-core";

@Component({
  selector: 'product-container',
  imports: [CommonModule, MatCardModuleUI, ProductCardComponent],
  providers: [ProductContainerService],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainerComponent implements OnInit {
  private notificationService = inject(NotificationService);
  public router = inject(Router);

  products = input<SearchProductsQuery['search'] |null>();

  status = ProductStatusEnum;

  ngOnInit() {
  }

  public handleProductClick(product: SearchProductsQuery['search']['items'][number]) {
    this.router.navigate([`product/${product.slug}`])
  }

  public handleAddToCart(product: SearchProductsQuery['search']['items'][number]) {
    this.notificationService.showNotification(NotificationType.INFO, {
      message: `"${product.productName}" added to cart`,
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    })
  }

}
