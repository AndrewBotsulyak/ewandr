import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {GqlDataService} from "@ewandr-workspace/data-access-graphql";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute, ActivatedRouteSnapshot, RouterLink} from "@angular/router";
import {filter, last, map, of, switchMap, take} from "rxjs";
import {CommonModule} from "@angular/common";
import {UiBreadcrumb, UiCollectionsLayout} from "@ewandr-workspace/ui-shared-lib";
import {ProductContainerComponent} from "../product-container/product-container.component";

@Component({
  selector: 'app-collection-item-container',
  imports: [
    CommonModule,
    UiCollectionsLayout,
    UiBreadcrumb,
    ProductContainerComponent
  ],
  templateUrl: './collection-item-container.html',
  styleUrl: './collection-item-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionItemContainer {
  private gqlService = inject(GqlDataService);
  private activatedRoute = inject(ActivatedRoute);

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
  protected readonly last = last;
}
