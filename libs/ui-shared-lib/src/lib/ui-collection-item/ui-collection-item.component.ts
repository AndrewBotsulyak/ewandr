import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {GetCollectionQuery} from "@ewandr-workspace/data-access-graphql";
import {RoutesConstants} from "@ewandr-workspace/core";

// 'children' type is optional
type CollectionChild = NonNullable<NonNullable<GetCollectionQuery['collection']>['children']>[number];

@Component({
  selector: 'ui-collection-item',
  imports: [
    RouterLink
  ],
  templateUrl: './ui-collection-item.component.html',
  styleUrl: './ui-collection-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCollectionItemComponent {
  category = input<CollectionChild>();

  RoutesConstants = RoutesConstants;
}
