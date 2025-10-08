import {Route} from "@angular/router";
import {CollectionsContainerComponent} from "../collections-container/collections-container.component";
import {CollectionItemContainer} from "../collection-item-container/collection-item-container";
import {
  collectionItemContainerResolver
} from "../collection-item-container/resolvers/collection-item-container.resolver";
import {RoutesConstants} from "@ewandr-workspace/core";

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: CollectionsContainerComponent,
  },
  {
    path: RoutesConstants.CATEGORY,
    pathMatch: "full",
    redirectTo: ''
  },
  {
    path: `${RoutesConstants.CATEGORY}/:slug` ,
    component: CollectionItemContainer,
    resolve: { collection: collectionItemContainerResolver},
  },
];
