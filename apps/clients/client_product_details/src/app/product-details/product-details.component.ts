import {
  Component, computed, DestroyRef,
  inject,
  OnInit, Signal,
  signal,
} from '@angular/core';
import {ProductDetailsService} from "./product-details.service";
import {ActivatedRoute} from "@angular/router";
import {CommonModule} from "@angular/common";
import {BehaviorSubject, filter, map, Observable, switchMap} from "rxjs";
import {GetProductQuery, ProductOptionGroup} from "@ewandr-workspace/data-access-graphql";
import {MatCardModuleUI} from "@ewandr-workspace/ui-shared-lib";
import {GalleryItem, GalleryModule, ImageItem} from "ng-gallery";
import {DataSource} from "@angular/cdk/collections";
import {CdkTableModule} from "@angular/cdk/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {LightboxModule} from "ng-gallery/lightbox";
import {notNullOrUndefined} from "@ewandr-workspace/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {TabSpecificationsComponent} from "../tab-specifications/tab-specifications.component";
import {ProductVariant} from "../models/details-product-variant.model";
import {ProductOptionsGroupsComponent} from "../product-options-groups/product-options-groups.component";
import {ProductOptionsData} from "../models/details-product-option-data.model";
import {DetailsSelectOptionOutput} from "../models/details-select-option-output.model";


@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    MatCardModuleUI,
    GalleryModule,
    CdkTableModule,
    MatTooltipModule,
    LightboxModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TabSpecificationsComponent,
    ProductOptionsGroupsComponent
  ],
  providers: [
    ProductDetailsService
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  private service = inject(ProductDetailsService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'code'];

  // product = toSignal(this.service.selectedProduct$);
  product = signal<GetProductQuery['product'] | null>(null);

  // Product state management
  productState = this.service.productState;

  images: Signal<GalleryItem[]> = computed(() => {
    const assets = this.product()?.assets ?? [];
    return assets?.map((item) => new ImageItem({
      src: item.source,
      thumb: item.source
    }));
  });

  productOptions: Signal<ProductOptionsData[]> = computed(() => {
    const optionGroups = this.product()?.optionGroups ?? [];

    return optionGroups.map((item) => {
      const optionsData = item.options.map(option => ({
        name: option.name,
        code: option.code,
        description: option.customFields?.description,
      }))

      return {
        id: item.id,
        title: item.name,
        options: optionsData
      }
    });
  });

  // Computed signals for better UX
  currentVariant = computed(() => {
    const state = this.productState();
    return state.selectedVariant || this.product()?.variants?.[0] || undefined;
  });

  currentPrice = computed(() => {
    const variant = this.currentVariant();
    return variant ? (variant.priceWithTax || 0) / 100 : 0;
  });

  currentCurrency = computed(() => {
    const variant = this.currentVariant();
    return variant?.currencyCode || 'USD';
  });

  isOptionSelected = computed(() => {
    return (optionGroupId: string, optionName: string) => {
      const state = this.productState();
      return state.selectedOptions[optionGroupId] === optionName;
    };
  });

  private productSlug$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('slug')),
    filter(notNullOrUndefined),
  );

  ngOnInit() {
    // handle slug
    this.productSlug$.pipe(
      switchMap((slug) => {
        return this.service.getProduct(slug).pipe(
          map(data => {
            this.product.set(data);
            // Initialize with first variant
            if (data?.variants?.[0]) {
              this.productState.update(state => ({
                ...state,
                selectedVariant: data.variants[0] as ProductVariant
              }));
            }
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  // Product interaction methods
  selectOption({optionGroupId, optionName}: DetailsSelectOptionOutput) {
    this.productState.update(state => ({
      ...state,
      selectedOptions: {
        ...state.selectedOptions,
        [optionGroupId]: optionName
      }
    }));

    // Find matching variant based on selected options
    this.updateSelectedVariant();
  }

  private updateSelectedVariant() {
    const product = this.product();

    if (!product?.variants) return;

    // Find variant that matches selected options
    const matchingVariant = product.variants.find(() => {
      // This is a simplified matching logic
      // In a real app, you'd need more sophisticated variant matching
      return true; // For now, just return the first variant
    });

    if (matchingVariant) {
      this.productState.update(state => ({
        ...state,
        selectedVariant: matchingVariant as ProductVariant
      }));
    }
  }

  selectVariant(variant: NonNullable<GetProductQuery['product']>['variants'][number]) {
    this.productState.update(state => ({
      ...state,
      selectedVariant: variant
    }));
  }

  updateQuantity(quantity: number) {
    if (quantity > 0) {
      this.productState.update(state => ({
        ...state,
        quantity
      }));
    }
  }

  addToCart() {
    const variant = this.currentVariant();

    if (!variant) {
      this.snackBar.open('Please select a product variant', 'Close', {
        duration: 3000
      });
      return;
    }

    // Here you would typically call a cart service
    this.snackBar.open(`Product "${variant.name}" added to cart`, 'Close', {
      duration: 3000
    });
  }

  buyNow() {
    const variant = this.currentVariant();

    if (!variant) {
      this.snackBar.open('Please select a product variant', 'Close', {
        duration: 3000
      });
      return;
    }

    // Here you would typically navigate to checkout
    this.snackBar.open('Redirecting to checkout...', 'Close', {
      duration: 2000
    });
  }

  toggleWishlist() {
    this.productState.update(state => ({
      ...state,
      isInWishlist: !state.isInWishlist
    }));

    const isInWishlist = this.productState().isInWishlist;
    const message = isInWishlist ? 'Product added to wishlist' : 'Product removed from wishlist';

    this.snackBar.open(message, 'Close', {
      duration: 2000
    });
  }

  shareProduct() {
    if (navigator.share) {
      navigator.share({
        title: this.product()?.name || 'Product',
        text: this.product()?.customFields?.shortDesc || '',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      this.snackBar.open('Link copied to clipboard', 'Close', {
        duration: 2000
      });
    }
  }

  setActiveTab(tab: 'description' | 'specifications' | 'reviews') {
    this.productState.update(state => ({
      ...state,
      activeTab: tab
    }));
  }

  // Computed signals for specifications
  productSpecifications = computed(() => {
    const product = this.product();
    const specifications = product?.customFields?.specifications;
    return specifications || [];
  });

  variantSpecifications = computed(() => {
    const variant = this.currentVariant();
    const specifications = variant?.customFields?.specifications;
    return specifications || [];
  });

  getShippingInfo(): string {
    // Get shipping information from product custom fields or use default
    const product = this.product();
    const customFields = product?.customFields as Record<string, unknown>;
    const shippingInfo = customFields?.['shippingInfo'] as string;

    if (shippingInfo) {
      return shippingInfo;
    }

    // Default shipping information
    return 'Free shipping on orders over $50';
  }
}
