import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacetFilterService } from "../services/facet-filter.service";

@Component({
  selector: 'app-product-facets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-facets.component.html',
  styleUrl: './product-facets.component.scss',
})
export class ProductFacetsComponent {
  private facetFilterService = inject(FacetFilterService);

  // Inputs
  collectionSlug = input.required<string>();

  // Facet groups and selected facets from service
  facetGroups = this.facetFilterService.facetGroups;
  selectedFacets = this.facetFilterService.selectedFacetIds;

  toggleFacet(facetValueId: string) {
    const slug = this.collectionSlug();
    this.facetFilterService.toggleFacet(facetValueId, slug);
  }

  clearAllFilters() {
    const slug = this.collectionSlug();
    this.facetFilterService.clearFilters(slug);
  }
}
