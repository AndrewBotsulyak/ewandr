import { inject, Injectable, signal } from '@angular/core';
import {GqlDataService, SearchInput, SearchProductsQuery} from "@ewandr-workspace/data-access-graphql";
import { take } from 'rxjs';

export interface FacetGroup {
  id: string;
  name: string;
  values: FacetValue[];
}

export interface FacetValue {
  id: string;
  name: string;
  count: number;
  selected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FacetFilterService {
  private gqlService = inject(GqlDataService);

  // Current search context (collection slug OR search term)
  private searchContext = signal<SearchInput | null>(null);

  // Selected facet value IDs
  selectedFacetIds = signal<string[]>([]);

  // Facet groups
  facetGroups = signal<FacetGroup[]>([]);

  // Products from search
  searchResults = signal<SearchProductsQuery['search'] | null>(null);

  // Sort order
  sortOrder = signal<string>('');

  // Set the search context (collection slug OR search term)
  setSearchContext(context: SearchInput) {
    this.searchContext.set(context);
    // Automatically trigger initial search
    this.searchProducts(context);
  }

  searchProducts(data: SearchInput, selectedFacetIds: string[] = []) {
    const facetFilters = this.buildFacetValueFilters(selectedFacetIds);
    const sort = this.buildSortParameter(this.sortOrder());

    this.gqlService.searchProducts({
      groupByProduct: true,
      take: 100,
      facetValueFilters: facetFilters.length > 0 ? facetFilters : undefined,
      sort: sort,
      ...data,
    }).pipe(take(1)).subscribe((response) => {
      // Update both products and facets from single query
      this.searchResults.set(response);

      if (response.facetValues != null) {
        const grouped = this.groupFacetsByFacet(response.facetValues, selectedFacetIds);
        this.facetGroups.set(grouped);
      }
    });
  }

  toggleFacet(facetValueId: string) {
    const context = this.searchContext();
    if (!context) return;

    const currentSelected = this.selectedFacetIds();
    const isSelected = currentSelected.includes(facetValueId);

    // Toggle selection
    const newSelected = isSelected
      ? currentSelected.filter(id => id !== facetValueId)
      : [...currentSelected, facetValueId];

    // Update selected facets
    this.selectedFacetIds.set(newSelected);

    // Reload facets with new filters
    this.searchProducts(context, newSelected);
  }

  clearFilters() {
    const context = this.searchContext();
    if (!context) return;

    this.selectedFacetIds.set([]);
    this.searchProducts(context, []);
  }

  resetFilters() {
    this.selectedFacetIds.set([]);
    this.facetGroups.set([]);
    this.searchResults.set(null);
    this.sortOrder.set('');
    this.searchContext.set(null);
  }

  setSortOrder(sortValue: string) {
    const context = this.searchContext();
    if (!context) return;

    this.sortOrder.set(sortValue);
    this.searchProducts(context, this.selectedFacetIds());
  }

  private groupFacetsByFacet(facetValues: SearchProductsQuery['search']['facetValues'], selectedIds: string[]): FacetGroup[] {
    const groups = new Map<string, FacetGroup>();

    facetValues.forEach((fv) => {
      const facetId = fv.facetValue.facet.id;
      const facetName = fv.facetValue.facet.name;

      if (!groups.has(facetId)) {
        groups.set(facetId, {
          id: facetId,
          name: facetName,
          values: []
        });
      }

      groups.get(facetId)!.values.push({
        id: fv.facetValue.id,
        name: fv.facetValue.name,
        count: fv.count,
        selected: selectedIds.includes(fv.facetValue.id)
      });
    });

    return Array.from(groups.values());
  }

  private buildFacetValueFilters(selectedIds: string[]): any[] {
    if (selectedIds.length === 0) return [];

    // Create AND filters for all selected facets
    return selectedIds.map(id => ({ and: id }));
  }

  private buildSortParameter(sortValue: string): any {
    switch (sortValue) {
      case 'price-asc':
        return { price: 'ASC' };
      case 'price-desc':
        return { price: 'DESC' };
      case 'name-asc':
        return { name: 'ASC' };
      case 'name-desc':
        return { name: 'DESC' };
      default:
        return undefined;
    }
  }
}
