import {Injectable, signal, computed, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {filter, map} from "rxjs";

/**
 * Header service for managing header-related state using signals.
 * This service provides reactive state management for header components.
 */
@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private route = inject(ActivatedRoute);

  // Search state - private writable signal
  private _searchTerm = signal<string>('');

  // Public readonly signal
  public readonly searchTerm = this._searchTerm.asReadonly();

  // Computed values
  public readonly hasSearchTerm = computed(() => this._searchTerm().trim().length > 0);

  constructor() {

  }

  /**
   * Set the current search term
   * @param term - The search term to set
   */
  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  /**
   * Clear the search term
   */
  clearSearchTerm(): void {
    this._searchTerm.set('');
  }

  /**
   * Update the search term (for use with two-way binding)
   * @param term - The search term to update
   */
  updateSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }
}
