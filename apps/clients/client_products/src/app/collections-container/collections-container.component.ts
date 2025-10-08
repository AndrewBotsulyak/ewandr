import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GqlDataService} from "@ewandr-workspace/data-access-graphql";
import {CommonModule} from "@angular/common";
import {filter} from "rxjs";
import {notNullOrUndefined, RoutesConstants} from "@ewandr-workspace/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {ProductContainerComponent} from "../product-container/product-container.component";

@Component({
  selector: 'app-collections-container',
  imports: [
    CommonModule,
    ProductContainerComponent
  ],
  templateUrl: './collections-container.component.html',
  styleUrl: './collections-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionsContainerComponent {
  private router = inject(Router);
  private gqlService = inject(GqlDataService);
  private activatedRoute = inject(ActivatedRoute);

  collections = toSignal(
    this.gqlService.getCollections().pipe(
      filter(notNullOrUndefined)
    ),
    {
      initialValue: null
    }
  );

  products = toSignal(this.gqlService.searchProducts()
    .pipe(
      filter(notNullOrUndefined)
    ),
    {
      initialValue: null
    }
  );

  /**
   * Navigate to a specific collection page
   * @param slug - The collection slug to navigate to
   */
  navigateToCollection(slug: string): void {
    this.router.navigate([`${RoutesConstants.CATEGORY}/`, slug]);
  }
}
