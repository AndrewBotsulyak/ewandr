import { Component, inject, signal } from '@angular/core';
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

  // Facet groups and selected facets from service
  facetGroups = this.facetFilterService.facetGroups;
  selectedFacets = this.facetFilterService.selectedFacetIds;

  // Track collapsed state for each group (all expanded by default)
  collapsedGroups = signal<Set<string>>(new Set());

  toggleFacet(facetValueId: string) {
    this.facetFilterService.toggleFacet(facetValueId);
  }

  clearAllFilters() {
    this.facetFilterService.clearFilters();
  }

  toggleGroup(groupId: string) {
    const collapsed = this.collapsedGroups();
    const newCollapsed = new Set(collapsed);
    if (newCollapsed.has(groupId)) {
      newCollapsed.delete(groupId);
    } else {
      newCollapsed.add(groupId);
    }
    this.collapsedGroups.set(newCollapsed);
  }

  isGroupExpanded(groupId: string): boolean {
    return !this.collapsedGroups().has(groupId);
  }

  getSelectedCountInGroup(groupId: string): number {
    const group = this.facetGroups().find(g => g.id === groupId);
    if (!group) return 0;

    const selected = this.selectedFacets();
    return group.values.filter(v => selected.includes(v.id)).length;
  }
}
