import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {ProductContainerComponent} from "../product-container/product-container.component";
import {ProductFacetsComponent} from "../product-facets/product-facets.component";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {filter, map, tap} from "rxjs";
import {FacetFilterService} from "../services/facet-filter.service";
import {HeaderService} from "@ewandr-workspace/client-core";

@Component({
  selector: 'search-container',
  imports: [
    ProductContainerComponent,
    ProductFacetsComponent,
  ],
  templateUrl: './search-container.component.html',
  styleUrl: './search-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchContainerComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private facetFilterService = inject(FacetFilterService);
  private headerService = inject(HeaderService);

  searchTerm = this.headerService.searchTerm;

  // Products from facet filter service
  products = this.facetFilterService.searchResults;

  constructor() {
    // Load products when search term changes
    effect(() => {
      const term = this.searchTerm();
      if (term) {
        // Reset and reload for new search
        this.facetFilterService.resetFilters();
        // Set search context (search term)
        this.facetFilterService.setSearchContext({ term });
      }
    });
  }

  handleSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const sortValue = select.value;
    this.facetFilterService.setSortOrder(sortValue);
  }

  clearSearch() {
    this.router.navigate(['/']);
  }
}
