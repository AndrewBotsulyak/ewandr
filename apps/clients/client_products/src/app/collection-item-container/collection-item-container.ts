import {ChangeDetectionStrategy, Component, computed, effect, inject} from '@angular/core';
import {GqlDataService} from "@ewandr-workspace/data-access-graphql";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";
import {filter, last, map, of, switchMap} from "rxjs";
import {CommonModule} from "@angular/common";
import {UiBreadcrumb, UiCollectionsLayout} from "@ewandr-workspace/ui-shared-lib";
import {ProductContainerComponent} from "../product-container/product-container.component";
import {ProductFacetsComponent} from "../product-facets/product-facets.component";
import {FacetFilterService} from "../services/facet-filter.service";

@Component({
  selector: 'app-collection-item-container',
  imports: [
    CommonModule,
    UiCollectionsLayout,
    UiBreadcrumb,
    ProductContainerComponent,
    ProductFacetsComponent
  ],
  templateUrl: './collection-item-container.html',
  styleUrl: './collection-item-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionItemContainer {
  private gqlService = inject(GqlDataService);
  private activatedRoute = inject(ActivatedRoute);
  private facetFilterService = inject(FacetFilterService);

  collection = toSignal(this.activatedRoute.data.pipe(
    switchMap(({collection}) => {
      if (collection == null) {
        return this.activatedRoute.paramMap.pipe(
          filter((paramMap) => paramMap.get('slug') != null),
          map(paramMap => paramMap.get('slug')!),
          switchMap(slug => this.gqlService.getCollection({ slug }))
        );
      }

      return of(collection);
    }),
  ));

  collectionSlug = computed(() => this.collection()?.slug || '');

  constructor() {
    // Load facets when collection changes
    effect(() => {
      const slug = this.collectionSlug();
      if (slug) {
        // Reset and reload facets for new collection
        this.facetFilterService.resetFilters();
        // load products and facets
        this.facetFilterService.searchProducts(slug);
      }
    }, { allowSignalWrites: true });
  }

  handleSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const sortValue = select.value;
    const slug = this.collectionSlug();

    if (slug) {
      this.facetFilterService.setSortOrder(sortValue, slug);
    }
  }

  protected readonly last = last;
}
