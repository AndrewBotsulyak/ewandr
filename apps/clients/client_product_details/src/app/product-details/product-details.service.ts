import {computed, DestroyRef, inject, Injectable, signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {GetProductQuery, GetProductQueryVariables, GqlDataService} from "@ewandr-workspace/data-access-graphql";
import {ProductState} from "../models/product-state.model";
import {DetailsTab} from "../models/details-tab.model";
import {filter, map, switchMap} from "rxjs";
import {notNullOrUndefined} from "@ewandr-workspace/core";
import {ActivatedRoute} from "@angular/router";
import {ProductVariant} from "../models/details-product-variant.model";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class ProductDetailsService {
  store = inject(Store);
  gqlService = inject(GqlDataService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  product = signal<GetProductQuery['product'] | null>(null);

  productState = signal<ProductState>({
    selectedVariant: undefined,
    selectedOptions: [],
    quantity: 1,
    isInWishlist: false,
    activeTab: DetailsTab.DESCRIPTION
  });

  isOptionSelected = computed(() => {
    return (id: string) => {
      const state = this.productState();
      return state.selectedOptions.includes(id);
    };
  });

  currentVariant = computed(() => {
    const state = this.productState();
    return state.selectedVariant || this.product()?.variants?.[0] || undefined;
  });

  private productSlug$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('slug')),
    filter(notNullOrUndefined),
  );

  getProduct(slug: GetProductQueryVariables['slug']) {
    return this.gqlService.getProduct(slug);
  }

  init() {
    this.productSlug$.pipe(
      switchMap((slug) => {
        return this.getProduct(slug).pipe(
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
}
