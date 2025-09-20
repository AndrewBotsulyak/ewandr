import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {GetCollectionsQuery, GqlDataService, RootNode} from "@ewandr-workspace/data-access-graphql";
import {CommonModule} from "@angular/common";
import {filter, tap} from "rxjs";
import {notNullOrUndefined, RoutesConstants} from "@ewandr-workspace/core";

@Component({
  selector: 'app-collections-container',
  imports: [
    CommonModule
  ],
  templateUrl: './collections-container.component.html',
  styleUrl: './collections-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionsContainerComponent implements OnInit {
  private router = inject(Router);
  private gqlService = inject(GqlDataService);

  collections = signal<RootNode<GetCollectionsQuery['collections']['items'][number]> | null>(null);

  ngOnInit() {
    this.gqlService.getCollections().pipe(
      filter(notNullOrUndefined),
      tap(value => {
        this.collections.set(value);
      })
    ).subscribe()
  }

  /**
   * Navigate to a specific collection page
   * @param slug - The collection slug to navigate to
   */
  navigateToCollection(slug: string): void {
    this.router.navigate([`/${RoutesConstants.CATEGORY}`, slug]);
  }
}
