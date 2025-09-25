import {Route} from "@angular/router";
import {CollectionsContainerComponent} from "../collections-container/collections-container.component";
import {CollectionItemContainer} from "../collection-item-container/collection-item-container";
import {
  collectionItemContainerResolver
} from "../collection-item-container/resolvers/collection-item-container.resolver";

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: CollectionsContainerComponent,
    pathMatch: "full",
  },
  {
    path: ':slug',
    component: CollectionItemContainer,
    resolve: { collection: collectionItemContainerResolver},
  },
];
