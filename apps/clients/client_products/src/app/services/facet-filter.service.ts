import { inject, Injectable, signal } from '@angular/core';
import { GqlDataService, SearchProductsQuery } from "@ewandr-workspace/data-access-graphql";
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

  // Selected facet value IDs
  selectedFacetIds = signal<string[]>([]);

  // Facet groups
  facetGroups = signal<FacetGroup[]>([]);

  // Products from search
  searchResults = signal<SearchProductsQuery['search'] | null>(null);

  loadFacets(collectionSlug: string, selectedFacetIds: string[] = []) {
    const facetFilters = this.buildFacetValueFilters(selectedFacetIds);

    this.gqlService.searchProducts({
      collectionSlug,
      groupByProduct: true,
      take: 100,
      facetValueFilters: facetFilters.length > 0 ? facetFilters : undefined
    }).pipe(take(1)).subscribe((response) => {
      // Update both products and facets from single query
      this.searchResults.set(response);

      if (response.facetValues) {
        const grouped = this.groupFacetsByFacet(response.facetValues, selectedFacetIds);
        this.facetGroups.set(grouped);
      }
    });
  }

  toggleFacet(facetValueId: string, collectionSlug: string) {
    const currentSelected = this.selectedFacetIds();
    const isSelected = currentSelected.includes(facetValueId);

    // Toggle selection
    const newSelected = isSelected
      ? currentSelected.filter(id => id !== facetValueId)
      : [...currentSelected, facetValueId];

    // Update selected facets
    this.selectedFacetIds.set(newSelected);

    // Reload facets with new filters
    this.loadFacets(collectionSlug, newSelected);
  }

  clearFilters(collectionSlug: string) {
    this.selectedFacetIds.set([]);
    this.loadFacets(collectionSlug, []);
  }

  resetFilters() {
    this.selectedFacetIds.set([]);
    this.facetGroups.set([]);
    this.searchResults.set(null);
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
}
